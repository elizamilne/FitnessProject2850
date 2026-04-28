import { api } from "./api";

export const messageService = {
  getMessages: (conversationId) =>
    api.get(`/messages/${conversationId}`)
};