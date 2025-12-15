import ConversationList from "./ConversationList";
import SidebarHeader from "./SidebarHeader";

interface SidebarProps {
  conversations: any[];
  activeConversationId: string | undefined;
  onSelectConversation: (id: string) => void;
}

const Sidebar = ({
  conversations,
  activeConversationId,
  onSelectConversation
}: SidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <SidebarHeader />
      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
      />
    </div>
  );
};

export default Sidebar;