const DateTabs = ({ dates, currentDate, onDateChange, formatDate, containerRef }) => {
  return (
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
                    text-gray-500
                    hover:bg-gradient-to-br hover:from-indigo-500/18 hover:via-purple-500/9 hover:to-indigo-500/18
                  `
              }
            `}
          >
            {/* Text */}
            <span className="relative z-10 text-xs sm:text-sm">
              {date.toLocaleDateString("en-GB", { weekday: "short" })}
            </span>

            <span className="relative z-10 font-semibold text-sm sm:text-base">
              {date.getDate()}
            </span>

            {/* Gradient */}
            {isSelected && (
              <div
                className="
                  absolute inset-0 rounded-xl pointer-events-none z-0
                  bg-gradient-to-br from-indigo-500/32 via-indigo-400/24 to-indigo-500/32
                "
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DateTabs;