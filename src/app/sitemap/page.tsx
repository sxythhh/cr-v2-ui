"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  {
    title: "Main",
    routes: [
      { path: "/", label: "Home" },
      { path: "/campaigns", label: "Campaigns" },
      { path: "/submissions", label: "Submissions" },
      { path: "/creators", label: "Creators" },
      { path: "/payouts", label: "Payouts" },
      { path: "/stories", label: "Stories" },
      { path: "/analytics", label: "Insights" },
      { path: "/finances", label: "Finance" },
      { path: "/notifications", label: "Notifications" },
      { path: "/contracts", label: "Contracts" },
      { path: "/messages", label: "Messages" },
    ],
  },
  {
    title: "Settings",
    routes: [
      { path: "/settings", label: "Settings" },
    ],
  },
  {
    title: "Creator",
    routes: [
      { path: "/creator", label: "Creator Home" },
      { path: "/onboard-creator", label: "Creator Onboarding" },
      { path: "/applications", label: "Applications" },
      { path: "/ranks", label: "Ranks" },
    ],
  },
  {
    title: "Support",
    routes: [
      { path: "/help", label: "Help Center" },
      { path: "/support", label: "Support (Legacy)" },
      { path: "/academy", label: "Academy" },
    ],
  },
  {
    title: "Marketing",
    routes: [
      { path: "/lander", label: "Lander" },
      { path: "/product-lander", label: "Product Lander" },
      { path: "/case-studies", label: "Case Studies" },
      { path: "/verified-agency", label: "Verified Agencies" },
      { path: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Dev",
    routes: [
      { path: "/forms-demo", label: "Forms Demo" },
      { path: "/kitchen-sink", label: "Kitchen Sink" },
      { path: "/analytics-poc", label: "Analytics POC" },
      { path: "/sitemap", label: "Sitemap" },
    ],
  },
];

export default function SitemapPage() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-page-bg px-5">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Sitemap</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none" }}>
        <div className="mx-auto max-w-[800px]">
          <p className="mb-6 font-inter text-[13px] tracking-[-0.02em] text-page-text-muted">
            All pages in the app. {SECTIONS.reduce((n, s) => n + s.routes.length, 0)} routes total.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <span className="font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">
                  {section.title}
                </span>
                <div className="flex flex-col gap-0.5">
                  {section.routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 font-inter text-[13px] font-medium tracking-[-0.02em] transition-colors ${
                        pathname === route.path
                          ? "bg-foreground/[0.06] text-page-text"
                          : "text-page-text-subtle hover:bg-foreground/[0.03] hover:text-page-text"
                      }`}
                    >
                      <span className="flex-1">{route.label}</span>
                      <svg
                        width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                        className="shrink-0 opacity-0 transition-opacity group-hover:opacity-40"
                      >
                        <path d="M6 4l4 4-4 4" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
