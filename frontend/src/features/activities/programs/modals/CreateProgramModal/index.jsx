import { useEffect, useState } from "react";
import Modal from "../../../../../common/ui/Modal";
import ExerciseCategorySelect from "./components/ExerciseCategorySelect";
import ExerciseSelect from "./components/ExerciseSelect";
import ExerciseMetricsFields from "./components/ExerciseMetricsFields";
import ScheduleProgram from "./components/ScheduleProgram";
import { programService } from "../../../../../services/program";
import { programExerciseService } from "../../../../../services/programExercise";
import { programScheduleService } from "../../../../../services/programSchedule";
import { categoryService } from "../../../../../services/category";
import { exerciseService } from "../../../../../services/exercise";

const steps = ["category", "exercise", "metrics", "schedule"];

const defaultProgramBanners = [
  "/defaults/program-banner1.jpeg",
  "/defaults/program-banner2.jpg",
  "/defaults/program-banner3.jpg",
  "/defaults/program-banner4.jpg",
];


const CreateProgramModal = ({ isOpen, onClose, onCreate }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const [exercisesByCategory, setExercisesByCategory] = useState({});
  const [currentCategoryExercises, setCurrentCategoryExercises] = useState([]);

  const [exerciseMetrics, setExerciseMetrics] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [title, setTitle] = useState("");

  const [loadingExercises, setLoadingExercises] = useState(false);

  const currentStep = steps[stepIndex];

  const getRandomDefaultBanner = () => {
    const randomIndex = Math.floor(Math.random() * defaultProgramBanners.length);
    return defaultProgramBanners[randomIndex];
  };

  const loadCategories = async () => {
    if (categories.length > 0) return;

    try {
      setLoadingCategories(true);

      const response = await categoryService.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const resetForm = () => {
    setStepIndex(0);
    setSelectedCategory(null);
    setSelectedExercises([]);
    setCurrentCategoryExercises([]);
    setExerciseMetrics({});
    setSelectedDays([]);
    setTitle("");
    setLoadingExercises(false);

    // Keep categories and exercisesByCategory cached.
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleCategorySelect = async (category) => {
    if (!category?.id || loadingExercises) return;

    setSelectedCategory(category);
    setCurrentCategoryExercises([]);
    setLoadingExercises(true);

    try {
      const cachedExercises = exercisesByCategory[category.id];

      if (cachedExercises) {
        setCurrentCategoryExercises(cachedExercises);
        setStepIndex(1);
        return;
      }

      const response = await exerciseService.getAll(category.id);
      const exercises = response.data || [];

      setExercisesByCategory((prev) => ({
        ...prev,
        [category.id]: exercises,
      }));

      setCurrentCategoryExercises(exercises);
      setStepIndex(1);
    } catch (error) {
      console.error("Failed to fetch exercises:", error);

      setCurrentCategoryExercises([]);
      setStepIndex(1);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleSelectedExercisesChange = (updatedExercises) => {
    setSelectedExercises(updatedExercises);

    const updatedExerciseIds = new Set(
      updatedExercises.map((item) => item.exercise.id)
    );

    setExerciseMetrics((prev) => {
      const nextMetrics = {};

      Object.entries(prev).forEach(([exerciseId, metrics]) => {
        if (updatedExerciseIds.has(Number(exerciseId))) {
          nextMetrics[exerciseId] = metrics;
        }
      });

      return nextMetrics;
    });
  };

  const createProgram = async () => {
    const defaultBannerUrl = getRandomDefaultBanner();

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
      return;
    }

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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Step {stepIndex + 1} of {steps.length}
              </span>
              <span className="capitalize">{currentStep}</span>
            </div>

            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{
                  width: `${((stepIndex + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            {currentStep === "category" && (
              <ExerciseCategorySelect
                categories={categories}
                loading={loadingCategories}
                onSelect={handleCategorySelect}
                loadingNext={loadingExercises}
              />
            )}

            {currentStep === "exercise" && (
              <ExerciseSelect
                selectedCategory={selectedCategory}
                exercises={currentCategoryExercises}
                selectedExercises={selectedExercises}
                onChange={handleSelectedExercisesChange}
                onChooseAnotherCategory={() => setStepIndex(0)}
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

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={prev}
              disabled={stepIndex === 0 || loadingExercises}
              className="
                px-4 py-2.5 rounded-xl text-sm font-medium
                bg-gray-200 text-gray-800
                hover:bg-gray-300 transition
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Previous
            </button>

            <button
              onClick={next}
              disabled={
                loadingExercises ||
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