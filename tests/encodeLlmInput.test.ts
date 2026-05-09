import { describe, expect, it } from "vitest";
import { encodeLlmInput } from "../lib/encodeLlmInput";

describe("encodeLlmInput", () => {
  it("returns encoded bytes", () => {
    const out = encodeLlmInput("0x0000000000000000000000000000000000000001", "The sky is blue", "sys");
    expect(out.startsWith("0x")).toBe(true);
    expect(out.length).toBeGreaterThan(2);
  });
});
