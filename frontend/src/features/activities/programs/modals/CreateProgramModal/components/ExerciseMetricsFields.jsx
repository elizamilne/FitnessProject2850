import { useEffect, useLayoutEffect, useState, useRef } from "react";
import ExerciseCard from "../../../../../../common/ui/ExerciseCard";
import { exerciseService } from "../../../../../../services/exercise";
import { gsap } from "gsap";

const ExerciseMetricsFields = ({
  selectedExercises = [],
  values = {},
  onChange,
}) => {
  const [metricsMap, setMetricsMap] = useState({});
  const containerRef = useRef(null);

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

  // SAME animation (no lag)
  useLayoutEffect(() => {
    if (!selectedExercises.length) return;

    const ctx = gsap.context(() => {
      gsap.to(".metric-item", {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.02,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedExercises]);

  return (
    <div ref={containerRef} className="space-y-6">
      {selectedExercises.map((e) => {
        const id = e.exercise.id;
        const exerciseValues = values[id] || {};
        const exerciseMetrics = metricsMap[id] || [];

        return (
          <div
            key={id}
            className="metric-item space-y-3"
            style={{
              opacity: 0,
              transform: "translateY(16px)",
            }}
          >
            {/* Exercise */}
            <ExerciseCard exerciseData={e} />

            {/* Metrics */}
            <div className="pl-6 flex flex-wrap gap-4">
              {exerciseMetrics.length === 0 && (
                <p className="text-sm text-gray-400">
                  No metrics available
                </p>
              )}

              {exerciseMetrics.map((m) => (
                <div key={m.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500">
                    {m.name}
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={exerciseValues[m.id] || ""}
                    onChange={(ev) => {
                      const raw = Number(ev.target.value);
                      const safeValue = Math.max(0, raw);
                      handleChange(id, m.id, safeValue);
                    }}
                    className="
                      w-24 px-3 py-2 rounded-lg
                      bg-white/70 backdrop-blur
                      border border-gray-200
                      text-sm text-gray-800
                      placeholder-gray-400

                      focus:outline-none
                      focus:ring-2 focus:ring-indigo-400/40
                      focus:border-indigo-300
                    "
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