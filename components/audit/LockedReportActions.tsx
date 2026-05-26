import { FileDown, LockKeyhole, Share2 } from "lucide-react";

export function LockedReportActions() {
  return (
    <section className="rounded-md border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <LockKeyhole className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-xl font-semibold">Save to unlock report actions</h2>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        The full audit is visible now. Save it by email to unlock the public share link
        and PDF download.
      </p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-muted-foreground">
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Public share URL
        </div>
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-muted-foreground">
          <FileDown className="h-4 w-4" aria-hidden="true" />
          PDF report
        </div>
      </div>
    </section>
  );
}
