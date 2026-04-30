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
                    text-gray-500 hover:text-gray-700 hover:bg-white/60
                  `
              }
            `}
          >
            <span className="text-xs sm:text-sm">
              {date.toLocaleDateString("en-GB", { weekday: "short" })}
            </span>

            <span className="font-semibold text-sm sm:text-base">
              {date.getDate()}
            </span>

            {isSelected && (
              <div className="absolute inset-0 rounded-xl pointer-events-none 
                              bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DateTabs;