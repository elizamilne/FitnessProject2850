const ActivitiesControlHeader = ({
  title,
  options,
  value,
  onChange,
}) => {
  const activeIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div className="flex items-center justify-between">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>

      {/* Control */}
      <div
        className="relative grid p-1 rounded-full w-fit
                   bg-white/60 backdrop-blur-md border border-white/50
                   shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {/* Sliding background (UPDATED) */}
        <div
          className="absolute top-1 bottom-1 left-1
                     rounded-full
                     bg-gradient-to-r from-indigo-500 to-purple-500
                     shadow-[0_4px_12px_rgba(99,102,241,0.35)]
                     transition-transform duration-300"
          style={{
            width: `calc(${100 / options.length}% - 0.25rem)`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {/* Buttons */}
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              relative px-5 py-2.5 text-sm font-medium z-10
              transition-colors duration-200 rounded-full

              ${
                value === opt.value
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesControlHeader;