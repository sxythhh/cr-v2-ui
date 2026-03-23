"use client";

import { use } from "react";
import Link from "next/link";
import { getCategories, type DocType } from "@/lib/docs-data";

export default function DocTypeLanding({ params }: { params: Promise<{ docType: string }> }) {
  const { docType } = use(params);
  const dt = docType as DocType;
  const categories = getCategories(dt);
  const allPages = categories.flatMap(cat => cat.pages);
  const title = dt === "brands" ? "Brand Documentation" : "Creator Documentation";
  const subtitle = dt === "brands"
    ? "Everything you need to launch campaigns and grow with Content Rewards"
    : "Learn how to earn money creating content with Content Rewards";

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-10 max-w-[900px]">
      <h1 className="text-[28px] sm:text-[36px] font-bold tracking-[-1.2px] leading-[1.2] text-foreground">
        {title}
      </h1>
      <p className="text-[15px] sm:text-[16px] font-medium mt-3 tracking-[-0.3px] leading-[1.6] text-foreground/70">
        {subtitle}
      </p>

      <div className="mt-8">
        <div className="p-6 rounded-xl border border-foreground/[0.06]">
          <h2 className="text-[18px] font-semibold tracking-[-0.5px] text-foreground">
            All articles
          </h2>
          <p className="text-[14px] font-medium mt-1 mb-4 text-foreground/50">
            {allPages.length} articles available
          </p>
          <div className="divide-y divide-foreground/[0.06]">
            {allPages.map((page) => {
              const category = categories.find(c => c.pages.some(p => p.id === page.id));
              return (
                <Link
                  key={page.id}
                  href={`/docs/${docType}/${category?.id || "start-here"}/${page.id}`}
                  className="group flex items-center gap-4 w-full text-left py-4"
                >
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="fill-foreground/50">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <span className="flex-1 text-[15px] font-medium tracking-[-0.4px] text-foreground group-hover:underline">
                    {page.title}
                  </span>
                  <svg className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" className="stroke-foreground/50" strokeWidth="1.5" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
