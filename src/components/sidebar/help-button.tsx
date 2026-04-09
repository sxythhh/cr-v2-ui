import Link from "next/link";

export function HelpButton() {
  return (
    <Link
      href="/help"
      className="flex size-11 shrink-0 items-center justify-center rounded-2xl text-foreground hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 17h.01"/><path d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0-3-4"/></svg>
    </Link>
  );
}
