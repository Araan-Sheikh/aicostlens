import { getExpectedMonthlySpend, getPlanPrice } from "@/lib/audit/pricing";
import type {
  AuditInput,
  RecommendationConfidence,
  RecommendationEvidence,
  RecommendationSeverity,
  ToolAuditResult,
  ToolName,
  ToolSpendInput
} from "@/lib/audit/types";

const codingAssistants: ToolName[] = ["Cursor", "GitHub Copilot", "Windsurf"];

type DraftRecommendation = Omit<ToolAuditResult, "annualSavings" | "severity"> & {
  severity: RecommendationSeverity;
};

function roundCurrency(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function severityForSavings(savings: number): RecommendationSeverity {
  if (savings <= 0) {
    return "optimal";
  }

  if (savings >= 500) {
    return "high";
  }

  if (savings >= 100) {
    return "medium";
  }

  return "minor";
}

function optimalResult(input: ToolSpendInput): DraftRecommendation {
  return {
    tool: input.tool,
    plan: input.plan,
    currentMonthlySpend: input.monthlySpend,
    recommendedAction: "Keep current setup",
    recommendedMonthlySpend: input.monthlySpend,
    monthlySavings: 0,
    reason: "No material overspend signal was found from plan fit, seat count, or duplicate tooling.",
    severity: "optimal",
    confidence: "medium",
    evidence: [
      { label: "Current monthly spend", value: formatMoney(input.monthlySpend) },
      { label: "Paid seats", value: `${input.seats}` }
    ],
    assumptions: [
      "Uses self-reported spend and seat counts.",
      "Does not inspect actual usage logs or private contracts."
    ]
  };
}

function maybeReplaceRecommendation(
  current: DraftRecommendation,
  recommendedMonthlySpend: number,
  recommendedAction: string,
  reason: string,
  details?: {
    confidence?: RecommendationConfidence;
    evidence?: RecommendationEvidence[];
    assumptions?: string[];
  }
): DraftRecommendation {
  const monthlySavings = roundCurrency(
    current.currentMonthlySpend - recommendedMonthlySpend
  );

  if (monthlySavings <= current.monthlySavings) {
    return current;
  }

  return {
    ...current,
    recommendedAction,
    recommendedMonthlySpend: roundCurrency(recommendedMonthlySpend),
    monthlySavings,
    reason,
    severity: severityForSavings(monthlySavings),
    confidence: details?.confidence || "medium",
    evidence: details?.evidence || current.evidence,
    assumptions: details?.assumptions || current.assumptions
  };
}

function sameVendorDowngradeTarget(input: ToolSpendInput, teamSize: number) {
  const isSmallTeam = teamSize <= 2;

  if (!isSmallTeam) {
    return null;
  }

  if (input.tool === "Cursor" && ["Business", "Enterprise"].includes(input.plan)) {
    return { plan: "Pro", action: "Downgrade Cursor to Pro for this small team" };
  }

  if (input.tool === "GitHub Copilot" && ["Business", "Enterprise"].includes(input.plan)) {
    return {
      plan: "Individual",
      action: "Downgrade Copilot to Individual for solo or two-person usage"
    };
  }

  if (input.tool === "ChatGPT" && ["Team", "Enterprise"].includes(input.plan)) {
    return { plan: "Plus", action: "Downgrade ChatGPT to Plus for this small team" };
  }

  if (input.tool === "Claude" && ["Team", "Enterprise"].includes(input.plan)) {
    return { plan: "Pro", action: "Downgrade Claude to Pro for this small team" };
  }

  return null;
}

function evaluateSingleTool(input: ToolSpendInput, auditInput: AuditInput) {
  let result = optimalResult(input);

  if (input.seats > auditInput.teamSize) {
    const perSeatSpend = input.monthlySpend / input.seats;
    const recommendedMonthlySpend = perSeatSpend * auditInput.teamSize;
    result = maybeReplaceRecommendation(
      result,
      recommendedMonthlySpend,
      `Reduce ${input.tool} seats from ${input.seats} to ${auditInput.teamSize}`,
      "Paid seats are higher than team size, so the extra seats are likely unused.",
      {
        confidence: "high",
        evidence: [
          { label: "Reported paid seats", value: `${input.seats}` },
          { label: "Reported team size", value: `${auditInput.teamSize}` },
          { label: "Implied spend per seat", value: formatMoney(perSeatSpend) },
          { label: "Recommended monthly spend", value: formatMoney(recommendedMonthlySpend) }
        ],
        assumptions: [
          "Assumes paid seats above team size are removable or inactive.",
          "Uses average spend per reported seat when official plan pricing is custom or bundled."
        ]
      }
    );
  }

  const listedSpend = getExpectedMonthlySpend(input.tool, input.plan, input.seats);
  if (listedSpend !== null && input.monthlySpend > listedSpend * 1.15) {
    result = maybeReplaceRecommendation(
      result,
      listedSpend,
      `Align ${input.tool} billing to the listed ${input.plan} price`,
      `The listed ${input.plan} benchmark is ${formatMoney(
        listedSpend
      )}/month for ${input.seats} seat${
        input.seats === 1 ? "" : "s"
      }. Current spend is ${formatMoney(
        input.monthlySpend
      )}/month, which is above the 15% tolerance buffer used to avoid flagging tiny billing variance.`,
      {
        confidence: "high",
        evidence: [
          { label: "Official listed benchmark", value: formatMoney(listedSpend) },
          { label: "Reported monthly spend", value: formatMoney(input.monthlySpend) },
          { label: "Tolerance threshold", value: formatMoney(listedSpend * 1.15) },
          { label: "Seat count used", value: `${input.seats}` }
        ],
        assumptions: [
          "Assumes the submitted plan maps to the public vendor pricing page.",
          "Keeps a 15% buffer for taxes, currency conversion, billing cadence, and minor add-ons."
        ]
      }
    );
  }

  const downgradeTarget = sameVendorDowngradeTarget(input, auditInput.teamSize);
  if (downgradeTarget) {
    const targetPrice = getPlanPrice(input.tool, downgradeTarget.plan);

    if (targetPrice?.monthlyUsd !== null && targetPrice?.monthlyUsd !== undefined) {
      const targetSpend = targetPrice.monthlyUsd * Math.min(input.seats, auditInput.teamSize);
      result = maybeReplaceRecommendation(
        result,
        targetSpend,
        downgradeTarget.action,
        "Team or enterprise controls look oversized for a one- or two-person team.",
        {
          confidence: "medium",
          evidence: [
            { label: "Current plan", value: input.plan },
            { label: "Recommended plan", value: downgradeTarget.plan },
            { label: "Recommended monthly spend", value: formatMoney(targetSpend) },
            { label: "Team size", value: `${auditInput.teamSize}` }
          ],
          assumptions: [
            "Assumes the team does not require enterprise administration, compliance, or procurement controls.",
            "Uses public per-seat pricing for the recommended lower plan."
          ]
        }
      );
    }
  }

  const isApiDirect =
    input.tool === "Anthropic API direct" ||
    input.tool === "OpenAI API direct" ||
    input.plan === "API direct" ||
    input.plan === "API";

  if (isApiDirect && input.monthlySpend >= 1000) {
    const creditAdjustedSpend = input.monthlySpend * 0.8;
    result = maybeReplaceRecommendation(
      result,
      creditAdjustedSpend,
      "Explore discounted AI infrastructure credits through Credex",
      "High direct API spend is a credible fit for credit-based purchasing or committed-use discounts.",
      {
        confidence: "medium",
        evidence: [
          { label: "Reported API spend", value: formatMoney(input.monthlySpend) },
          { label: "Modeled credit savings", value: "20%" },
          { label: "Recommended monthly spend", value: formatMoney(creditAdjustedSpend) }
        ],
        assumptions: [
          "Models a conservative 20% savings opportunity for eligible high API spend.",
          "Actual savings depend on vendor eligibility, contract terms, and available credits."
        ]
      }
    );
  }

  return result;
}

function applyDuplicateCodingAssistantRule(
  input: AuditInput,
  results: DraftRecommendation[]
) {
  if (input.primaryUseCase !== "coding") {
    return results;
  }

  const paidCodingTools = input.tools
    .map((tool, index) => ({ ...tool, index }))
    .filter((tool) => codingAssistants.includes(tool.tool) && tool.monthlySpend > 0)
    .sort((a, b) => b.monthlySpend - a.monthlySpend);

  if (paidCodingTools.length <= 1) {
    return results;
  }

  const [primaryTool, ...duplicateTools] = paidCodingTools;
  const duplicateIndexes = new Set(duplicateTools.map((tool) => tool.index));

  return results.map((result, index) => {
    if (!duplicateIndexes.has(index)) {
      return result;
    }

    return maybeReplaceRecommendation(
      result,
      0,
      `Consolidate coding assistance into ${primaryTool.tool}`,
      "Multiple paid coding assistants overlap for the same coding-heavy workflow.",
      {
        confidence: "medium",
        evidence: [
          { label: "Primary coding assistant", value: primaryTool.tool },
          { label: "Duplicate tool flagged", value: result.tool },
          { label: "Duplicate monthly spend", value: formatMoney(result.currentMonthlySpend) }
        ],
        assumptions: [
          "Applies only when the primary use case is coding.",
          "Assumes the team can standardize on the highest-spend coding assistant without losing required workflows."
        ]
      }
    );
  });
}

export function evaluateTools(input: AuditInput) {
  const initialResults = input.tools.map((tool) => evaluateSingleTool(tool, input));
  const duplicateAwareResults = applyDuplicateCodingAssistantRule(input, initialResults);

  return duplicateAwareResults.map((result) => ({
    ...result,
    annualSavings: roundCurrency(result.monthlySavings * 12)
  }));
}
