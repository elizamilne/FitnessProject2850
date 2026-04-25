import React from "react";

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
  const toggleDay = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-500">
          Program title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="e.g. Push/Pull/Legs"
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <p className="text-sm text-gray-500">
        Select training days
      </p>

      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day);

          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-4 py-2 rounded-lg border transition ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleProgram;