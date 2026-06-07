# Victor – Website Giới Thiệu & Quản Lý Sản Phẩm Cầu Lông

Là website giới thiệu sản phẩm, vận động viên và tư vấn mua sắm cho thương hiệu cầu lông **VICTOR**.

## Tổng Quan

Victor là ứng dụng web kết hợp catalogue sản phẩm, thông tin vận động viên, so sánh sản phẩm, tìm kiếm, xác thực người dùng và trợ lý AI tư vấn sản phẩm (Victor Cortex).

## Công Nghệ Sử Dụng

**Frontend**
- React 19 + Vite
- React Router v7
- Clerk React (xác thực)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Clerk Express (phân quyền)
- Groq API (AI streaming chat)

**Triển khai**
- Frontend build ra `dist`
- API serverless trên Vercel
- Backend local chạy cổng 5000

## Chức Năng Chính

### Người dùng
- **Trang chủ**: Hero, cards giới thiệu, carousel chiến dịch, tin tức
- **Catalogue**: hiển thị 3 nhóm sản phẩm – vợt, giày, quả cầu với bộ lọc
- **Chi tiết sản phẩm**: hình ảnh, thumbnails, giá, SKU, thông số kỹ thuật
- **So sánh sản phẩm**: đối chiếu tối đa 3 sản phẩm cùng lúc
- **Tìm kiếm**: modal tìm sản phẩm theo tên hoặc series
- **Team Victor**: danh sách và trang chi tiết vận động viên
- **Victor Cortex**: mini chat AI tư vấn lựa chọn sản phẩm
- **Đăng nhập / Đăng ký**: hỗ trợ email/password và Google OAuth qua Clerk

### Quản trị (`/admin` – yêu cầu role `admin`)
- Quản lý người dùng: xem danh sách, cập nhật role, kích hoạt/vô hiệu hóa tài khoản
- Quản lý sản phẩm: xem, thêm, sửa, xóa mềm, khôi phục
- Quản lý vận động viên: xem, thêm, sửa, xóa mềm
- Chat log: xem lịch sử chat, thống kê, trạng thái kết nối Groq

## Cấu Trúc Dự Án

```
├── src/                  # Frontend React
│   ├── components/       # Các component UI
│   ├── context/          # AuthContext
│   └── utils/            # API utilities
├── server/               # Backend Express
│   ├── models/           # Mongoose models (Product, Athlete, ChatLog)
│   ├── routes/           # API routes
│   ├── data/             # Dữ liệu seed
│   └── scripts/          # Script seed database
└── api/                  # Serverless entry cho Vercel
```

## Cài Đặt & Chạy Local

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc Atlas)
- Tài khoản Clerk, Groq

### Biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
VITE_CLERK_PUBLISHABLE_KEY=...
VITE_API_URL=http://localhost:5000
```

Tạo file `.env` tại thư mục `server/`:

```env
CLERK_SECRET_KEY=...
MONGODB_URI=...
GROQ_API_KEY=...
CLIENT_URL=http://localhost:5173
```

### Chạy ứng dụng

```bash
# Cài dependencies
npm install
cd server && npm install && cd ..

# Seed dữ liệu (lần đầu)
node server/scripts/seed.js

# Chạy cả frontend và backend
npm run start

# Hoặc chạy riêng
npm run dev          # Frontend: http://localhost:5173
npm run server       # Backend:  http://localhost:5000
```

## Dữ Liệu

Database MongoDB gồm 3 collection:
- **Product**: 59 sản phẩm (20 vợt, 15 giày, 24 quả cầu)
- **Athlete**: 24 vận động viên Team Victor
- **ChatLog**: lưu lịch sử hội thoại AI