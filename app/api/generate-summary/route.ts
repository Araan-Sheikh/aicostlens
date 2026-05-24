import { NextResponse } from "next/server";
import { generateAuditSummary } from "@/lib/ai/summary";
import type { AuditResult } from "@/lib/audit/types";

export async function POST(request: Request) {
  try {
    const result = (await request.json()) as AuditResult;
    const summary = await generateAuditSummary(result);

    return NextResponse.json(summary);
  } catch {
    return NextResponse.json(
      { error: "Unable to generate summary" },
      { status: 400 }
    );
  }
}
