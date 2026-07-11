import { describe, expect, it } from "vitest";
import { MIN_MESSAGE_LENGTH, validateContactForm } from "./contactForm";

const base = {
  name: "James",
  email: "james@example.com",
  message: "x".repeat(MIN_MESSAGE_LENGTH),
  captchaToken: "token",
  botcheck: null,
  formReadyAt: Date.now() - 5000,
};

describe("validateContactForm", () => {
  it("accepts a valid payload", () => {
    expect(validateContactForm(base)).toBeNull();
  });

  it("rejects missing fields", () => {
    expect(validateContactForm({ ...base, name: "" })).toMatch(/required/i);
  });

  it("rejects short messages", () => {
    expect(validateContactForm({ ...base, message: "too short" })).toMatch(/30/);
  });

  it("rejects invalid email", () => {
    expect(validateContactForm({ ...base, email: "nope" })).toMatch(/email/i);
  });
});
