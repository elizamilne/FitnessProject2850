const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const sortDays = (days = []) => {
  return [...days].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );
};

export const formatDays = (days = []) => {
  const sortedDays = sortDays(days);

  if (sortedDays.length === 0) return "No days";

  const isEveryday =
    sortedDays.length === 7 &&
    DAY_ORDER.every((day) => sortedDays.includes(day));

  if (isEveryday) return "Everyday";

  const isWeekend =
    sortedDays.length === 2 &&
    sortedDays.includes("Saturday") &&
    sortedDays.includes("Sunday");

  if (isWeekend) return "Weekend";

  return sortedDays.join(", ");
};