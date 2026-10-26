import { describe, expect, it } from "vitest";
import { validateNewItem } from "./validation";

describe("validateNewItem", () => {
  it("accepts a valid item, trimmed", () => {
    expect(validateNewItem("  Caderno ", " capa dura ")).toEqual({
      value: { name: "Caderno", description: "capa dura" },
      errors: {},
    });
  });

  it("says what to fix", () => {
    expect(validateNewItem(" ", "").errors.name).toBe("Informe o nome.");
    expect(validateNewItem("x".repeat(81), "").errors.name).toBe("Use no máximo 80 caracteres.");
    expect(validateNewItem("ok", "x".repeat(301)).errors.description).toBe("Use no máximo 300 caracteres.");
  });
});
