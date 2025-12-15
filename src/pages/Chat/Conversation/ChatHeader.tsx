import { MoreVertical, Phone, Video } from "lucide-react";

interface ChatHeaderProps {
  activeConversation: any;
}

const ChatHeader = ({ activeConversation }: ChatHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xl">
          {activeConversation?.avatar || '👤'}
        </div>
        <div className="ml-3">
          <h2 className="font-semibold">{activeConversation?.name || 'Chọn cuộc trò chuyện'}</h2>
          <p className="text-xs text-green-500">Đang hoạt động</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
          <Phone size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
          <Video size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
  
};

export default ChatHeader;