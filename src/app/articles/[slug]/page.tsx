"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { BusinessOnboardingTypeform } from "@/components/forms/business-onboarding-typeform";
import { DubNav } from "@/components/lander/dub-nav";
import { ARTICLES } from "../articles-data";

function BackArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES.find((a) => a.slug === slug);
  const [activeSection, setActiveSection] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const section of article.content) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [article]);

  if (!article) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-inter text-2xl font-semibold tracking-[-0.05em] text-page-text">
            Article not found
          </h1>
          <Link
            href="/articles"
            className="mt-4 inline-flex items-center gap-1.5 font-inter text-sm font-medium tracking-[-0.03em] text-page-text-muted hover:text-page-text"
          >
            <BackArrow />
            Back to articles
          </Link>
        </div>
      </div>
    );
  }

  const related = ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug,
  ).slice(0, 2);

  return (
    <div className="min-h-screen bg-page-bg">
      <DubNav />
    <div className="mx-auto max-w-[1088px] px-4 py-8 sm:px-10 sm:py-12">
      <Link
        href="/articles"
        className="mb-8 inline-flex items-center gap-1.5 font-inter text-sm font-medium tracking-[-0.03em] text-page-text-muted transition-colors hover:text-page-text"
      >
        <BackArrow />
        All articles
      </Link>

      <div className="flex gap-12">
        {/* Main content */}
        <article className="min-w-0 flex-1">
          <header className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full bg-foreground/[0.04] px-2.5 py-1 font-inter text-xs font-medium tracking-[-0.03em] text-page-text-muted">
                {article.category}
              </span>
              <span className="font-inter text-xs tracking-[-0.03em] text-page-text-muted">
                {article.readTime}
              </span>
              <span className="text-page-text-muted">·</span>
              <span className="font-inter text-xs tracking-[-0.03em] text-page-text-muted">
                {article.date}
              </span>
            </div>

            <h1 className="font-inter text-[28px] font-semibold leading-[1.15] tracking-[-0.05em] text-page-text sm:text-[36px]">
              {article.title}
            </h1>

            <p className="mt-4 max-w-[560px] font-inter text-base leading-[1.7] tracking-[-0.03em] text-page-text-muted">
              {article.description}
            </p>

            <div className="mt-8 h-px bg-foreground/[0.06]" />
          </header>

          <div className="space-y-10">
            {article.content.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="mb-4 font-inter text-xl font-semibold leading-[1.3] tracking-[-0.05em] text-page-text">
                  {section.heading}
                </h2>
                <p className="font-inter text-[15px] leading-[1.8] tracking-[-0.02em] text-page-text-muted">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="mb-5 font-inter text-base font-semibold tracking-[-0.05em] text-page-text">
                Related articles
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/articles/${r.slug}`}
                    className="group flex flex-col gap-2 rounded-xl border border-foreground/[0.06] p-5 transition-shadow hover:shadow-md"
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <h4 className="font-inter text-sm font-semibold leading-[1.3] tracking-[-0.05em] text-page-text group-hover:underline">
                      {r.title}
                    </h4>
                    <p className="font-inter text-xs leading-[1.5] tracking-[-0.03em] text-page-text-muted">
                      {r.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="hidden w-[200px] shrink-0 lg:block">
          <div className="sticky top-8 flex flex-col gap-6">
            {/* TOC */}
            <div>
              <span className="mb-3 block font-inter text-xs font-medium tracking-[-0.03em] text-page-text-muted">
                On this page
              </span>
              <nav className="flex flex-col gap-1">
                {article.content.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 font-inter text-[13px] leading-[1.4] tracking-[-0.03em] transition-colors",
                      activeSection === section.id
                        ? "bg-foreground/[0.04] font-medium text-page-text"
                        : "text-page-text-muted hover:text-page-text",
                    )}
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>

            {/* CTA */}
            <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4">
              <p className="font-inter text-[13px] font-medium leading-[1.5] tracking-[-0.03em] text-page-text">
                Ready to get started?
              </p>
              <p className="mt-1 font-inter text-xs leading-[1.5] tracking-[-0.03em] text-page-text-muted">
                Launch your first creator campaign in minutes.
              </p>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="mt-3 flex h-8 w-full cursor-pointer items-center justify-center rounded-lg bg-[#252525] font-inter text-xs font-semibold tracking-[-0.05em] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all hover:bg-[#1a1a1a] active:scale-[0.97]"
              >
                Start for free
              </button>
            </div>
          </div>
        </aside>
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
    </div>
  );
}
