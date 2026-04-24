"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { Tabs, TabItem } from "@/components/ui/tabs";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { Icon } from "@/components/scope/icon";
import { cn } from "@/lib/utils";

type Route = { label: string; href: string; match: (p: string) => boolean };

const PRIMARY: Route[] = [
  { label: "Home", href: "/tools", match: (p) => p === "/tools" },
  { label: "Feed", href: "/tools/feed", match: (p) => p.startsWith("/tools/feed") },
  { label: "Competitors", href: "/tools/competitors", match: (p) => p.startsWith("/tools/competitors") },
  { label: "Radar", href: "/tools/radar", match: (p) => p.startsWith("/tools/radar") },
];

const MORE: { label: string; href: string; description: string; match: (p: string) => boolean }[] = [
  { label: "Swipe", href: "/tools/swipe", description: "Boards + creative briefs", match: (p) => p.startsWith("/tools/swipe") },
  { label: "Alerts", href: "/tools/alerts", description: "Inbox, rules & delivery", match: (p) => p.startsWith("/tools/alerts") },
  { label: "Explore", href: "/tools/explore", description: "Search indexed posts", match: (p) => p.startsWith("/tools/explore") },
  { label: "Settings", href: "/tools/settings", description: "Workspace preferences", match: (p) => p.startsWith("/tools/settings") },
];

export function ScopeTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const primaryIdx = PRIMARY.findIndex((r) => r.match(pathname));
  const moreActive = MORE.some((m) => m.match(pathname));
  const activeMore = MORE.find((m) => m.match(pathname));

  // If we're in a More route, force selectedIndex to -1 (no highlight) by using a sentinel
  const selectedIndex = useMemo(() => (primaryIdx === -1 ? -1 : primaryIdx), [primaryIdx]);

  return (
    <div className="sticky top-14 z-20 -mx-4 -mt-5 border-b border-foreground/[0.06] bg-page-bg/95 px-4 backdrop-blur dark:border-[rgba(224,224,224,0.03)] sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-2 py-2">
        <Tabs
          variant="contained"
          selectedIndex={selectedIndex}
          onSelect={(idx) => {
            const route = PRIMARY[idx];
            if (route) router.push(route.href);
          }}
        >
          {PRIMARY.map((route, i) => (
            <TabItem key={route.href} index={i} label={route.label} />
          ))}
        </Tabs>

        <Popover placement="bottom-start">
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-[10px] px-3 font-[family-name:var(--font-inter)] text-sm tracking-[-0.02em] transition-colors",
                moreActive
                  ? "bg-scope-accent/10 text-page-text"
                  : "text-page-text-muted hover:bg-foreground/[0.04] hover:text-page-text",
              )}
            >
              {moreActive && activeMore ? activeMore.label : "More"}
              <Icon name="chevron-down" size={12} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] rounded-xl border border-foreground/[0.06] bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          >
            <div className="flex flex-col">
              {MORE.map((m) => {
                const active = m.match(pathname);
                return (
                  <PopoverClose asChild key={m.href}>
                    <button
                      type="button"
                      onClick={() => router.push(m.href)}
                      className={cn(
                        "flex flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-foreground/[0.04]",
                        active && "bg-scope-accent/10",
                      )}
                    >
                      <span className="font-[family-name:var(--font-inter)] text-sm font-medium text-page-text">
                        {m.label}
                      </span>
                      <span className="font-[family-name:var(--font-inter)] text-xs text-page-text-subtle">
                        {m.description}
                      </span>
                    </button>
                  </PopoverClose>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
