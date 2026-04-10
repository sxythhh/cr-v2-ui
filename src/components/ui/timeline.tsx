"use client";

import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

/* ── Context ── */
const TimelineCtx = createContext<{ activeStep: number }>({ activeStep: 0 });

/* ── Timeline ── */
interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
}

function Timeline({ defaultValue = 0, className, children, ...props }: TimelineProps) {
  return (
    <TimelineCtx.Provider value={{ activeStep: defaultValue }}>
      <div
        className={cn("group/timeline flex flex-col", className)}
        data-orientation="vertical"
        data-slot="timeline"
        {...props}
      >
        {children}
      </div>
    </TimelineCtx.Provider>
  );
}

/* ── TimelineItem ── */
interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  isLast?: boolean;
}

function TimelineItem({ step, isLast, className, children, ...props }: TimelineItemProps) {
  const { activeStep } = useContext(TimelineCtx);
  const completed = step <= activeStep;

  return (
    <div
      className={cn(
        "group/timeline-item relative flex flex-col gap-0.5 not-last:pb-6",
        className
      )}
      data-completed={completed || undefined}
      data-slot="timeline-item"
      {...props}
    >
      {children}
    </div>
  );
}

/* ── TimelineIndicator ── */
function TimelineIndicator({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute -translate-x-1/2 size-4 rounded-full border-2 border-primary/20 top-0 group-data-completed/timeline-item:border-primary",
        className
      )}
      data-slot="timeline-indicator"
      {...props}
    >
      {children}
    </div>
  );
}

/* ── TimelineSeparator (vertical line) ── */
function TimelineSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute -translate-x-1/2 w-0.5 rounded-full bg-primary/10 group-last/timeline-item:hidden",
        className
      )}
      data-slot="timeline-separator"
      {...props}
    />
  );
}

/* ── TimelineHeader ── */
function TimelineHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} data-slot="timeline-header" {...props}>
      {children}
    </div>
  );
}

/* ── TimelineTitle ── */
function TimelineTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-medium text-sm", className)} data-slot="timeline-title" {...props}>
      {children}
    </h3>
  );
}

/* ── TimelineContent ── */
function TimelineContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} data-slot="timeline-content" {...props}>
      {children}
    </div>
  );
}

/* ── TimelineDate ── */
function TimelineDate({ className, children, ...props }: React.HTMLAttributes<HTMLTimeElement>) {
  return (
    <time className={cn("text-xs font-medium text-muted-foreground", className)} data-slot="timeline-date" {...props}>
      {children}
    </time>
  );
}

export {
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineIndicator,
  TimelineSeparator,
  TimelineHeader,
  TimelineTitle,
  TimelineDate,
};
