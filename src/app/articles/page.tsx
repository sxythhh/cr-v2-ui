"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ARTICLES, CATEGORIES } from "./articles-data";
import { Modal } from "@/components/ui/modal";
import { BusinessOnboardingTypeform } from "@/components/forms/business-onboarding-typeform";
import { DubNav } from "@/components/lander/dub-nav";

/* ── Featured Hero Card ─────────────────────────────────────────── */

function FeaturedCard({ slug, title, description, category, readTime, date, gradient, icon }: {
  slug: string; title: string; description: string; category: string;
  readTime: string; date: string; gradient: string; icon: string;
}) {
  return (
    <Link href={`/articles/${slug}`} className="group block">
      <motion.article
        whileHover={{ y: -3 }}
        transition={{ duration: 0.25 }}
        className="relative flex flex-col overflow-hidden rounded-3xl bg-card-bg shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.3)] sm:flex-row"
      >
        {/* Gradient side */}
        <div className={cn("relative flex items-center justify-center sm:w-[280px] shrink-0 py-12 sm:py-0")}>
          <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", gradient)} />
          <span className="relative text-6xl">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center gap-4 p-7 sm:p-9">
          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-foreground/[0.06] px-3 py-1 font-inter text-xs font-medium tracking-[-0.03em] text-page-text-muted">
              {category}
            </span>
            <span className="font-inter text-xs tracking-[-0.03em] text-page-text-muted/60">
              {readTime} · {date}
            </span>
          </div>
          <h2 className="font-inter text-2xl font-semibold leading-[1.2] tracking-[-0.05em] text-page-text sm:text-[28px]">
            {title}
          </h2>
          <p className="max-w-[440px] font-inter text-[15px] leading-[1.7] tracking-[-0.02em] text-page-text-muted">
            {description}
          </p>
          <span className="inline-flex items-center gap-1.5 font-inter text-sm font-medium tracking-[-0.03em] text-foreground/50 transition-all group-hover:gap-2.5 group-hover:text-foreground">
            Read article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </motion.article>
    </Link>
  );
}

/* ── Regular Card ───────────────────────────────────────────────── */

function ArticleCard({ slug, title, description, category, readTime, date, icon }: {
  slug: string; title: string; description: string; category: string;
  readTime: string; date: string; icon: string;
}) {
  return (
    <Link href={`/articles/${slug}`} className="group block">
      <motion.article
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col rounded-2xl bg-card-bg p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.3)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-3xl">{icon}</span>
          <span className="font-inter text-xs tracking-[-0.03em] text-page-text-muted/50">
            {readTime}
          </span>
        </div>

        <span className="mb-2 inline-block w-fit rounded-full bg-foreground/[0.04] px-2.5 py-0.5 font-inter text-[11px] font-medium tracking-[-0.02em] text-page-text-muted">
          {category}
        </span>

        <h3 className="mb-2 font-inter text-base font-semibold leading-[1.35] tracking-[-0.05em] text-page-text group-hover:underline group-hover:decoration-foreground/20 group-hover:underline-offset-2">
          {title}
        </h3>

        <p className="mb-4 flex-1 font-inter text-[13px] leading-[1.6] tracking-[-0.02em] text-page-text-muted/80">
          {description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-foreground/[0.04]">
          <span className="font-inter text-xs tracking-[-0.03em] text-page-text-muted/50">
            {date}
          </span>
          <span className="flex items-center gap-1 font-inter text-xs font-medium tracking-[-0.03em] text-foreground/40 transition-all group-hover:gap-2 group-hover:text-foreground">
            Read
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </motion.article>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const featured = ARTICLES.filter((a) => a.featured);
  const filtered =
    activeCategory === "All"
      ? ARTICLES.filter((a) => !a.featured)
      : ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-page-bg">
      <DubNav />
      <div className="mx-auto max-w-[1088px] px-4 py-12 sm:px-10 sm:py-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-inter text-xs font-medium tracking-[-0.02em] text-page-text-muted/60">
              Content Rewards
            </p>
            <h1 className="font-inter text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] text-page-text sm:text-[48px]">
              Resources
            </h1>
            <p className="mt-3 max-w-[420px] font-inter text-[15px] leading-[1.6] tracking-[-0.02em] text-page-text-muted">
              Guides, strategies, and case studies for building creator-led marketing campaigns.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#252525] px-4 font-inter text-sm font-semibold tracking-[-0.05em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:bg-[#1a1a1a] active:scale-[0.97]"
          >
            Get started free
          </button>
        </div>

        {/* Featured */}
        {activeCategory === "All" && featured.length > 0 && (
          <div className="mb-10 flex flex-col gap-5">
            {featured.map((a) => (
              <FeaturedCard key={a.slug} {...a} />
            ))}
          </div>
        )}

        {/* Filter */}
        <div className="mb-8 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 font-inter text-[13px] font-medium tracking-[-0.03em] transition-all",
                activeCategory === cat
                  ? "bg-foreground text-background shadow-sm"
                  : "text-page-text-muted hover:bg-foreground/[0.04] hover:text-page-text",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Form modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="max-w-sm"
        showClose={false}
        className="border-0 shadow-xl"
      >
        <BusinessOnboardingTypeform
          key={formKey}
          onComplete={(data) => {
            console.log("Onboarding complete:", data);
            setFormOpen(false);
            setFormKey((k) => k + 1);
          }}
        />
      </Modal>
    </div>
  );
}
