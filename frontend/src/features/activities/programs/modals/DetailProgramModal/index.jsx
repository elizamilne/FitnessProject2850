import { useEffect, useState } from "react";
import Modal from "../../../../../common/ui/Modal";
import { programExerciseService } from "../../../../../services/programExercise";
import { programService } from "../../../../../services/program";

import ProgramHero from "./components/ProgramHero";
import ProgramInfo from "./components/ProgramInfo";
import ProgramExercisesList from "./components/ProgramExerciseList";
import ProgramModalActions from "./components/ProgramModalActions";

const DetailProgramModal = ({ isOpen, onClose, program, onUpdate }) => {
  const [form, setForm] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [exerciseError, setExerciseError] = useState(null);
  const [deletingExerciseId, setDeletingExerciseId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (program) {
      setForm({
        id: program.id,
        title: program.title || "",
        bannerUrl: program.bannerUrl || "",
      });

      setIsEditing(false);
    } else {
      setForm(null);
      setExercises([]);
    }
  }, [program]);

  useEffect(() => {
    if (!isOpen || !program?.id) return;

    const fetchExercises = async () => {
      try {
        setLoadingExercises(true);
        setExerciseError(null);

        const response = await programExerciseService.getByProgram(program.id);
        setExercises(response.data);
      } catch (error) {
        console.error("Failed to fetch program exercises:", error);
        setExerciseError("Failed to load exercises");
      } finally {
        setLoadingExercises(false);
      }
    };

    fetchExercises();
  }, [isOpen, program?.id]);

  if (!program || !form) return null;

  const isValid = form.title.trim();

  const resetForm = () => {
    setForm({
      id: program.id,
      title: program.title || "",
      bannerUrl: program.bannerUrl || "",
    });

    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (!isValid) return;

    try {
      setUpdateLoading(true);

      const response = await programService.updateProgram(program.id, {
        ...program,
        title: form.title,
        bannerUrl: form.bannerUrl,
      });

      onUpdate?.(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Program update failed:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!program?.id) return;

    try {
      setArchiveLoading(true);

      const response = await programService.toggleArchive(program.id);
      onUpdate?.(response.data);
    } catch (error) {
      console.error("Archive update failed:", error);
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!program?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this program? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      await programService.deleteProgram(program.id);

      onUpdate?.({ ...program, deleted: true });
      onClose();
    } catch (error) {
      console.error("Program delete failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteExercise = async (programExerciseId) => {
    try {
      setDeletingExerciseId(programExerciseId);

      await programExerciseService.deleteProgramExercise(programExerciseId);

      setExercises((prevExercises) =>
        prevExercises.filter(
          (exercise) => exercise.programExerciseId !== programExerciseId
        )
      );
    } catch (error) {
      console.error("Failed to delete program exercise:", error);
      setExerciseError("Failed to delete exercise");
    } finally {
      setDeletingExerciseId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={
        <h3 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Program" : "Program Details"}
        </h3>
      }
      body={
        <div className="space-y-6">
          <ProgramHero
            title={form.title}
            bannerUrl={form.bannerUrl}
            archived={program.archived}
          />

          <ProgramInfo
            form={form}
            setForm={setForm}
            program={program}
            isEditing={isEditing}
          />

          {!isEditing && (
            <ProgramExercisesList
              exercises={exercises}
              loading={loadingExercises}
              error={exerciseError}
              deletingExerciseId={deletingExerciseId}
              onDeleteExercise={handleDeleteExercise}
            />
          )}

          <ProgramModalActions
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isValid={isValid}
            updateLoading={updateLoading}
            archiveLoading={archiveLoading}
            archived={program.archived}
            onUpdate={handleUpdate}
            onCancel={resetForm}
            onArchive={handleArchive}
          />

          {!isEditing && (
            <div className="flex justify-center border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={handleDeleteProgram}
                disabled={deleteLoading}
                className="
                  text-xs font-medium text-gray-400
                  hover:text-red-500
                  transition
                  disabled:opacity-40 disabled:cursor-not-allowed
                "
                >
                {deleteLoading ? "Deleting..." : "Delete program"}
              </button>
            </div>
          )}
        </div>
      }
    />
  );
};

export default DetailProgramModal;