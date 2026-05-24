import 'dotenv/config';
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import athleteRoutes from "./routes/athletes.js";
import chatRoutes from "./routes/chat.js";
import Product from "./models/Product.js";
import ChatLog from "./models/ChatLog.js";

// ─── Kết nối MongoDB ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected:', process.env.MONGODB_URI))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));

const app = express();
const extraOrigins = (process.env.CLIENT_URL || '').split(',').map((o) => o.trim()).filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        // Allow requests with no origin (curl, Postman, same-origin proxy)
        if (!origin) return callback(null, true);
        // Allow any localhost / 127.0.0.1 port (dev environment)
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        // Allow Vercel preview/production deployments for this project
        if (/^https:\/\/victor-badminton(-[a-z0-9-]+)?\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        // Allow extra origins from CLIENT_URL env
        if (extraOrigins.includes(origin)) return callback(null, true);

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json({ charset: 'utf-8' }));
app.use(clerkMiddleware());

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Victor Backend is running' }));

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many chat requests. Please try again in a minute.' },
});

const chatInputSchema = z.object({
    message: z.string().trim().min(1).max(500),
    history: z.array(
        z.object({
            role: z.enum(['user', 'assistant']),
            content: z.string().trim().min(1).max(1000),
        })
    ).max(20).optional(),
    userId: z.string().max(200).optional(),
});

const blockedInputPatterns = [
    /api\s*key/i,
    /password/i,
    /credit\s*card/i,
    /hack|bypass|exploit/i,
];

function moderateInput(text) {
    return !blockedInputPatterns.some((pattern) => pattern.test(text));
}

function sanitizeOutput(text) {
    if (!text) return '';
    const noTags = String(text).replace(/<[^>]*>/g, '');
    const cleaned = Array.from(noTags, (char) => {
        const code = char.charCodeAt(0);
        return (code < 32 || code === 127) ? ' ' : char;
    }).join('');
    return cleaned.slice(0, 4000);
}

async function buildCatalog() {
    try {
        const [rackets, shoes, shuttles] = await Promise.all([
            Product.find({ status: 'racket', isActive: true }).select('name price series balance performanceStats').lean(),
            Product.find({ status: 'shoes', isActive: true }).select('name price series midsole').lean(),
            Product.find({ status: 'shuttle', isActive: true }).select('name price type speed unit').lean(),
        ]);

        const fmt = (n) => Number(n).toLocaleString('vi-VN') + 'đ';

        const racketLines = rackets.map((r) => {
            const s = r.performanceStats || {};
            return `  - ${r.name} | ${fmt(r.price)} | balance:${r.balance || '?'} | Pwr:${s.power||'?'} Spd:${s.speed||'?'} Ctrl:${s.control||'?'}`;
        });

        const shoeLines = shoes.map((s) => `  - ${s.name} | ${fmt(s.price)}`);

        const shuttleLines = shuttles.map((s) =>
            `  - ${s.name} | ${fmt(s.price)}/${s.unit||'tá'} | ${s.type||''} | speed:${s.speed||'?'}`
        );

        return [
            '=== VỢT CẦU LÔNG ===',
            ...racketLines,
            '',
            '=== GIÀY CẦU LÔNG ===',
            ...shoeLines,
            '',
            '=== QUẢ CẦU ===',
            ...shuttleLines,
        ].join('\n');
    } catch {
        return '';
    }
}

function getSystemPrompt(catalog = '') {
    const catalogSection = catalog
        ? `\n\nDANH MỤC SẢN PHẨM HIỆN CÓ (chỉ tư vấn các sản phẩm trong danh sách này, không bịa tên khác):\n${catalog}`
        : '';

    return `Bạn là Victor Cortex, trợ lý AI cho Victor Badminton - thương hiệu dụng cụ cầu lông cao cấp Việt Nam.

HƯỚNG DẪN:
- Trả lời tiếng Việt, ngắn gọn (2-4 câu), tự nhiên.
- CHỈ tư vấn sản phẩm có trong danh mục bên dưới, không được đề xuất sản phẩm không tồn tại.
- Khi tư vấn vợt: dựa vào balance (≥300mm = nặng đầu/tấn công, ≤290mm = nhẹ đầu/tốc độ, 291-299mm = cân bằng) và chỉ số Pwr/Spd/Ctrl.
- Nếu thiếu thông tin để tư vấn chính xác, hỏi lại 1 câu ngắn.
- Luôn kèm giá khi đề xuất sản phẩm cụ thể.${catalogSection}`;
}

