"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ToolSpendRow } from "@/components/audit/ToolSpendRow";
import { UseCaseSelector } from "@/components/audit/UseCaseSelector";

export type ToolRow = {
  id: string;
  tool: string;
  plan: string;
  monthlySpend: string;
  seats: string;
};

const defaultRow = (): ToolRow => ({
  id: crypto.randomUUID(),
  tool: "Cursor",
  plan: "Pro",
  monthlySpend: "",
  seats: "1"
});

export function AuditForm() {
  const [rows, setRows] = useState<ToolRow[]>([defaultRow()]);
  const [teamSize, setTeamSize] = useState("1");
  const [primaryUseCase, setPrimaryUseCase] = useState("coding");

  function updateRow(id: string, patch: Partial<ToolRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  }

  function removeRow(id: string) {
    setRows((current) => current.filter((row) => row.id !== id));
  }

  return (
    <form
      id="audit-form"
      className="rounded-md border bg-white p-5 shadow-sm"
      aria-label="AI spend audit form"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Run your audit</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your current AI tools. Validation and persistence land on Day 2.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRows((current) => [...current, defaultRow()])}
          className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add tool
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-md border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Tool spend</p>
              {rows.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-muted-foreground transition hover:text-foreground"
                  aria-label="Remove tool"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <ToolSpendRow row={row} onChange={updateRow} />
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Team size
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(event) => setTeamSize(event.target.value)}
            className="rounded-md border bg-white px-3 py-2"
          />
        </label>
        <UseCaseSelector value={primaryUseCase} onChange={setPrimaryUseCase} />
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95"
      >
        Calculate savings
      </button>
    </form>
  );
}
