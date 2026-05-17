import express from 'express';
import { requireAuth, getAuth, createClerkClient } from '@clerk/express';
import Product from '../models/Product.js';

const router = express.Router();
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function isAdminUser(userId) {
    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata?.role === 'admin';
}

// ─── GET /api/products/rackets ───────────────────────────────────────────────
router.get('/rackets', async (req, res) => {
    try {
        const products = await Product.find({ status: 'racket', isActive: true }).lean();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// ─── GET /api/products/shoes ─────────────────────────────────────────────────
router.get('/shoes', async (req, res) => {
    try {
        const products = await Product.find({ status: 'shoes', isActive: true }).lean();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// ─── GET /api/products/shuttles ──────────────────────────────────────────────
router.get('/shuttles', async (req, res) => {
    try {
        const products = await Product.find({ status: 'shuttle', isActive: true }).lean();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// ─── ADMIN: GET ALL (kể cả inactive) — phải đứng TRƯỜC /:type ───────────────────────────
router.get('/admin/all', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ message: 'Không có userId.' });
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const products = await Product.find().sort({ createdAt: -1 }).lean();
        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: err.message || 'Lỗi server.' });
    }
});

// ─── GET /api/products/:type (generic) ───────────────────────────────────────
router.get('/:type', async (req, res) => {
    const map = { rackets: 'racket', shoes: 'shoes', shuttles: 'shuttle' };
    const status = map[req.params.type];
    if (!status) return res.status(404).json({ message: 'Loại sản phẩm không tồn tại.' });
    try {
        const products = await Product.find({ status, isActive: true }).lean();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server.' });
    }
});

// ─── ADMIN: POST — Thêm sản phẩm ─────────────────────────────────────────────
router.post('/', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const { type, ...rest } = req.body;
        const product = await Product.create({ ...rest, status: type, price: rest.price || 0 });
        res.status(201).json({ message: 'Thêm sản phẩm thành công.', product });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ─── ADMIN: PUT — Sửa sản phẩm ───────────────────────────────────────────────
router.put('/:id', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const { type, ...rest } = req.body;
        const update = type ? { ...rest, status: type } : rest;
        const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: false });
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        res.json({ message: 'Cập nhật thành công.', product });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ─── ADMIN: DELETE — Xóa sản phẩm (soft delete) ──────────────────────────────
router.delete('/:id', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        res.json({ message: 'Đã xóa sản phẩm.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── ADMIN: RESTORE — Khôi phục sản phẩm đã xóa ─────────────────────────────
router.patch('/:id/restore', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) return res.status(403).json({ message: 'Không có quyền.' });
        const product = await Product.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
        res.json({ message: 'Đã khôi phục sản phẩm.', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
