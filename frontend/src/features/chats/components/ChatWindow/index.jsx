import {
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import { Send } from "lucide-react";
import { gsap } from "gsap";

import MessageCard from "./components/MessageCard";
import { useMessages } from "./hooks/useMessages";
import { useConversation } from "./hooks/useConversations";
import { useChatSocket } from "./hooks/useChatSocket";
import { useAutoScroll } from "./hooks/useAutoScroll";

const ChatWindow = ({ profileId, conversationId }) => {
  const { messages, setMessages } = useMessages(conversationId);
  const conversation = useConversation(conversationId, profileId);

  const [input, setInput] = useState("");

  const containerRef = useRef(null);
  const messagesRef = useRef(null);

  // Animate ONLY header text on conversation change
  useLayoutEffect(() => {
    if (!conversationId) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chat-header-text > *",
        { y: 6, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [conversationId]);

  // Animate only new messages
  useEffect(() => {
    if (!messagesRef.current) return;

    const items = messagesRef.current.querySelectorAll(".message-item");
    if (!items.length) return;

    const last = items[items.length - 1];

    gsap.fromTo(
      last,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.25,
        ease: "power2.out",
      }
    );
  }, [messages]);


  const handleMessage = useCallback(
    (msg) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.temp &&
            m.profileId === msg.profileId &&
            m.content === msg.content &&
            Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 3000
        );

        if (isDuplicate) {
          return prev.map((m) =>
            m.temp && m.profileId === msg.profileId && m.content === msg.content
              ? msg
              : m
          );
        }

        return [...prev, msg];
      });
    },
    [setMessages]
  );

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
    <div
      ref={containerRef}
      className="flex flex-col h-full min-h-0 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fdf4ff]"
    >
      {/* Header */}
      <div className="pt-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="relative px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 pointer-events-none" />

            <div className="relative flex items-center gap-3">
              {/* Avatar (NO animation) */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-semibold text-white">
                {conversation?.name?.[0] || "?"}
              </div>

              {/* Animated text ONLY */}
              <div className="flex flex-col leading-tight chat-header-text">
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
        <div
          ref={messagesRef}
          className="max-w-2xl mx-auto flex flex-col gap-3 px-4 h-full"
        >
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="flex flex-col items-center gap-4 text-center w-full">
                <img
                  src="/watch.svg"
                  alt="No messages"
                  className="w-48 opacity-60"
                />

                <div
                  className="
                    w-full max-w-xs px-6 py-5 rounded-2xl
                    bg-white/80 backdrop-blur-xl
                    border border-white/60
                    shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                  "
                >
                  <p className="text-sm text-gray-500">No messages yet</p>

                  <p className="mt-1 text-base font-semibold text-gray-900">
                    Say hello 👋
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div
                  key={msg.id || `${msg.createdAt}-${i}`}
                  className="message-item"
                >
                  <MessageCard
                    message={msg}
                    isMine={msg.profileId === profileId}
                  />
                </div>
              ))}

              <div ref={bottomRef} />
            </>
          )}
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