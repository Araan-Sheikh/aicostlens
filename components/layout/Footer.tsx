import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>AICostLens audits AI spend after value is shown, with no login required.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-4">
          <Link className="font-medium text-foreground hover:text-primary" href="/privacy">
            Privacy
          </Link>
          <Link className="font-medium text-foreground hover:text-primary" href="/terms">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
