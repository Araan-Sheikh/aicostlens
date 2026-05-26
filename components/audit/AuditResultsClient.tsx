"use client";

import { ArrowLeft, CalendarClock, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BenchmarkStrip } from "@/components/audit/BenchmarkStrip";
import { ExportPdfButton } from "@/components/audit/ExportPdfButton";
import { LeadCaptureForm } from "@/components/audit/LeadCaptureForm";
import { LockedReportActions } from "@/components/audit/LockedReportActions";
import { MethodologyCard } from "@/components/audit/MethodologyCard";
import { ResultsHero } from "@/components/audit/ResultsHero";
import { ShareReportCard } from "@/components/audit/ShareReportCard";
import { ToolResultCard } from "@/components/audit/ToolResultCard";
import type { AuditResult } from "@/lib/audit/types";

const resultStoragePrefix = "aicostlens.auditResult";

type AuditResultsClientProps = {
  auditId: string;
};

export function AuditResultsClient({ auditId }: AuditResultsClientProps) {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isMissing, setIsMissing] = useState(false);
  const [isReportSaved, setIsReportSaved] = useState(false);

  function focusLeadCapture() {
    const leadCapture = document.getElementById("lead-capture");
    const emailInput = document.getElementById("lead-email");

    leadCapture?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (emailInput instanceof HTMLInputElement) {
      window.setTimeout(() => emailInput.focus(), 350);
    }
  }

  useEffect(() => {
    const storedResult = window.localStorage.getItem(
      `${resultStoragePrefix}.${auditId}`
    );

    if (!storedResult) {
      setIsMissing(true);
      return;
    }

    try {
      setResult(JSON.parse(storedResult) as AuditResult);
    } catch {
      setIsMissing(true);
    }
  }, [auditId]);

  if (isMissing) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-md border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Audit report not found</h1>
          <p className="mt-3 text-muted-foreground">
            This local report may have been cleared from your browser. Run a new
            audit to generate a fresh result.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Run new audit
          </Link>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-6xl text-sm text-muted-foreground">
          Loading audit report...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to audit form
          </Link>
          {isReportSaved ? (
            <ExportPdfButton
              href={result.publicSlug ? `/report/${result.publicSlug}/pdf` : undefined}
            />
          ) : null}
        </div>

        <ResultsHero result={result} />
        <BenchmarkStrip result={result} />

        {result.credexQualified ? (
          <section className="mt-5 rounded-md border bg-primary p-5 text-primary-foreground shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Strong fit for Credex discounted AI credits
                </h2>
                <p className="mt-2 text-sm opacity-90">
                  This audit found more than $500/month in potential savings.
                  Credex may be able to help capture more of that without forcing
                  your team to change its workflow.
                </p>
              </div>
              <button
                type="button"
                onClick={focusLeadCapture}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-primary"
              >
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                Book consultation
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-5 rounded-md border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Keep monitoring this stack</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your savings signal is below the high-priority Credex threshold.
              The honest next step is to save the report and get notified when
              pricing or credit options change.
            </p>
          </section>
        )}

        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Per-tool breakdown</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Current spend, recommendation, savings, and reasoning for each tool.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {result.toolResults.length} recommendation
              {result.toolResults.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid gap-4">
            {result.toolResults.map((toolResult, index) => (
              <ToolResultCard
                key={`${toolResult.tool}-${toolResult.plan}-${index}`}
                result={toolResult}
              />
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <LeadCaptureForm result={result} onSaved={() => setIsReportSaved(true)} />
          <div className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Summary</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {result.summary ||
                "Summary generation is unavailable for this locally generated report. The deterministic verdict above remains the source of truth."}
            </p>
          </div>
        </section>

        <div className="mt-6">
          {isReportSaved ? (
            <ShareReportCard publicSlug={result.publicSlug} />
          ) : (
            <LockedReportActions />
          )}
        </div>

        <div className="mt-6">
          <MethodologyCard />
        </div>
      </div>
    </main>
  );
}
