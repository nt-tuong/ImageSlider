import { Image, Paperclip, Send, Smile } from "lucide-react";

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const ChatInput = ({
    message,
    onMessageChange,
    onSendMessage
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <Image size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <Paperclip size={20} />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button className="p-1 hover:bg-gray-200 rounded-full text-gray-600">
            <Smile size={20} />
          </button>
        </div>
        <button
          onClick={onSendMessage}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;