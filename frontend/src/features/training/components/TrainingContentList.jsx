import { useState } from "react";
import { Plus } from "lucide-react";
import { programExerciseMetricService } from "../../../services/programExerciseMetric";
import { activityService } from "../../../services/activity";

import { useExercises } from "./hooks/useExercises";
import { useCompletedExercises } from "./hooks/useCompletedExercises";

const TrainingContentList = ({ program, date }) => {
  const { exercises } = useExercises(program);

  const {
    completed,
    initialCompleted,
    toggleExercise,
  } = useCompletedExercises(program, date);

  const progress = exercises.length
    ? Math.min(
      100,
      Math.round(
        ([...new Set(completed)].filter((id) =>
          exercises.some((ex) => ex.programExerciseId === id)
        ).length /
          exercises.length) *
        100
      )
    )
    : 0;

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(exercises.length / pageSize);

  const paginatedExercises = exercises.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const hasNext = page < totalPages;
  const isEmpty = exercises.length === 0;

  const formatMetrics = (metrics = []) => {
    return metrics
      .slice(0, 2)
      .map((m) => {
        const name = m.metricType?.name || "Metric";
        const unit = m.metricType?.unit || "";
        const value = m.value ?? "";

        return `${value}${unit ? ` ${unit}` : ""} ${name.toLowerCase()}`;
      })
      .join(" • ");
  };

  const handleSave = async () => {
    const profile = JSON.parse(sessionStorage.getItem("profile"));
    const profileId = profile?.id;

    try {
      const toCreate = completed.filter(
        (id) => !initialCompleted.includes(id)
      );

      const toDelete = initialCompleted.filter(
        (id) => !completed.includes(id)
      );

      // Create
      await Promise.all(
        toCreate.map(async (programExerciseId) => {
          const res =
            await programExerciseMetricService.getByProgramExerciseId(
              programExerciseId
            );

          const cleanedMetrics = res.data.map(
            ({ metricTypeId, value }) => ({
              metricTypeId,
              value,
            })
          );

          const payload = {
            date,
            profileId,
            programExerciseId,
            metrics: cleanedMetrics,
          };

          return activityService.createActivity(payload);
        })
      );

      // Delete
      await Promise.all(
        toDelete.map((programExerciseId) =>
          activityService.deleteByProgramExercise(
            profileId,
            programExerciseId,
            date
          )
        )
      );
    } catch (error) {
      console.error("Error saving activities:", error);
    }
  };

  // Empty state
  if (!program) {
    return (
      <div className="w-full lg:w-[80%] mx-auto">
        <div className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <div className="text-center text-gray-400 max-w-sm space-y-2">
            <p className="text-base font-semibold text-gray-500">
              No program selected
            </p>
            <p className="text-sm leading-relaxed">
              Select a program to view your training
            </p>
          </div>

          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[100%] mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 truncate">
            {program.title}
          </h2>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 active:scale-95 transition"
          >
            Save
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>In progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 bg-gray-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercises */}
      {isEmpty ? (
        <div className="relative p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center justify-center">
          <div className="text-center text-gray-400 max-w-sm space-y-2">
            <p className="text-base font-semibold text-gray-500">
              No exercises yet
            </p>
            <p className="text-sm leading-relaxed">
              Add exercises to start your workout
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-2">
            {paginatedExercises.map((exercise) => {
              const id = exercise.programExerciseId;
              const programId = program.id;

              const uniqueKey = `${programId}-${id}`;

              const isCompleted = completed.includes(
                exercise.programExerciseId
              );

              return (
                <div
                  key={uniqueKey}
                  onClick={() => toggleExercise(exercise)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer
                    transition-all duration-200 relative
                    ${isCompleted
                      ? "bg-white/70 backdrop-blur border border-indigo-100 shadow-[0_4px_20px_rgba(99,102,241,0.08)]"
                      : "hover:bg-gradient-to-br hover:from-indigo-500/18 hover:via-purple-500/9 hover:to-indigo-500/18"
                    }
                  `}
                >
                  <img
                    src={exercise.image}
                    alt={exercise.exerciseName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {exercise.exerciseName}
                    </h3>

                    <p className="text-base text-gray-500 truncate">
                      {formatMetrics(exercise.metrics)}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${isCompleted
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "border border-gray-300"
                      }`}
                  >
                    {isCompleted && "✓"}
                  </div>

                  {isCompleted && (
                    <div className="absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={!hasNext}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingContentList;