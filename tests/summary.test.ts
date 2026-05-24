import { describe, expect, it } from "vitest";
import { buildFallbackSummary } from "@/lib/ai/summary";
import type { AuditResult } from "@/lib/audit/types";

function result(totalMonthlySavings: number): AuditResult {
  return {
    id: "audit",
    createdAt: "2026-05-24T00:00:00.000Z",
    input: {
      tools: [],
      teamSize: 1,
      primaryUseCase: "mixed"
    },
    toolResults: [],
    totalMonthlySpend: 1000,
    totalRecommendedMonthlySpend: 1000 - totalMonthlySavings,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    credexQualified: totalMonthlySavings > 500,
    overallVerdict: "Verdict"
  };
}

describe("fallback audit summary", () => {
  it("mentions Credex for high-savings audits", () => {
    expect(buildFallbackSummary(result(700))).toContain("Credex");
  });

  it("is honest for optimized audits", () => {
    expect(buildFallbackSummary(result(20))).toContain("reasonably optimized");
  });

  it("summarizes moderate savings without inventing tools", () => {
    expect(buildFallbackSummary(result(250))).toContain("$250");
  });
});
