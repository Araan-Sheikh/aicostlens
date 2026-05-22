import type { ToolName, UseCase } from "@/lib/audit/catalog";

export type { ToolName, UseCase };

export interface ToolSpendInput {
  id: string;
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolSpendInput[];
  teamSize: number;
  primaryUseCase: UseCase;
}

export type RecommendationSeverity = "optimal" | "minor" | "medium" | "high";

export interface ToolAuditResult {
  tool: ToolName;
  plan: string;
  currentMonthlySpend: number;
  recommendedAction: string;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: RecommendationSeverity;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  input: AuditInput;
  toolResults: ToolAuditResult[];
  totalMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  credexQualified: boolean;
  overallVerdict: string;
}
