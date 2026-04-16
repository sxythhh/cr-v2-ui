"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/showcase", label: "Dashboard" },
  { href: "/showcase/insights", label: "Insights" },
  { href: "/showcase/configure", label: "Configure" },
] as const;

/**
 * Showcase layout — standalone (no sidebar), with a minimal top nav
 * to switch between creator views and configure page.
 */
export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-page-bg font-inter tracking-[-0.02em]">
      {/* Minimal top bar */}
      <nav className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-foreground/[0.06] bg-page-bg px-4 dark:border-foreground/[0.08] sm:px-6">
        <span className="text-sm font-semibold tracking-[-0.02em] text-page-text">
          Content Rewards
        </span>
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium tracking-[-0.02em] transition-colors",
                  isActive
                    ? "bg-foreground/[0.08] text-page-text"
                    : "text-page-text-muted hover:bg-foreground/[0.04] hover:text-page-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
