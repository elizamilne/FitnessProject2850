import { useEffect, useRef, useState } from "react";
import { chatService } from "../../../../services/chat";
import { messageService } from "../../../../services/message";
import { Send } from "lucide-react";
import MessageCard from "./components/MessageCard";

const ChatWindow = ({ profileId, conversationId }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Load messages
  useEffect(() => {
    if (!conversationId) return;

    let isActive = true;

    async function loadMessages() {
      try {
        const { data } = await messageService.getMessages(conversationId);

        if (isActive) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }

    loadMessages();

    return () => {
      isActive = false;
    };
  }, [conversationId]);

  // WebSocket connection
  useEffect(() => {
    if (!conversationId) return;

    const token = sessionStorage.getItem("token");

    const socket = chatService.connect(conversationId, token, (msg) => {
      
      //  SAFE state update (no warning)
      console.log("🔥 WS RECEIVED:", msg);

      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [conversationId]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    chatService.sendMessage(socketRef.current, input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-4 border-b bg-white text-lg font-semibold">Chat</div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-100 py-4">
        <div className="max-w-2xl mx-auto flex flex-col gap-2 px-3">
          {messages.map((msg, i) => (
            <MessageCard
              key={i}
              message={msg}
              isMine={msg.profileId === profileId}
            />
          ))}

          {/* Auto scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
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
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={sendMessage}
          className="
            p-3 bg-indigo-600 text-white rounded-full 
            hover:bg-indigo-700 transition 
            flex items-center justify-center
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
