import { useEffect, useRef } from "react";
import { chatService } from "../../../../../services/chat";

export function useChatSocket(conversationId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!conversationId) return;

    const token = sessionStorage.getItem("token");

    let isActive = true;

    const socket = chatService.connect(conversationId, token, onMessage);

    socketRef.current = socket;

    socket.onopen = () => {
      if (!isActive) {
        socket.close();
      }
    };

    return () => {
      isActive = false;

      // ❌ DO NOT close immediately
      // let onopen handle it safely
    };
  }, [conversationId, onMessage]);

  return socketRef;
}