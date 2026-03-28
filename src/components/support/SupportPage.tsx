"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ChevronRight, Search } from "lucide-react";
import SearchArrows from "@/assets/icons/search-arrows.svg";
import SearchPlay from "@/assets/icons/search-play.svg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  categories,
  type DocPage,
  type DocCategory,
  type DocSection,
} from "@/lib/support/docs-data";
import { SupportChat } from "./SupportChat";

// ── Theme (ported from auth-standalone) ──────────────────────────────────────

const C = {
  pageBg: "var(--support-page-bg)",
  sidebarBg: "var(--support-page-bg)",
  surfaceBg: "var(--support-surface-bg)",
  elevatedBg: "var(--support-elevated-bg)",
  hoverBg: "var(--support-hover-bg)",
  border: "var(--support-border)",
  textPrimary: "var(--support-text-primary)",
  textSecondary: "var(--support-text-secondary)",
  textMuted: "var(--support-text-muted)",
  textFaint: "var(--support-text-faint)",
  searchBg: "var(--support-search-bg)",
  dropdownBg: "var(--support-dropdown-bg)",
  dropdownHover: "var(--support-dropdown-hover)",
  sidebarIconBg: "var(--support-sidebar-icon-bg)",
  accent: "#ff6207",
} as const;

// ── DocMarkdown ──────────────────────────────────────────────────────────────

function DocMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p
            className="text-[15px] font-medium leading-[27px] mt-4"
            style={{ letterSpacing: "-0.3px", color: C.textSecondary }}
          >
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <span className="font-bold" style={{ color: C.textPrimary }}>
            {children}
          </span>
        ),
        a: ({ href, children }) => (
          <a
            href={href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline decoration-[#ff6207] hover:text-[#ff6207] transition-colors duration-150"
            style={{ color: C.textPrimary }}
          >
            {children}
          </a>
        ),
        ol: ({ children }) => (
          <ol
            className="list-decimal pl-5 space-y-2 text-[15px] font-medium leading-[27px] mt-4"
            style={{ letterSpacing: "-0.3px", color: C.textSecondary }}
          >
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 space-y-1 mt-2" style={{ color: C.textSecondary }}>
            {children}
          </ul>
        ),
        li: ({ children }) => <li>{children}</li>,
        table: ({ children }) => (
          <div
            className="overflow-x-auto mt-4 mb-4 rounded-lg border"
            style={{ borderColor: C.border }}
          >
            <table className="w-full text-[14px] border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead style={{ backgroundColor: C.surfaceBg }}>{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b last:border-b-0" style={{ borderColor: C.border }}>
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th
            className="text-left px-4 py-3 font-semibold border-r last:border-r-0"
            style={{ color: C.textPrimary, borderColor: C.border }}
          >
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td
            className="px-4 py-3 border-r last:border-r-0"
            style={{ color: C.textSecondary, borderColor: C.border }}
          >
            {children}
          </td>
        ),
        pre: ({ children }) => (
          <pre
            className="mt-4 mb-4 p-4 rounded-lg overflow-x-auto text-[13px] leading-[1.6]"
            style={{ backgroundColor: C.surfaceBg, color: C.textPrimary }}
          >
            {children}
          </pre>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded text-[13px] font-mono"
                style={{ backgroundColor: C.surfaceBg, color: C.textPrimary }}
              >
                {children}
              </code>
            );
          }
          return <code className="font-mono">{children}</code>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar({
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectPage,
  isAiMode,
  setIsAiMode,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: DocPage[];
  onSelectPage: (page: DocPage) => void;
  isAiMode: boolean;
  setIsAiMode: (fn: (v: boolean) => boolean) => void;
}) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);

  const showDropdown = focused && searchResults.length > 0;

  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", width: "100%", maxWidth: 450 }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
          setFocused(false);
        }
      }}
    >
      <div
        ref={barRef}
        onMouseEnter={(e) => {
          if (!showDropdown) e.currentTarget.style.backgroundColor = C.elevatedBg as string;
        }}
        onMouseLeave={(e) => {
          if (!showDropdown) e.currentTarget.style.backgroundColor = C.surfaceBg as string;
        }}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: 52,
          padding: 3,
          backgroundColor: C.surfaceBg,
          borderRadius: showDropdown ? "10px 10px 0 0" : 10,
          boxSizing: "border-box",
          transition: "background-color 0.15s ease, border-radius 0.15s ease",
        }}
      >
        <button
          ref={arrowRef}
          type="button"
          onClick={() => {
            setIsAiMode((v) => !v);
            const el = arrowRef.current;
            if (el) {
              el.style.transform = "scale(0.85)";
              requestAnimationFrame(() => {
                setTimeout(() => {
                  el.style.transform = "scale(1)";
                }, 120);
              });
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 46,
            flexShrink: 0,
            backgroundColor: C.hoverBg,
            backgroundImage: "none",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <SearchArrows width={10} height={17} className="text-[#B6B6B6]" />
        </button>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (barRef.current) barRef.current.style.backgroundColor = C.surfaceBg as string;
          }}
          onFocus={() => setFocused(true)}
          placeholder={isAiMode ? "Ask AI..." : "Find Opportunities"}
          className="flex-1 min-w-0 h-[46px] px-2 border-none outline-none bg-transparent font-inter text-[14px] font-semibold tracking-[-0.28px]"
          style={{ color: C.textPrimary, }}
        />

        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            flexShrink: 0,
            backgroundColor: "#F7890F",
            backgroundImage: "none",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          <SearchPlay width={16} height={18} className="text-white" />
        </button>
      </div>

      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: 52,
            left: 0,
            right: 0,
            backgroundColor: C.surfaceBg,
            borderRadius: "0 0 10px 10px",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          {searchResults.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => {
                onSelectPage(page);
                setFocused(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.elevatedBg as string;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                border: "none",
                backgroundColor: "transparent",
                backgroundImage: "none",
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 0.1s ease",
              }}
            >
              <Search style={{ width: 14, height: 14, color: C.textMuted, flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.textPrimary,
                    letterSpacing: "-0.28px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {page.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 1,
                  }}
                >
                  {page.subtitle}
                </div>
              </div>
              <ChevronRight style={{ width: 12, height: 12, color: C.textMuted, flexShrink: 0 }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  categories: cats,
  activePage,
  onSelectPage,
}: {
  categories: DocCategory[];
  activePage: DocPage | null;
  onSelectPage: (page: DocPage) => void;
}) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    cats.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  return (
    <div
      className="hidden lg:flex flex-col shrink-0 sticky top-0 h-dvh overflow-y-auto"
      style={{
        width: 260,
        borderRight: `1px solid ${C.border}`,
        backgroundColor: C.sidebarBg,
      }}
    >
      <div className="flex-1 px-5 pt-6 pb-4">
        <div className="space-y-4">
          {cats
            .filter((cat) => cat.pages.length > 0)
            .map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategories((prev) => ({
                        ...prev,
                        [cat.id]: !prev[cat.id],
                      }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 2,
                    }}
                  >
                    <svg
                      className={`transition-transform duration-200 ${
                        openCategories[cat.id] ? "rotate-90" : ""
                      }`}
                      width={12}
                      height={12}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke={C.textMuted}
                      strokeWidth="1.5"
                    >
                      <path d="M4.5 2.5l4 3.5-4 3.5" />
                    </svg>
                  </button>
                  <span
                    className="text-[14px] font-semibold"
                    style={{
                      letterSpacing: "-0.48px",
                      lineHeight: "20px",
                      color: C.textPrimary,
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
                {openCategories[cat.id] && (
                  <div className="ml-[6px] pl-[12px] relative">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px"
                      style={{ backgroundColor: C.border }}
                    />
                    {cat.pages.map((page) => {
                      const isActive = activePage?.id === page.id;
                      return (
                        <div key={page.id} className="relative">
                          {isActive && (
                            <div
                              className="absolute left-[-12px] top-[2px] bottom-[2px] w-px"
                              style={{ backgroundColor: C.accent }}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectPage(page)}
                            className="block w-full text-left text-[14px] font-medium py-[5px] px-2 -mx-1 rounded-[6px] transition-colors duration-150"
                            style={{
                              letterSpacing: "-0.42px",
                              lineHeight: "20px",
                              color: isActive ? C.textPrimary : C.textMuted,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive)
                                e.currentTarget.style.color = C.textPrimary;
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive)
                                e.currentTarget.style.color = C.textMuted;
                            }}
                          >
                            {page.title}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Article View ─────────────────────────────────────────────────────────────

function ArticleView({
  page,
  onBack,
  allPages,
  onNavigate,
}: {
  page: DocPage;
  onBack: () => void;
  allPages: DocPage[];
  onNavigate: (page: DocPage) => void;
}) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    page.sections[0]?.id ?? null
  );
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const pageIndex = allPages.findIndex((p) => p.id === page.id);
  const prevPage = pageIndex > 0 ? allPages[pageIndex - 1] : null;
  const nextPage = pageIndex < allPages.length - 1 ? allPages[pageIndex + 1] : null;

  // Scroll spy
  useEffect(() => {
    setActiveSectionId(page.sections[0]?.id ?? null);
    sectionRefs.current.clear();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section-id");
            if (id) setActiveSectionId(id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: [0, 0.1] }
    );

    const timeout = setTimeout(() => {
      sectionRefs.current.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [page]);

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = sectionRefs.current.get(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categoryName =
    categories.find((c) => c.pages.some((p) => p.id === page.id))?.name ?? "Docs";

  return (
    <div style={{ display: "flex", minWidth: 0 }}>
      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, padding: "24px 16px" }} className="sm:py-8 sm:px-10 xl:max-w-[820px]">
        {/* Back link */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] font-semibold hover:underline"
          style={{
            color: C.accent,
            letterSpacing: "-0.56px",
            lineHeight: "14px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M7.5 9.5L4 6l3.5-3.5" />
          </svg>
          Return to {categoryName}
        </button>

        {/* Title */}
        <h2
          className="text-[22px] sm:text-[26px] font-bold mt-2"
          style={{ letterSpacing: "-1.04px", lineHeight: "1.4", color: C.textPrimary }}
        >
          {page.title}
        </h2>
        <p
          className="text-[14px] sm:text-[15px] font-medium mt-3"
          style={{ letterSpacing: "-0.3px", lineHeight: "22.5px", color: C.textSecondary }}
        >
          {page.subtitle}
        </p>

        {/* Intro */}
        {page.intro.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-[14px] sm:text-[15px] font-medium leading-[25px] sm:leading-[27px] mt-4"
            style={{ letterSpacing: "-0.3px", color: C.textSecondary }}
          >
            {paragraph}
          </p>
        ))}

        {/* Sections */}
        {page.sections.map((section) => (
          <div
            key={section.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el);
              else sectionRefs.current.delete(section.id);
            }}
            data-section-id={section.id}
            className="scroll-mt-[80px]"
          >
            <h3
              className="text-[20px] sm:text-[26px] font-bold mt-8 sm:mt-10"
              style={{ letterSpacing: "-1.04px", lineHeight: "1.4", color: C.textPrimary }}
            >
              {section.heading}
            </h3>
            <DocMarkdown content={section.content} />
          </div>
        ))}

        {/* Prev / Next */}
        <div className="flex gap-4 mt-12 mb-4">
          {prevPage ? (
            <button
              type="button"
              onClick={() => onNavigate(prevPage)}
              className="flex-1 text-left rounded-[12px] border px-5 py-4 transition-colors duration-150"
              style={{
                borderColor: C.border,
                background: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.surfaceBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="text-[14px] font-medium"
                style={{ color: C.textPrimary, letterSpacing: "-0.3px" }}
              >
                {prevPage.title}
              </div>
              <div
                className="text-[13px] font-medium mt-1 flex items-center gap-1"
                style={{ color: C.textMuted, letterSpacing: "-0.3px" }}
              >
                <span>‹</span> Previous
              </div>
            </button>
          ) : (
            <div className="flex-1" />
          )}
          {nextPage ? (
            <button
              type="button"
              onClick={() => onNavigate(nextPage)}
              className="flex-1 text-right rounded-[12px] border px-5 py-4 transition-colors duration-150"
              style={{
                borderColor: C.border,
                background: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = C.surfaceBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <div
                className="text-[14px] font-medium"
                style={{ color: C.textPrimary, letterSpacing: "-0.3px" }}
              >
                {nextPage.title}
              </div>
              <div
                className="text-[13px] font-medium mt-1 flex items-center gap-1 justify-end"
                style={{ color: C.textMuted, letterSpacing: "-0.3px" }}
              >
                Next <span>›</span>
              </div>
            </button>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </main>

      {/* Right TOC */}
      <aside
        className="support-right-toc"
        style={{
          width: 300,
          flexShrink: 0,
          padding: 32,
          position: "sticky",
          top: 60,
          height: "calc(100vh - 60px)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={C.textPrimary}
            strokeWidth="1.5"
          >
            <path d="M2 4h12M2 8h9M2 12h12" />
          </svg>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.42px",
              color: C.textPrimary,
              margin: 0,
            }}
          >
            On this page
          </p>
        </div>
        {page.sections.map((section) => {
          const isActive = activeSectionId === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                padding: "6px 0 6px 16px",
                letterSpacing: "-0.42px",
                color: isActive ? C.textPrimary : C.textSecondary,
                borderLeft: `2px solid ${isActive ? C.accent : C.border}`,
                background: "none",
                backgroundImage: "none",
                border: "none",
                borderLeftWidth: 2,
                borderLeftStyle: "solid",
                borderLeftColor: isActive ? C.accent : C.border,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.textPrimary;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = C.textSecondary;
              }}
            >
              {section.heading}
            </button>
          );
        })}
      </aside>
    </div>
  );
}

// ── Landing View ─────────────────────────────────────────────────────────────

function LandingView({
  pages,
  onSelectPage,
}: {
  pages: DocPage[];
  onSelectPage: (page: DocPage) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? pages : pages.slice(0, 6);

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-10 max-w-[900px]">
      <div
        className="p-6 rounded-xl border"
        style={{ borderColor: C.border }}
      >
        <h2
          className="text-[18px] font-semibold"
          style={{ letterSpacing: "-0.5px", color: C.textPrimary }}
        >
          {showAll ? "All articles" : "Recommended articles"}
        </h2>
        <p className="text-[14px] font-medium mt-1 mb-4" style={{ color: C.textMuted }}>
          {showAll
            ? `${pages.length} articles available`
            : "Explore suggested articles to get started"}
        </p>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {displayed.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelectPage(page)}
              className="group flex items-center gap-4 w-full text-left py-4"
              style={{ borderColor: C.border, background: "none", border: "none", cursor: "pointer" }}
            >
              <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={C.textMuted}>
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
              </div>
              <span
                className="flex-1 text-[15px] font-medium group-hover:underline"
                style={{ letterSpacing: "-0.4px", color: C.textPrimary }}
              >
                {page.title}
              </span>
              <svg
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke={C.textMuted}
                strokeWidth="1.5"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
            </button>
          ))}
        </div>
        {pages.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 mt-4 text-[14px] font-medium"
            style={{ color: C.accent, background: "none", border: "none", cursor: "pointer" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={`transition-transform duration-200 ${showAll ? "rotate-90" : ""}`}
            >
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
            {showAll ? "Show less" : "View all articles"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

const SUPPORT_CATEGORIES = [
  {
    title: "Getting Started",
    description: "Learn the basics of Content Rewards",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    categoryId: "general",
  },
  {
    title: "For Brands",
    description: "Campaigns, budgets, and creator management",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" />
      </svg>
    ),
    categoryId: "brands",
  },
  {
    title: "For Creators",
    description: "Submissions, payouts, and growing your reach",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    categoryId: "creators",
  },
  {
    title: "Billing & Payments",
    description: "Invoices, deposits, and payment methods",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    categoryId: "general",
  },
  {
    title: "Account & Settings",
    description: "Profile, team members, and workspace settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    categoryId: "general",
  },
  {
    title: "Academy",
    description: "Tutorials, guides, and best practices",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    href: "/academy",
  },
];

export function SupportPageClient() {
  const [selectedPage, setSelectedPage] = useState<DocPage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiMode, setIsAiMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allPages = useMemo(() => {
    const seen = new Set<string>();
    return categories.flatMap((c) => c.pages).filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPages
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.sections.some(
            (s) =>
              s.heading.toLowerCase().includes(q) ||
              s.content.toLowerCase().includes(q)
          )
      )
      .slice(0, 5);
  }, [searchQuery, allPages]);

  const categoryPages = useMemo(() => {
    if (!activeCategory) return [];
    const cat = categories.find((c) => c.id === activeCategory);
    return cat?.pages ?? [];
  }, [activeCategory]);

  return (
    <div className="help-page font-inter antialiased">
      <div className="min-w-0">
        {/* Header with search */}
        {!selectedPage && !activeCategory && (
          <div className="py-8 sm:py-10 px-4 sm:px-10 max-w-[900px]">
            <h1
              className="text-[28px] sm:text-[36px] font-semibold"
              style={{
                letterSpacing: "-0.04em",
                lineHeight: 1.2,
                color: C.textPrimary,
              }}
            >
              Help Center
            </h1>
            <p
              className="text-[16px] font-normal max-w-[420px] mt-3"
              style={{
                letterSpacing: "-0.01em",
                lineHeight: "25px",
                color: C.textMuted,
              }}
            >
              Browse documentation, search for answers, or chat with our AI assistant.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                onSelectPage={(page) => {
                  setSelectedPage(page);
                  setSearchQuery("");
                }}
                isAiMode={isAiMode}
                setIsAiMode={setIsAiMode}
              />

              {/* Category pills */}
              {!searchQuery && (
                <div className="flex items-center gap-2">
                  <span className="font-inter text-[14px] font-medium tracking-[-0.42px]" style={{ color: C.textPrimary }}>
                    Discover
                  </span>
                  {[
                    { label: "Clipping", onClick: () => categories[0]?.pages[0] && setSelectedPage(categories[0].pages[0]) },
                    { label: "UGC", onClick: () => categories[1]?.pages[0] && setSelectedPage(categories[1].pages[0]) },
                    { label: "Music", onClick: () => categories[2]?.pages[0] && setSelectedPage(categories[2].pages[0]) },
                  ].map((pill) => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={pill.onClick}
                      className="flex h-7 cursor-pointer items-center gap-[3px] rounded-lg border-none bg-foreground/[0.08] px-3 font-inter text-[12px] font-medium tracking-[-0.24px] text-page-text transition-colors hover:bg-foreground/[0.15]"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M1.625 5.41667C1.625 3.32258 3.32258 1.625 5.41667 1.625C7.51075 1.625 9.20833 3.32258 9.20833 5.41667C9.20833 7.51075 7.51075 9.20833 5.41667 9.20833C3.32258 9.20833 1.625 7.51075 1.625 5.41667Z" stroke="currentColor" strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.125 8.125L11.375 11.375" stroke="currentColor" strokeWidth="1.08333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {pill.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {selectedPage ? (
          <ArticleView
            page={selectedPage}
            onBack={() => {
              setSelectedPage(null);
              if (activeCategory) setActiveCategory(activeCategory);
            }}
            allPages={allPages}
            onNavigate={(page) => {
              setSelectedPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        ) : activeCategory ? (
          /* Category article list */
          <div className="px-4 sm:px-10 py-8 max-w-[900px]">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="flex items-center gap-1.5 mb-6 font-inter text-[14px] font-medium tracking-[-0.02em] transition-colors hover:opacity-80"
              style={{ color: C.textMuted, background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
              Back to Help Center
            </button>
            <h2 className="text-[24px] font-semibold tracking-[-0.04em]" style={{ color: C.textPrimary }}>
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <p className="text-[14px] font-medium mt-1 mb-6" style={{ color: C.textMuted }}>
              {categoryPages.length} article{categoryPages.length !== 1 ? "s" : ""}
            </p>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {categoryPages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedPage(page)}
                  className="group flex items-center gap-4 w-full text-left py-4"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: C.surfaceBg }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium tracking-[-0.4px] group-hover:underline" style={{ color: C.textPrimary }}>
                      {page.title}
                    </span>
                    <span className="block text-[13px] mt-0.5 truncate" style={{ color: C.textMuted }}>
                      {page.subtitle}
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ color: C.textMuted }} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Category cards grid */
          !searchQuery && (
            <div className="px-4 sm:px-10 pb-6 max-w-[900px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {SUPPORT_CATEGORIES.map((cat) => {
                  if (cat.href) {
                    return (
                      <a
                        key={cat.title}
                        href={cat.href}
                        className="group flex flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.03] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]"
                      >
                        <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.04] text-page-text-muted dark:bg-foreground/[0.06]">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{cat.title}</span>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-page-text-muted"><path d="M5 3h8v8" /><path d="M13 3L3 13" /></svg>
                          </div>
                          <p className="mt-1 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{cat.description}</p>
                        </div>
                      </a>
                    );
                  }
                  return (
                    <button
                      key={cat.title}
                      type="button"
                      onClick={() => setActiveCategory(cat.categoryId!)}
                      className="group flex cursor-pointer flex-col gap-3 rounded-2xl border border-foreground/[0.06] bg-card-bg p-4 text-left shadow-[0px_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-foreground/[0.03] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]"
                    >
                      <div className="flex size-10 items-center justify-center rounded-xl bg-foreground/[0.04] text-page-text-muted dark:bg-foreground/[0.06]">
                        {cat.icon}
                      </div>
                      <div>
                        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{cat.title}</span>
                        <p className="mt-1 font-inter text-xs tracking-[-0.02em] text-page-text-muted">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* AI Chat widget */}
      <SupportChat />
    </div>
  );
}
