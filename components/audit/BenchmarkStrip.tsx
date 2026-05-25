import { Gauge } from "lucide-react";
import type { AuditResult } from "@/lib/audit/types";

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

type BenchmarkStripProps = {
  result: AuditResult;
};

export function BenchmarkStrip({ result }: BenchmarkStripProps) {
  const teamSize = Math.max(result.input.teamSize, 1);
  const paidSeats = result.input.tools.reduce((total, tool) => total + tool.seats, 0);
  const spendPerTeamMember = result.totalMonthlySpend / teamSize;
  const savingsPerTeamMember = result.totalMonthlySavings / teamSize;

  return (
    <section className="mt-5 rounded-md border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Stack efficiency</h2>
      </div>
      <dl className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-md border bg-background p-3">
          <dt className="text-xs uppercase text-muted-foreground">Spend / person</dt>
          <dd className="mt-1 text-lg font-semibold">
            {money(spendPerTeamMember)}/mo
          </dd>
        </div>
        <div className="rounded-md border bg-background p-3">
          <dt className="text-xs uppercase text-muted-foreground">Savings / person</dt>
          <dd className="mt-1 text-lg font-semibold">
            {money(savingsPerTeamMember)}/mo
          </dd>
        </div>
        <div className="rounded-md border bg-background p-3">
          <dt className="text-xs uppercase text-muted-foreground">Tools tracked</dt>
          <dd className="mt-1 text-lg font-semibold">{result.input.tools.length}</dd>
        </div>
        <div className="rounded-md border bg-background p-3">
          <dt className="text-xs uppercase text-muted-foreground">Paid seats</dt>
          <dd className="mt-1 text-lg font-semibold">{paidSeats}</dd>
        </div>
      </dl>
    </section>
  );
}
