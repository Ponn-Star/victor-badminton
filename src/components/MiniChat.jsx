import { useState, useRef, useEffect } from 'react';
import './MiniChat.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function MiniChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Xin Chào! Tôi là Victor Cortex, trợ lý AI cho Victor Badminton - thương hiệu dụng cụ cầu lông cao cấp Việt Nam. Tôi có thể giúp gì cho bạn để tìm được sản phẩm hoàn hảo dựa trên phong cách chơi của bạn hiện nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const messageIdRef = useRef(2);

  const buildHistory = (items) => {
    return items
      .filter((item) => item.sender === 'user' || item.sender === 'ai')
      .slice(-10)
      .map((item) => ({
        role: item.sender === 'user' ? 'user' : 'assistant',
        content: item.text,
      }));
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    const userId = messageIdRef.current++;
    const aiId = messageIdRef.current++;
    const nextMessages = [
      ...messages,
      { id: userId, sender: 'user', text: userMessage },
      { id: aiId, sender: 'ai', text: '' },
    ];

    setMessages(nextMessages);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: buildHistory(messages),
        }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.details || errorPayload.error || 'Failed to get AI response');
      }

      if (!response.body) {
        throw new Error('Streaming is not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = '';
      let hasStartedStreaming = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const chunks = sseBuffer.split('\n\n');
        sseBuffer = chunks.pop() || '';

        for (const chunk of chunks) {
          const line = chunk
            .split('\n')
            .find((item) => item.startsWith('data: '));

          if (!line) continue;

          const payload = JSON.parse(line.slice(6));

          if (payload.type === 'token') {
            if (!hasStartedStreaming) {
              hasStartedStreaming = true;
              setIsTyping(false);
            }

            setMessages((prev) =>
              prev.map((item) =>
                item.id === aiId
                  ? { ...item, text: `${item.text}${payload.token}` }
                  : item
              )
            );
          }

          if (payload.type === 'error') {
            throw new Error(payload.message || 'Streaming failed');
          }

          if (payload.type === 'done') {
            setIsTyping(false);
          }
        }
      }

      setMessages((prev) =>
        prev.map((item) =>
          item.id === aiId && !item.text
            ? { ...item, text: 'Xin lỗi, tôi chưa thể phản hồi ngay lúc này.' }
            : item
        )
      );
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) =>
        prev.map((item) =>
          item.id === aiId
            ? { ...item, text: 'Xin lỗi, tôi đang gặp lỗi kết nối. Vui lòng thử lại sau.' }
            : item
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="mini-chat-container">
      {!isOpen && (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <span className="chat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </span>
          <span className="chat-label">Ask AI</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="ai-avatar-small">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
              </div>
              <div className="chat-title">
                <h3>Victor Cortex</h3>
                <span className="online-status">Online</span>
              </div>
            </div>
            <button className="chat-close" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-wrapper ${msg.sender}`}>
                {msg.sender === 'ai' && (
                   <div className="message-avatar">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                   </div>
                )}
                <div className={`message-bubble ${msg.sender}`}>{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message-wrapper ai">
                 <div className="message-avatar">
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path></svg>
                 </div>
                 <div className="message-bubble typing-bubble">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <form className="chat-input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="E.g., Which racket is best for smashes?" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MiniChat;