async function buildModelMessages(message, history = []) {
    const catalog = await buildCatalog();
    const normalizedHistory = history
        .slice(-10)
        .map((item) => ({ role: item.role, content: item.content }));

    return [
        { role: 'system', content: getSystemPrompt(catalog) },
        ...normalizedHistory,
        { role: 'user', content: message },
    ];
}

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function hasValidGroqKey() {
    return Boolean(process.env.GROQ_API_KEY) && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
}

// ─── AI Chat Endpoint (Streaming) ──────────────────────────────────────────
app.post('/api/chat/stream', chatLimiter, async (req, res) => {
    const parsed = chatInputSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { message, history = [], userId: clientUserId } = parsed.data;

    if (!moderateInput(message)) {
        // Lưu log: tin nhắn bị chặn
        ChatLog.create({ userMessage: message, blocked: true, userId: clientUserId || null }).catch(() => {});
        return res.status(400).json({ error: 'Input blocked by safety policy' });
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') {
        res.flushHeaders();
    }

    const chatStartTime = Date.now();
    let accumulatedResponse = '';

    try {
        if (!hasValidGroqKey()) {
            ChatLog.create({ userMessage: message, hasError: true, userId: clientUserId || null }).catch(() => {});
            res.write(`data: ${JSON.stringify({ type: 'error', message: 'Groq is not configured. Set GROQ_API_KEY in server/.env.' })}\n\n`);
            return res.end();
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                stream: true,
                messages: await buildModelMessages(message, history),
                temperature: 0.7,
                max_tokens: 512,
            }),
        });

        if (!response.ok || !response.body) {
            const errorText = await response.text().catch(() => 'Model unavailable');
            ChatLog.create({ userMessage: message, hasError: true, responseTimeMs: Date.now() - chatStartTime, userId: clientUserId || null }).catch(() => {});
            res.write(`data: ${JSON.stringify({ type: 'error', message: sanitizeOutput(errorText) })}\n\n`);
            return res.end();
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;

                const payload = line.slice(6).trim();
                if (!payload) continue;

                if (payload === '[DONE]') {
                    ChatLog.create({
                        userMessage: message,
                        aiResponse: accumulatedResponse,
                        responseTimeMs: Date.now() - chatStartTime,
                        userId: clientUserId || null,
                    }).catch(() => {});
                    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
                    return res.end();
                }

                try {
                    const json = JSON.parse(payload);
                    const token = json.choices?.[0]?.delta?.content || '';

                    if (token) {
                        accumulatedResponse += token;
                        res.write(`data: ${JSON.stringify({ type: 'token', token: sanitizeOutput(token) })}\n\n`);
                    }
                } catch {
                    // Ignore malformed chunk and continue streaming.
                }
            }
        }

        ChatLog.create({
            userMessage: message,
            aiResponse: accumulatedResponse,
            responseTimeMs: Date.now() - chatStartTime,
            userId: clientUserId || null,
        }).catch(() => {});
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
    } catch (error) {
        ChatLog.create({ userMessage: message, hasError: true, responseTimeMs: Date.now() - chatStartTime, userId: clientUserId || null }).catch(() => {});
        res.write(`data: ${JSON.stringify({ type: 'error', message: sanitizeOutput(error.message || 'Streaming failed') })}\n\n`);
        res.end();
    }
});

app.get('/api/chat/provider', (req, res) => {
    res.json({
        provider: 'groq',
        model: GROQ_MODEL,
        configured: hasValidGroqKey(),
    });
});

app.get('/api/chat/catalog-debug', async (req, res) => {
    const catalog = await buildCatalog();
    res.type('text/plain; charset=utf-8').send(catalog || '(empty)');
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/athletes', athleteRoutes);
app.use('/api/chat', chatRoutes);

export default app;

// Only start HTTP server when running locally (not on Vercel serverless)
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}