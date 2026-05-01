import { useLayoutEffect, useRef } from "react";
import ExerciseCard from "../../../../../../common/ui/ExerciseCard";
import { gsap } from "gsap";

const ExerciseSelect = ({
  exercises = [],
  selectedExercises = [],
  onChange,
}) => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!exercises.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".exercise-item",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.02,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [exercises]);

  const toggleExercise = (exercise) => {
    const exists = selectedExercises.some(
      (e) => e.exercise.id === exercise.exercise.id
    );

    const updated = exists
      ? selectedExercises.filter(
          (e) => e.exercise.id !== exercise.exercise.id
        )
      : [...selectedExercises, exercise];

    onChange?.(updated);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {exercises.length === 0 ? (
        <div className="text-center py-10 text-md text-gray-500">
          No exercises found
        </div>
      ) : (
        exercises.map((e) => {
          const isSelected = selectedExercises.some(
            (sel) => sel.exercise.id === e.exercise.id
          );

          return (
            <div key={e.exercise.id} className="exercise-item">
              <ExerciseCard
                exerciseData={e}
                isSelected={isSelected}
                clickable
                onClick={() => toggleExercise(e)}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default ExerciseSelect;