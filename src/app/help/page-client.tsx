"use client";

import Link from "next/link";
import { DubNav } from "@/components/lander/dub-nav";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const CATEGORIES = [
  {
    title: "Getting Started",
    description: "Learn the basics and set up your account.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    articles: ["Creating your account", "Setting up your workspace", "Inviting team members", "Platform overview"],
    href: "/academy",
  },
  {
    title: "Campaigns",
    description: "Create, manage, and track campaigns.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    articles: ["Creating a campaign", "Setting budgets", "Tracking performance", "Campaign templates"],
    href: "/academy",
  },
  {
    title: "Creators & Affiliates",
    description: "Manage creator relationships and payouts.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    articles: ["Finding creators", "Managing submissions", "Approval workflows", "Payout setup"],
    href: "/academy",
  },
  {
    title: "Analytics & Reports",
    description: "Understand your data and measure ROI.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    articles: ["Dashboard overview", "Custom reports", "Export data", "Attribution models"],
    href: "/academy",
  },
  {
    title: "Billing & Plans",
    description: "Manage subscriptions, invoices, and payments.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 10h22" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
    articles: ["Upgrading your plan", "Managing payment methods", "Invoices & receipts", "Cancellation policy"],
    href: "/academy",
  },
  {
    title: "Integrations",
    description: "Connect with your favorite tools.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    articles: ["Zapier integration", "API overview", "Webhooks", "Shopify connection"],
    href: "/academy",
  },
];

const POPULAR_ARTICLES = [
  "How does CPM work?",
  "How do I request a payout?",
  "Why was my submission rejected?",
  "How to set up auto-payouts",
  "Understanding campaign metrics",
  "Creator verification process",
];

export function HelpCenterLanding() {
  const [search, setSearch] = useState("");
  const { darkMode } = useTheme();

  return (
    <div className="help-root min-h-screen bg-page-bg font-inter text-foreground">
      <style>{`
        html:has(.help-root), html:has(.help-root) body, .help-root, .help-root * {
          scrollbar-width: none !important; -ms-overflow-style: none !important;
        }
        html:has(.help-root)::-webkit-scrollbar, html:has(.help-root) body::-webkit-scrollbar,
        .help-root::-webkit-scrollbar, .help-root *::-webkit-scrollbar { display: none !important; }
      `}</style>
      <DubNav theme={darkMode ? "dark" : "light"} />

      {/* Hero */}
      <div className="bg-card-bg pb-16 pt-20">
        <div className="mx-auto max-w-[720px] px-4 text-center">
          <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.84px] text-page-text sm:text-[52px] sm:leading-[60px]">
            How can we help?
          </h1>
          <p className="mt-4 text-[18px] font-medium leading-[26px] tracking-[-0.18px] text-page-text-muted">
            Search our knowledge base or browse categories below.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 flex max-w-[560px] items-center gap-3 rounded-xl border border-border bg-card-bg px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-muted-foreground">
              <path d="M9.167 15.833a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333ZM17.5 17.5l-3.625-3.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for articles, guides, and more..."
              className="flex-1 bg-transparent text-[16px] font-medium text-page-text outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1">
              <kbd className="flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-border px-1 text-xs font-semibold text-muted-foreground" style={{ borderBottomWidth: 2 }}>
                ⌘
              </kbd>
              <kbd className="flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-border px-1 text-xs font-medium text-muted-foreground" style={{ borderBottomWidth: 2 }}>
                K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mx-auto max-w-[1100px] px-4 py-16">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group flex flex-col rounded-2xl border border-border bg-card-bg p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
                {cat.icon}
              </div>
              <h3 className="mt-4 text-[16px] font-semibold leading-[22px] tracking-[-0.16px] text-page-text">
                {cat.title}
              </h3>
              <p className="mt-1.5 text-[14px] font-medium leading-[20px] text-page-text-muted">
                {cat.description}
              </p>
              <ul className="mt-4 space-y-1.5">
                {cat.articles.map((article) => (
                  <li key={article} className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors group-hover:text-page-text-muted">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {article}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="border-t border-border bg-card-bg py-16">
        <div className="mx-auto max-w-[1100px] px-4">
          <h2 className="text-center text-[28px] font-semibold leading-[36px] tracking-[-0.32px] text-page-text">
            Popular articles
          </h2>
          <div className="mx-auto mt-8 grid max-w-[720px] grid-cols-1 gap-3 sm:grid-cols-2">
            {POPULAR_ARTICLES.map((article) => (
              <Link
                key={article}
                href="/academy"
                className="flex items-center gap-3 rounded-xl border border-border bg-page-bg px-4 py-3.5 text-[14px] font-medium text-page-text-muted transition-all hover:text-page-text hover:shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#FF7A00]">
                  <path d="M2 4C2 2.9 2.9 2 4 2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4Z" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M5.5 5.5h5M5.5 8h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {article}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Academy CTA */}
      <div className="py-16">
        <div className="mx-auto max-w-[640px] px-4 text-center">
          <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.32px] text-page-text">
            Want to go deeper?
          </h2>
          <p className="mt-2 text-[16px] font-medium text-page-text-muted">
            Our Academy has step-by-step video courses to master every feature.
          </p>
          <Link
            href="/academy"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-semibold text-background transition-opacity hover:opacity-90"
          >
            Browse Academy
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.917 7h8.166M7.583 3.5L11.083 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
