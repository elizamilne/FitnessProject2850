import { api } from "./api";

export const conversationService = {
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