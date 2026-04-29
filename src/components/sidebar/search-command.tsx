"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useSideNav } from "./sidebar-context";
import {
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
} from "@/components/ui/command";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { cn } from "@/lib/utils";
import { Tabs, TabItem } from "@/components/ui/tabs";

const TABS = [
  "All",
  "Dashboard",
  "Insights",
  "Campaigns",
  "Submissions",
  "Creators",
] as const;

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 14L11.1067 11.1067M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.33333 8C1.33333 4.31811 4.3181 1.33333 8 1.33333C11.6819 1.33333 14.6667 4.31811 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8ZM8 4C8.36819 4 8.66667 4.29848 8.66667 4.66667V5.07911C9.20271 5.21474 9.67567 5.51305 9.98393 5.93937C10.1997 6.23773 10.1327 6.6545 9.83434 6.87024C9.53598 7.08598 9.11921 7.019 8.90347 6.72064C8.75863 6.52033 8.43562 6.33333 8 6.33333H7.81481C7.21829 6.33333 7 6.69661 7 6.85185V6.90274C7 7.03425 7.09942 7.25508 7.43504 7.38932L9.06016 8.03938C9.77146 8.32389 10.3333 8.95906 10.3333 9.76393C10.3333 10.7459 9.54867 11.4096 8.66667 11.6061V12C8.66667 12.3682 8.36819 12.6667 8 12.6667C7.63181 12.6667 7.33333 12.3682 7.33333 12V11.5842C6.79731 11.4486 6.32434 11.1503 6.01608 10.7239C5.80034 10.4256 5.86731 10.0088 6.16567 9.79311C6.46403 9.57736 6.8808 9.64434 7.09654 9.94271C7.24138 10.143 7.56438 10.3333 8 10.3333H8.12158C8.75324 10.3333 9 9.94727 9 9.76393C9 9.63242 8.90058 9.41159 8.56497 9.27734L6.93984 8.62729C6.22855 8.34277 5.66667 7.7076 5.66667 6.90274V6.85185C5.66667 5.87584 6.45957 5.22602 7.33333 5.04887V4.66667C7.33333 4.29848 7.63181 4 8 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.835449 7.61058C0.961094 7.21862 2.84818 2.66675 8.00007 2.66675C13.152 2.66675 15.0391 7.21862 15.1647 7.61058C15.2517 7.88229 15.2517 8.11787 15.1647 8.38959C15.0391 8.78155 13.152 13.3334 8.00007 13.3334C2.84818 13.3334 0.961094 8.78155 0.835449 8.38959C0.74841 8.11787 0.74841 7.88229 0.835449 7.61058ZM8.00007 11.0001C9.65692 11.0001 11.0001 9.65692 11.0001 8.00008C11.0001 6.34324 9.65692 5.00008 8.00007 5.00008C6.34323 5.00008 5.00007 6.34324 5.00007 8.00008C5.00007 9.65692 6.34323 11.0001 8.00007 11.0001Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 2V14M2 8H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.31054 6.08097C5.61229 4.77922 7.72284 4.77922 9.02459 6.08097L9.25335 6.30973C9.79754 6.85391 10.1148 7.54121 10.2037 8.25055C10.2495 8.61588 9.99041 8.94914 9.62508 8.99491C9.25974 9.04068 8.92648 8.78162 8.88071 8.41628C8.82738 7.99061 8.63785 7.57985 8.31055 7.25254L8.08178 7.02378C7.30073 6.24273 6.0344 6.24273 5.25335 7.02377L3.02459 9.25254C2.24354 10.0336 2.24354 11.2999 3.02459 12.081L3.25335 12.3097C4.0344 13.0908 5.30073 13.0908 6.08178 12.3097L6.19614 12.1954C6.45648 11.935 6.87859 11.935 7.13895 12.1953C7.39931 12.4557 7.39932 12.8778 7.13898 13.1381L7.02461 13.2525C5.72286 14.5543 3.61229 14.5543 2.31054 13.2525L2.08178 13.0238C0.780033 11.722 0.78003 9.61148 2.08178 8.30973L4.31054 6.08097Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.97717 3.4143C10.2789 2.11255 12.3895 2.11255 13.6912 3.4143L13.92 3.64306C15.2217 4.94481 15.2217 7.05536 13.92 8.35711L11.6912 10.5859C10.3895 11.8876 8.27892 11.8876 6.97717 10.5859L6.74841 10.3571C6.20423 9.81292 5.88692 9.12563 5.79806 8.41628C5.75229 8.05095 6.01135 7.71768 6.37669 7.67192C6.74202 7.62615 7.07528 7.88521 7.12105 8.25055C7.17438 8.67623 7.36391 9.08699 7.69122 9.4143L7.91998 9.64306C8.70103 10.4241 9.96736 10.4241 10.7484 9.64306L12.9772 7.4143C13.7582 6.63325 13.7582 5.36692 12.9772 4.58587L12.7484 4.35711C11.9674 3.57608 10.7011 3.57606 9.92004 4.35705C9.92002 4.35707 9.92006 4.35703 9.92004 4.35705L9.8057 4.47142C9.54538 4.73181 9.12327 4.73186 8.86289 4.47155C8.6025 4.21123 8.60245 3.78912 8.86276 3.52874L8.97717 3.4143Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UserAddIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.99935 1.3335C6.34249 1.3335 4.99935 2.67664 4.99935 4.3335C4.99935 5.99035 6.34249 7.3335 7.99935 7.3335C9.6562 7.3335 10.9993 5.99035 10.9993 4.3335C10.9993 2.67664 9.6562 1.3335 7.99935 1.3335Z"
        fill="currentColor"
      />
      <path
        d="M11.9993 9.3335C12.3675 9.3335 12.666 9.63197 12.666 10.0002V11.3335H13.9993C14.3675 11.3335 14.666 11.632 14.666 12.0002C14.666 12.3684 14.3675 12.6668 13.9993 12.6668H12.666V14.0002C12.666 14.3684 12.3675 14.6668 11.9993 14.6668C11.6312 14.6668 11.3327 14.3684 11.3327 14.0002V12.6668H9.99935C9.63116 12.6668 9.33268 12.3684 9.33268 12.0002C9.33268 11.632 9.63116 11.3335 9.99935 11.3335H11.3327V10.0002C11.3327 9.63197 11.6312 9.3335 11.9993 9.3335Z"
        fill="currentColor"
      />
      <path
        d="M2.46395 12.4645C3.0352 9.9226 5.1339 8.00016 8.00003 8.00016C8.95452 8.00016 9.8239 8.21337 10.5801 8.59166C10.2215 8.95313 10 9.45078 10 10.0002C8.89543 10.0002 8 10.8956 8 12.0002C8 13.1047 8.89543 14.0002 10 14.0002H3.73231C2.97554 14.0002 2.27077 13.3241 2.46395 12.4645Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center justify-center rounded-full bg-foreground/[0.06] px-2 font-medium text-[12px] leading-none tracking-[-0.02em] text-page-text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

