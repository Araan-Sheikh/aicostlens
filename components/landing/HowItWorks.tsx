import { Calculator, MailCheck, Share2 } from "lucide-react";

const steps = [
  {
    title: "Enter current spend",
    copy: "Add the tools, plans, seats, and monthly cost your team pays today.",
    icon: Calculator
  },
  {
    title: "Get the audit",
    copy: "Deterministic rules compare plan fit, duplicate seats, alternatives, and credit opportunities.",
    icon: MailCheck
  },
  {
    title: "Save and share",
    copy: "Capture the report by email and share a public URL with private details removed.",
    icon: Share2
  }
];

export function HowItWorks() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="mt-2 text-muted-foreground">
          AICostLens is designed for founders, CTOs, and engineering managers who
          want a fast second opinion on AI tool spend.
        </p>
      </div>
      <div className="grid gap-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-md border bg-white p-5">
            <step.icon className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.copy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
