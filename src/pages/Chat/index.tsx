import { useEffect, useState } from "react";
import MainChatArea from "./Conversation/MainChatArea";
import Sidebar from "./Sidebar";
import { messagesData, conversationsData } from "../../data";

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  
  const [messages, setMessages] = useState(messagesData);

  const [conversations] = useState(conversationsData);

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