import React, { useState, useRef, useEffect } from "react";
import { profileService } from "../../services/profile";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

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

  const contentRef = useRef(null);
  const progressRef = useRef(null);

  const videoA = useRef(null);
  const videoB = useRef(null);
  const [isAActive, setIsAActive] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const currentQuestion = quiz[currentIndex];
  const progress = ((currentIndex + 1) / quiz.length) * 100;

  // Animate progress on change
  useEffect(() => {
    gsap.to(progressRef.current, {
      width: `${progress}%`,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [progress]);

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

    // GSAP forward animation
    if (currentIndex + 1 < quiz.length) {
      gsap.to(contentRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {
          setCurrentIndex((prev) => prev + 1);

          gsap.fromTo(
            contentRef.current,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
              ease: "power3.out",
            },
          );
        },
      });
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

    gsap.to(contentRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        setCurrentIndex(prevIndex);

        const prevQuestion = quiz[prevIndex];
        setAnswer(answers[prevQuestion.key] || "");

        gsap.fromTo(
          contentRef.current,
          { y: -40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power3.out",
          },
        );
      },
    });
  };

  useEffect(() => {
    const active = isAActive ? videoA.current : videoB.current;
    const next = isAActive ? videoB.current : videoA.current;

    if (!active || !next) return;

    // load next video in hidden player
    next.src = currentQuestion.video;

    next.oncanplay = () => {
      next.play();

      // smooth crossfade
      gsap.to(next, { opacity: 1, duration: 0.6, ease: "power2.out" });
      gsap.to(active, { opacity: 0, duration: 0.6, ease: "power2.out" });

      setIsAActive((prev) => !prev);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion.video]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoA}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover opacity-100"
        src={quiz[0].video}
      />

      <video
        ref={videoB}
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover opacity-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-screen px-4 text-white">
        <form
          onSubmit={handleNext}
          className="
            relative w-full max-w-md text-center
            p-8 rounded-3xl
            bg-white/10 backdrop-blur-xl
            border border-white/10
            shadow-[0_10px_40px_rgba(0,0,0,0.4)]
          "
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

          <div ref={contentRef} className="relative z-10">
            {/* Progress */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>
                  Step {currentIndex + 1} of {quiz.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>

              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              {currentQuestion.question}
            </h2>

            {/* Choices */}
            {currentQuestion.type === "choice" && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = answer === option;

                  return (
                    <label
                      key={option}
                      className={`
                        px-4 py-3 rounded-xl cursor-pointer
                        border transition-all
                        ${
                          isSelected
                            ? "bg-white/20 border-indigo-400 shadow-[0_4px_20px_rgba(99,102,241,0.25)]"
                            : "bg-white/10 border-white/10 hover:bg-white/20"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        value={option}
                        checked={isSelected}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="hidden"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            )}

            {/* Input */}
            {currentQuestion.type === "input" && (
              <input
                type={currentQuestion.inputType || "text"}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="
                  w-full mt-2 p-3 rounded-xl
                  bg-white/10 border border-white/10
                  text-white placeholder-gray-400
                  outline-none
                  focus:border-indigo-400/50
                "
              />
            )}

            {/* Error */}
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentIndex === 0}
                className="
                  w-1/2 py-3 rounded-xl
                  bg-white/10 border border-white/10
                  hover:bg-white/20
                  disabled:opacity-40
                "
              >
                Back
              </button>

              <button
                type="submit"
                className="
                  w-1/2 py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  hover:opacity-90
                  shadow-[0_6px_25px_rgba(99,102,241,0.4)]
                "
              >
                {currentIndex + 1 < quiz.length ? "Next" : "Finish"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Questions;
