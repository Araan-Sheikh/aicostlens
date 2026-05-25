import { ArrowRight, Sparkles } from "lucide-react";

const tools = ["Cursor", "Claude", "ChatGPT", "Copilot", "Gemini", "Windsurf"];

const proof = [
  {
    quote:
      "Found $1,240/month in duplicate AI tooling across our engineering team.",
    person: "Mocked feedback, seed-stage CTO"
  },
  {
    quote:
      "The useful part was not just the savings number. It explained which tools overlapped.",
    person: "Mocked feedback, startup engineering lead"
  }
];

export function Hero() {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_0.75fr] lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
            Find hidden waste in your AI stack.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Audit Cursor, Claude, ChatGPT, Copilot, Gemini, and API spend in under
            two minutes. See savings before sharing your email.
          </p>
          <a
            href="#audit-form"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Run free audit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className="grid content-center gap-3">
          <p className="text-sm font-medium uppercase text-muted-foreground">
            Tools supported
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool}
                className="rounded-md border bg-background px-4 py-3 text-sm font-medium"
              >
                {tool}
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            {proof.map((item) => (
              <figure key={item.quote} className="rounded-md border bg-background p-4">
                <blockquote className="text-sm leading-6 text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-2 text-xs font-medium uppercase text-muted-foreground">
                  {item.person}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
