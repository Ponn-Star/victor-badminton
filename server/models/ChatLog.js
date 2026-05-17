import mongoose from 'mongoose';

const chatLogSchema = new mongoose.Schema({
    userMessage: { type: String, required: true, maxlength: 500 },
    aiResponse:  { type: String, default: '' },
    userId:      { type: String, default: null },      // Clerk user ID nếu đã đăng nhập
    blocked:     { type: Boolean, default: false },    // Bị chặn bởi content moderation
    hasError:    { type: Boolean, default: false },    // Groq API lỗi
    responseTimeMs: { type: Number, default: null },   // Thời gian phản hồi (ms)
}, { timestamps: true });

chatLogSchema.index({ createdAt: -1 });
chatLogSchema.index({ blocked: 1 });
chatLogSchema.index({ hasError: 1 });

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
export default ChatLog;
