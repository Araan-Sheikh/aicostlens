const faqs = [
  {
    question: "Do I need to connect billing accounts?",
    answer:
      "No. The MVP uses self-reported spend, seats, plans, team size, and use case, so you do not need to share sensitive billing access."
  },
  {
    question: "Will you ask for email first?",
    answer:
      "No. You see the audit first. Email is only used after the report is generated so you can save the result and receive the link."
  },
  {
    question: "How are savings calculated?",
    answer:
      "Savings are calculated with deterministic pricing, seat cleanup, plan-fit, overlap, and credit-opportunity rules. The AI summary does not calculate savings."
  },
  {
    question: "What if the audit finds more than $500/month in savings?",
    answer:
      "The report highlights Credex as a strong fit for discounted AI infrastructure credits and prompts you to save the report for follow-up."
  },
  {
    question: "Can I share the report publicly?",
    answer:
      "Yes. Public reports show tools, spend totals, savings, and recommendations. Email, company, role, and private lead details are not shown."
  }
];

export function FAQ() {
  return (
    <section className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-md border bg-background p-5">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
