import type { ToolName } from "@/lib/audit/types";

export type PricingUnit = "user" | "seat" | "account" | "usage" | "custom";

export interface PlanPrice {
  monthlyUsd: number | null;
  unit: PricingUnit;
  sourceUrl: string;
  verifiedAt: string;
  notes?: string;
}

export type PricingTable = Record<ToolName, Record<string, PlanPrice>>;

export const PRICING_VERIFIED_AT = "2026-05-21";

export const pricing: PricingTable = {
  Cursor: {
    Hobby: {
      monthlyUsd: 0,
      unit: "user",
      sourceUrl: "https://cursor.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Pro: {
      monthlyUsd: 20,
      unit: "user",
      sourceUrl: "https://cursor.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Business: {
      monthlyUsd: 40,
      unit: "seat",
      sourceUrl: "https://cursor.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT,
      notes: "Current official page labels this tier as Teams."
    },
    Enterprise: {
      monthlyUsd: null,
      unit: "custom",
      sourceUrl: "https://cursor.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  "GitHub Copilot": {
    Individual: {
      monthlyUsd: 10,
      unit: "user",
      sourceUrl: "https://github.com/features/copilot/plans",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Business: {
      monthlyUsd: 19,
      unit: "seat",
      sourceUrl: "https://github.com/features/copilot/plans",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Enterprise: {
      monthlyUsd: 39,
      unit: "seat",
      sourceUrl: "https://github.com/features/copilot/plans",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  Claude: {
    Free: {
      monthlyUsd: 0,
      unit: "user",
      sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Pro: {
      monthlyUsd: 20,
      unit: "user",
      sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Max: {
      monthlyUsd: 100,
      unit: "user",
      sourceUrl: "https://support.claude.com/en/articles/11049762-choose-a-claude-plan",
      verifiedAt: PRICING_VERIFIED_AT,
      notes: "Uses Max 5x as the conservative baseline."
    },
    Team: {
      monthlyUsd: 25,
      unit: "seat",
      sourceUrl: "https://www.claude.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT,
      notes: "Team Standard monthly baseline; verify before final submission."
    },
    Enterprise: {
      monthlyUsd: null,
      unit: "custom",
      sourceUrl: "https://www.claude.com/pricing/enterprise",
      verifiedAt: PRICING_VERIFIED_AT
    },
    "API direct": {
      monthlyUsd: null,
      unit: "usage",
      sourceUrl: "https://docs.claude.com/en/docs/about-claude/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  ChatGPT: {
    Plus: {
      monthlyUsd: 20,
      unit: "user",
      sourceUrl: "https://help.openai.com/en/articles/6950777-chatgpt-plus",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Team: {
      monthlyUsd: 25,
      unit: "seat",
      sourceUrl: "https://help.openai.com/en/articles/8792828-what-is-chatgpt-team",
      verifiedAt: PRICING_VERIFIED_AT,
      notes: "ChatGPT Team is now generally described as ChatGPT Business."
    },
    Enterprise: {
      monthlyUsd: null,
      unit: "custom",
      sourceUrl: "https://chatgpt.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    },
    "API direct": {
      monthlyUsd: null,
      unit: "usage",
      sourceUrl: "https://openai.com/api/pricing/",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  "Anthropic API direct": {
    "API direct": {
      monthlyUsd: null,
      unit: "usage",
      sourceUrl: "https://docs.claude.com/en/docs/about-claude/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  "OpenAI API direct": {
    "API direct": {
      monthlyUsd: null,
      unit: "usage",
      sourceUrl: "https://openai.com/api/pricing/",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  Gemini: {
    Pro: {
      monthlyUsd: 19.99,
      unit: "user",
      sourceUrl: "https://gemini.google/us/subscriptions/",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Ultra: {
      monthlyUsd: 99.99,
      unit: "user",
      sourceUrl: "https://gemini.google/us/subscriptions/",
      verifiedAt: PRICING_VERIFIED_AT,
      notes: "Uses the entry Ultra price; page also lists a higher-usage $199.99 option."
    },
    API: {
      monthlyUsd: null,
      unit: "usage",
      sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    }
  },
  Windsurf: {
    Free: {
      monthlyUsd: 0,
      unit: "user",
      sourceUrl: "https://docs.windsurf.com/windsurf/accounts/usage",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Pro: {
      monthlyUsd: 20,
      unit: "user",
      sourceUrl: "https://windsurf.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    },
    Teams: {
      monthlyUsd: 40,
      unit: "seat",
      sourceUrl: "https://windsurf.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
   },
    Enterprise: {
      monthlyUsd: null,
      unit: "custom",
      sourceUrl: "https://windsurf.com/pricing",
      verifiedAt: PRICING_VERIFIED_AT
    }
  }
};

export function getPlanPrice(tool: ToolName, plan: string) {
  return pricing[tool]?.[plan];
}

export function getExpectedMonthlySpend(tool: ToolName, plan: string, seats: number) {
  const planPrice = getPlanPrice(tool, plan);

  if (!planPrice || planPrice.monthlyUsd === null) {
    return null;
  }

  return planPrice.monthlyUsd * seats;
}
