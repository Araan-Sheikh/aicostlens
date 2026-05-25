import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquareText } from "lucide-react";
import { BenchmarkStrip } from "@/components/audit/BenchmarkStrip";
import { MethodologyCard } from "@/components/audit/MethodologyCard";
import { ResultsHero } from "@/components/audit/ResultsHero";
import { ShareReportCard } from "@/components/audit/ShareReportCard";
import { ToolResultCard } from "@/components/audit/ToolResultCard";
import { getPublicAuditResult } from "@/lib/audit/public-report";

type ReportPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export async function generateMetadata({
  params
}: ReportPageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = await getPublicAuditResult(slug);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!report) {
    return {
      title: "AI Spend Audit Report",
      description: "View an AI tool spend audit report."
    };
  }

  const title =
    report.totalMonthlySavings > 0
      ? `AI Spend Audit: Save ${money(report.totalMonthlySavings)}/mo`
      : "AI Spend Audit: Optimized Stack";
  const description =
    report.totalMonthlySavings > 0
      ? `This AI stack audit found ${money(
          report.totalAnnualSavings
        )}/year in potential savings.`
      : "This AI stack audit found a reasonably optimized setup.";
  const url = `${appUrl}/report/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { slug } = await params;
  const report = await getPublicAuditResult(slug);

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Run your own audit
        </Link>

        <ResultsHero result={report} />
        <BenchmarkStrip result={report} />

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
          <ShareReportCard publicSlug={slug} />
          <section className="rounded-md border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-xl font-semibold">Summary</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {report.summary ||
                "This public report shows deterministic audit results based on the submitted AI stack."}
            </p>
          </section>
        </div>

        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Public breakdown</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tools, spend totals, recommendations, and savings. Private lead
                details are not shown.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {report.toolResults.length} recommendation
              {report.toolResults.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid gap-4">
            {report.toolResults.map((toolResult, index) => (
              <ToolResultCard
                key={`${toolResult.tool}-${toolResult.plan}-${index}`}
                result={toolResult}
              />
            ))}
          </div>
        </section>

        <div className="mt-6">
          <MethodologyCard />
        </div>
      </div>
    </main>
  );
}
