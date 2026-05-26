import type { AuditResult } from "@/lib/audit/types";

type PdfPage = string[];

const pageWidth = 612;
const pageHeight = 792;
const margin = 42;
const contentWidth = pageWidth - margin * 2;
const primary = "0.020 0.471 0.431";
const dark = "0.090 0.118 0.180";
const muted = "0.350 0.390 0.450";
const border = "0.830 0.860 0.900";
const soft = "0.965 0.980 0.976";

function money(value: number) {
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function sanitize(text: string) {
  return text
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(text: string) {
  return sanitize(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrap(text: string, maxLength: number) {
  const words = sanitize(text).split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [""];
}

class PdfBuilder {
  pages: PdfPage[] = [[]];
  y = pageHeight - margin;

  private get page() {
    return this.pages[this.pages.length - 1];
  }

  addPage() {
    this.pages.push([]);
    this.y = pageHeight - margin;
  }

  ensure(height: number) {
    if (this.y - height < margin) {
      this.addPage();
    }
  }

  rect(x: number, y: number, width: number, height: number, color: string, stroke = false) {
    this.page.push(`${color} ${stroke ? "RG" : "rg"}`);
    this.page.push(`${x} ${y} ${width} ${height} re ${stroke ? "S" : "f"}`);
  }

  text(
    text: string,
    x: number,
    y: number,
    options: { size?: number; bold?: boolean; color?: string } = {}
  ) {
    const size = options.size || 10;
    const font = options.bold ? "F2" : "F1";
    const color = options.color || dark;
    this.page.push("BT");
    this.page.push(`${color} rg`);
    this.page.push(`/${font} ${size} Tf`);
    this.page.push(`${x} ${y} Td`);
    this.page.push(`(${escapePdfText(text)}) Tj`);
    this.page.push("ET");
  }

  wrapped(
    text: string,
    x: number,
    maxChars: number,
    options: { size?: number; bold?: boolean; color?: string; lineHeight?: number } = {}
  ) {
    const lineHeight = options.lineHeight || 13;
    const lines = wrap(text, maxChars);
    this.ensure(lines.length * lineHeight + 4);
    lines.forEach((line) => {
      this.text(line, x, this.y, options);
      this.y -= lineHeight;
    });
  }

  heading(title: string) {
    this.ensure(34);
    this.y -= 12;
    this.text(title, margin, this.y, { size: 15, bold: true, color: primary });
    this.y -= 12;
    this.rect(margin, this.y, contentWidth, 0.8, border);
    this.y -= 14;
  }

  labelValue(label: string, value: string, x: number, y: number, width: number) {
    this.text(label, x, y + 30, { size: 8, color: muted });
    this.text(value, x, y + 13, { size: 14, bold: true, color: dark });
    this.rect(x - 10, y, width, 50, border, true);
  }
}

function addHeader(pdf: PdfBuilder, result: AuditResult) {
  pdf.rect(0, pageHeight - 128, pageWidth, 128, primary);
  pdf.text("AICostLens", margin, pageHeight - 58, {
    size: 26,
    bold: true,
    color: "1 1 1"
  });
  pdf.text("AI Spend Audit Report", margin, pageHeight - 82, {
    size: 13,
    color: "1 1 1"
  });
  pdf.text(`Audit ${result.id.slice(0, 8)}  |  ${new Date().toISOString().slice(0, 10)}`, margin, pageHeight - 104, {
    size: 9,
    color: "0.850 0.960 0.940"
  });

  pdf.y = pageHeight - 158;
}

function addKpis(pdf: PdfBuilder, result: AuditResult) {
  pdf.ensure(118);
  const gap = 12;
  const cardWidth = (contentWidth - gap * 3) / 4;
  const y = pdf.y - 58;

  pdf.labelValue("Current / mo", money(result.totalMonthlySpend), margin + 10, y, cardWidth);
  pdf.labelValue(
    "Recommended / mo",
    money(result.totalRecommendedMonthlySpend),
    margin + cardWidth + gap + 10,
    y,
    cardWidth
  );
  pdf.labelValue(
    "Monthly savings",
    money(result.totalMonthlySavings),
    margin + (cardWidth + gap) * 2 + 10,
    y,
    cardWidth
  );
  pdf.labelValue(
    "Annual savings",
    money(result.totalAnnualSavings),
    margin + (cardWidth + gap) * 3 + 10,
    y,
    cardWidth
  );

  pdf.y = y - 22;
  pdf.rect(margin, pdf.y - 52, contentWidth, 52, soft);
  pdf.wrapped(result.overallVerdict, margin + 14, 92, {
    size: 10,
    lineHeight: 13,
    color: dark
  });
  pdf.y -= 8;
}

function addSummary(pdf: PdfBuilder, result: AuditResult) {
  if (!result.summary) {
    return;
  }

  pdf.heading("Personalized Summary");
  pdf.wrapped(result.summary, margin, 98, { size: 10, color: dark, lineHeight: 14 });
}

function addInputs(pdf: PdfBuilder, result: AuditResult) {
  pdf.heading("Audit Inputs");
  pdf.text(`Team size: ${result.input.teamSize}`, margin, pdf.y, { size: 10 });
  pdf.text(`Primary use case: ${result.input.primaryUseCase}`, margin + 170, pdf.y, {
    size: 10
  });
  pdf.text(`Tools reviewed: ${result.toolResults.length}`, margin + 370, pdf.y, {
    size: 10
  });
  pdf.y -= 18;
}

function addRecommendations(pdf: PdfBuilder, result: AuditResult) {
  pdf.heading("Recommendations");

  result.toolResults.forEach((tool, index) => {
    const minHeight = 132 + tool.evidence.length * 14 + tool.assumptions.length * 13;
    pdf.ensure(Math.min(minHeight, 260));

    const startY = pdf.y;
    pdf.rect(margin, startY - 28, contentWidth, 28, soft);
    pdf.text(`${index + 1}. ${tool.tool} - ${tool.plan}`, margin + 12, startY - 18, {
      size: 12,
      bold: true,
      color: dark
    });
    pdf.text(`${tool.confidence} confidence`, pageWidth - margin - 112, startY - 18, {
      size: 9,
      color: primary
    });
    pdf.y -= 44;

    const metricY = pdf.y - 42;
    const metricWidth = (contentWidth - 24) / 3;
    pdf.labelValue("Current", `${money(tool.currentMonthlySpend)}/mo`, margin + 10, metricY, metricWidth);
    pdf.labelValue(
      "Recommended",
      `${money(tool.recommendedMonthlySpend)}/mo`,
      margin + metricWidth + 12 + 10,
      metricY,
      metricWidth
    );
    pdf.labelValue(
      "Savings",
      `${money(tool.monthlySavings)}/mo`,
      margin + (metricWidth + 12) * 2 + 10,
      metricY,
      metricWidth
    );
    pdf.y = metricY - 18;

    pdf.wrapped(tool.recommendedAction, margin + 10, 88, {
      size: 10,
      bold: true,
      lineHeight: 13
    });
    pdf.wrapped(tool.reason, margin + 10, 92, { size: 9, color: muted, lineHeight: 12 });

    if (tool.evidence.length) {
      pdf.text("Evidence", margin + 10, pdf.y - 4, { size: 9, bold: true, color: primary });
      pdf.y -= 18;
      tool.evidence.forEach((item) => {
        pdf.wrapped(`${item.label}: ${item.value}`, margin + 18, 86, {
          size: 8.5,
          color: dark,
          lineHeight: 11
        });
      });
    }

    if (tool.assumptions.length) {
      pdf.text("Assumptions", margin + 10, pdf.y - 4, {
        size: 9,
        bold: true,
        color: primary
      });
      pdf.y -= 18;
      tool.assumptions.forEach((assumption) => {
        pdf.wrapped(`- ${assumption}`, margin + 18, 86, {
          size: 8.5,
          color: muted,
          lineHeight: 11
        });
      });
    }

    pdf.y -= 14;
  });
}

function addMethodology(pdf: PdfBuilder) {
  pdf.heading("Methodology");
  pdf.wrapped(
    "Savings are calculated by deterministic rules using submitted spend, seats, team size, official pricing benchmarks, duplicate-tool signals, and credit-fit assumptions. The AI summary does not calculate savings.",
    margin,
    98,
    { size: 9, color: dark, lineHeight: 13 }
  );
  pdf.wrapped(
    "Public reports exclude email, company, role, and private lead details. Actual savings depend on vendor pricing, contract terms, taxes, currency, usage, and credit eligibility.",
    margin,
    98,
    { size: 9, color: muted, lineHeight: 13 }
  );
}

function objectEntry(id: number, body: string) {
  return `${id} 0 obj\n${body}\nendobj\n`;
}

export function generateAuditReportPdf(result: AuditResult) {
  const pdf = new PdfBuilder();

  addHeader(pdf, result);
  addKpis(pdf, result);
  addSummary(pdf, result);
  addInputs(pdf, result);
  addRecommendations(pdf, result);
  addMethodology(pdf);

  const objects: string[] = [];
  const pageObjectIds = pdf.pages.map((_, index) => 5 + index * 2);
  const contentObjectIds = pdf.pages.map((_, index) => 6 + index * 2);

  objects.push(objectEntry(1, "<< /Type /Catalog /Pages 2 0 R >>"));
  objects.push(
    objectEntry(
      2,
      `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pdf.pages.length} >>`
    )
  );
  objects.push(objectEntry(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"));
  objects.push(objectEntry(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"));

  pdf.pages.forEach((commands, index) => {
    const stream = commands.join("\n");
    const pageId = pageObjectIds[index];
    const contentId = contentObjectIds[index];

    objects.push(
      objectEntry(
        pageId,
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`
      )
    );
    objects.push(
      objectEntry(
        contentId,
        `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`
      )
    );
  });

  let output = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(output, "utf8"));
    output += object;
  });

  const xrefOffset = Buffer.byteLength(output, "utf8");
  output += `xref\n0 ${objects.length + 1}\n`;
  output += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    output += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  output += `startxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(output, "utf8");
}
