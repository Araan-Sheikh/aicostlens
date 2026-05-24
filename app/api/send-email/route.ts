import { NextResponse } from "next/server";
import { z } from "zod";
import { sendAuditEmail } from "@/lib/email/resend";

const sendEmailSchema = z.object({
  email: z.email(),
  shareUrl: z.url(),
  totalMonthlySavings: z.number().min(0),
  totalAnnualSavings: z.number().min(0),
  credexQualified: z.boolean()
});

export async function POST(request: Request) {
  const parsed = sendEmailSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const result = await sendAuditEmail(parsed.data);

  return NextResponse.json(result);
}
