"use client";

import Link from "next/link";

export function ReferButton() {
  return (
    <Link
      href="/account/settings/referrals"
      className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-foreground transition-colors duration-150 hover:bg-accent active:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8m0 1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>
    </Link>
  );
}
