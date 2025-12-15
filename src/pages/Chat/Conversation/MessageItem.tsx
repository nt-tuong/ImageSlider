interface MessageItemProps {
  message: any;
}

const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end space-x-2 max-w-md ${message.sent ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {!message.sent && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm flex-shrink-0">
            👨
          </div>
        )}
        <div>
          <div
            className={`px-4 py-2 rounded-2xl ${
              message.sent
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
            }`}
          >
            {message.text}
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${message.sent ? 'text-right' : 'text-left'}`}>
            {message.time}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;