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

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {!search.trim() && !isCreatingGroup ? (
        <>
          <h3 className="font-semibold mb-2">{getTitle()}</h3>

          <div className="flex flex-col gap-2">
            {conversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => onSelectConversation(conv.conversationId)}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  conversationId === conv.conversationId ? "bg-gray-200" : ""
                }`}
              >
                {conv.name}
              </div>
            ))}
          </div>
        </>
      ) : loading ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          Searching...
        </div>
      ) : results.length > 0 ? (
        <>
          <h3 className="font-semibold mb-2">{getTitle()}</h3>

          <div className="flex flex-col gap-2">
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
                  className={`p-2 rounded cursor-pointer ${
                    isCreatingGroup
                      ? isSelected
                        ? "bg-indigo-200"
                        : "hover:bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>

                  <div className="text-sm text-gray-500">{user.email}</div>

                  {isCreatingGroup && isSelected && (
                    <div className="text-xs text-indigo-600 mt-1">
                      ✓ Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
};

export default ConversationsList;