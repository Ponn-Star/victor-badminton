import express from 'express';
import { requireAuth, getAuth, createClerkClient } from '@clerk/express';
import ChatLog from '../models/ChatLog.js';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const router = express.Router();

async function isAdminUser(userId) {
    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata?.role === 'admin';
}

// ─── ADMIN: Danh sách log chat (phân trang) ─────────────────────────────────
router.get('/admin/logs', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }

        const page  = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const filter = {};
        if (req.query.blocked === 'true')  filter.blocked  = true;
        if (req.query.hasError === 'true') filter.hasError = true;

        const [logs, total] = await Promise.all([
            ChatLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            ChatLog.countDocuments(filter),
        ]);

        res.json({ logs, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error('Chat logs error:', err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

// ─── ADMIN: Thống kê tổng quan ───────────────────────────────────────────────
router.get('/admin/stats', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [total, today, blocked, errors, avgTime] = await Promise.all([
            ChatLog.countDocuments(),
            ChatLog.countDocuments({ createdAt: { $gte: todayStart } }),
            ChatLog.countDocuments({ blocked: true }),
            ChatLog.countDocuments({ hasError: true }),
            ChatLog.aggregate([
                { $match: { responseTimeMs: { $ne: null }, hasError: false, blocked: false } },
                { $group: { _id: null, avg: { $avg: '$responseTimeMs' } } },
            ]),
        ]);

        res.json({
            total,
            today,
            blocked,
            errors,
            avgResponseMs: avgTime[0]?.avg ? Math.round(avgTime[0].avg) : null,
        });
    } catch (err) {
        console.error('Chat stats error:', err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

// ─── ADMIN: Kiểm tra trạng thái Groq API ─────────────────────────────────────
router.get('/admin/health', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }

        const hasKey = Boolean(process.env.GROQ_API_KEY) &&
                       process.env.GROQ_API_KEY !== 'your_groq_api_key_here';

        if (!hasKey) {
            return res.json({ status: 'not_configured', model: null });
        }

        // Gọi thử Groq models list endpoint (nhẹ, không tốn token)
        const start = Date.now();
        const check = await fetch('https://api.groq.com/openai/v1/models', {
            headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
        }).catch(() => null);

        const latencyMs = Date.now() - start;

        if (!check || !check.ok) {
            return res.json({ status: 'error', model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', latencyMs });
        }

        res.json({
            status: 'ok',
            model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            latencyMs,
        });
    } catch (err) {
        console.error('Groq health check error:', err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

export default router;
