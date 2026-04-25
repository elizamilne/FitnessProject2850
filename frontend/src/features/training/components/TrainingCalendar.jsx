import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

const getDaysFromWidth = () => {
  const width = window.innerWidth;

  if (width < 640) return 3;
  if (width < 1024) return 5;
  return 7;
};

const TrainingCalendar = ({ selectedDate, onDateChange }) => {
  const [startDate, setStartDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysToShow, setDaysToShow] = useState(getDaysFromWidth);
  const containerRef = useRef(null);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-CA");
  };

  // Responsive logic
  useEffect(() => {
    const updateDays = () => {
      const newDays = getDaysFromWidth();

      setDaysToShow((prev) => (prev !== newDays ? newDays : prev));
    };

    window.addEventListener("resize", updateDays);
    return () => window.removeEventListener("resize", updateDays);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      const today = formatDate(new Date());
      onDateChange?.(today);
    }
  });

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < daysToShow; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const shiftDays = (direction) => {
    // animate OUT
    gsap.to(containerRef.current, {
      x: direction === 1 ? -50 : 50,
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        // your original logic (unchanged)
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + direction * daysToShow);
        setStartDate(newDate);

        // animate IN
        gsap.fromTo(
          containerRef.current,
          { x: direction === 1 ? 50 : -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
          },
        );
      },
    });
  };

  const dates = generateDates();

  const currentDate = selectedDate ? new Date(selectedDate) : new Date();

  return (
    <div className="w-full space-y-4">
      
      {/* Row */}
      <div className="flex items-center gap-4">
        {/* LEFT */}
        <button
          onClick={() => shiftDays(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full
                   bg-white/70 backdrop-blur border border-white/50
                   text-gray-700 hover:bg-white active:scale-95 transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* DATES CONTAINER */}
        <div
          ref={containerRef}
          className="flex flex-1 gap-2 sm:gap-3 overflow-hidden p-1 rounded-2xl
                   bg-white/60 backdrop-blur-xl border border-white/50
                   shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
        >
          {dates.map((date, index) => {
            const isSelected =
              date.toDateString() === currentDate.toDateString();

            return (
              <div
                key={index}
                onClick={() => onDateChange?.(formatDate(date))}
                className={`
                flex-1 min-w-0 aspect-square flex flex-col items-center justify-center
                rounded-xl cursor-pointer transition-all duration-200 relative

                ${
                  isSelected
                    ? `
                      bg-white text-gray-900 shadow-sm
                      ring-1 ring-indigo-100
                    `
                    : `
                      text-gray-500 hover:text-gray-700 hover:bg-white/60
                    `
                }
              `}
              >
                <span className="text-xs sm:text-sm">
                  {date.toLocaleDateString("en-GB", {
                    weekday: "short",
                  })}
                </span>

                <span className="font-semibold text-sm sm:text-base">
                  {date.getDate()}
                </span>

                {/* subtle AI glow */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none 
                                bg-gradient-to-r from-indigo-500/5 to-purple-500/5"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT */}
        <button
          onClick={() => shiftDays(1)}
          className="w-10 h-10 flex items-center justify-center rounded-full
                   bg-white/70 backdrop-blur border border-white/50
                   text-gray-700 hover:bg-white active:scale-95 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Month label */}
      <div className="text-center text-sm text-gray-500 font-medium tracking-wide">
        {startDate.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

export default TrainingCalendar;
