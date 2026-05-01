const ProgramModalActions = ({
  isEditing,
  setIsEditing,
  isValid,
  updateLoading,
  archiveLoading,
  archived,
  onUpdate,
  onCancel,
  onArchive,
}) => {
  return (
    <div className="flex gap-3 pt-2">
      {isEditing ? (
        <>
          <button
            onClick={onUpdate}
            disabled={!isValid || updateLoading}
            className="
              flex-1 py-3 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-indigo-500 to-purple-500 text-white
              hover:opacity-90 active:scale-[0.98] transition
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={onCancel}
            className="
              flex-1 py-3 rounded-xl text-sm font-medium
              bg-gray-100 text-gray-700
              hover:bg-gray-200 transition
            "
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="
              flex-1 py-3 rounded-xl text-sm font-medium
              bg-gray-100 text-gray-700
              hover:bg-gray-200 transition
            "
          >
            Edit
          </button>

          <button
            onClick={onArchive}
            disabled={archiveLoading}
            className={`
              flex-1 py-3 rounded-xl text-sm font-semibold
              text-white hover:opacity-90 active:scale-[0.98]
              transition disabled:opacity-40 disabled:cursor-not-allowed
              ${
                archived
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500"
              }
            `}
          >
            {archiveLoading
              ? archived
                ? "Unarchiving..."
                : "Archiving..."
              : archived
                ? "Disarchive"
                : "Archive"}
          </button>
        </>
      )}
    </div>
  );
};

export default ProgramModalActions;