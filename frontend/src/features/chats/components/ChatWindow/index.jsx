import { useCallback, useState } from "react";
import { Send } from "lucide-react";

import MessageCard from "./components/MessageCard";
import { useMessages } from "./hooks/useMessages";
import { useConversation } from "./hooks/useConversations";
import { useChatSocket } from "./hooks/useChatSocket";
import { useAutoScroll } from "./hooks/useAutoScroll";

const ChatWindow = ({ profileId, conversationId }) => {
  const { messages, setMessages } = useMessages(conversationId);
  const conversation = useConversation(conversationId, profileId);

  const [input, setInput] = useState("");

  // ✅ FIX: replace temp message instead of duplicating
  const handleMessage = useCallback((msg) => {
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (m) =>
          m.temp &&
          m.profileId === msg.profileId &&
          m.content === msg.content &&
          Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 3000
      );

      if (isDuplicate) {
        // replace temp message with real one
        return prev.map((m) =>
          m.temp &&
          m.profileId === msg.profileId &&
          m.content === msg.content
            ? msg
            : m
        );
      }

      return [...prev, msg];
    });
  }, [setMessages]);

  const socketRef = useChatSocket(conversationId, handleMessage);

  const bottomRef = useAutoScroll(messages);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const now = new Date().toISOString();

    const tempMessage = {
      content: input,
      profileId,
      createdAt: now,
      temp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    socketRef.current.send(input);

    setInput("");
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]">

      {/* Header */}
      <div className="pt-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3 overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 pointer-events-none" />

            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
                {conversation?.name?.[0] || "?"}
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-900">
                  {conversation?.name || "Loading..."}
                </span>

                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Active chat
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-3 px-4">
          {messages.map((msg, i) => (
            <MessageCard
              key={msg.id || `${msg.createdAt}-${i}`}
              message={msg}
              isMine={msg.profileId === profileId}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-gray-700 text-sm focus:outline-none"
            />

            <button
              onClick={sendMessage}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              <Send size={16} />
            </button>

          </div>
        </div>
      </div>

    </div>
  );
};

export default ChatWindow;