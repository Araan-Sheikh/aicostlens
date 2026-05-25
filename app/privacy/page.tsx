import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AICostLens",
  description: "How AICostLens handles audit inputs, saved reports, and lead details."
};

const sections = [
  {
    title: "What We Collect",
    body:
      "AICostLens collects the AI tools, plans, monthly spend, seats, team size, and use case you enter into the audit form. If you save a report, we also collect the email address you provide and optional company, role, and team-size details. We do not ask for passwords, payment details, or direct access to your vendor accounts."
  },
  {
    title: "How We Use It",
    body:
      "We use audit inputs to calculate savings estimates, generate a personalized summary, create a shareable report URL, send the report confirmation email, and identify cases where a Credex consultation may be useful. We may also review aggregated, non-identifying patterns to improve the audit rules and pricing coverage."
  },
  {
    title: "Public Reports",
    body:
      "Public report links are designed to remove identifying lead details such as email, company name, and role. They can still show the tool stack, savings numbers, and recommendation reasoning, so you should only share a report link if you are comfortable with those details being visible."
  },
  {
    title: "Service Providers",
    body:
      "AICostLens uses Supabase for audit and lead storage, Resend for transactional email, and Gemini for optional AI-generated summary text. These providers process data only so the product can function. We do not sell personal information."
  },
  {
    title: "Retention And Deletion",
    body:
      "Saved audits and lead records are retained so report links and follow-up emails continue to work. To request deletion or correction, contact info@aicostlens.shop with the email used to save the report."
  }
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 lg:px-8">
      <Link className="text-sm font-medium text-primary hover:underline" href="/">
        Back to audit
      </Link>

      <section className="mt-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Last updated May 25, 2026
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          This policy explains how AICostLens handles the information needed to run an AI spend
          audit, save a report, and follow up on high-savings opportunities.
        </p>
      </section>

      <div className="mt-10 grid gap-5">
        {sections.map((section) => (
          <section key={section.title} className="rounded-lg border border-border bg-white p-6">
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-6">
        <h2 className="text-xl font-semibold text-foreground">Important Note</h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          AICostLens is an assignment-stage product, so the privacy model is intentionally narrow:
          collect only what is needed after the audit value is shown, avoid sensitive billing
          credentials, and keep public reports stripped of lead identity.
        </p>
      </section>
    </main>
  );
}
