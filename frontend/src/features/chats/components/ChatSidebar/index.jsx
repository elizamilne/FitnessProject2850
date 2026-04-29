import { conversationService } from "../../../../services/conversation";

import FilterTabs from "./components/FilterTabs";
import SearchInput from "./components/SearchInput";
import ConversationsList from "./components/ConversationsList";
import { useGroupCreation } from "./hooks/useGroupCreation";
import { useSearchProfiles } from "./hooks/useSearchProfiles";
import { useConversations } from "./hooks/useConversations";
import { useState } from "react";

const ChatSidebar = ({ profileId, conversationId, setConversationId }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Hooks
  const { results, loading, setResults, setLoading } =
    useSearchProfiles(search);

  const { conversations, setConversations } = useConversations(
    profileId,
    filter,
  );

  const {
    isCreatingGroup,
    selectedUsers,
    toggleUser,
    createGroup,
    cancelGroup,
  } = useGroupCreation(profileId, setConversations, setConversationId);

  // Start private chat
  const startPrivateChat = async (selectedUser) => {
    const { data } = await conversationService.startPrivate(
      profileId,
      selectedUser.profileId,
    );

    const newConversationId = data.conversationId;

    setConversations((prev) => {
      if (prev.some((c) => c.conversationId === newConversationId)) {
        return prev;
      }

      return [{ conversationId: newConversationId }, ...prev];
    });

    setConversationId(newConversationId);
  };

  return (
    <div className="w-full md:w-72 border-r border-gray-300 p-4 flex flex-col gap-4 bg-white">
      <div className="flex flex-col">
        <button
          onClick={createGroup}
          disabled={isCreatingGroup && selectedUsers.length === 0}
          className={`rounded py-2 text-white transition ${
            isCreatingGroup
              ? selectedUsers.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isCreatingGroup
            ? `Create Group (${selectedUsers.length})`
            : "+ Create Group"}
        </button>

        {isCreatingGroup && (
          <button onClick={cancelGroup} className="text-sm text-gray-500 mt-1">
            Cancel
          </button>
        )}
      </div>

      {/* Search */}
      <SearchInput
        label="Search People"
        placeholder="Search..."
        value={search}
        onChange={setSearch}
        onClear={() => {
          setResults([]);
          setLoading(false);
        }}
      />

      {/* Filter */}
      <FilterTabs value={filter} onChange={setFilter} />

      {/* List */}
      <ConversationsList
        search={search}
        loading={loading}
        results={results}
        conversations={conversations}
        conversationId={conversationId}
        onSelectConversation={setConversationId}
        onSelectUser={startPrivateChat}
        filter={filter}
        isCreatingGroup={isCreatingGroup}
        selectedUsers={selectedUsers}
        onToggleUser={toggleUser}
        onCreateGroup={createGroup}
        onCancelGroup={cancelGroup}
      />
    </div>
  );
};

export default ChatSidebar;
