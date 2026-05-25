import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAuditSummary } from "@/lib/ai/summary";
import { runAudit } from "@/lib/audit/engine";
import { auditFormSchema } from "@/lib/audit/form-schema";
import type { AuditInput } from "@/lib/audit/types";
import { getSupabaseAdmin } from "@/lib/db/supabase";

const auditRequestSchema = z.object({
  input: auditFormSchema
});

function createPublicSlug() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 8);
  }

  return `r${Date.now()}`;
}

export async function POST(request: Request) {
  const parsed = auditRequestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid audit input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const auditInput: AuditInput = {
    teamSize: parsed.data.input.teamSize,
    primaryUseCase: parsed.data.input.primaryUseCase,
    tools: parsed.data.input.tools.map((tool, index) => ({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `tool_${index}`,
      ...tool
    }))
  };
  const result = runAudit(auditInput);
  const summaryResult = await generateAuditSummary(result);
  let publicSlug: string | undefined;
  let resultWithSummary = {
    ...result,
    summary: summaryResult.summary
  };

  let stored = false;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    publicSlug = createPublicSlug();
    resultWithSummary = {
      ...resultWithSummary,
      publicSlug
    };

    const { error } = await supabase.from("audits").insert({
      id: result.id,
      input: auditInput,
      result: resultWithSummary,
      summary: summaryResult.summary,
      public_slug: publicSlug
    });

    stored = !error;

    if (!stored) {
      publicSlug = undefined;
      resultWithSummary = {
        ...result,
        summary: summaryResult.summary
      };
    }
  }

  return NextResponse.json({
    result: resultWithSummary,
    summary: summaryResult.summary,
    publicSlug,
    summaryProvider: summaryResult.provider,
    summaryUsedFallback: summaryResult.usedFallback,
    stored
  });
}
