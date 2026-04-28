import { useEffect, useRef, useState } from "react";
import { chatService } from "../../services/chat";
import { messageService } from "../../services/message";

const Chat = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  // 🟢 1. Load messages (REST)
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

  // 🟢 2. WebSocket connection
  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem("token");

    const socket = chatService.connect(
      conversationId,
      token,
      (msg) => {
        // ✅ SAFE state update (no warning)
        setMessages((prev) => [...prev, msg]);
      }
    );

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [conversationId]);

  // 🟢 3. Send message
  const sendMessage = (text) => {
    if (!text || !socketRef.current) return;

    chatService.sendMessage(socketRef.current, text);
  };

  return (
    <div>
      <h2>Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.profileId}</b>: {msg.content}
          </div>
        ))}
      </div>

      <button onClick={() => sendMessage("Hello!")}>
        Send Hello
      </button>
    </div>
  );
}

export default Chat;