"use client";

import { FileDown } from "lucide-react";

type ExportPdfButtonProps = {
  href?: string;
};

export function ExportPdfButton({ href }: ExportPdfButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-background print:hidden"
      >
        <FileDown className="h-4 w-4" aria-hidden="true" />
        Download PDF
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-background print:hidden"
    >
      <FileDown className="h-4 w-4" aria-hidden="true" />
      Export full report PDF
    </button>
  );
}
