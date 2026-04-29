import { useState } from "react";
import { conversationService } from "../../../../../services/conversation";

export const useGroupCreation = (profileId, setConversations, setConversationId) => {
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      if (prev.some((u) => u.profileId === user.profileId)) {
        return prev.filter((u) => u.profileId !== user.profileId);
      }
      return [...prev, user];
    });
  };

  const createGroup = async () => {
    if (!isCreatingGroup) {
      setIsCreatingGroup(true);
      return;
    }

    if (selectedUsers.length === 0) return;
    const participants = [
      profileId,
      ...selectedUsers.map((u) => u.profileId),
    ];
    console.log(participants)

    const { data } = await conversationService.createGroup(participants);

    const newConversationId = data.conversationId;

    setConversations((prev) => [
      {
        conversationId: newConversationId,
        name: `Group #${newConversationId}`,
        isGroup: true,
      },
      ...prev,
    ]);

    setConversationId(newConversationId);

    reset();
  };

  const cancelGroup = () => {
    reset();
  };

  const reset = () => {
    setIsCreatingGroup(false);
    setSelectedUsers([]);
  };

  return {
    isCreatingGroup,
    selectedUsers,
    toggleUser,
    createGroup,
    cancelGroup,
  };
};