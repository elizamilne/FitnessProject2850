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
          <div className="text-xs text-gray-500 mb-1 ml-2">
            {senderName}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            px-4 py-2.5 rounded-2xl break-words relative
            transition-all duration-200

            ${
              isMine
                ? `
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  text-white rounded-br-sm
                  shadow-[0_6px_20px_rgba(99,102,241,0.25)]
                `
                : `
                  bg-white/70 backdrop-blur
                  text-gray-800 rounded-bl-sm
                  border border-white/50
                  shadow-[0_4px_15px_rgba(0,0,0,0.05)]
                `
            }
          `}
        >
          {message.content}

          {/* subtle glow for mine */}
          {isMine && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none 
              bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
          )}
        </div>

        {/* Footer */}
        <div
          className={`
            flex items-center gap-2 mt-1 text-[11px] text-gray-400
            ${isMine ? "justify-end" : "justify-start"}
          `}
        >
          <span>{formatTime(message.createdAt)}</span>

          {!isMine && (
            <button
              onClick={() => onReport?.(message)}
              className="
                flex items-center justify-center
                text-gray-400 hover:text-red-500
                transition
              "
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