"use client";

import type { NotionPageSummary } from "@/hooks/use-notion-workspace";

export function NotionBreadcrumb({
  trail,
  onNavigate,
}: {
  trail: NotionPageSummary[];
  onNavigate: (id: string) => void;
}) {
  if (trail.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-[12px]">
      {trail.map((page, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={page.id} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white/20">
                <path d="M4.5 2.5L8 6l-4.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {isLast ? (
              <span className="font-medium text-white/60">{page.icon ? `${page.icon} ` : ""}{page.title}</span>
            ) : (
              <button
                onClick={() => onNavigate(page.id)}
                className="text-white/35 transition-colors hover:text-white/60"
              >
                {page.icon ? `${page.icon} ` : ""}{page.title}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
