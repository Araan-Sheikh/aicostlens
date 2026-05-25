"use client";

import { ChevronDown, MailCheck } from "lucide-react";
import { useState } from "react";
import type { AuditResult } from "@/lib/audit/types";

type LeadCaptureFormProps = {
  result: AuditResult;
};

export function LeadCaptureForm({ result }: LeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);

  async function onSubmit(formData: FormData) {
    setStatus("submitting");
    setMessage(null);

    const teamSizeValue = formData.get("teamSize")?.toString();
    const payload = {
      auditId: result.id,
      email: formData.get("email")?.toString() || "",
      companyName: formData.get("companyName")?.toString() || "",
      role: formData.get("role")?.toString() || "",
      teamSize: teamSizeValue ? Number(teamSizeValue) : undefined,
      totalMonthlySavings: result.totalMonthlySavings,
      totalAnnualSavings: result.totalAnnualSavings,
      credexQualified: result.credexQualified,
      shareUrl:
        typeof window !== "undefined" && result.publicSlug
          ? `${window.location.origin}/report/${result.publicSlug}`
          : typeof window !== "undefined"
            ? window.location.href
            : "",
      website: formData.get("website")?.toString() || ""
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Lead capture failed");
      }

      const body = (await response.json()) as {
        stored?: boolean;
        emailSent?: boolean;
        storageError?: string | null;
        emailError?: string | null;
      };
      setStatus("success");
      if (body.stored && body.emailSent) {
        setMessage("Report saved. Check your email for the confirmation link.");
      } else if (body.stored) {
        setMessage(
          `Report saved. Email was not sent yet${
            body.emailError ? `: ${body.emailError}` : "."
          }`
        );
      } else if (body.emailSent) {
        setMessage(
          `Email sent, but database storage failed${
            body.storageError ? `: ${body.storageError}` : "."
          }`
        );
      } else {
        setMessage(
          `Could not store or email this report${
            body.storageError ? `: ${body.storageError}` : "."
          }`
        );
      }
    } catch {
      setStatus("error");
      setMessage("Could not save the report yet. Please try again.");
    }
  }

  return (
    <form
      id="lead-capture"
      action={onSubmit}
      className="scroll-mt-6 rounded-md border bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <MailCheck className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Save this report</h2>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Send yourself the report link and follow-up recommendations.
      </p>

      <div className="mt-5 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              id="lead-email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              className="h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting"
              ? "Saving..."
              : status === "success"
                ? "Saved"
                : "Save report"}
          </button>
        </div>

        <div className="rounded-md border bg-background">
          <button
            type="button"
            onClick={() => setShowOptionalDetails((current) => !current)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            aria-expanded={showOptionalDetails}
          >
            <span>
              <span className="block text-sm font-medium">Optional details</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Help Credex route high-savings reports to the right context.
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition ${
                showOptionalDetails ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows] duration-200 ${
              showOptionalDetails ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid gap-3 border-t px-4 py-4 sm:grid-cols-3">
                <label className="grid gap-2 text-sm font-medium">
                  Company
                  <input
                    name="companyName"
                    type="text"
                    placeholder="Acme AI"
                    className="h-10 rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Role
                  <input
                    name="role"
                    type="text"
                    placeholder="Founder, CTO..."
                    className="h-10 rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Team size
                  <input
                    name="teamSize"
                    type="number"
                    min="1"
                    defaultValue={result.input.teamSize}
                    className="h-10 rounded-md border bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {message ? (
        <p
          className={`mt-3 rounded-md border px-3 py-2 text-sm ${
            status === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-primary/25 bg-primary/10 text-primary"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
