import { useEffect, useState } from "react";
import { activityService } from "../../../../services/activity";

export const useCompletedExercises = (program, date) => {
  const [completed, setCompleted] = useState([]);
  const [initialCompleted, setInitialCompleted] = useState([]);

  useEffect(() => {
    const loadCompleted = async () => {
      const profile = JSON.parse(sessionStorage.getItem("profile"));
      const profileId = profile?.id;

      if (!profileId || !date) return;

      try {
        const res = await activityService.getCompleted(profileId, date);

        const data = res.data || [];

        setCompleted(data);
        setInitialCompleted(data);
      } catch (err) {
        console.error("Failed to load completed exercises", err);
      }
    };

    if (program && date) {
      loadCompleted();
    }
  }, [program, date]);

  const toggleExercise = (exercise) => {
    const id = exercise.programExerciseId;

    setCompleted((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id) // deselect
        : [...prev, id] // select
    );
  };

  return {
    completed,
    initialCompleted, 
    setCompleted,
    toggleExercise,
  };
};