type Row = {
  icon: React.ReactNode;
  label: string;
  textTone: "muted" | "subtle";
  onSelect?: () => void;
};

export function SearchCommand({
  onOpenChange,
}: { onOpenChange?: (open: boolean) => void } = {}) {
  const router = useRouter();
  const { searchOpen: open, setSearchOpen } = useSideNav();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setSearchOpen(next);
      onOpenChange?.(next);
    },
    [setSearchOpen, onOpenChange],
  );

  const navigate = useCallback(
    (href: string) => {
      handleOpenChange(false);
      router.push(href);
    },
    [router, handleOpenChange],
  );

  const recommended: Row[] = [
    {
      icon: <DollarIcon />,
      label: "Topup Harry Styles Podcast x Shania Twain Clipping [7434]",
      textTone: "muted",
      onSelect: () => navigate("/campaigns"),
    },
    {
      icon: <EyeIcon />,
      label:
        "Review submissions for Harry Styles Podcast x Shania Twain Clipping [7434]",
      textTone: "muted",
      onSelect: () => navigate("/submissions"),
    },
  ];

  const actions: Row[] = [
    { icon: <PlusIcon />, label: "Create new campaign", textTone: "subtle" },
    { icon: <LinkIcon />, label: "Create short link", textTone: "subtle" },
    { icon: <UserAddIcon />, label: "Invite team member", textTone: "subtle" },
  ];

  const allRows = [...recommended, ...actions];
  const dividerIndex = recommended.length;

  const listRef = useRef<HTMLDivElement>(null);
  const {
    activeIndex,
    itemRects,
    sessionRef,
    handlers,
    registerItem,
    measureItems,
  } = useProximityHover(listRef);

  useEffect(() => {
    if (open) {
      measureItems();
    }
  }, [open, selectedTabIndex, measureItems]);

  const activeRect =
    activeIndex !== null && activeIndex >= 0 && activeIndex < allRows.length
      ? itemRects[activeIndex]
      : null;

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandDialogTrigger className="relative z-10 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sidebar-text-muted">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M11.3333 11.3327L8.69998 8.69934M9.99999 5.33268C9.99999 7.91001 7.91065 9.99935 5.33332 9.99935C2.75599 9.99935 0.666656 7.91001 0.666656 5.33268C0.666656 2.75535 2.75599 0.666016 5.33332 0.666016C7.91065 0.666016 9.99999 2.75535 9.99999 5.33268Z"
            stroke="currentColor"
            strokeWidth="1.33333"
            strokeLinecap="round"
          />
        </svg>
      </CommandDialogTrigger>
      <CommandDialogPopup className="w-[520px] max-h-[80vh] max-w-[520px] overflow-hidden rounded-[20px] border-0 bg-card-bg shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)]">
        <div className="flex flex-col">
          <div className="relative flex h-14 items-center gap-2 bg-foreground/[0.04] px-5 py-3">
            <SearchIcon className="shrink-0 text-page-text-subtle" />
            <input
              autoFocus
              placeholder="Search"
              className="flex-1 border-none bg-transparent text-[14px] leading-[120%] tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-subtle"
            />
            <Kbd>⌘K</Kbd>
          </div>

          <Tabs
            variant="underline"
            selectedIndex={selectedTabIndex}
            onSelect={setSelectedTabIndex}
            className="px-1.5"
          >
            {TABS.map((label, i) => (
              <TabItem key={label} index={i} label={label} />
            ))}
          </Tabs>
        </div>

        <div
          ref={listRef}
          className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-3 pt-4"
          onMouseEnter={handlers.onMouseEnter}
          onMouseMove={handlers.onMouseMove}
          onMouseLeave={handlers.onMouseLeave}
        >
          <AnimatePresence>
            {activeRect && (
              <motion.div
                key={sessionRef.current}
                className="pointer-events-none absolute rounded-[10px] bg-foreground/[0.04]"
                initial={{ opacity: 0, ...activeRect }}
                animate={{ opacity: 1, ...activeRect }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{
                  ...springs.moderate,
                  opacity: { duration: 0.16 },
                }}
              />
            )}
          </AnimatePresence>

          <span className="pb-2 text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
            Recommended
          </span>

          {recommended.map((row, i) => (
            <button
              key={`rec-${i}`}
              type="button"
              ref={(el) => registerItem(i, el)}
              onClick={row.onSelect}
              className={cn(
                "relative z-10 flex h-10 w-full cursor-pointer select-none items-center gap-2 rounded-[10px] py-2 pl-4 pr-3 text-left font-medium text-[14px] leading-none tracking-[-0.02em] outline-none",
                row.textTone === "muted"
                  ? "text-page-text-muted"
                  : "text-page-text-subtle",
              )}
            >
              <span className="flex size-4 shrink-0 items-center justify-center text-page-text-muted">
                {row.icon}
              </span>
              <span className="min-w-0 flex-1 truncate">{row.label}</span>
            </button>
          ))}

          <div className="my-4 h-px w-full bg-foreground/[0.06]" />

          <span className="pb-2 text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
            Actions
          </span>

          {actions.map((row, i) => {
            const idx = dividerIndex + i;
            return (
              <button
                key={`act-${i}`}
                type="button"
                ref={(el) => registerItem(idx, el)}
                onClick={row.onSelect}
                className={cn(
                  "relative z-10 flex h-10 w-full cursor-pointer select-none items-center gap-2 rounded-[10px] py-2 pl-4 pr-3 text-left font-medium text-[14px] leading-none tracking-[-0.02em] outline-none",
                  row.textTone === "muted"
                    ? "text-page-text-muted"
                    : "text-page-text-subtle",
                )}
              >
                <span className="flex size-4 shrink-0 items-center justify-center text-page-text-muted">
                  {row.icon}
                </span>
                <span className="min-w-0 flex-1 truncate">{row.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-foreground/[0.06] bg-card-bg px-5 pb-5 pt-3">
          <span className="text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
            Navigate with arrows
          </span>
          <div className="flex items-center gap-1">
            <Kbd>Esc</Kbd>
            <span className="text-[12px] leading-none tracking-[-0.02em] text-page-text-muted">
              to close
            </span>
          </div>
        </div>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
