"use client";

import { cn } from "@/lib/utils";
import {
  AnalyticsPocCardHeader,
} from "./AnalyticsPocCardPrimitives";
import { AnalyticsPocMediumCardBase } from "./AnalyticsPocMediumCardBase";
import { ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS } from "./interaction";
import type { AnalyticsPocHealthCardProps } from "./types";

const RING_SIZE = 148;
const RING_CIRCLE_SIZE = 140;
const RING_STROKE_WIDTH = 4;
const RING_RADIUS = (RING_CIRCLE_SIZE - RING_STROKE_WIDTH) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function HeartbeatIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M13.0152 2.56385C14.0611 5.1781 12.7284 9.0031 6.91521 12.2693C6.76311 12.3548 6.57747 12.3548 6.42537 12.2693C0.612192 9.00312 -0.720565 5.17811 0.325298 2.56387C0.836732 1.28548 1.90854 0.372816 3.16845 0.0912035C4.31407 -0.164862 5.577 0.10875 6.67026 1.03304C7.7635 0.10875 9.02643 -0.164863 10.1721 0.0912005C11.432 0.372811 12.5038 1.28547 13.0152 2.56385ZM6.11648 3.77639C6.03336 3.61015 5.86489 3.50374 5.67907 3.5001C5.49324 3.49645 5.32073 3.59619 5.23116 3.75904L4.27364 5.5H3.16927C2.89313 5.5 2.66927 5.72386 2.66927 6C2.66927 6.27614 2.89313 6.5 3.16927 6.5H4.56927C4.75162 6.5 4.9195 6.40073 5.00738 6.24096L5.64818 5.07586L7.22206 8.22361C7.30518 8.38985 7.47365 8.49626 7.65947 8.4999C7.8453 8.50355 8.01781 8.40381 8.10738 8.24096L9.06491 6.5H10.1693C10.4454 6.5 10.6693 6.27614 10.6693 6C10.6693 5.72386 10.4454 5.5 10.1693 5.5H8.76927C8.58693 5.5 8.41904 5.59927 8.33116 5.75904L7.69036 6.92414L6.11648 3.77639Z" fill="currentColor" fillOpacity="0.7"/>
    </svg>
  );
}

function ScoreRing({
  score,
  progressPercent,
  accentColor,
}: {
  score: string;
  progressPercent: number;
  accentColor: string;
}) {
  const bounded = Math.min(100, Math.max(0, progressPercent));
  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - bounded / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: RING_SIZE, height: RING_SIZE }}
    >
      <svg
        className="absolute inset-0"
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth={RING_STROKE_WIDTH}
          opacity={0.2}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={accentColor}
          strokeWidth={RING_STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-inter text-5xl font-medium leading-none tracking-[-0.96px] text-[var(--ap-text)]">
          {score}
        </span>
        <span
          className="mt-1 font-inter text-xs font-medium leading-none"
          style={{ color: accentColor }}
        >
          Healthy
        </span>
      </div>
    </div>
  );
}

export function AnalyticsPocHealthCard({
  title,
  score,
  statusText,
  ctaLabel,
  progressPercent = 75,
  className,
}: AnalyticsPocHealthCardProps) {
  return (
    <AnalyticsPocMediumCardBase className={className}>
      <AnalyticsPocCardHeader
        title={title}
        icon={<HeartbeatIcon />}
      />

      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex max-w-[220px] flex-col gap-1.5">
            <p className="font-inter text-sm font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ap-text)]">
              Looking healthy!
            </p>
            <p className="font-inter text-sm leading-[1.4] tracking-[-0.02em] text-foreground/70">
              {statusText}
            </p>
          </div>

          <button
            className={cn(
              ANALYTICS_POC_SHARE_BUTTON_INTERACTION_CLASS,
              "w-fit cursor-pointer rounded-full bg-foreground/[0.06] px-3 py-1.5 font-inter text-sm font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-foreground/[0.10]",
            )}
            type="button"
          >
            {ctaLabel}
          </button>
        </div>

        <ScoreRing
          score={score}
          progressPercent={progressPercent}
          accentColor="#34D399"
        />
      </div>
    </AnalyticsPocMediumCardBase>
  );
}
