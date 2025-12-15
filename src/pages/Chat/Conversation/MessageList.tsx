import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: any[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50 to-white">
      {messages.map((item) => (
        <MessageItem key={item.id} message={item} />
      ))}
    </div>
  );
};

export default MessageList;