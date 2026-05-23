import { BadgeDollarSign, CheckCircle2, TrendingDown } from "lucide-react";
import type { AuditResult } from "@/lib/audit/types";

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

type ResultsHeroProps = {
  result: AuditResult;
};

export function ResultsHero({ result }: ResultsHeroProps) {
  const isOptimized = result.totalMonthlySavings < 100;

  return (
    <section className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1 text-sm text-muted-foreground">
            {isOptimized ? (
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            {isOptimized ? "Optimized stack" : "Potential savings"}
          </div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {isOptimized
              ? "Your AI spend looks well controlled."
              : `Save ${money(result.totalMonthlySavings)} / month`}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {result.overallVerdict}
          </p>
        </div>
        <div className="grid min-w-64 gap-3 rounded-md border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <BadgeDollarSign className="h-4 w-4 text-primary" aria-hidden="true" />
            Audit totals
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Current / mo</dt>
              <dd className="mt-1 font-semibold">{money(result.totalMonthlySpend)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Recommended / mo</dt>
              <dd className="mt-1 font-semibold">
                {money(result.totalRecommendedMonthlySpend)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Monthly savings</dt>
              <dd className="mt-1 font-semibold">
                {money(result.totalMonthlySavings)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Annual savings</dt>
              <dd className="mt-1 font-semibold">
                {money(result.totalAnnualSavings)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
