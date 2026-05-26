import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";
import type { AuditInput } from "@/lib/audit/types";

function input(overrides: Partial<AuditInput>): AuditInput {
  return {
    tools: [],
    teamSize: 1,
    primaryUseCase: "coding",
    ...overrides
  };
}

describe("audit engine", () => {
  it("recommends downgrading a solo user on ChatGPT Team to Plus", () => {
    const result = runAudit(
      input({
        tools: [
          {
            id: "chatgpt",
            tool: "ChatGPT",
            plan: "Team",
            monthlySpend: 30,
            seats: 1
          }
        ]
      })
    );

    expect(result.toolResults[0]?.recommendedAction).toContain("Downgrade ChatGPT");
    expect(result.toolResults[0]?.recommendedMonthlySpend).toBe(20);
    expect(result.totalMonthlySavings).toBe(10);
  });

  it("recommends Cursor Pro for Cursor Business with one seat", () => {
    const result = runAudit(
      input({
        tools: [
          {
            id: "cursor",
            tool: "Cursor",
            plan: "Business",
            monthlySpend: 40,
            seats: 1
          }
        ]
      })
    );

    expect(result.toolResults[0]?.recommendedAction).toContain("Cursor to Pro");
    expect(result.toolResults[0]?.recommendedMonthlySpend).toBe(20);
    expect(result.totalMonthlySavings).toBe(20);
  });

  it("explains listed-price overspend with the benchmark amount", () => {
    const result = runAudit(
      input({
        teamSize: 10,
        primaryUseCase: "coding",
        tools: [
          {
            id: "cursor-pro",
            tool: "Cursor",
            plan: "Pro",
            monthlySpend: 400,
            seats: 10
          }
        ]
      })
    );

    expect(result.toolResults[0]?.recommendedMonthlySpend).toBe(200);
    expect(result.toolResults[0]?.reason).toContain(
      "benchmark is $200/month for 10 seats"
    );
    expect(result.toolResults[0]?.reason).toContain("15% tolerance buffer");
    expect(result.toolResults[0]?.confidence).toBe("high");
    expect(result.toolResults[0]?.evidence).toContainEqual({
      label: "Official listed benchmark",
      value: "$200"
    });
  });

  it("recommends consolidating duplicate coding assistants", () => {
    const result = runAudit(
      input({
        teamSize: 3,
        primaryUseCase: "coding",
        tools: [
          {
            id: "cursor",
            tool: "Cursor",
            plan: "Pro",
            monthlySpend: 60,
            seats: 3
          },
          {
            id: "copilot",
            tool: "GitHub Copilot",
            plan: "Business",
            monthlySpend: 57,
            seats: 3
          }
        ]
      })
    );

    expect(result.toolResults[1]?.recommendedAction).toContain("Consolidate");
    expect(result.toolResults[1]?.monthlySavings).toBe(57);
  });

  it("qualifies high API spend for the Credex CTA when savings exceed $500/month", () => {
    const result = runAudit(
      input({
        primaryUseCase: "mixed",
        tools: [
          {
            id: "openai-api",
            tool: "OpenAI API direct",
            plan: "API direct",
            monthlySpend: 3000,
            seats: 1
          }
        ]
      })
    );

    expect(result.credexQualified).toBe(true);
    expect(result.totalMonthlySavings).toBe(600);
    expect(result.overallVerdict).toContain("Credex");
  });

  it("does not manufacture savings for an optimized stack", () => {
    const result = runAudit(
      input({
        teamSize: 1,
        primaryUseCase: "writing",
        tools: [
          {
            id: "chatgpt-plus",
            tool: "ChatGPT",
            plan: "Plus",
            monthlySpend: 20,
            seats: 1
          }
        ]
      })
    );

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.toolResults[0]?.severity).toBe("optimal");
    expect(result.overallVerdict).toContain("reasonably optimized");
  });

  it("recommends reducing seats when paid seats exceed team size", () => {
    const result = runAudit(
      input({
        teamSize: 3,
        primaryUseCase: "mixed",
        tools: [
          {
            id: "claude",
            tool: "Claude",
            plan: "Team",
            monthlySpend: 125,
            seats: 5
          }
        ]
      })
    );

    expect(result.toolResults[0]?.recommendedAction).toContain("Reduce Claude seats");
    expect(result.toolResults[0]?.recommendedMonthlySpend).toBe(75);
    expect(result.toolResults[0]?.assumptions).toContain(
      "Assumes paid seats above team size are removable or inactive."
    );
    expect(result.totalMonthlySavings).toBe(50);
  });
});
