import ConversationItem from "./ConversationItem";

interface ConversationListProps {
  conversations: any[];
  activeConversationId: string | undefined;
  onSelectConversation: (id: string) => void;
}

const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation
}: ConversationListProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((item) => (
        <ConversationItem
          key={item.id}
          conversation={item}
          isActive={item.id === activeConversationId}
          onClick={() => onSelectConversation(item.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;