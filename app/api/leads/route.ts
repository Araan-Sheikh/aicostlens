import { NextResponse } from "next/server";
import { z } from "zod";
import { sendAuditEmail } from "@/lib/email/resend";
import { getSupabaseAdmin } from "@/lib/db/supabase";

const leadSchema = z.object({
  auditId: z.string().min(1),
  email: z.email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().int().min(1).optional(),
  totalMonthlySavings: z.number().min(0),
  totalAnnualSavings: z.number().min(0),
  credexQualified: z.boolean(),
  shareUrl: z.url(),
  website: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid lead input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({
      ok: true,
      stored: false,
      emailSent: false
    });
  }

  let stored = false;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("leads").insert({
      audit_id: parsed.data.auditId,
      email: parsed.data.email,
      company_name: parsed.data.companyName || null,
      role: parsed.data.role || null,
      team_size: parsed.data.teamSize || null,
      total_monthly_savings: parsed.data.totalMonthlySavings,
      credex_qualified: parsed.data.credexQualified,
      source: "ai-spend-audit"
    });

    stored = !error;
  }

  const emailResult = await sendAuditEmail({
    email: parsed.data.email,
    shareUrl: parsed.data.shareUrl,
    totalMonthlySavings: parsed.data.totalMonthlySavings,
    totalAnnualSavings: parsed.data.totalAnnualSavings,
    credexQualified: parsed.data.credexQualified
  });

  return NextResponse.json({
    ok: true,
    stored,
    emailSent: emailResult.sent
  });
}
