"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ToolSpendRow } from "@/components/audit/ToolSpendRow";
import { UseCaseSelector } from "@/components/audit/UseCaseSelector";
import { runAudit } from "@/lib/audit/engine";
import {
  auditFormSchema,
  defaultAuditFormValues,
  type AuditFormValues
} from "@/lib/audit/form-schema";
import type { AuditInput } from "@/lib/audit/types";

const draftStorageKey = "aicostlens.auditFormDraft";
const resultStoragePrefix = "aicostlens.auditResult";

const emptyTool: AuditFormValues["tools"][number] = {
  tool: "Cursor",
  plan: "Pro",
  monthlySpend: 0,
  seats: 1
};

export function AuditForm() {
  const router = useRouter();
  const [isRestored, setIsRestored] = useState(false);
  const [draftStatus, setDraftStatus] = useState<"clean" | "saved" | "restored">(
    "clean"
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditFormSchema),
    defaultValues: defaultAuditFormValues,
    mode: "onBlur"
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "tools"
  });

  const watchedTools = watch("tools");
  const currentMonthlySpend = watchedTools.reduce(
    (total, tool) => total + (Number.isFinite(tool.monthlySpend) ? tool.monthlySpend : 0),
    0
  );
  const totalPaidSeats = watchedTools.reduce(
    (total, tool) => total + (Number.isFinite(tool.seats) ? tool.seats : 0),
    0
  );

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);

    if (savedDraft) {
      try {
        const parsedDraft = auditFormSchema.safeParse(JSON.parse(savedDraft));

        if (parsedDraft.success) {
          reset(parsedDraft.data);
          setDraftStatus("restored");
        }
      } catch {
        window.localStorage.removeItem(draftStorageKey);
      }
    }

    setIsRestored(true);
  }, [reset]);

  useEffect(() => {
    if (!isRestored) {
      return;
    }

    const subscription = watch((value) => {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(value));
      setDraftStatus("saved");
    });

    return () => subscription.unsubscribe();
  }, [isRestored, watch]);

  function resetDraft() {
    reset(defaultAuditFormValues);
    window.localStorage.removeItem(draftStorageKey);
    setDraftStatus("clean");
    setSubmitMessage(null);
  }

  function onSubmit(values: AuditFormValues) {
    const auditInput: AuditInput = {
      teamSize: values.teamSize,
      primaryUseCase: values.primaryUseCase,
      tools: values.tools.map((tool, index) => ({
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `tool_${index}`,
        ...tool
      }))
    };
    const result = runAudit(auditInput);

    window.localStorage.setItem(
      `${resultStoragePrefix}.${result.id}`,
      JSON.stringify(result)
    );
    setSubmitMessage("Audit ready. Opening your savings report...");
    router.push(`/audit/${result.id}`);
  }

  return (
    <form
      id="audit-form"
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border bg-white p-5 shadow-sm"
      aria-label="AI spend audit form"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Run your audit</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your current AI tools.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md border bg-background px-2 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              {draftStatus === "restored"
                ? "Draft restored"
                : draftStatus === "saved"
                  ? "Draft saved"
                  : "Ready"}
            </span>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset draft
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => append(emptyTool)}
          className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add tool
        </button>
      </div>

      <div className="mt-5 grid gap-3 rounded-md border bg-background p-4 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Tools</p>
          <p className="mt-1 text-lg font-semibold">{fields.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Paid seats</p>
          <p className="mt-1 text-lg font-semibold">{totalPaidSeats}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Monthly spend</p>
          <p className="mt-1 text-lg font-semibold">
            ${currentMonthlySpend.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Annualized</p>
          <p className="mt-1 text-lg font-semibold">
            ${(currentMonthlySpend * 12).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-md border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Tool spend {index + 1}</p>
              {fields.length > 1 ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-muted-foreground transition hover:text-foreground"
                  aria-label="Remove tool"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
            <ToolSpendRow
              errors={errors.tools?.[index]}
              index={index}
              register={register}
              setValue={setValue}
              tool={watch(`tools.${index}.tool`)}
            />
          </div>
        ))}
      </div>
      {errors.tools?.root?.message ? (
        <p className="mt-2 text-sm text-red-700">{errors.tools.root.message}</p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Team size
          <input
            type="number"
            min="1"
            {...register("teamSize", { valueAsNumber: true })}
            className="rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.teamSize?.message ? (
            <span className="text-sm font-normal text-red-700">
              {errors.teamSize.message}
            </span>
          ) : null}
        </label>
        <UseCaseSelector
          error={errors.primaryUseCase?.message}
          register={register}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Checking..." : "Calculate savings"}
      </button>
      {submitMessage ? (
        <p className="mt-3 rounded-md border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-primary">
          {submitMessage}
        </p>
      ) : null}
    </form>
  );
}
