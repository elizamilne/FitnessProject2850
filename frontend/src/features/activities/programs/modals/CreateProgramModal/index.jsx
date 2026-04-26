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

  const createProgram = async () => {
    const defaultBannerUrl =
      "https://images.pexels.com/photos/5038854/pexels-photo-5038854.jpeg";

    const profile = JSON.parse(sessionStorage.getItem("profile"));
    const profileId = profile?.id;

    const programData = {
      title,
      bannerUrl: defaultBannerUrl,
      profileId,
    };

    const res = await programService.createProgram(programData);

    return res.data.id;
  };

  const createProgramExercisesAndMetrics = async (programId) => {
    const requests = selectedExercises.map((e) => {
      const exerciseId = e.exercise.id;

      const metrics = exerciseMetrics[exerciseId] || {};

      const metricsArray = Object.entries(metrics).map(
        ([metricTypeId, value]) => ({
          metricTypeId: Number(metricTypeId),
          value,
        }),
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
      // Create Program
      const programId = await createProgram();

      // Create Exercises with Metrics
      createProgramExercisesAndMetrics(programId);

      // Create Schedule for the Program
      createProgramSchedule(programId)

      onCreate?.("hi");
      onClose();
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
      onClose={onClose}
      header={<h3 className="text-lg font-semibold">Create Program</h3>}
      body={
        <div className="space-y-4">
          {/* Step indicator */}
          <p className="text-sm text-gray-500">
            Step {stepIndex + 1} of {steps.length}
          </p>

          {/* Step content */}
          <div>
            {currentStep === "category" && (
              <ExerciseCategorySelect
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                onNext={next} // auto next
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

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={next}
              disabled={
                (currentStep === "category" && !selectedCategory) ||
                (currentStep === "exercise" && selectedExercises.length === 0)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {stepIndex === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      }
    />
  );
};

export default CreateProgramModal;
