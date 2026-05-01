import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import AnimatedError from "../../../../../../common/ui/AnimatedError";

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
  const containerRef = useRef(null);
  const [titleTouched, setTitleTouched] = useState(false);

  const titleError =
    titleTouched && title.trim().length === 0
      ? "Program title is required"
      : "";

  const toggleDay = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    onChange?.(updated);
  };

  const handleTitleChange = (e) => {
    setTitleTouched(true);
    onTitleChange?.(e.target.value);
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
      }
    );
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".schedule-block", {
        opacity: 1,
        y: 0,
        duration: 0.25,
        stagger: 0.05,
        ease: "power2.out",
      });

      gsap.to(".day-btn", {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.03,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Title */}
      <div
        className="schedule-block space-y-1.5"
        style={{ opacity: 0, transform: "translateY(16px)" }}
      >
        <label className="text-sm font-medium text-gray-600">
          Program title
        </label>

        <input
          type="text"
          required
          value={title}
          onBlur={() => setTitleTouched(true)}
          onChange={handleTitleChange}
          placeholder="e.g. Push / Pull / Legs"
          aria-invalid={!!titleError}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-white/70 backdrop-blur border
            text-gray-800 placeholder-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-indigo-400/40
            ${
              titleError
                ? "border-red-300 focus:ring-red-400/30"
                : "border-gray-200"
            }
          `}
        />

        <AnimatedError message={titleError} />
      </div>

      {/* Days */}
      <div
        className="schedule-block space-y-2"
        style={{ opacity: 0, transform: "translateY(16px)" }}
      >
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
                  day-btn
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
                style={{
                  opacity: 0,
                  transform: "translateY(16px)",
                }}
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