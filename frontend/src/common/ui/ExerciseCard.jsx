const ExerciseCard = ({
  exerciseData,
  isSelected = false,
  onClick,
  clickable = false,
}) => {
  const { exercise, categories = [], muscleGroups = [] } = exerciseData;

  return (
    <div
      onClick={onClick}
      className={`
      group flex items-center gap-4 px-4 py-3 rounded-xl
      transition-all duration-200

      bg-white/60 backdrop-blur-md border border-white/50

      ${clickable ? "cursor-pointer" : ""}

      ${
        isSelected
          ? `
            bg-gradient-to-r from-indigo-500/10 to-purple-500/10
            border-indigo-200
          `
          : `
            hover:bg-gradient-to-r 
            hover:from-indigo-500/5 hover:to-purple-500/5
            hover:border-indigo-200/60
          `
      }
    `}
    >
      {/* Image */}
      <img
        src={exercise.image || "https://via.placeholder.com/60"}
        alt={exercise.name}
        className="w-14 h-14 rounded-lg object-cover shrink-0 pointer-events-none"
      />

      {/* Text */}
      <div className="flex-1 min-w-0 pointer-events-none">
        {/* Name */}
        <p className="font-semibold text-gray-900 truncate">{exercise.name}</p>

        {/* Muscle Groups */}
        {muscleGroups.length > 0 && (
          <p className="text-sm text-gray-600 truncate mt-0.5">
            {muscleGroups.map((m) => m.name).join(" • ")}
          </p>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <p className="text-xs text-gray-400 truncate mt-1">
            {categories.map((c, i) => (
              <span key={c.id || c.name}>
                {c.name}
                {i < categories.length - 1 && (
                  <span className="mx-1 text-gray-300">/</span>
                )}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Right Icon */}
      <span
        className={`
        text-sm font-semibold pointer-events-none transition-all

        ${
          isSelected
            ? "text-indigo-600"
            : "text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1"
        }
      `}
      >
        {isSelected ? "✓" : "→"}
      </span>
    </div>
  );
};

export default ExerciseCard;
