import { Flag } from "lucide-react";

const MessageCard = ({ message, isMine, onReport }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const senderName = message.senderName || "Unknown";

  return (
    <div className={`flex my-2 ${isMine ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col max-w-[70%]">
        {/* Sender name */}
        {!isMine && (
          <div className="text-xs text-gray-500 mb-1 ml-1">{senderName}</div>
        )}

        {/* Message bubble */}
        <div
          className={`
            px-3 py-2 rounded-2xl shadow-sm break-words
            ${
              isMine
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-gray-200 text-gray-900 rounded-bl-sm"
            }
          `}
        >
          {message.content}
        </div>

        {/* Footer row (time + report) */}
        <div
          className={`flex items-center gap-2 mt-1 text-[10px] opacity-70 ${
            isMine ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatTime(message.createdAt)}</span>

          {!isMine && (
            <button
              onClick={() => onReport?.(message)}
              className="text-gray-400 hover:text-red-500"
            >
              <Flag
                size={12}
                className="transition-all duration-150 hover:fill-red-500"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
