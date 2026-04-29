import { useEffect, useState } from "react";
import { messageService } from "../../../../../services/message";

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversationId) return;

    let isActive = true;

    async function loadMessages() {
      try {
        const { data } = await messageService.getMessages(conversationId);
        if (isActive) setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }

    loadMessages();
    return () => (isActive = false);
  }, [conversationId]);

  return { messages, setMessages };
}