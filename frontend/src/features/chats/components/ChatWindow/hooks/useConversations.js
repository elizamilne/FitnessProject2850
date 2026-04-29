import { useEffect, useState } from "react";
import { conversationService } from "../../../../../services/conversation";

export function useConversation(conversationId, profileId) {
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    if (!conversationId || !profileId) return;

    let isActive = true;

    async function loadConversation() {
      try {
        const { data } = await conversationService.getConversation(
          conversationId,
          profileId
        );

        if (isActive) setConversation(data);
      } catch (err) {
        console.error("Failed to load conversation:", err);
      }
    }

    loadConversation();

    return () => {
      isActive = false;
    };
  }, [conversationId, profileId]);

  return conversation;
}