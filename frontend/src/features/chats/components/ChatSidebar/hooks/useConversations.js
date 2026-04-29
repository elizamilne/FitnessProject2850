import { useEffect, useState } from "react";
import { conversationService } from "../../../../../services/conversation";

export const useConversations = (profileId, filter) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!profileId) return;

    const fetchConversations = async () => {
      try {
        const { data } =
          await conversationService.getUserConversations(
            profileId,
            filter === "all" ? undefined : filter
          );

        setConversations(data);
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };

    fetchConversations();
  }, [profileId, filter]);

  return { conversations, setConversations };
};