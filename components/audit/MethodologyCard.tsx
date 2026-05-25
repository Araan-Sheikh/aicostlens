import { FileCheck2 } from "lucide-react";

export function MethodologyCard() {
  return (
    <section className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <FileCheck2 className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-semibold">How this audit is calculated</h2>
      </div>
      <div className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
        <p>
          Savings are calculated by deterministic rules, not by the AI summary.
          The engine checks plan fit, paid seats versus team size, duplicate
          coding assistants, listed-price overspend, and high API spend that may
          qualify for credit-based purchasing.
        </p>
        <p>
          Pricing benchmarks come from official vendor pricing pages checked for
          this submission. If a vendor price is unclear, custom, or usage-based,
          the engine avoids pretending it has exact savings.
        </p>
      </div>
    </section>
  );
}
