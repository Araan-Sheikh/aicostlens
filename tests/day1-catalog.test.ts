import { describe, expect, it } from "vitest";
import { plansByTool, supportedTools, useCases } from "@/lib/audit/catalog";

describe("Day 1 audit catalog scaffold", () => {
  it("includes the minimum tools required by the assignment", () => {
    expect(supportedTools).toEqual([
      "Cursor",
      "GitHub Copilot",
      "Claude",
      "ChatGPT",
      "Anthropic API direct",
      "OpenAI API direct",
      "Gemini",
      "Windsurf"
    ]);
  });

  it("includes plan options and primary use cases for the first form shell", () => {
    expect(plansByTool.Cursor).toContain("Business");
    expect(plansByTool.Claude).toContain("API direct");
    expect(useCases.map((useCase) => useCase.value)).toEqual([
      "coding",
      "writing",
      "data",
      "research",
      "mixed"
    ]);
  });
});
