import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

// const programsData = [
//   "Program 1",
//   "Program 2",
//   "Program 3",
//   "Program 4",
//   "Program 5",
//   "Program 6",
//   "Program 7",
//   "Program 8",
// ];

// same pattern as calendar
const getItemsFromWidth = () => {
  const width = window.innerWidth;

  if (width < 640) return 1; // mobile
  if (width < 1024) return 3; // tablet
  return 4; // desktop
};

const TrainingProgramSelector = ({
  programs,
  selectedProgram,
  onProgramChange,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(getItemsFromWidth);
  const containerRef = useRef(null);
  const isAnimating = useRef(false);

  // Update items count based on screen size
  useEffect(() => {
    const updateItems = () => {
      const newValue = getItemsFromWidth();
      setItemsToShow((prev) => (prev !== newValue ? newValue : prev));
    };

    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  // Select a default program on page load
  useEffect(() => {
    if (!selectedProgram && programs.length > 0) {
      onProgramChange?.(programs[0]);
    }
  }, [programs, selectedProgram, onProgramChange]);

  // Handles carousel navigation with animation
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

  const maxIndex = programs.length - itemsToShow;

  const isStart = startIndex === 0;
  const isEnd = startIndex >= maxIndex;

  const visiblePrograms = programs.slice(startIndex, startIndex + itemsToShow);

  return (
    <div className="w-[60%] mx-auto mb-6 space-y-3">
      {/* status */}
      <div className="text-sm text-gray-600 font-medium">
        {programs?.length ? `${programs.length} programs` : "No programs"}
      </div>

      {/* row */}
      <div className="flex items-center gap-3">
        {/* Left */}
        <button
          onClick={() => shiftPrograms(-1)}
          disabled={isStart}
          className={`
            w-11 h-11 flex items-center justify-center rounded-full
            transition-all duration-200

            ${
              isStart
                ? `
                  bg-gray-100 text-gray-300 cursor-not-allowed
                `
                : `
                  bg-white/80 backdrop-blur-md
                  text-gray-700

                  border border-white/60
                  shadow-[0_4px_12px_rgba(0,0,0,0.05)]

                  hover:bg-white
                  hover:shadow-[0_6px_18px_rgba(99,102,241,0.12)]
                  hover:text-gray-900

                  active:scale-95
                `
            }
          `}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Programs */}
        <div ref={containerRef} className="flex flex-1 gap-2 overflow-hidden">
          {visiblePrograms.map((program) => {
            const isSelected = selectedProgram === program;

            return (
              <div
                key={program.id}
                onClick={() => {
                  if (isAnimating.current) return;
                  onProgramChange?.(program);
                }}
                className={`
                  flex-1 min-w-0 px-5 py-3 text-center cursor-pointer
                  rounded-xl transition-all duration-200

                  ${
                    isSelected
                      ? `
                        bg-indigo-100 text-indigo-600
                      `
                      : `
                        bg-white text-gray-500
                        hover:bg-gray-100 hover:text-gray-600
                      `
                  }
                `}
              >
                <span className="block truncate text-base font-semibold">
                  {program.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right */}
        <button
          onClick={() => shiftPrograms(1)}
          disabled={isEnd}
          className={`
            w-11 h-11 flex items-center justify-center rounded-full
            transition-all duration-200

            ${
              isEnd
                ? `
                  bg-gray-100 text-gray-300 cursor-not-allowed
                `
                : `
                  bg-white/80 backdrop-blur-md
                  text-gray-700

                  border border-white/60
                  shadow-[0_4px_12px_rgba(0,0,0,0.05)]

                  hover:bg-white
                  hover:shadow-[0_6px_18px_rgba(99,102,241,0.12)]
                  hover:text-gray-900

                  active:scale-95
                `
            }
          `}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TrainingProgramSelector;
