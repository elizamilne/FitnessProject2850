import { useEffect, useState } from "react";
import { programExerciseService } from "../../../../services/programExercise";

export const useExercises = (program) => {
  const [exercises, setExercises] = useState([]);

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

  return { exercises };
};