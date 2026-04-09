"use client";
import { PageShell } from "@/components/page-shell";

const DOMAINS = [
  { id: 1, domain: "dub.sh", status: "active", links: 47 },
  { id: 2, domain: "acme.link", status: "active", links: 12 },
  { id: 3, domain: "go.acme.com", status: "pending", links: 0 },
];

export default function DomainsPage() {
  return (
    <PageShell title="Domains" description="Manage your custom domains for short links.">
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-page-bg transition-colors hover:bg-foreground/90 active:scale-[0.98]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add domain
        </button>
      </div>
      <div className="mt-4 divide-y divide-border rounded-lg border border-border">
        {DOMAINS.map((d) => (
          <div key={d.id} className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-accent">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>
              <span className="text-sm font-medium text-foreground">{d.domain}</span>
              {d.status === "active" ? (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10-10"/></svg> Verified
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                  Pending
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{d.links} links</span>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
