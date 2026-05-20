import { AuditForm } from "@/components/audit/AuditForm";
import { FAQ } from "@/components/landing/FAQ";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <HowItWorks />
        <AuditForm />
      </section>
      <FAQ />
    </main>
  );
}
