import { useEffect, useState } from "react";
import ExerciseCard from "../../../../../../common/ui/ExerciseCard";
import { exerciseService } from "../../../../../../services/exercise";

const ExerciseMetricsFields = ({
  selectedExercises = [],
  values = {},
  onChange,
}) => {
  const [metricsMap, setMetricsMap] = useState({});

  const handleChange = (exerciseId, metricId, value) => {
    const updated = {
      ...values,
      [exerciseId]: {
        ...values[exerciseId],
        [metricId]: value,
      },
    };

    onChange?.(updated);
  };

  useEffect(() => {
    if (!selectedExercises.length) return;

    const fetchMetrics = async () => {
      const results = await Promise.allSettled(
        selectedExercises.map((e) =>
          exerciseService.getMetrics(e.exercise.id)
        )
      );

      const map = {};

      results.forEach((res, index) => {
        const id = selectedExercises[index].exercise.id;

        if (res.status === "fulfilled") {
          map[id] = res.value.data.metrics || [];
        } else {
          map[id] = [];
        }
      });

      setMetricsMap(map);
    };

    fetchMetrics();
  }, [selectedExercises]);

  return (
    <div className="space-y-4">
      {selectedExercises.map((e) => {
        const id = e.exercise.id;
        const exerciseValues = values[id] || {};
        const exerciseMetrics = metricsMap[id] || [];

        return (
          <div key={id} className="space-y-2">
            <ExerciseCard exerciseData={e} />

            <div className="pl-4 flex gap-3 flex-wrap">
              {exerciseMetrics.length === 0 && (
                <p className="text-xs text-gray-400">
                  No metrics available
                </p>
              )}

              {exerciseMetrics.map((m) => (
                <div key={m.id} className="flex flex-col">
                  <label className="text-xs text-gray-500">
                    {m.name}
                  </label>

                  <input
                    type="number"
                    value={exerciseValues[m.id] || ""}
                    onChange={(ev) =>
                      handleChange(
                        id,
                        m.id,
                        Number(ev.target.value)
                      )
                    }
                    className="border rounded px-2 py-1 w-24"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExerciseMetricsFields;