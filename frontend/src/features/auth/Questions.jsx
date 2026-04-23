import React, { useState } from "react";
import { profileService } from "../../services/profile";
import { useNavigate } from "react-router-dom";

const quiz = [
  {
    key: "goal",
    type: "choice",
    question: "What is your fitness goal?",
    options: ["Lose Weight", "Build Muscle", "Stay Fit", "Improve Flexibility"],
    video: "/q1.mp4",
  },
  {
    key: "gender",
    type: "choice",
    question: "What is your gender?",
    options: ["Female", "Male", "Other"],
    video: "/q2.mp4",
  },
  {
    key: "age",
    type: "input",
    inputType: "number",
    question: "What is your age?",
    placeholder: "Enter your age",
    video: "/q3.mp4",
  },
  {
    key: "weight",
    type: "input",
    inputType: "number",
    question: "What is your weight (kg)?",
    placeholder: "Enter your weight",
    video: "/q4.mp4",
  },
  {
    key: "height",
    type: "input",
    inputType: "number",
    question: "What is your height (cm)?",
    placeholder: "Enter your height",
    video: "/q5.mp4",
  },
  {
    key: "workoutFrequency",
    type: "choice",
    question: "How many workouts can you do a week?",
    options: ["1", "2", "3", "4", "5", "6", "7"],
    video: "/q6.mp4",
  },
];

const Questions = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const currentQuestion = quiz[currentIndex];
  
  const getUserId = () => {
    const id = sessionStorage.getItem("userId");
    if (!id) throw new Error("No userId found");
    return Number(id);
  };

  const calculateLevel = (freq) => {
    if (freq <= 2) return "Beginner";
    if (freq <= 4) return "Intermediate";
    return "Advanced";
  };

  const buildPayload = (answers) => {
    const userId = getUserId();

    return {
      userId,
      ...answers,
      level: calculateLevel(answers.workoutFrequency),
    };
  };

  const saveProfile = (profile) => {
    sessionStorage.removeItem("userId");
    sessionStorage.setItem("profile", JSON.stringify(profile));
  };

  const handleNext = async (e) => {
    e.preventDefault();

    // Validation
    if (!answer) {
      setError("Please provide an answer");
      return;
    }

    if (
      currentQuestion.type === "input" &&
      currentQuestion.inputType === "number" &&
      isNaN(answer)
    ) {
      setError("Please enter a valid number");
      return;
    }

    setError("");

    const updatedAnswers = {
      ...answers,
      [currentQuestion.key]:
        currentQuestion.type === "input"
          ? Number(answer)
          : currentQuestion.key === "workoutFrequency"
            ? Number(answer)
            : answer,
    };

    setAnswers(updatedAnswers);
    setAnswer("");

    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    try {
      const payload = buildPayload(updatedAnswers);

      const res = await profileService.createProfile(payload);
      const profile = res?.data || res;

      saveProfile(profile);

      navigate("/training-page");
    } catch (err) {
      console.error("Profile creation failed:", err);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) return;

    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);

    const prevQuestion = quiz[prevIndex];
    setAnswer(answers[prevQuestion.key] || "");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={currentQuestion.video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex items-center justify-center h-screen text-white px-4">
        <form
          onSubmit={handleNext}
          className="bg-black/50 p-8 rounded-xl w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-6">
            {currentQuestion.question}
          </h2>

          {/* Choice */}
          {currentQuestion.type === "choice" && (
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option) => (
                <label
                  key={option}
                  className={`p-3 rounded border cursor-pointer ${
                    answer === option ? "bg-blue-600" : "bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={answer === option}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="hidden"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {/* Input */}
          {currentQuestion.type === "input" && (
            <input
              type={currentQuestion.inputType || "text"}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full p-3 mb-4 rounded bg-white/20 text-white placeholder-white focus:outline-none"
            />
          )}

          {/* Error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="w-1/2 py-3 bg-gray-600 rounded font-bold hover:bg-gray-700 disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="submit"
              className="w-1/2 py-3 bg-blue-600 rounded font-bold hover:bg-blue-700"
            >
              {currentIndex + 1 < quiz.length ? "Next" : "Finish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;
