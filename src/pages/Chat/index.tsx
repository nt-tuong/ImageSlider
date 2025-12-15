import { useEffect, useState } from "react";
import MainChatArea from "./Conversation/MainChatArea";
import Sidebar from "./Sidebar";

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  
  const [messages, setMessages] = useState([
    { id: 1, text: 'Chào bạn! Bạn khỏe không?', sent: false, time: '10:30' },
    { id: 2, text: 'Mình khỏe, cảm ơn bạn!', sent: true, time: '10:31' },
    { id: 3, text: 'Cuối tuần này mình đi chơi nhé', sent: false, time: '10:32' },
    { id: 4, text: 'Okay, đi đâu vậy?', sent: true, time: '10:33' },
  ]);

  const [conversations] = useState([
    { id: "1", name: 'Nguyễn Văn A', avatarUrl: "/assets/images/pexels-cottonbro-10034377.jpg", isOnline: true, lastMsg: 'Cuối tuần này mình đi chơi nhé', time: '10:32', unread: 2 },
    { id: "2", name: 'Trần Thị B', avatarUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop", isOnline: false, lastMsg: 'Okela, hẹn gặp lại', time: 'Hôm qua', unread: 0 },
    { id: "3", name: 'Lê Văn C', avatarUrl: null, isOnline: true, lastMsg: 'Đã gửi một file', time: 'T2', unread: 0 },
    { id: "4", name: 'Phạm Thị D', avatarUrl: null, isOnline: false, lastMsg: 'Thanks bạn nhé!', time: 'T2', unread: 0 },
    { id: "5", name: 'Hoàng Văn E', avatarUrl: null, isOnline: true, lastMsg: 'Mình đang bận, call lại sau nhé', time: 'CN', unread: 1 },
  ]);

  const activeConversation = conversations.find(item => item.id === activeConversationId);

  useEffect(() => {
    document.title = "Chat Demo";
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sent: true,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <MainChatArea
        activeConversation={activeConversation}
        messages={messages}
        message={message}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatUI;