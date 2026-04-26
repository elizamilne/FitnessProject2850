const ActivitiesControlHeader = ({
  title,
  options,
  value,
  onChange,
}) => {
  const activeIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>
        
      <div
        className="relative grid bg-gray-100 p-1 rounded-full w-fit"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {/* Sliding background */}
        <div
          className="absolute top-1 bottom-1 left-1 bg-white rounded-full shadow transition-transform duration-300"
          style={{
            width: `calc(${100 / options.length}% - 0.25rem)`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative px-4 py-2 text-sm z-10 text-center ${
              value === opt.value ? "text-black" : "text-gray-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesControlHeader;
