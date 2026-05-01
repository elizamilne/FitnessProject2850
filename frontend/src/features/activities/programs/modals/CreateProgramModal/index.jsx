import { useState } from "react";
import Modal from "../../../../../common/ui/Modal";
import ExerciseCategorySelect from "./components/ExerciseCategorySelect";
import ExerciseSelect from "./components/ExerciseSelect";
import ExerciseMetricsFields from "./components/ExerciseMetricsFields";
import ScheduleProgram from "./components/ScheduleProgram";
import { programService } from "../../../../../services/program";
import { programExerciseService } from "../../../../../services/programExercise";
import { programScheduleService } from "../../../../../services/programSchedule";

const steps = ["category", "exercise", "metrics", "schedule"];

const CreateProgramModal = ({ isOpen, onClose, onCreate }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseMetrics, setExerciseMetrics] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [title, setTitle] = useState("");

  const currentStep = steps[stepIndex];

  const resetForm = () => {
    setStepIndex(0);
    setSelectedCategory(null);
    setSelectedExercises([]);
    setExerciseMetrics({});
    setSelectedDays([]);
    setTitle("");
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const createProgram = async () => {
    const defaultBannerUrl = "/defaults/program-banner1.jpeg";

    const profile = JSON.parse(sessionStorage.getItem("profile"));
    const profileId = profile?.id;

    const programData = {
      title: title.trim(),
      bannerUrl: defaultBannerUrl,
      profileId,
    };

    const res = await programService.createProgram(programData);

    return res.data;
  };

  const createProgramExercisesAndMetrics = async (programId) => {
    const requests = selectedExercises.map((e) => {
      const exerciseId = e.exercise.id;

      const metrics = exerciseMetrics[exerciseId] || {};

      const metricsArray = Object.entries(metrics).map(
        ([metricTypeId, value]) => ({
          metricTypeId: Number(metricTypeId),
          value,
        })
      );

      return programExerciseService.addExerciseToProgram({
        programId,
        exerciseId,
        metrics: metricsArray,
      });
    });

    const responses = await Promise.all(requests);

    return responses.map((res) => res.data.id);
  };

  const createProgramSchedule = async (programId) => {
    const requests = selectedDays.map((day) => {
      return programScheduleService.addDay({
        programId,
        day,
      });
    });

    await Promise.all(requests);
  };

  const next = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      if (!title.trim()) return;

      const program = await createProgram();
      const programId = program.id;

      await createProgramExercisesAndMetrics(programId);
      await createProgramSchedule(programId);

      onCreate?.({
        ...program,
        weeklyFrequency: selectedDays,
        days: selectedDays,
      });

      resetForm();
      onClose?.();
    }
  };

  const prev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header={
        <h3 className="text-xl font-semibold text-gray-900">Create Program</h3>
      }
      body={
        <div className="space-y-6">
          {/* STEP PROGRESS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Step {stepIndex + 1} of {steps.length}
              </span>
              <span className="capitalize">{currentStep}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{
                  width: `${((stepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* STEP CONTENT */}
          <div className="pt-2">
            {currentStep === "category" && (
              <ExerciseCategorySelect
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                onNext={next}
              />
            )}

            {currentStep === "exercise" && (
              <ExerciseSelect
                selectedCategory={selectedCategory}
                selectedExercises={selectedExercises}
                onChange={setSelectedExercises}
              />
            )}

            {currentStep === "metrics" && (
              <ExerciseMetricsFields
                selectedExercises={selectedExercises}
                values={exerciseMetrics}
                onChange={setExerciseMetrics}
              />
            )}

            {currentStep === "schedule" && (
              <ScheduleProgram
                selectedDays={selectedDays}
                onChange={setSelectedDays}
                title={title}
                onTitleChange={setTitle}
              />
            )}
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-between pt-2">
            {/* PREVIOUS */}
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="
                px-4 py-2.5 rounded-xl text-sm font-medium
                bg-gray-200 text-gray-800
                hover:bg-gray-300 transition
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Previous
            </button>

            {/* NEXT */}
            <button
              onClick={next}
              disabled={
                (currentStep === "category" && !selectedCategory) ||
                (currentStep === "exercise" &&
                  selectedExercises.length === 0) ||
                (currentStep === "schedule" && !title.trim())
              }
              className="
                px-5 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                hover:opacity-90 active:scale-[0.98] transition
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              {stepIndex === steps.length - 1 ? "Create Program" : "Next"}
            </button>
          </div>
        </div>
      }
    />
  );
};

export default CreateProgramModal;