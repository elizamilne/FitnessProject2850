import { describe, test, expect } from "vitest";
import { sortDays, formatDays } from "../features/activities/programs/utils/formatters";

describe("sortDays", () => {
  test("sorts days into weekday order", () => {
    const days = ["Friday", "Monday", "Sunday", "Wednesday"];

    expect(sortDays(days)).toEqual([
      "Monday",
      "Wednesday",
      "Friday",
      "Sunday",
    ]);
  });

  test("returns an empty array when no days are provided", () => {
    expect(sortDays()).toEqual([]);
  });

  test("does not mutate the original array", () => {
    const days = ["Sunday", "Monday"];
    const result = sortDays(days);

    expect(result).toEqual(["Monday", "Sunday"]);
    expect(days).toEqual(["Sunday", "Monday"]);
  });
});

describe("formatDays", () => {
  test("returns 'No days' when no days are provided", () => {
    expect(formatDays()).toBe("No days");
  });

  test("returns 'Everyday' when all seven days are selected", () => {
    expect(
      formatDays([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ])
    ).toBe("Everyday");
  });

  test("returns 'Weekend' when Saturday and Sunday are selected", () => {
    expect(formatDays(["Sunday", "Saturday"])).toBe("Weekend");
  });

  test("formats selected days in correct order", () => {
    expect(formatDays(["Friday", "Monday", "Wednesday"])).toBe(
      "Monday, Wednesday, Friday"
    );
  });

  test("formats a single selected day", () => {
    expect(formatDays(["Thursday"])).toBe("Thursday");
  });
});