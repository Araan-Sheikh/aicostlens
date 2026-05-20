const faqs = [
  {
    question: "Do I need to connect billing accounts?",
    answer: "No. The first version uses self-reported spend, seats, and plans."
  },
  {
    question: "Will you ask for email first?",
    answer: "No. You see the audit first. Email is only needed to save the report."
  },
  {
    question: "How are savings calculated?",
    answer: "Savings come from deterministic pricing and plan-fit rules, not AI guesses."
  }
];

export function FAQ() {
  return (
    <section className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
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
