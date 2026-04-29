import { useEffect, useRef } from "react";
import { chatService } from "../../../../../services/chat";

export function useChatSocket(conversationId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    console.log(conversationId)

    const token = sessionStorage.getItem("token");

    const socket = chatService.connect(conversationId, token, onMessage);
    socketRef.current = socket;

    return () => socket.close();
  }, [conversationId, onMessage]);

  return socketRef;
}