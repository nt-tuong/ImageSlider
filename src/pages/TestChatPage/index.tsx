import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import MessageIcon from "../../components/icons/MessageIcon";

const TestChatPage: React.FC = () => {
  const navigate = useNavigate();

  const handleMessageClick = (): void => {
    console.log("Message icon clicked!");
  };

  useEffect(() => {
    document.title = "Test Chat";
  }, []);

  return (
    <div className="test-chat-page">
      <div className="test-chat-header">
        <button onClick={() => navigate("/")} className="back-link">
          ← Back to Home
        </button>
        <h1>Test Chat</h1>
      </div>

      <div className="test-chat-content">
        <div className="chat-demo">
          <MessageIcon
            size={80}
            color="#667eea"
            onClick={handleMessageClick}
            className="chat-demo-icon"
          />
          <p>Chat functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default TestChatPage;
