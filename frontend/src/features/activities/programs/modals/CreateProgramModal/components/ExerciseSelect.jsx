import { useEffect, useState } from "react";
import { exerciseService } from "../../../../../../services/exercise";
import ExerciseCard  from "../../../../../../common/ui/ExerciseCard"

const ExerciseSelect = ({
  selectedCategory,
  selectedExercises = [],
  onChange,
}) => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!selectedCategory) return;
      const res = await exerciseService.getAll(selectedCategory.id);
      setExercises(res.data);
    };

    fetchExercises();
  }, [selectedCategory]);

  const toggleExercise = (exercise) => {
    const exists = selectedExercises.some(
      (e) => e.exercise.id === exercise.exercise.id,
    );

    let updated;
    if (exists) {
      updated = selectedExercises.filter(
        (e) => e.exercise.id !== exercise.exercise.id,
      );
    } else {
      updated = [...selectedExercises, exercise];
    }

    onChange?.(updated);
  };

  return (
    <div className="space-y-2">
      {exercises.map((e) => {
        const isSelected = selectedExercises.some(
          (sel) => sel.exercise.id === e.exercise.id,
        );

        return (
          <ExerciseCard
            key={e.exercise.id}
            exerciseData={e}
            isSelected={isSelected}
            clickable
            onClick={() => toggleExercise(e)}
          />
        );
      })}
    </div>
  );
};

export default ExerciseSelect;
