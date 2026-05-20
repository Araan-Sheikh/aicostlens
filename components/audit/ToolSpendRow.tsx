import type { ToolRow } from "@/components/audit/AuditForm";
import { plansByTool, supportedTools } from "@/lib/audit/catalog";

type ToolSpendRowProps = {
  row: ToolRow;
  onChange: (id: string, patch: Partial<ToolRow>) => void;
};

export function ToolSpendRow({ row, onChange }: ToolSpendRowProps) {
  const plans = plansByTool[row.tool as keyof typeof plansByTool] ?? [];

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">
        Tool
        <select
          value={row.tool}
          onChange={(event) => {
            const tool = event.target.value as keyof typeof plansByTool;
            onChange(row.id, { tool, plan: plansByTool[tool][0] });
          }}
          className="rounded-md border bg-white px-3 py-2"
        >
          {supportedTools.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Plan
        <select
          value={row.plan}
          onChange={(event) => onChange(row.id, { plan: event.target.value })}
          className="rounded-md border bg-white px-3 py-2"
        >
          {plans.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Monthly spend
        <input
          type="number"
          min="0"
          placeholder="240"
          value={row.monthlySpend}
          onChange={(event) => onChange(row.id, { monthlySpend: event.target.value })}
          className="rounded-md border bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Paid seats
        <input
          type="number"
          min="1"
          value={row.seats}
          onChange={(event) => onChange(row.id, { seats: event.target.value })}
          className="rounded-md border bg-white px-3 py-2"
        />
      </label>
    </div>
  );
}
