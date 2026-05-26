import { NextResponse } from "next/server";
import { getPublicAuditResult } from "@/lib/audit/public-report";
import { generateAuditReportPdf } from "@/lib/pdf/report-pdf";

type PdfRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: PdfRouteProps) {
  const { slug } = await params;
  const report = await getPublicAuditResult(slug);

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const pdf = generateAuditReportPdf(report);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="aicostlens-${slug}.pdf"`,
      "Cache-Control": "private, max-age=0, must-revalidate"
    }
  });
}
