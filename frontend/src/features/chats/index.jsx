import { useState } from "react";
import Chat from "./chat";
import { conversationService } from "../../services/conversation";

export default function ChatPage() {
  const [conversationId, setConversationId] = useState(null);

  // nitialize directly (no useEffect)
  const [conversations] = useState([
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
  ]);

  const startChat = async () => {
    const { data } = await conversationService.startPrivate(1, 2);
    setConversationId(data.conversationId);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <h3>Chats</h3>

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setConversationId(conv.id)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            {conv.name}
          </div>
        ))}

        <button onClick={startChat}>Start Chat</button>
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        {conversationId ? (
          <Chat conversationId={conversationId} />
        ) : (
          <p>Select a chat</p>
        )}
      </div>
    </div>
  );
}
