const ConversationsList = ({
  search,
  loading,
  results,
  conversations,
  conversationId,
  onSelectConversation,
  onSelectUser,
  filter,
  isCreatingGroup,
  selectedUsers,
  onToggleUser,
}) => {
  const getTitle = () => {
    if (isCreatingGroup) return "Select People";
    if (filter === "group") return "Groups";
    if (filter === "chat") return "Chats";
    return "Conversations";
  };

  const isEmptyConversations = !loading && conversations.length === 0;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-3 pb-4">
      {!search.trim() && !isCreatingGroup ? (
        <>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 px-1 tracking-wide">
            {getTitle()}
          </h3>

          {/* Empty state for conversations */}
          {isEmptyConversations ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-gray-400 max-w-sm space-y-2">
                <p className="text-sm font-semibold text-gray-500">
                  No conversations yet
                </p>
                <p className="text-xs leading-relaxed">
                  Start a chat to see your conversations here
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {conversations.map((conv) => {
                const isActive = conversationId === conv.conversationId;

                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => onSelectConversation(conv.conversationId)}
                    className={`
                      relative px-4 py-3 rounded-2xl cursor-pointer
                      transition-all duration-200 group

                      ${
                        isActive
                          ? `
                            bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                            border border-indigo-300/70
                            shadow-[0_6px_20px_rgba(99,102,241,0.15)]
                          `
                          : `
                            bg-white/80 backdrop-blur-md
                            border border-white/60
                            hover:bg-white
                            hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]
                            hover:-translate-y-[1px]
                          `
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
                    )}

                    <span
                      className={`
                        relative block truncate text-sm font-medium
                        ${
                          isActive
                            ? "text-indigo-700"
                            : "text-gray-800 group-hover:text-gray-900"
                        }
                      `}
                    >
                      {conv.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : loading ? (
        <div className="flex items-center justify-center h-full text-sm text-gray-500">
          Searching...
        </div>
      ) : results.length > 0 ? (
        <>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 px-1 tracking-wide">
            {getTitle()}
          </h3>

          <div className="flex flex-col gap-2.5">
            {results.map((user) => {
              const isSelected = selectedUsers.some(
                (u) => u.profileId === user.profileId,
              );

              return (
                <div
                  key={user.profileId}
                  onClick={() =>
                    isCreatingGroup ? onToggleUser(user) : onSelectUser(user)
                  }
                  className={`
                    px-4 py-3 rounded-2xl cursor-pointer
                    transition-all duration-200

                    ${
                      isCreatingGroup && isSelected
                        ? `
                          bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                          border border-indigo-300/70
                          shadow-[0_6px_20px_rgba(99,102,241,0.15)]
                        `
                        : `
                          bg-white/80 backdrop-blur-md
                          border border-white/60
                          hover:bg-white
                          hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]
                        `
                    }
                  `}
                >
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </div>

                  <div className="text-xs text-gray-500 truncate">
                    {user.email}
                  </div>

                  {isCreatingGroup && isSelected && (
                    <div className="text-xs text-indigo-600 mt-1 font-medium">
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Improved search empty state
        <div className="flex items-center justify-center py-12">
          <div className="text-center text-gray-400 max-w-sm space-y-2">
            <p className="text-sm font-semibold text-gray-500">
              No results found
            </p>
            <p className="text-xs leading-relaxed">
              Try searching with a different name or email
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationsList;