import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

interface MainChatAreaProps {
  activeConversation: any;
  messages: any[];
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const MainChatArea = ({
    activeConversation,
    messages,
    message,
    onMessageChange,
    onSendMessage
}: MainChatAreaProps) => {
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader activeConversation={activeConversation} />
      <MessageList messages={messages} />
      <ChatInput
        message={message}
        onMessageChange={onMessageChange}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default MainChatArea;