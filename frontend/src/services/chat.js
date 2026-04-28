export const chatService = {
  connect: (conversationId, token, onMessage) => {
    const socket = new WebSocket(
      `ws://localhost:8080/chat?conversationId=${conversationId}&token=${token}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    return socket;
  },

  sendMessage: (socket, message) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message); 
    }
  }
};