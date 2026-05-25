"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

type ShareReportCardProps = {
  publicSlug?: string;
};

export function ShareReportCard({ publicSlug }: ShareReportCardProps) {
  const [origin, setOrigin] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!publicSlug) {
    return null;
  }

  const shareUrl = `${origin || process.env.NEXT_PUBLIC_APP_URL || ""}/report/${publicSlug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <section className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Share report</h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        This public link hides email, company, role, and private lead details.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <input
          readOnly
          value={shareUrl}
          className="h-10 min-w-0 rounded-md border bg-background px-3 text-sm text-muted-foreground"
          aria-label="Public report link"
        />
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition hover:bg-background"
        >
          {copyState === "copied" ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {copyState === "copied"
            ? "Copied"
            : copyState === "failed"
              ? "Select link"
              : "Copy link"}
        </button>
      </div>
    </section>
  );
}
