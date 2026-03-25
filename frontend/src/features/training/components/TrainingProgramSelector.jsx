import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

const programsData = [
  "Program 1",
  "Program 2",
  "Program 3",
  "Program 4",
  "Program 5",
  "Program 6",
  "Program 7",
  "Program 8",
];

// same pattern as calendar
const getItemsFromWidth = () => {
  const width = window.innerWidth;

  if (width < 640) return 1; // mobile
  if (width < 1024) return 3; // tablet
  return 4; // desktop
};

const WorkoutSelector = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(getItemsFromWidth);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const containerRef = useRef(null);
  const isAnimating = useRef(false);

  // identical resize logic to the calendar
  useEffect(() => {
    const updateItems = () => {
      const newValue = getItemsFromWidth();
      setItemsToShow((prev) => (prev !== newValue ? newValue : prev));
    };

    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const maxIndex = programsData.length - itemsToShow;

  const isStart = startIndex === 0;
  const isEnd = startIndex >= maxIndex;

  const visiblePrograms = programsData.slice(
    startIndex,
    startIndex + itemsToShow,
  );

  const shiftPrograms = (direction) => {
    if ((direction === -1 && isStart) || (direction === 1 && isEnd)) {
      return;
    }

    isAnimating.current = true;

    gsap.to(containerRef.current, {
      x: direction === 1 ? -50 : 50,
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        let newIndex = startIndex + direction * itemsToShow;
        newIndex = Math.max(0, Math.min(newIndex, maxIndex));
        setStartIndex(newIndex);

        gsap.fromTo(
          containerRef.current,
          { x: direction === 1 ? 50 : -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            onComplete: () => {
              isAnimating.current = false;
            },
          },
        );
      },
    });
  };

  return (
    <div className="w-[80%] mx-auto mb-5">
      {/* Title */}
      <h3 className="text-xl font-semibold mb-3">Workouts</h3>

      {/* Row */}
      <div className="flex items-center gap-3">
        {/* Left */}
        <button
          onClick={() => shiftPrograms(-1)}
          disabled={isStart}
          className={`p-2 rounded-full shadow transition
            ${
              isStart
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }
          `}
        >
          <ChevronLeft />
        </button>

        {/* Programs */}
        <div ref={containerRef} className="flex flex-1 gap-3 overflow-hidden">
          {visiblePrograms.map((program) => {
            const isSelected = selectedProgram === program;

            return (
              <div
                key={program}
                onClick={() => {
                    if (isAnimating.current) return;
                    setSelectedProgram(program);
                    }}
                className={`flex-1 min-w-0 rounded-xl p-4 cursor-pointer text-center transition-all duration-200 border
                    ${
                      isSelected
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                        : "bg-white border-gray-200 hover:shadow-md hover:-translate-y-1"
                    }
                `}
              >
                {program}
              </div>
            );
          })}
        </div>

        {/* Right */}
        <button
          onClick={() => shiftPrograms(1)}
          disabled={isEnd}
          className={`p-2 rounded-full shadow transition
            ${
              isEnd
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }
          `}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default WorkoutSelector;
