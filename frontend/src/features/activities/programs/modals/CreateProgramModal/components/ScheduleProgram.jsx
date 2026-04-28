import React from "react";
import { gsap } from "gsap";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ScheduleProgram = ({
  selectedDays = [],
  onChange,
  title = "",
  onTitleChange,
}) => {
  const toggleDay = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    onChange?.(updated);
  };

  const handlePress = (el) => {
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 0.92,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* TITLE */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-600">
          Program title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="e.g. Push / Pull / Legs"
          className="w-full px-4 py-3 rounded-xl
            bg-white/70 backdrop-blur border border-gray-200
            text-gray-800 placeholder-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-indigo-400/40"
        />
      </div>

      {/* DAYS */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">
          Select training days
        </p>

        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);

            return (
              <button
                key={day}
                onClick={(e) => {
                  handlePress(e.currentTarget);
                  toggleDay(day);
                }}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-300 ease-out
                  border

                  ${
                    isSelected
                      ? `
                        bg-gradient-to-r from-indigo-500 to-purple-500
                        text-white
                        border-transparent
                        shadow-[0_4px_15px_rgba(99,102,241,0.25)]
                      `
                      : `
                        bg-white/60 backdrop-blur
                        border-white/50
                        text-gray-700
                        hover:bg-gradient-to-r 
                        hover:from-indigo-500/5 hover:to-purple-500/5
                        hover:border-indigo-200/60
                      `
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleProgram;
