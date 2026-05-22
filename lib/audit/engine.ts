import { evaluateTools } from "@/lib/audit/rules";
import type { AuditInput, AuditResult } from "@/lib/audit/types";

function createAuditId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `audit_${Date.now()}`;
}

function roundCurrency(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function buildVerdict(totalMonthlySavings: number) {
  if (totalMonthlySavings >= 500) {
    return `You are overspending by $${totalMonthlySavings.toFixed(0)}/month. Credex may be able to help capture more of this savings through discounted AI infrastructure credits.`;
  }

  if (totalMonthlySavings < 100) {
    return "Your AI spend looks reasonably optimized. We will notify you when new optimization opportunities apply.";
  }

  return `You have about $${totalMonthlySavings.toFixed(0)}/month in practical AI spend optimization opportunities.`;
}

export function runAudit(input: AuditInput): AuditResult {
  const toolResults = evaluateTools(input);
  const totalMonthlySpend = roundCurrency(
    input.tools.reduce((total, tool) => total + tool.monthlySpend, 0)
  );
  const totalMonthlySavings = roundCurrency(
    toolResults.reduce((total, result) => total + result.monthlySavings, 0)
  );
  const totalRecommendedMonthlySpend = roundCurrency(
    totalMonthlySpend - totalMonthlySavings
  );

  return {
    id: createAuditId(),
    createdAt: new Date().toISOString(),
    input,
    toolResults,
    totalMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings: roundCurrency(totalMonthlySavings * 12),
    credexQualified: totalMonthlySavings > 500,
    overallVerdict: buildVerdict(totalMonthlySavings)
  };
}
