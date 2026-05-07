import { describe, test, expect } from "vitest";
import { validateLogin } from "../features/auth/utils/loginValidation";

describe("validateLogin", () => {
  test("returns email error when email is missing", () => {
    expect(validateLogin("", "password123")).toEqual({
      email: "Email is required",
    });
  });

  test("returns email error when email format is invalid", () => {
    expect(validateLogin("invalid-email", "password123")).toEqual({
      email: "Invalid email format",
    });
  });

  test("returns password error when password is missing", () => {
    expect(validateLogin("test@example.com", "")).toEqual({
      password: "Password is required",
    });
  });

  test("returns password error when password is less than 6 characters", () => {
    expect(validateLogin("test@example.com", "12345")).toEqual({
      password: "Password must be at least 6 characters",
    });
  });

  test("returns no errors for valid email and password", () => {
    expect(validateLogin("test@example.com", "password123")).toEqual({});
  });

  test("returns both email and password errors when both are missing", () => {
    expect(validateLogin("", "")).toEqual({
      email: "Email is required",
      password: "Password is required",
    });
  });
});