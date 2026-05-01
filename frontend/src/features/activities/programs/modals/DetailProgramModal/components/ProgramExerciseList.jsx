import ProgramExerciseCard from "./ProgramExerciseCard";

const ProgramExercisesList = ({
  exercises,
  loading,
  error,
  deletingExerciseId,
  onDeleteExercise,
}) => {
  return (
    <div className="space-y-2">
      <h5 className="text-md font-semibold">Exercises</h5>

      {loading && (
        <p className="text-sm text-gray-500">Loading exercises...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && exercises.length === 0 && (
        <p className="text-sm text-gray-500">
          No exercises added to this program.
        </p>
      )}

      {!loading &&
        !error &&
        exercises.map((exercise) => (
          <ProgramExerciseCard
            key={exercise.programExerciseId}
            exercise={exercise}
            isDeleting={deletingExerciseId === exercise.programExerciseId}
            onDelete={() => onDeleteExercise(exercise.programExerciseId)}
          />
        ))}
    </div>
  );
};

export default ProgramExercisesList;