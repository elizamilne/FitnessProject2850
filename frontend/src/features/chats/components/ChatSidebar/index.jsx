import { conversationService } from "../../../../services/conversation";

import FilterTabs from "./components/FilterTabs";
import SearchInput from "./components/SearchInput";
import ConversationsList from "./components/ConversationsList";
import { useGroupCreation } from "./hooks/useGroupCreation";
import { useSearchProfiles } from "./hooks/useSearchProfiles";
import { useConversations } from "./hooks/useConversations";
import { useState } from "react";
import { Users } from "lucide-react";

const ChatSidebar = ({ profileId, conversationId, setConversationId }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { results, loading, setResults, setLoading } =
    useSearchProfiles(search, profileId);

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
    <div
      className="
        w-full md:w-72 h-full
        p-4 flex flex-col gap-4
      "
    >
      {/* Create group */}
      <div className="flex flex-col gap-1">
        <button
          onClick={createGroup}
          disabled={isCreatingGroup && selectedUsers.length === 0}
          className={`
            flex items-center justify-center gap-2
            rounded-xl py-2.5 text-sm font-semibold
            transition-all duration-200

            ${
              isCreatingGroup
                ? selectedUsers.length === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:opacity-90 active:scale-95"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:opacity-90 active:scale-95"
            }
          `}
        >
          <Users size={16} />
          {isCreatingGroup
            ? `Create (${selectedUsers.length})`
            : "Create Group"}
        </button>

        {isCreatingGroup && (
          <button
            onClick={cancelGroup}
            className="text-xs text-gray-500 hover:text-gray-700 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/20" />

      {/* Search */}
      <SearchInput
        profileId={profileId}
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

      {/* Divider */}
      <div className="h-px bg-white/20" />

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
      />
    </div>
  );
};

export default ChatSidebar;