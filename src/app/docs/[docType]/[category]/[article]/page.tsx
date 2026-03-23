"use client";

import { use, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories, getAllPages, findPage, findCategoryForPage, type DocType } from "@/lib/docs-data";

// ── Icons ──

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-foreground/30" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
      strokeWidth="1.5"
    >
      <path d="M4.5 2.5l4 3.5-4 3.5" className="stroke-foreground/50" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" strokeWidth="1.5">
      <path d="M2 4h12M2 8h9M2 12h12" className="stroke-foreground" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" strokeWidth="1.5">
      <path d="M3 5h14M3 10h14M3 15h14" className="stroke-foreground" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" strokeWidth="1.5">
      <path d="M5 5l10 10M15 5L5 15" className="stroke-foreground/50" />
    </svg>
  );
}

// ── Feedback ──

function PageFeedback() {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);

  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-foreground/[0.06]">
      <span className="text-[14px] font-medium tracking-[-0.3px] text-foreground/50">
        {selected ? "Thanks for your feedback!" : "Was this page helpful?"}
      </span>
      {!selected && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelected("yes")}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-[10px] border border-foreground/[0.06] text-foreground/70 hover:bg-foreground/[0.03] transition-colors"
          >
            Yes
          </button>
          <button
            onClick={() => setSelected("no")}
            className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-[10px] border border-foreground/[0.06] text-foreground/70 hover:bg-foreground/[0.03] transition-colors"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sidebar Navigation ──

