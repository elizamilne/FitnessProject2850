import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import DateTabs from "./components/DateTabs";

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
        {/* Left */}
        <button
          onClick={() => shiftDays(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full
                   bg-white/70 backdrop-blur border border-white/50
                   text-gray-700 hover:bg-white active:scale-95 transition"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dates container */}
        <DateTabs
          dates={dates}
          currentDate={currentDate}
          onDateChange={onDateChange}
          formatDate={formatDate}
          containerRef={containerRef}
        />

        {/* Right */}
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
