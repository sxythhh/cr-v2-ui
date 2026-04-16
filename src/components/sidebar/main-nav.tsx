"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { useSideNav } from "./sidebar-context";
import { AppSidebarNav } from "./app-sidebar-nav";
import { MobileHeader } from "@/components/mobile-header";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { OnboardingButton } from "./onboarding-button";
import { CreatorAiFab } from "@/components/creator-ai-fab";
import { FeedbackWidget } from "@/components/feedback-widget";

export function MainNav({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen, collapsed, aiSidebarOpen } = useSideNav();
  const pathname = usePathname();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Routes that bypass the sidebar entirely
  if (pathname?.startsWith("/lander") || pathname?.startsWith("/case-studies") || pathname?.startsWith("/academy") || pathname?.startsWith("/product-lander") || pathname?.startsWith("/verified-agency") || pathname?.startsWith("/articles") || pathname?.startsWith("/discord") || pathname?.startsWith("/blog") || pathname?.startsWith("/affiliate") || pathname?.startsWith("/agencies") || pathname?.startsWith("/showcase")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-dvh flex-col bg-page-bg md:bg-page-outer-bg">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden md:grid"
        style={{
          gridTemplateColumns: aiSidebarOpen
            ? "min-content minmax(500px, 1fr) clamp(320px, 30vw, 439px)"
            : "min-content minmax(0, 1fr) 0px",
          transition: "grid-template-columns 300ms ease",
        }}
      >
        {/* Side nav backdrop — desktop only */}
        <div
          className={cn(
            "fixed left-0 top-0 z-50 h-dvh w-screen transition-[background-color,backdrop-filter] md:sticky md:z-auto md:w-full md:bg-transparent",
            isOpen
              ? "bg-black/20 backdrop-blur-sm"
              : "bg-transparent max-md:pointer-events-none",
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              setIsOpen(false);
            }
          }}
        >
          {/* Side nav */}
          <div
            className={cn(
              "relative h-full w-min max-w-full bg-page-outer-bg transition-transform md:translate-x-0",
              !isOpen && "max-md:-translate-x-full",
            )}
          >
            <AppSidebarNav />
          </div>
        </div>

        {/* Main content — on mobile the outer div is the scroll container so sticky works */}
        <div className="scrollbar-hide relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-page-bg pb-[calc(60px+max(8px,env(safe-area-inset-bottom)))] md:overflow-hidden md:pb-0 md:[contain:layout_style_paint]">
          {/* <MobileHeader /> */}
          <div className={cn("scrollbar-hide flex min-h-0 flex-col md:flex-1 md:overflow-y-auto md:will-change-transform", aiSidebarOpen && "ai-content-narrow")}>
            {children}
          </div>
        </div>

        {/* AI assistant — rendered as grid column when sidebar mode */}
        <CreatorAiFab />
      </div>

      {/* Feedback button + widget */}
      <button
        onClick={() => setFeedbackOpen((v) => !v)}
        className="fixed bottom-5 left-5 z-[9998] hidden size-10 items-center justify-center rounded-full border border-border bg-card-bg text-page-text-muted shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-colors hover:text-page-text md:flex dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.33 7.33H8V10.67M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="4.83" r=".5" fill="currentColor"/></svg>
      </button>
      <FeedbackWidget open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
