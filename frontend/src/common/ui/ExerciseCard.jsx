const ExerciseCard = ({
  exerciseData,
  isSelected = false,
  onClick,
  clickable = false,
}) => {
  const { exercise, categories = [], muscleGroups = [] } = exerciseData;

  return (
    <div
      onClick={onClick} // ✅ attach click handler
      className={`flex items-center gap-3 p-3 rounded-lg border transition
        ${clickable ? "cursor-pointer hover:bg-gray-50" : ""}
        ${isSelected ? "bg-blue-50 border-blue-200" : "bg-white"}
      `}
    >
      <img
        src={exercise.img || "https://via.placeholder.com/60"}
        alt={exercise.name}
        className="w-12 h-12 rounded-md object-cover pointer-events-none"
      />

      <div className="flex-1 min-w-0 pointer-events-none">
        <p className="font-medium truncate">{exercise.name}</p>

        {categories.length > 0 && (
          <p className="text-sm text-gray-500 truncate">
            {categories.map((c) => c.name).join(", ")}
          </p>
        )}

        {muscleGroups.length > 0 && (
          <p className="text-xs text-gray-400 truncate">
            {muscleGroups.map((m) => m.name).join(", ")}
          </p>
        )}
      </div>

      {isSelected && (
        <span className="text-blue-500 font-bold pointer-events-none">
          ✓
        </span>
      )}
    </div>
  );
};

export default ExerciseCard;