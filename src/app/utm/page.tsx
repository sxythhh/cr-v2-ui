"use client";
import { PageShell } from "@/components/page-shell";

const TEMPLATES = [
  { id: 1, name: "Newsletter", source: "email", medium: "newsletter", campaign: "weekly-digest" },
  { id: 2, name: "Twitter Organic", source: "twitter", medium: "social", campaign: "organic" },
  { id: 3, name: "Google Ads", source: "google", medium: "cpc", campaign: "brand-search" },
];

export default function UTMPage() {
  return (
    <PageShell title="UTM Templates" description="Save and reuse UTM parameter templates.">
      <div className="mt-4 flex justify-end">
        <button className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-page-bg transition-colors hover:bg-foreground/90 active:scale-[0.98]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          New template
        </button>
      </div>
      <div className="mt-4 divide-y divide-border rounded-lg border border-border">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="px-4 py-3 transition-colors hover:bg-accent">
            <div className="text-sm font-medium text-foreground">{t.name}</div>
            <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
              <span>source={t.source}</span>
              <span>medium={t.medium}</span>
              <span>campaign={t.campaign}</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
