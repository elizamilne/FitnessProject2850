import { describe, test, expect } from "vitest";
import { validateRegister } from "../features/auth/utils/registerValidation";

describe("validateRegister", () => {
  test("returns first name error when first name is empty", () => {
    expect(
      validateRegister({
        firstName: "",
        lastName: "Smith",
        email: "test@example.com",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({
      firstName: "First name is required",
    });
  });

  test("returns first name error when first name is only spaces", () => {
    expect(
      validateRegister({
        firstName: "   ",
        lastName: "Smith",
        email: "test@example.com",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({
      firstName: "First name is required",
    });
  });

  test("returns last name error when last name is empty", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "",
        email: "test@example.com",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({
      lastName: "Last name is required",
    });
  });

  test("returns last name error when last name is only spaces", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "   ",
        email: "test@example.com",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({
      lastName: "Last name is required",
    });
  });

  test("returns email error when email is missing", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({
      email: "Email is required",
    });
  });

  test("returns email error when email format is invalid", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "invalid-email",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({
      email: "Invalid email format",
    });
  });

  test("returns password error when password is missing", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "test@example.com",
        password: "",
        rePassword: "password123",
      })
    ).toEqual({
      password: "Password is required",
      rePassword: "Passwords do not match",
    });
  });

  test("returns password error when password is less than 6 characters", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "test@example.com",
        password: "12345",
        rePassword: "12345",
      })
    ).toEqual({
      password: "Password must be at least 6 characters",
    });
  });

  test("returns rePassword error when confirmation password is missing", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "test@example.com",
        password: "password123",
        rePassword: "",
      })
    ).toEqual({
      rePassword: "Please confirm your password",
    });
  });

  test("returns rePassword error when passwords do not match", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "test@example.com",
        password: "password123",
        rePassword: "different123",
      })
    ).toEqual({
      rePassword: "Passwords do not match",
    });
  });

  test("returns multiple errors when required fields are empty", () => {
    expect(
      validateRegister({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: "",
      })
    ).toEqual({
      firstName: "First name is required",
      lastName: "Last name is required",
      email: "Email is required",
      password: "Password is required",
      rePassword: "Please confirm your password",
    });
  });

  test("returns no errors when all register details are valid", () => {
    expect(
      validateRegister({
        firstName: "John",
        lastName: "Smith",
        email: "test@example.com",
        password: "password123",
        rePassword: "password123",
      })
    ).toEqual({});
  });
});