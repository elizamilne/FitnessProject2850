import { api } from "./api";

export const conversationService = {
  getUserConversations: (profileId, type) =>
    api.get(`/conversation/user/${profileId}`, {
      params: type ? { type } : {}
    }),

  startPrivate: (profile1Id, profile2Id) =>
    api.post("/conversation/private", {
      user1: profile1Id,
      user2: profile2Id
    }),

  createGroup: (participants) =>
    api.post("/conversation/group", {
      participants
    })
};