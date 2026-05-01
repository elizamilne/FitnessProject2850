import { X } from "lucide-react";

const ProgramExerciseCard = ({ exercise, isDeleting, onDelete }) => {
  return (
    <div
      className="
        group flex items-center gap-4 px-4 py-3 rounded-xl
        transition-all duration-200
        bg-white/60 backdrop-blur-md border border-white/50
        hover:bg-gradient-to-r
        hover:from-indigo-500/5 hover:to-purple-500/5
        hover:border-indigo-200/60
      "
    >
      <img
        src={exercise.image || "https://via.placeholder.com/60"}
        alt={exercise.exerciseName}
        className="w-14 h-14 rounded-lg object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {exercise.exerciseName}
        </p>

        {exercise.metrics?.length > 0 ? (
          <p className="text-sm text-gray-600 truncate mt-0.5">
            {exercise.metrics.map((metric, index) => (
              <span key={metric.metricType?.id || index}>
                {metric.metricType?.name}: {metric.value}
                {metric.metricType?.unit ? ` ${metric.metricType.unit}` : ""}
                {index < exercise.metrics.length - 1 && (
                  <span className="mx-1 text-gray-300">•</span>
                )}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-sm text-gray-400 mt-0.5">No metrics</p>
        )}

        <p className="text-xs text-gray-400 truncate mt-1">
          Program exercise #{exercise.programExerciseId}
        </p>
      </div>

      <button
        type="button"
        onClick={onDelete}
        disabled={isDeleting}
        className="
          p-1 rounded-full text-red-400
          hover:bg-red-50 hover:text-red-600
          disabled:opacity-40 disabled:cursor-not-allowed
          group-hover:scale-110
          transition-all
        "
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default ProgramExerciseCard;