import React, { useState } from "react";

const Questions = () => {
  const quiz = [
    { type: "choice", question: "What is your fitness goal?", options: ["Lose Weight", "Build Muscle", "Stay Fit", "Improve Flexibility"], video: "/q1.mp4" },
    { type: "choice", question: "What is your gender?", options: ["Female", "Male", "Other"], video: "/q2.mp4" },
    { type: "input", question: "What is your age?", placeholder: "Enter your age", inputType: "number", video: "/q3.mp4" },
    { type: "input", question: "What is your weight (kg)?", placeholder: "Enter your weight", inputType: "number", video: "/q4.mp4" },
    { type: "input", question: "What is your height (cm)?", placeholder: "Enter your height", inputType: "number", video: "/q5.mp4" },
    { type: "choice", question: "How many workouts can you do a week?", options: ["1", "2", "3", "4", "5", "6", "7"], video: "/q6.mp4" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [answers, setAnswers] = useState([]);

  const currentQuestion = quiz[currentIndex];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (currentQuestion.type === "choice" && !selected) return alert("Please select an option!");
    if (currentQuestion.type === "input" && !inputValue) return alert("Please enter a value!");

    const answer = currentQuestion.type === "choice" ? selected : inputValue;
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    setSelected("");
    setInputValue("");

 
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("All answers:", newAnswers);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
        key={currentIndex}
      >
        <source src={currentQuestion.video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex items-center justify-center h-screen text-white px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-black/50 p-8 rounded-xl w-full max-w-md text-center"
        >
          <h2 className="text-2xl font-bold mb-6">{currentQuestion.question}</h2>

          {currentQuestion.type === "choice" && (
            <div className="flex flex-col gap-4">
              {currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`p-3 rounded border cursor-pointer ${
                    selected === option ? "bg-blue-600" : "bg-white/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selected === option}
                    onChange={(e) => setSelected(e.target.value)}
                    className="hidden"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === "input" && (
            <input
              type={currentQuestion.inputType || "text"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full p-3 mb-4 rounded bg-white/20 text-white placeholder-white focus:outline-none"
              required
            />
          )}

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 rounded font-bold hover:bg-blue-700 transition"
          >
            {currentIndex + 1 < quiz.length ? "Next" : "Finish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Questions;