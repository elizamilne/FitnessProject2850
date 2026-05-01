import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { exerciseService } from "../../../../../../services/exercise";
import ExerciseCard from "../../../../../../common/ui/ExerciseCard";
import { gsap } from "gsap";

const ExerciseSelect = ({
  selectedCategory,
  selectedExercises = [],
  onChange,
}) => {
  const [exercises, setExercises] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!selectedCategory) return;
      const res = await exerciseService.getAll(selectedCategory.id);
      setExercises(res.data);
    };

    fetchExercises();
  }, [selectedCategory]);

  // Same animation as categories
  useLayoutEffect(() => {
    if (!exercises.length) return;

    const ctx = gsap.context(() => {
      gsap.to(".exercise-item", {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.02,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [exercises]);

  const toggleExercise = (exercise) => {
    const exists = selectedExercises.some(
      (e) => e.exercise.id === exercise.exercise.id
    );

    let updated;
    if (exists) {
      updated = selectedExercises.filter(
        (e) => e.exercise.id !== exercise.exercise.id
      );
    } else {
      updated = [...selectedExercises, exercise];
    }

    onChange?.(updated);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      {exercises.map((e) => {
        const isSelected = selectedExercises.some(
          (sel) => sel.exercise.id === e.exercise.id
        );

        return (
          <div
            key={e.exercise.id}
            className="exercise-item"
            style={{
              opacity: 0,
              transform: "translateY(16px)",
            }}
          >
            <ExerciseCard
              exerciseData={e}
              isSelected={isSelected}
              clickable
              onClick={() => toggleExercise(e)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ExerciseSelect;