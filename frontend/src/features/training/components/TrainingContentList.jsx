import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { programExerciseService } from "../../../services/programExercise";
import { metricService } from "../../../services/metricType";
import { programExerciseMetricService } from "../../../services/programExerciseMetric";
import { activityService } from "../../../services/activity";

const TrainingContentList = ({ program, date }) => {
  const progress = 66;
  const [completed, setCompleted] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [metricMap, setMetricMap] = useState({});

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const { data } = await metricService.getAll();

        const map = Object.fromEntries(
          data.map((m) => [
            m.id,
            {
              name: m.name,
              unit: m.unit,
            },
          ]),
        );

        setMetricMap(map);
      } catch (error) {
        console.error("Failed to load metrics", error);
      }
    };

    loadMetrics();
  }, []);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const { data } = await programExerciseService.getByProgram(program.id);
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      }
    };

    if (program) loadExercises();
  }, [program]);

  const toggleExercise = (exercise) => {
    setCompleted((prev) => {
      const exists = prev.some(
        (item) => item.programExerciseId === exercise.programExerciseId,
      );

      return exists
        ? prev.filter(
            (item) =>
              item.programExerciseId !== exercise.programExerciseId,
          )
        : [...prev, exercise];
    });
  };

  const formatMetrics = (metrics) => {
    if (!metrics) return "";

    return metrics
      .slice(0, 2)
      .map((m) => {
        const metric = metricMap[m.metricTypeId];
        if (!metric) return m.value;

        return `${m.value}${metric.unit || ""} ${metric.name.toLowerCase()}`;
      })
      .join(" • ");
  };

  const handleSave = async () => {
    const profile = JSON.parse(sessionStorage.getItem("profile"));
    const profileId = profile?.id;

    try {
      completed.map(async (e) => {
        const exerciseId = e.programExerciseId;
        const res =
          await programExerciseMetricService.getByProgramExerciseId(
            exerciseId,
          );

        const cleanedMetrics = res.data.map(
          ({ metricTypeId, value }) => ({
            metricTypeId,
            value,
          }),
        );

        const payload = {
          date,
          profileId,
          exerciseId,
          metrics: cleanedMetrics,
        };

        activityService.createActivity(payload);
      });
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  // Empty state: no program selected
  if (!program) {
    return (
      <div className="w-full lg:w-[80%] mx-auto">
        <div
          className="relative p-6 rounded-3xl
                      bg-white/70 backdrop-blur-xl border border-white/50
                      shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                      flex items-center justify-center"
        >
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 truncate">
          {program.title}
        </h2>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur border border-white/60 hover:bg-white transition">
            <Plus size={20} />
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 active:scale-95 transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Progress */}
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

      {/* Empty state: no exercises */}
      {exercises.length === 0 ? (
        <div
          className="relative p-6 rounded-3xl
                      bg-white/70 backdrop-blur-xl border border-white/50
                      shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                      flex items-center justify-center"
        >
          <div className="text-center text-gray-400 max-w-sm space-y-2">
            <p className="text-base font-semibold text-gray-500">
              No exercises yet
            </p>
            <p className="text-sm leading-relaxed">
              Add exercises to start your workout
            </p>
          </div>

          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
        </div>
      ) : (
        <div className="space-y-2">
          {exercises.map((exercise) => {
            const isCompleted = completed.some(
              (item) =>
                item.programExerciseId ===
                exercise.programExerciseId,
            );

            return (
              <div
                key={exercise.programExerciseId}
                onClick={() => toggleExercise(exercise)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer
                  transition-all duration-200 relative
                  ${
                    isCompleted
                      ? "bg-white/70 backdrop-blur border border-indigo-100 shadow-[0_4px_20px_rgba(99,102,241,0.08)]"
                      : "hover:bg-white/60"
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
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCompleted
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
      )}
    </div>
  );
};

export default TrainingContentList;