import { MoreVertical, Phone, Video } from "lucide-react";
import Avatar from "../../../components/common/Avatar";

interface ChatHeaderProps {
  activeConversation: any;
}

const ChatHeader = ({ activeConversation }: ChatHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Avatar
          url={activeConversation?.avatarUrl || null}
          size={40}
          name={activeConversation?.name || ''}
          isOnline={activeConversation?.isOnline || false}
        />
        <div className="ml-3">
          <h2 className="font-semibold">{activeConversation?.name || 'Chọn cuộc trò chuyện'}</h2>
          <p className={`text-xs ${activeConversation?.isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            {activeConversation?.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          </p>
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