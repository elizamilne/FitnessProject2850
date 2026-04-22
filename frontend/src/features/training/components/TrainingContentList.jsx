import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { programExerciseService } from "../../../services/programExercise";
import { metricService } from "../../../services/metricType";

// const exercises = [
//   {
//     name: "Bench PressSSSSSSSSSSSSS",
//     reps: "3 sets • 10 reps",
//     image: "https://workoutapi.com/exercises/seated_chest_press.svg",
//   },
//   {
//     name: "Shoulder Pressssssss",
//     reps: "3h 20m durationsss • 5 sets",
//     image: "https://workoutapi.com/exercises/lunges.svg",
//   },
//   {
//     name: "Tricep Dips",
//     reps: "35 reps • 9090kg weight ",
//     image: "https://workoutapi.com/exercises/unilateral_bent_over_row.svg",
//   },
//   {
//     name: "Bent Over Row",
//     reps: "3 sets • 10 reps",
//     image: "https://workoutapi.com/exercises/deadlift.svg",
//   },
//   {
//     name: "Lat Pulldown",
//     reps: "3 sets • 12 reps",
//     image: "https://workoutapi.com/exercises/barbell_curl.svg",
//   },
// ];

const TrainingContentList = ({ program }) => {
  const progress = 66;
  const [completed, setCompleted] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [metricMap, setMetricMap] = useState({});

  // Load all possible metrics table
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

  // Load program's exercises
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const { data } = await programExerciseService.getByProgram(program.id);
        console.log("Exercises", data);
        setExercises(data);
      } catch (error) {
        console.error("Failed to load exercises:", error);
      }
    };

    if (program) {
      loadExercises();
    }
  }, [program]);

  // Exercise completed effect
  const toggleExercise = (name) => {
    setCompleted((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name],
    );
  };

  // Format exercise metrics
  const formatMetrics = (metrics) => {
    if (!metrics) return "";

    return metrics
      .slice(0, 2)
      .map((m) => {
        const metric = metricMap[m.metricTypeId]

        if (!metric) return m.value;
        return `${m.value}${metric.unit} ${metric.name.toLowerCase()}`;
      })
      .join(" • ");
  };

  if (!program) {
    return (
      <div className="w-[100%] lg:w-[80%] mx-auto p-6 text-center text-gray-400">
        No program selected
      </div>
    );
  }

  return (
    <div className="w-[100%] lg:w-[80%] mx-auto bg-gray-50 p-6 rounded-xl shadow">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold min-w-0 truncate">
          {program.title}
        </h2>

        <button className="w-9 h-9 shrink-0 flex items-center justify-center border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition">
          <Plus size={18} />
        </button>
      </div>

      {/* Tag + Progress Row */}
      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Tag */}
        <span className="px-3 py-1 bg-[#f9e59e] text-[#b78d02] rounded-full text-sm font-medium">
          In Progress
        </span>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="text-sm mb-1 text-gray-600">{progress}% / 100%</div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f1c21c]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {exercises.map((exercise) => {
          const isCompleted = completed.includes(exercise.exerciseName);

          return (
            <div
              key={exercise.exerciseName}
              onClick={() => toggleExercise(exercise.exerciseName)}
              className={`p-4 rounded-xl shadow transition flex items-center gap-3 cursor-pointer relative
                ${
                  isCompleted
                    ? "bg-green-100 border border-green-400"
                    : "bg-white hover:shadow-md"
                }`}
            >
              <img
                src={exercise.image}
                alt={exercise.exerciseName}
                className="w-12 h-12 object-cover rounded-lg"
              />

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">
                  {exercise.exerciseName}
                </h3>

                <p className="text-sm text-gray-500 truncate">
                  {formatMetrics(exercise.metrics)}
                </p>
              </div>

              {isCompleted && (
                <div className="absolute top-0 right-2 text-green-600 text-lg">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainingContentList;
