import express from 'express';
import { requireAuth, getAuth, createClerkClient } from '@clerk/express';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const router = express.Router();

// Helper: kiểm tra admin từ Clerk publicMetadata
async function isAdminUser(userId) {
    const user = await clerkClient.users.getUser(userId);
    return user.publicMetadata?.role === 'admin';
}

// ─── LẤY THÔNG TIN USER HIỆN TẠI ───────────────────────────────────────────
router.get('/me', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const clerkUser = await clerkClient.users.getUser(userId);
        res.json({
            user: {
                id: clerkUser.id,
                name: clerkUser.fullName || clerkUser.username || clerkUser.firstName || 'User',
                email: clerkUser.emailAddresses[0]?.emailAddress,
                avatar: clerkUser.imageUrl,
                role: clerkUser.publicMetadata?.role || 'user',
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

// ─── ADMIN: DANH SÁCH USERS ─────────────────────────────────────────────────
router.get('/admin/users', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }
        const result = await clerkClient.users.getUserList({ limit: 500, orderBy: '-created_at' });
        const users = result.data.map(u => ({
            id: u.id,
            name: u.fullName || u.username || u.firstName || 'User',
            email: u.emailAddresses[0]?.emailAddress,
            avatar: u.imageUrl,
            role: u.publicMetadata?.role || 'user',
            isActive: !u.banned,
            provider: u.externalAccounts?.length > 0 ? 'google' : 'email',
            createdAt: u.createdAt,
        }));
        res.json({ users });
    } catch (err) {
        console.error('Admin users error:', err);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

// ─── ADMIN: CẬP NHẬT ROLE ───────────────────────────────────────────────────
router.patch('/admin/users/:id/role', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Role không hợp lệ.' });
        }
        await clerkClient.users.updateUser(req.params.id, {
            publicMetadata: { role }
        });
        res.json({ message: 'Cập nhật role thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

// ─── ADMIN: VÔ HIỆU HÓA / KÍCH HOẠT USER ───────────────────────────────────
router.patch('/admin/users/:id/status', requireAuth(), async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!await isAdminUser(userId)) {
            return res.status(403).json({ message: 'Không có quyền truy cập.' });
        }
        const { isActive } = req.body;
        if (isActive) {
            await clerkClient.users.unbanUser(req.params.id);
        } else {
            await clerkClient.users.banUser(req.params.id);
        }
        res.json({ message: `Tài khoản đã ${isActive ? 'kích hoạt' : 'vô hiệu hóa'}.` });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
});

export default router;