function DocsSidebar({
  docType,
  currentArticle,
  currentCategory,
  categories,
  open,
  onClose,
  mobile = false,
}: {
  docType: string;
  currentArticle: string;
  currentCategory: string;
  categories: ReturnType<typeof getCategories>;
  open: boolean;
  onClose: () => void;
  mobile?: boolean;
}) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach(cat => { initial[cat.id] = cat.id === currentCategory; });
    return initial;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5">
        {/* Search */}
        <div className="mb-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 h-9 rounded-[10px] bg-foreground/[0.04]">
              <SearchIcon />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search docs..."
                className="flex-1 bg-transparent text-[13px] font-medium outline-none text-foreground/70 placeholder:text-foreground/30 min-w-0"
                style={{ letterSpacing: "-0.3px" }}
              />
              {!searchQuery && (
                <kbd className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded-[6px] text-foreground/30 bg-foreground/[0.04]">
                  /
                </kbd>
              )}
            </div>
            {mobile && (
              <button onClick={onClose} className="p-1.5 shrink-0">
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4 pb-4">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <button onClick={() => toggleCategory(cat.id)} className="p-0.5 -m-0.5 rounded hover:bg-foreground/[0.05] transition-colors">
                  <ChevronIcon open={!!openCategories[cat.id]} />
                </button>
                <Link
                  href={`/docs/${docType}/${cat.id}`}
                  className="text-[14px] font-semibold tracking-[-0.48px] leading-[20px] text-foreground hover:text-[#ff6207] hover:underline transition-colors"
                  onClick={mobile ? onClose : undefined}
                >
                  {cat.name}
                </Link>
              </div>
              {openCategories[cat.id] && (
                <div className="ml-[6px] pl-[12px] relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-foreground/[0.06]" />
                  {cat.pages.map((page) => {
                    const isActive = page.id === currentArticle;
                    return (
                      <div key={page.id} className="relative">
                        {isActive && (
                          <div className="absolute left-[-12px] top-[2px] bottom-[2px] w-px bg-[#ff6207]" />
                        )}
                        <Link
                          href={`/docs/${docType}/${cat.id}/${page.id}`}
                          onClick={mobile ? onClose : undefined}
                          className={`block w-full text-left text-[14px] font-medium py-[5px] px-2 -mx-1 rounded-[6px] transition-colors tracking-[-0.42px] leading-[20px] ${
                            isActive ? "text-foreground" : "text-foreground/50 hover:text-foreground"
                          }`}
                        >
                          {page.title}
                        </Link>
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

  if (mobile) {
    return (
      <>
        {open && (
          <div className="fixed inset-0 z-[60] bg-black/40 lg:hidden" onClick={onClose} />
        )}
        <aside
          className={`fixed top-0 left-0 z-[70] h-screen w-[280px] border-r border-foreground/[0.06] bg-page-bg transition-transform duration-300 lg:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <div className="hidden lg:block shrink-0 sticky top-0 h-screen overflow-hidden w-[280px]">
      <div className="w-[280px] h-full border-r border-foreground/[0.06] bg-page-bg">
        {sidebarContent}
      </div>
    </div>
  );
}

// ── Main Article Page ──

export default function ArticlePage({
  params,
}: {
  params: Promise<{ docType: string; category: string; article: string }>;
}) {
  const { docType, category, article } = use(params);
  const router = useRouter();
  const dt = docType as DocType;
  const categories = getCategories(dt);
  const allPages = getAllPages(dt);
  const page = findPage(dt, article);
  const activePageIndex = allPages.findIndex(p => p.id === article);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isClickScrolling = useRef(false);

  // Initialize active section
  useEffect(() => {
    sectionRefs.current.clear();
    if (page && page.sections.length > 0) {
      setActiveSectionId(page.sections[0].id);
    }
  }, [article, page]);

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

  // IntersectionObserver for TOC tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("data-section-id");
            if (sectionId) setActiveSectionId(sectionId);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: [0, 0.1, 0.5] }
    );

    const timeout = setTimeout(() => {
      sectionRefs.current.forEach((el) => observer.observe(el));
    }, 100);

    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [article, page]);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    isClickScrolling.current = true;
    setTocOpen(false);
    const el = sectionRefs.current.get(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => { isClickScrolling.current = false; }, 600);
  }, []);

  const setSectionRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
    else sectionRefs.current.delete(id);
  }, []);

  // Close sidebar on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!page) {
    return (
      <div className="py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
        <p className="text-foreground/50 mt-2">The article &ldquo;{article}&rdquo; could not be found.</p>
        <Link href={`/docs/${docType}`} className="text-[#ff6207] mt-4 inline-block hover:underline">
          Back to {docType} docs
        </Link>
      </div>
    );
  }

  const navigateTo = (pageId: string) => {
    const cat = findCategoryForPage(dt, pageId);
    router.push(`/docs/${docType}/${cat?.id || category}/${pageId}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <DocsSidebar
        docType={docType}
        currentArticle={article}
        currentCategory={category}
        categories={categories}
        open={true}
        onClose={() => {}}
      />

      {/* Mobile sidebar */}
      <DocsSidebar
        docType={docType}
        currentArticle={article}
        currentCategory={category}
        categories={categories}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        mobile
      />

      {/* Right portion */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-50 flex items-center px-3 h-[48px] lg:hidden gap-2 bg-page-bg">
          <button className="p-1.5 shrink-0" onClick={() => setSidebarOpen(true)}>
            <HamburgerIcon />
          </button>
        </div>

        <div className="flex">
          {/* Main Content */}
          <main className="flex-1 py-6 sm:py-8 px-4 sm:px-10 max-w-[820px]">
            {/* Category label */}
            <Link
              href={`/docs/${docType}/${category}`}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-[#ff6207] hover:underline tracking-[-0.56px] leading-[14px]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" strokeWidth="1.5">
                <path d="M7.5 9.5L4 6l3.5-3.5" className="stroke-current" />
              </svg>
              Return to {categories.find(c => c.id === category)?.name || "Start Here"}
            </Link>

            {/* Title + subtitle */}
            <h2 className="text-[22px] sm:text-[26px] font-bold mt-2 tracking-[-1.04px] leading-[1.4] text-foreground">
              {page.title}
            </h2>
            <p className="text-[14px] sm:text-[15px] font-medium mt-3 tracking-[-0.3px] leading-[22.5px] text-foreground">
              {page.subtitle}
            </p>

            {/* Mobile TOC */}
            <div className="xl:hidden mt-6">
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className="flex items-center gap-2 w-full text-left py-2.5 px-3 rounded-[8px] border border-foreground/[0.06] transition-colors"
              >
                <ListIcon />
                <span className="text-[14px] font-medium flex-1 tracking-[-0.42px] text-foreground">
                  On this page
                </span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${tocOpen ? "rotate-180" : ""}`} viewBox="0 0 14 14" fill="none" strokeWidth="1.5">
                  <path d="M3 5l4 4 4-4" className="stroke-foreground/30" />
                </svg>
              </button>
              {tocOpen && (
                <div className="mt-2 ml-1 space-y-0">
                  {page.sections.map((section) => {
                    const isActive = activeSectionId === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left text-[14px] py-1.5 pl-4 border-l-2 transition-all tracking-[-0.42px] ${
                          isActive
                            ? "font-medium text-foreground border-[#ff6207]"
                            : "font-normal text-foreground/70 border-foreground/[0.06] hover:text-foreground"
                        }`}
                      >
                        {section.heading}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Introduction */}
            {page.intro && (
              <p className="text-[14px] sm:text-[15px] font-medium leading-[25px] sm:leading-[27px] mt-4 tracking-[-0.3px] text-foreground/70">
                {page.intro}
              </p>
            )}

            {/* Sections */}
            {page.sections.map((section) => (
              <div
                key={section.id}
                ref={(el) => setSectionRef(section.id, el)}
                data-section-id={section.id}
                className="scroll-mt-[80px]"
              >
                <h3 className="text-[20px] sm:text-[26px] font-bold mt-8 sm:mt-10 tracking-[-1.04px] leading-[1.4] text-foreground">
                  {section.heading}
                </h3>
                {section.content && (
                  <p className="text-[15px] font-medium leading-[27px] mt-4 tracking-[-0.3px] text-foreground/70">
                    {section.content}
                  </p>
                )}
              </div>
            ))}

            {/* Prev / Next navigation */}
            <div className="flex gap-4 mt-12 mb-4">
              {activePageIndex > 0 ? (
                <button
                  onClick={() => navigateTo(allPages[activePageIndex - 1].id)}
                  className="flex-1 text-left rounded-[12px] border border-foreground/[0.06] px-5 py-4 hover:bg-foreground/[0.03] transition-colors"
                >
                  <div className="text-[14px] font-medium text-foreground tracking-[-0.3px]">
                    {allPages[activePageIndex - 1].title}
                  </div>
                  <div className="text-[13px] font-medium mt-1 flex items-center gap-1 text-foreground/50 tracking-[-0.3px]">
                    <span>&lsaquo;</span> Previous
                  </div>
                </button>
              ) : <div className="flex-1" />}
              {activePageIndex < allPages.length - 1 ? (
                <button
                  onClick={() => navigateTo(allPages[activePageIndex + 1].id)}
                  className="flex-1 text-right rounded-[12px] border border-foreground/[0.06] px-5 py-4 hover:bg-foreground/[0.03] transition-colors"
                >
                  <div className="text-[14px] font-medium text-foreground tracking-[-0.3px]">
                    {allPages[activePageIndex + 1].title}
                  </div>
                  <div className="text-[13px] font-medium mt-1 flex items-center gap-1 justify-end text-foreground/50 tracking-[-0.3px]">
                    Next <span>&rsaquo;</span>
                  </div>
                </button>
              ) : <div className="flex-1" />}
            </div>

            {/* Feedback */}
            <PageFeedback />
          </main>

          {/* Right TOC (desktop only) */}
          <aside className="hidden xl:flex xl:flex-col xl:justify-between w-[340px] shrink-0 p-8 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ListIcon />
                <p className="text-[14px] font-medium tracking-[-0.42px] text-foreground">
                  On this page
                </p>
              </div>
              <div className="space-y-0">
                {page.sections.map((section) => {
                  const isActive = activeSectionId === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left text-[14px] py-1.5 pl-4 border-l-2 transition-all tracking-[-0.42px] ${
                        isActive
                          ? "font-medium text-foreground border-[#ff6207]"
                          : "font-normal text-foreground/70 border-foreground/[0.06] hover:text-foreground"
                      }`}
                    >
                      {section.heading}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
