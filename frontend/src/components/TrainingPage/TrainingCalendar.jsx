import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

const getDaysFromWidth = () => {
  const width = window.innerWidth;

  if (width < 640) return 3;
  if (width < 1024) return 5;
  return 7;
};

const TrainingCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysToShow, setDaysToShow] = useState(getDaysFromWidth);
  const containerRef = useRef(null);

  // Responsive logic
  useEffect(() => {
    const updateDays = () => {
      const newDays = getDaysFromWidth();

      setDaysToShow((prev) => (prev !== newDays ? newDays : prev));
    };

    window.addEventListener("resize", updateDays);
    return () => window.removeEventListener("resize", updateDays);
  }, []);

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

  return (
    <div className="w-full">
      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">Calendar</h1>

      {/* Row */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Left Arrow */}
        <button
          onClick={() => shiftDays(-1)}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        {/* Dates */}
        <div
          ref={containerRef}
          className="flex flex-1 gap-2 sm:gap-3 flex-nowrap overflow-hidden"
        >
          {dates.map((date, index) => {
            const isSelected =
              date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 min-w-0 aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition text-sm sm:text-base
                  ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-white shadow-sm hover:shadow-md hover:bg-gray-50 hover:scale-105"
                  }`}
              >
                <span>
                  {date.toLocaleDateString("en-GB", {
                    weekday: "short",
                  })}
                </span>
                <span className="font-semibold">{date.getDate()}</span>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => shiftDays(1)}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="mt-4 text-center text-gray-600 font-medium">
        {startDate.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
};

export default TrainingCalendar;
