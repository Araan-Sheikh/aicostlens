import { CircleCheck, CircleMinus, TriangleAlert } from "lucide-react";
import type { ToolAuditResult } from "@/lib/audit/types";

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

const severityCopy = {
  optimal: "Optimized",
  minor: "Minor",
  medium: "Medium",
  high: "High"
} as const;

type ToolResultCardProps = {
  result: ToolAuditResult;
};

export function ToolResultCard({ result }: ToolResultCardProps) {
  const Icon =
    result.severity === "optimal"
      ? CircleCheck
      : result.severity === "minor"
        ? CircleMinus
        : TriangleAlert;

  return (
    <article className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">{result.tool}</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{result.plan}</p>
        </div>
        <span className="w-fit rounded-md border bg-background px-2 py-1 text-xs font-medium">
          {severityCopy[result.severity]}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Current</dt>
          <dd className="mt-1 font-semibold">{money(result.currentMonthlySpend)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Recommended</dt>
          <dd className="mt-1 font-semibold">
            {money(result.recommendedMonthlySpend)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Savings</dt>
          <dd className="mt-1 font-semibold">{money(result.monthlySavings)}/mo</dd>
        </div>
      </dl>

      <div className="mt-5 rounded-md border bg-background p-4">
        <p className="text-sm font-medium">{result.recommendedAction}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {result.reason}
        </p>
      </div>
    </article>
  );
}
