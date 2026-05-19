import express from 'express';
import { requireAuth, getAuth, createClerkClient } from '@clerk/express';
import Athlete from '../models/Athlete.js';

const router = express.Router();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function isAdminUser(userId) {
    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata?.role === 'admin';
}

// ─── GET /api/athletes ────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const athletes = await Athlete.find({ isActive: true }).sort({ id: 1 }).lean();
        res.json({ athletes });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// ─── ADMIN: GET /api/athletes/admin/all ──────────────────────────────────────
router.get('/admin/all', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        console.log('[athletes/admin/all] userId:', userId);
        if (!userId) return res.status(401).json({ message: 'Không có userId.' });
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const athletes = await Athlete.find().sort({ id: 1 }).lean();
        res.json({ athletes });
    } catch (err) {
        console.error('[athletes/admin/all] error:', err.message);
        res.status(500).json({ message: err.message || 'Lỗi server.' });
    }
});

// ─── GET /api/athletes/:slug ──────────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
    try {
        const athlete = await Athlete.findOne({ slug: req.params.slug, isActive: true }).lean();
        if (!athlete) return res.status(404).json({ message: 'Không tìm thấy vận động viên.' });
        res.json(athlete);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// ─── ADMIN: POST — Thêm athlete ───────────────────────────────────────────────
router.post('/', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const athlete = await Athlete.create(req.body);
        res.status(201).json({ message: 'Thêm vận động viên thành công.', athlete });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ─── ADMIN: PUT — Sửa athlete ─────────────────────────────────────────────────
router.put('/:id', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const athlete = await Athlete.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!athlete) return res.status(404).json({ message: 'Không tìm thấy vận động viên.' });
        res.json({ message: 'Cập nhật thành công.', athlete });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ─── ADMIN: DELETE — Xóa athlete (soft delete) ───────────────────────────────
router.delete('/:id', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const athlete = await Athlete.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!athlete) return res.status(404).json({ message: 'Không tìm thấy vận động viên.' });
        res.json({ message: 'Đã xóa vận động viên.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
