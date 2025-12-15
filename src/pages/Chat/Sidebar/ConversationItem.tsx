import Avatar from '../../../components/common/Avatar';

interface ConversationItemProps {
  conversation: any;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = ({
    conversation,
    isActive,
    onClick
}: ConversationItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
        isActive ? 'bg-blue-50' : ''
      }`}
    >
      <div className="relative">
        <Avatar
          url={conversation.avatarUrl || null}
          size={48}
          name={conversation.name}
          isOnline={conversation.isOnline}
        />
        {conversation.unread > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {conversation.unread}
          </div>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
          <span className="text-xs text-gray-500 ml-2">{conversation.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{conversation.lastMsg}</p>
      </div>
    </div>
  );
};

export default ConversationItem;