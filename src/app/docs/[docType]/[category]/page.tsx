"use client";

import { use } from "react";
import Link from "next/link";
import { getCategories, type DocType } from "@/lib/docs-data";

export default function CategoryPage({ params }: { params: Promise<{ docType: string; category: string }> }) {
  const { docType, category } = use(params);
  const dt = docType as DocType;
  const categories = getCategories(dt);
  const categoryData = categories.find(cat => cat.id === category);
  const pages = categoryData?.pages || [];

  // Recommended articles from other categories
  const recommendedArticles = categories
    .filter(cat => cat.id !== category)
    .flatMap(cat => cat.pages)
    .slice(0, 4);

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-10 flex gap-16">
      <div className="flex-1 max-w-[700px]">
        <p className="text-[14px] font-semibold text-[#ff6207] tracking-[-0.56px] leading-[14px]">
          {dt === "brands" ? "Brand Docs" : "Creator Docs"}
        </p>
        <h1 className="text-[28px] sm:text-[32px] font-bold mt-2 tracking-[-1px] leading-[1.2] text-foreground">
          {categoryData?.name || category}
        </h1>
        <p className="text-[15px] font-medium mt-2 mb-6 tracking-[-0.3px] text-foreground/70">
          {categoryData?.description || "Browse all articles in this category"}
        </p>

        <div className="rounded-xl border border-foreground/[0.06] divide-y divide-foreground/[0.06] overflow-hidden">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/docs/${docType}/${category}/${page.id}`}
              className="group flex items-start gap-4 w-full text-left p-5"
            >
              <div className="shrink-0 w-10 h-10 flex items-center justify-center mt-0.5">
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-foreground/50">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-foreground group-hover:underline">
                  {page.title}
                </h3>
                <p className="text-[14px] font-medium mt-1 tracking-[-0.3px] text-foreground/50 line-clamp-2">
                  {page.subtitle}
                </p>
              </div>
              <svg className="shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" className="stroke-foreground/50" strokeWidth="1.5" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Articles - Desktop only */}
      {recommendedArticles.length > 0 && (
        <div className="hidden xl:block w-[300px] shrink-0 ml-auto">
          <div className="sticky top-[80px]">
            <h2 className="text-[16px] font-semibold mb-4 tracking-[-0.4px] text-foreground">
              Recommended articles
            </h2>
            <div className="rounded-xl border border-foreground/[0.06] divide-y divide-foreground/[0.06] overflow-hidden">
              {recommendedArticles.map((page) => {
                const cat = categories.find(c => c.pages.some(p => p.id === page.id));
                return (
                  <Link
                    key={page.id}
                    href={`/docs/${docType}/${cat?.id || "start-here"}/${page.id}`}
                    className="group flex items-center gap-3 w-full text-left p-4"
                  >
                    <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-foreground/50">
                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <span className="flex-1 text-[14px] font-medium tracking-[-0.4px] text-foreground group-hover:underline">
                      {page.title}
                    </span>
                    <svg className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" className="stroke-foreground/50" strokeWidth="1.5" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
