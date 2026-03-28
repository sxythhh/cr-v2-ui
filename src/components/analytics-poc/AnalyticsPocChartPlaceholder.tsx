"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  AnalyticsPocChartTooltip,
  type AnalyticsPocChartTooltipRow,
} from "./AnalyticsPocChartTooltip";
import type {
  AnalyticsPocChartPlaceholderProps,
  AnalyticsPocPerformanceLineSeries,
  AnalyticsPocStackedBarSeries,
} from "./types";
import { useAnalyticsPocChartHover } from "./useAnalyticsPocChartHover";

const PERFORMANCE_TOOLTIP_WIDTH = 200;
const PERFORMANCE_TOOLTIP_SIDE_GAP = 12;
const HOVER_DIM_OPACITY = 0.32;
const HOVER_FOCUS_TOTAL_WIDTH = 44;
const HOVER_FOCUS_CORE_WIDTH = 12;
const HOVER_FOCUS_EDGE_FADE_WIDTH = 16;
const HOVER_OPACITY_TRANSITION_MS = 200;
const TOGGLE_OPACITY_TRANSITION_MS = 380;
const HOVER_OPACITY_TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const LINE_START_FADE_OPACITY = 0.2;
const LINE_START_FADE_END_OFFSET = "14%";
const STACKED_BAR_MAX_SIZE = 40;
const STACKED_BAR_CATEGORY_GAP = "20%";

// ── Animated Y-axis labels ──────────────────────────────────────────

/** Parse a compact label like "100k", "1.5k", "8%", "800" into a raw number + suffix */
function parseYLabel(label: string): { value: number; suffix: string } {
  const trimmed = label.trim();
  const match = trimmed.match(/^([+-]?\d*\.?\d+)\s*(%|[kKmMbB]?)$/);
  if (!match) return { value: 0, suffix: "" };

  let num = Number.parseFloat(match[1]);
  const suffix = match[2];

  // Normalize multiplier suffixes to raw number for interpolation
  if (suffix === "k" || suffix === "K") num *= 1000;
  else if (suffix === "m" || suffix === "M") num *= 1_000_000;
  else if (suffix === "b" || suffix === "B") num *= 1_000_000_000;

  return { value: Number.isFinite(num) ? num : 0, suffix };
}

/** Format an interpolated number back to compact form matching the target label's style */
function formatYLabel(value: number, targetSuffix: string): string {
  if (targetSuffix === "%") {
    // Decide decimal places based on magnitude
    if (Math.abs(value) < 0.05) return "0%";
    if (value === Math.round(value)) return `${Math.round(value)}%`;
    return `${value.toFixed(1).replace(/\.0$/, "")}%`;
  }

  const abs = Math.abs(value);
  if (targetSuffix === "k" || targetSuffix === "K") {
    const v = value / 1000;
    if (abs < 50) return `${Number(v.toFixed(2)).toString()}k`;
    if (v === Math.round(v)) return `${Math.round(v)}k`;
    return `${Number(v.toFixed(1)).toString()}k`;
  }
  if (targetSuffix === "m" || targetSuffix === "M") {
    const v = value / 1_000_000;
    return `${Number(v.toFixed(2)).toString()}M`;
  }

  // Plain number
  if (abs < 1) return "0";
  if (value === Math.round(value)) return `${Math.round(value)}`;
  return `${Number(value.toFixed(1)).toString()}`;
}

const LABEL_ANIM_DURATION_MS = 400;
const LABEL_ANIM_EASING = (t: number) => {
  // cubic-bezier(0.22, 1, 0.36, 1) approximation — ease-out expo
  return 1 - (1 - t) ** 3;
};

function useAnimatedLabels(targetLabels: string[]): string[] {
  const [displayed, setDisplayed] = useState(targetLabels);
  const prevTargetsRef = useRef(targetLabels);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(0);
  const fromValuesRef = useRef<{ value: number; suffix: string }[]>(
    targetLabels.map(parseYLabel),
  );
  const toValuesRef = useRef<{ value: number; suffix: string }[]>(
    targetLabels.map(parseYLabel),
  );

  const animate = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / LABEL_ANIM_DURATION_MS, 1);
    const eased = LABEL_ANIM_EASING(progress);

    const from = fromValuesRef.current;
    const to = toValuesRef.current;
    const interpolated = to.map((target, i) => {
      const source = from[i] ?? target;
      const current = source.value + (target.value - source.value) * eased;
      return formatYLabel(current, target.suffix);
    });

    setDisplayed(interpolated);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, []);

  useEffect(() => {
    const prev = prevTargetsRef.current;
    const changed =
      targetLabels.length !== prev.length ||
      targetLabels.some((label, i) => label !== prev[i]);

    if (!changed) return;

    // Snapshot current displayed values as the "from"
    fromValuesRef.current = prev.map(parseYLabel);
    toValuesRef.current = targetLabels.map(parseYLabel);
    prevTargetsRef.current = targetLabels;

    cancelAnimationFrame(rafRef.current);
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [targetLabels, animate]);

  return displayed;
}

// ── Reduced motion ──────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return prefersReducedMotion;
}


interface StackedBarSegmentShapeProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number | string;
  radius?: number;
}

function toFiniteNumber(value?: number | string) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  if (max < min) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function toGradientOffset(value: number, width: number) {
  if (!Number.isFinite(width) || width <= 0) {
    return "0%";
  }

  return `${(clampNumber(value, 0, width) / width) * 100}%`;
}

function createActiveMetricKeySet(
  visibleMetricKeys: string[] | undefined,
  fallbackMetricKeys: string[],
) {
  return new Set(visibleMetricKeys ?? fallbackMetricKeys);
}

function resolveTooltipLeft({
  activeHoverX,
  chartPlotWidth,
}: {
  activeHoverX: number | undefined;
  chartPlotWidth: number;
}) {
  if (activeHoverX === undefined || chartPlotWidth <= 0) {
    return undefined;
  }

  const maxLeft = Math.max(0, chartPlotWidth - PERFORMANCE_TOOLTIP_WIDTH);
  const preferredRightLeft = activeHoverX + PERFORMANCE_TOOLTIP_SIDE_GAP;

  if (preferredRightLeft + PERFORMANCE_TOOLTIP_WIDTH <= chartPlotWidth) {
    return preferredRightLeft;
  }

  const preferredLeftLeft =
    activeHoverX - PERFORMANCE_TOOLTIP_SIDE_GAP - PERFORMANCE_TOOLTIP_WIDTH;

  if (preferredLeftLeft >= 0) {
    return preferredLeftLeft;
  }

  return clampNumber(preferredRightLeft, 0, maxLeft);
}

function formatPerformanceTooltipValue(
  value: number,
  series: AnalyticsPocPerformanceLineSeries,
) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  const resolvedValueType =
    series.tooltipValueType ?? (series.axis === "right" ? "percent" : "number");

  if (resolvedValueType === "percent") {
    const decimals = series.tooltipDecimals ?? 1;
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value)}%`;
  }

  if (resolvedValueType === "currency") {
    const decimals = series.tooltipDecimals ?? 0;
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      style: "currency",
    }).format(value);
  }

  const decimals = series.tooltipDecimals ?? 0;

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

function buildPerformanceSeriesLine({
  lineKey,
  series,
  stroke,
  strokeOpacity,
  transitionDurationMs,
}: {
  lineKey: string;
  series: AnalyticsPocPerformanceLineSeries;
  stroke: string;
  strokeOpacity: number;
  transitionDurationMs: number;
}) {
  return (
    <Line
      activeDot={false}
      animationDuration={450}
      animationEasing="ease-out"
      dataKey={series.key}
      dot={false}
      fill="none"
      isAnimationActive
      key={lineKey}
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={strokeOpacity}
      strokeWidth={1.5}
      style={{
        transition: `stroke-opacity ${transitionDurationMs}ms ${HOVER_OPACITY_TRANSITION_EASING}`,
      }}
      type="monotone"
      yAxisId={series.axis}
    />
  );
}

function buildPerformanceTooltipRows({
  activeHover,
  activeMetricKeys,
  dataset,
  seriesList,
}: {
  activeHover: { index: number } | null;
  activeMetricKeys: Set<string>;
  dataset: NonNullable<
    AnalyticsPocChartPlaceholderProps["lineChart"]
  >["datasets"]["daily"];
  seriesList: AnalyticsPocPerformanceLineSeries[];
}) {
  if (!activeHover) {
    return [];
  }

  const dataPoint = dataset[activeHover.index];
  if (!dataPoint) {
    return [];
  }

  return seriesList
    .filter((series) => activeMetricKeys.has(series.key))
    .map((series) => ({
      color: series.color,
      key: series.key,
      label: series.label,
      value: formatPerformanceTooltipValue(dataPoint[series.key], series),
    }));
}

function buildPerformanceSeriesLayers({
  activeMetricKeys,
  hoverFocusGradientIdPrefix,
  lineGradientIdPrefix,
  seriesList,
  shouldRenderFocusWindow,
}: {
  activeMetricKeys: Set<string>;
  hoverFocusGradientIdPrefix: string;
  lineGradientIdPrefix: string;
  seriesList: AnalyticsPocPerformanceLineSeries[];
  shouldRenderFocusWindow: boolean;
}) {
  return seriesList.flatMap((series) => {
    const isActive = activeMetricKeys.has(series.key);
    const restStroke = `url(#${lineGradientIdPrefix}-${series.key})`;
    const focusStroke = `url(#${hoverFocusGradientIdPrefix}-${series.key})`;
    const baseStroke = shouldRenderFocusWindow ? series.color : restStroke;
    const baseOpacity = isActive
      ? shouldRenderFocusWindow
        ? HOVER_DIM_OPACITY
        : 1
      : 0;
    const focusOpacity = isActive && shouldRenderFocusWindow ? 1 : 0;
    // Use longer transition for toggle (active↔inactive), shorter for hover dim
    const baseTransitionMs = isActive
      ? HOVER_OPACITY_TRANSITION_MS
      : TOGGLE_OPACITY_TRANSITION_MS;

    return [
      buildPerformanceSeriesLine({
        lineKey: `${series.key}-base`,
        series,
        stroke: baseStroke,
        strokeOpacity: baseOpacity,
        transitionDurationMs: baseTransitionMs,
      }),
      buildPerformanceSeriesLine({
        lineKey: `${series.key}-focus`,
        series,
        stroke: focusStroke,
        strokeOpacity: focusOpacity,
        transitionDurationMs: HOVER_OPACITY_TRANSITION_MS,
      }),
    ];
  });
}

function StackedBarSegmentShape({
  x,
  y,
  width,
  height,
  fill,
  stroke,
  strokeWidth = 1,
  opacity,
  radius: radiusProp = 0,
}: StackedBarSegmentShapeProps) {
  const normalizedX = toFiniteNumber(x);
  const normalizedY = toFiniteNumber(y);
  const normalizedWidth = toFiniteNumber(width);
  const normalizedHeight = toFiniteNumber(height);
  const normalizedOpacity = toFiniteNumber(opacity);

  if (
    normalizedX === undefined ||
    normalizedY === undefined ||
    normalizedWidth === undefined ||
    normalizedHeight === undefined ||
    normalizedWidth <= 0 ||
    normalizedHeight <= 0
  ) {
    return null;
  }

  const r2 = Math.max(0, Math.min(radiusProp, normalizedWidth / 2, normalizedHeight / 2));

  return (
    <g
      opacity={
        normalizedOpacity === undefined
          ? undefined
          : clampNumber(normalizedOpacity, 0, 1)
      }
    >
      <rect x={normalizedX} y={normalizedY} width={normalizedWidth} height={normalizedHeight} rx={r2} ry={r2} fill="var(--card-bg, #FFFFFF)" />
      <rect x={normalizedX} y={normalizedY} width={normalizedWidth} height={normalizedHeight} rx={r2} ry={r2} fill={fill ?? "transparent"} fillOpacity={0.3} />
      <rect x={normalizedX} y={normalizedY} width={normalizedWidth} height={normalizedHeight} rx={r2} ry={r2} fill="none" stroke="var(--card-bg, #FFFFFF)" strokeWidth={1} />
    </g>
  );
}

function OverlappingBarShape({
  x,
  y,
  width,
  height,
  color,
}: {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  color: string;
}) {
  const nx = toFiniteNumber(x);
  const ny = toFiniteNumber(y);
  const nw = toFiniteNumber(width);
  const nh = toFiniteNumber(height);
  if (nx === undefined || ny === undefined || nw === undefined || nh === undefined || nw <= 0 || nh <= 0) return null;

  const r = Math.min(nw / 2, 14);
  const bottom = ny + nh;

  const d = [
    `M${nx},${bottom}`,
    `L${nx},${ny + r}`,
    `Q${nx},${ny} ${nx + r},${ny}`,
    `L${nx + nw - r},${ny}`,
    `Q${nx + nw},${ny} ${nx + nw},${ny + r}`,
    `L${nx + nw},${bottom}`,
    "Z",
  ].join(" ");

  return (
    <g>
      {/* White base fill */}
      <path d={d} fill="var(--card-bg)" />
      {/* Colored fill at 30% opacity */}
      <path d={d} fill={color} fillOpacity={0.3} />
      {/* White stroke border (only top + sides, not bottom) */}
      <path
        d={[
          `M${nx},${bottom}`,
          `L${nx},${ny + r}`,
          `Q${nx},${ny} ${nx + r},${ny}`,
          `L${nx + nw - r},${ny}`,
          `Q${nx + nw},${ny} ${nx + nw},${ny + r}`,
          `L${nx + nw},${bottom}`,
        ].join(" ")}
        fill="none"
        stroke="var(--card-bg)"
        strokeWidth={1}
      />
    </g>
  );
}

function formatStackedTooltipValue(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function buildStackedTooltipRows({
  activeHover,
  activeMetricKeys,
  dataset,
  seriesList,
}: {
  activeHover: { index: number } | null;
  activeMetricKeys: Set<string>;
  dataset: NonNullable<
    AnalyticsPocChartPlaceholderProps["stackedBarChart"]
  >["points"];
  seriesList: AnalyticsPocStackedBarSeries[];
}) {
  if (!activeHover) {
    return [];
  }

  const dataPoint = dataset[activeHover.index];
  if (!dataPoint) {
    return [];
  }

  return seriesList
    .filter((series) => activeMetricKeys.has(series.key))
    .map((series) => ({
      color: series.color,
      key: series.key,
      label: series.label,
      value: formatStackedTooltipValue(dataPoint[series.key]),
    }));
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Keeping hover layout and synchronized overlays in one place avoids chart drift between layers.
function PerformanceMainLineChartBody({
  activeLineDataset,
  lineChart,
  visibleMetricKeys,
  onDayClick,
}: {
  activeLineDataset: "daily" | "cumulative";
  lineChart: NonNullable<AnalyticsPocChartPlaceholderProps["lineChart"]>;
  visibleMetricKeys?: string[];
  onDayClick?: (index: number, label: string) => void;
}) {
  const chartHoverRootRef = useRef<HTMLDivElement>(null);
  const chartPlotAreaRef = useRef<HTMLDivElement>(null);
  const [measuredPlotWidth, setMeasuredPlotWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const hasRightAxis = !isMobile && Boolean(lineChart.rightYLabels?.length);
  const lineGradientIdPrefix = useId().replace(/:/g, "");
  const hoverFocusGradientIdPrefix = useId().replace(/:/g, "");

  // Measure chart plot area width accurately via ResizeObserver
  useEffect(() => {
    const el = chartPlotAreaRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setMeasuredPlotWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dataset =
    lineChart.datasets[activeLineDataset] ?? lineChart.datasets.daily;
  const activeMetricKeys = useMemo(
    () =>
      createActiveMetricKeySet(
        visibleMetricKeys,
        lineChart.series.map((series) => series.key),
      ),
    [lineChart.series, visibleMetricKeys],
  );

  const isInteractionEnabled = activeMetricKeys.size > 0;
  const { activeHover, handleChartClick, handleMouseLeave, handleMouseMove } =
    useAnalyticsPocChartHover({
      chartContainerRef: chartHoverRootRef,
      data: dataset,
      isEnabled: isInteractionEnabled,
    });

  const handleLineChartClick = (eventState: unknown) => {
    handleChartClick(eventState);
    if (!onDayClick || !eventState || typeof eventState !== "object") return;
    const state = eventState as {
      activeTooltipIndex?: number | string;
      activePayload?: Array<{ payload?: { label?: string } }>;
    };
    const index =
      typeof state.activeTooltipIndex === "number"
        ? state.activeTooltipIndex
        : undefined;
    const label = state.activePayload?.[0]?.payload?.label;
    if (index !== undefined && label) {
      onDayClick(index, label);
    }
  };

  const chartContainerWidth = measuredPlotWidth || (chartPlotAreaRef.current?.clientWidth ?? 0);
  const chartRightMargin = hasRightAxis ? 48 : 24;
  const chartPlotWidth = Math.max(1, chartContainerWidth - chartRightMargin);
  // Derive hover X from data index for reliable gradient alignment —
  // Recharts' activeCoordinate.x can drift due to margin/padding discrepancies.
  const dataLength = dataset.length;
  const activeHoverX =
    activeHover && chartPlotWidth > 0 && dataLength > 1
      ? (activeHover.index / (dataLength - 1)) * chartPlotWidth
      : undefined;
  const tooltipLeft = resolveTooltipLeft({ activeHoverX, chartPlotWidth });

  const tooltipRows = useMemo<AnalyticsPocChartTooltipRow[]>(() => {
    return buildPerformanceTooltipRows({
      activeHover,
      activeMetricKeys,
      dataset,
      seriesList: lineChart.series,
    });
  }, [activeHover, activeMetricKeys, dataset, lineChart.series]);

  const activeHoverLabel = activeHover?.label ?? "";
  const shouldShowHoverState = Boolean(
    activeHoverLabel &&
      activeHoverX !== undefined &&
      tooltipLeft !== undefined &&
      tooltipRows.length > 0,
  );
  const focusCenterX =
    shouldShowHoverState && activeHoverX !== undefined && chartPlotWidth > 0
      ? activeHoverX
      : undefined;
  const focusHalfCore = HOVER_FOCUS_CORE_WIDTH / 2;
  const focusHalfTotal = Math.min(
    HOVER_FOCUS_TOTAL_WIDTH / 2,
    focusHalfCore + HOVER_FOCUS_EDGE_FADE_WIDTH,
  );
  const focusLeft =
    focusCenterX !== undefined ? focusCenterX - focusHalfTotal : 0;
  const focusRight =
    focusCenterX !== undefined ? focusCenterX + focusHalfTotal : 0;
  const leftFadeStartX =
    focusCenterX !== undefined ? clampNumber(focusLeft, 0, chartPlotWidth) : 0;
  const leftFadeEndX =
    focusCenterX !== undefined
      ? clampNumber(focusCenterX - focusHalfCore, 0, chartPlotWidth)
      : 0;
  const rightFadeStartX =
    focusCenterX !== undefined
      ? clampNumber(focusCenterX + focusHalfCore, 0, chartPlotWidth)
      : 0;
  const rightFadeEndX =
    focusCenterX !== undefined ? clampNumber(focusRight, 0, chartPlotWidth) : 0;
  const shouldRenderFocusWindow = focusCenterX !== undefined;
  const leftFadeStartOffset = toGradientOffset(leftFadeStartX, chartPlotWidth);
  const leftFadeEndOffset = toGradientOffset(leftFadeEndX, chartPlotWidth);
  const rightFadeStartOffset = toGradientOffset(
    rightFadeStartX,
    chartPlotWidth,
  );
  const rightFadeEndOffset = toGradientOffset(rightFadeEndX, chartPlotWidth);
  const renderedSeriesLines = useMemo(
    () =>
      buildPerformanceSeriesLayers({
        activeMetricKeys,
        hoverFocusGradientIdPrefix,
        lineGradientIdPrefix,
        seriesList: lineChart.series,
        shouldRenderFocusWindow,
      }),
    [
      activeMetricKeys,
      hoverFocusGradientIdPrefix,
      lineGradientIdPrefix,
      lineChart.series,
      shouldRenderFocusWindow,
    ],
  );

  const primarySeries = lineChart.series.find((s) => activeMetricKeys.has(s.key));
  const primaryColor = primarySeries?.color ?? "rgba(0,0,0,0.4)";
  const primaryYLabels = primarySeries?.yLabels ?? lineChart.yLabels;
  const animatedYLabels = useAnimatedLabels(primaryYLabels);

  const leftDomain: [number, number] =
    primarySeries?.axis === "left" && primarySeries.domain
      ? (primarySeries.domain as [number, number])
      : (lineChart.leftDomain as [number, number]) ?? [0, 100000];
  const rightDomain: [number, number] =
    primarySeries?.axis === "right" && primarySeries.domain
      ? (primarySeries.domain as [number, number])
      : (lineChart.rightDomain as [number, number]) ?? [0, 8];

  return (
    <div className="absolute inset-0 chart-no-focus-ring" ref={chartHoverRootRef}>
      <div className="absolute inset-x-0 bottom-7 top-0 flex items-end gap-4">
        {/* Y-axis labels — left side (hidden on mobile) */}
        <div className="relative hidden h-full w-5 shrink-0 sm:block">
          <div className="absolute inset-0 flex flex-col items-end justify-between">
            {animatedYLabels.map((label, i) => (
              <span
                className="font-inter text-[10px] font-normal leading-[1.2] text-right text-foreground/50"
                key={`y-${i}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative h-full min-h-0 min-w-0 flex-1" ref={chartPlotAreaRef}>
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={dataset}
              margin={{ bottom: 2, left: 0, right: hasRightAxis ? 48 : 24, top: 0 }}
              onClick={handleLineChartClick}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              style={onDayClick ? { cursor: "pointer" } : undefined}
            >
              <XAxis
                dataKey="index"
                domain={[0, dataset.length - 1]}
                height={0}
                hide
                type="number"
              />
              <YAxis
                domain={leftDomain}
                hide
                width={0}
                yAxisId="left"
              />
              <YAxis
                domain={rightDomain}
                hide
                orientation="right"
                width={0}
                yAxisId="right"
              />

              {/* Keep Recharts tooltip tracking enabled without using the default UI */}
              <RechartsTooltip
                content={() => null}
                cursor={false}
                isAnimationActive={false}
                wrapperStyle={{ display: "none" }}
              />

              <defs>
                {lineChart.series.map((series) => {
                  const startFadeGradientId = `${lineGradientIdPrefix}-${series.key}`;
                  const hoverFocusGradientId = `${hoverFocusGradientIdPrefix}-${series.key}`;

                  return [
                    <linearGradient
                      id={startFadeGradientId}
                      key={startFadeGradientId}
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={series.color}
                        stopOpacity={LINE_START_FADE_OPACITY}
                      />
                      <stop
                        offset={LINE_START_FADE_END_OFFSET}
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                    </linearGradient>,
                    <linearGradient
                      id={hoverFocusGradientId}
                      key={hoverFocusGradientId}
                      x1="0"
                      x2="1"
                      y1="0"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                      <stop
                        offset={leftFadeStartOffset}
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                      <stop
                        offset={leftFadeEndOffset}
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                      <stop
                        offset={rightFadeStartOffset}
                        stopColor={series.color}
                        stopOpacity={1}
                      />
                      <stop
                        offset={rightFadeEndOffset}
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                      <stop
                        offset="100%"
                        stopColor={series.color}
                        stopOpacity={0}
                      />
                    </linearGradient>,
                  ];
                })}
              </defs>

              {renderedSeriesLines}
            </LineChart>
          </ResponsiveContainer>

          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10"
            style={{
              opacity: shouldShowHoverState ? 1 : 0,
              transition: "opacity 150ms ease-out",
            }}
          >
            <div
              className="absolute top-2"
              style={{
                left: tooltipLeft ?? 0,
                transition: "left 120ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <AnalyticsPocChartTooltip
                footerText={onDayClick ? "View Submissions" : undefined}
                label={activeHoverLabel}
                onFooterClick={
                  onDayClick && activeHover
                    ? () => onDayClick(activeHover.index, activeHoverLabel)
                    : undefined
                }
                rows={tooltipRows}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Y-axis labels — right side (engagement %) — absolutely positioned */}
      {lineChart.rightYLabels && lineChart.rightYLabels.length > 0 && (
        <div className="absolute right-0 top-0 bottom-7 hidden w-9 flex-col items-end justify-between sm:flex">
          {lineChart.rightYLabels.map((label, i) => {
            const rightSeries = lineChart.series.find((s) => s.axis === "right");
            return (
              <span
                className="font-inter text-[10px] font-normal leading-[1.2] text-right whitespace-nowrap"
                key={`yr-${i}`}
                style={{ color: rightSeries?.color ?? "#C084FC" }}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}

      {/* Hover crosshair line */}
      <div
        className="pointer-events-none absolute top-0 right-0"
        style={{
          bottom: 24,
          left: 36,
        }}
      >
        {/* Dynamic hover line */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: activeHoverX ?? 0,
            width: 0,
            borderLeft: "1px solid var(--foreground)",
            opacity: shouldShowHoverState && activeHoverX !== undefined ? 0.2 : 0,
            transition: "left 100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 100ms ease-out",
          }}
        />
        {/* Static end-date line — fades when hover line overlaps */}
        <div
          className="absolute top-0 bottom-0 transition-opacity duration-100"
          style={{
            right: hasRightAxis ? 47 : 24,
            width: 0,
            borderLeft: "1px solid var(--foreground)",
            opacity: shouldShowHoverState && activeHoverX !== undefined && activeHoverX > chartPlotWidth - 20 ? 0 : 0.2,
          }}
        />
      </div>

      {/* X-axis labels + hover date pill */}
      <div className="absolute bottom-0 right-0 flex h-6 items-center justify-between gap-2" style={{ left: 36 }}>
        {lineChart.xTicks.map((tick, i) => (
          <span
            className={cn(
              "font-inter text-[10px] font-normal leading-[1.2] tracking-[0.1px] text-[var(--ap-text-tertiary)]",
              i === lineChart.xTicks.length - 1 && "invisible",
            )}
            key={`x-${tick.index}-${tick.label}`}
          >
            {tick.label}
          </span>
        ))}

        {/* Hover date pill */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 flex items-center justify-center"
          style={{
            left: activeHoverX ?? 0,
            transform: "translateX(-50%)",
            opacity: shouldShowHoverState ? 1 : 0,
            transition: "left 100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 100ms ease-out",
          }}
        >
          <span className="whitespace-nowrap rounded-full border border-foreground/[0.06] bg-card-bg dark:border-[rgba(224,224,224,0.03)] px-[10px] py-[6px] font-inter text-[10px] font-medium leading-[1.2] tracking-[0.1px] text-page-text-muted">
            {activeHoverLabel}
          </span>
        </div>

        {/* Static end-date pill — fades when hover pill overlaps */}
        <div
          className="pointer-events-none absolute inset-y-0 z-10 flex items-center justify-center transition-opacity duration-100"
          style={{ right: hasRightAxis ? 47 : 24, transform: "translateX(50%)" }}
        >
          <span className="whitespace-nowrap rounded-full bg-[#EBEBEB] px-[10px] py-[6px] font-inter text-[10px] font-medium leading-[1.2] text-foreground/50 dark:bg-[#2a2a2a]">
            {lineChart.xTicks[lineChart.xTicks.length - 1]?.label ?? "Today"}
          </span>
        </div>
      </div>

    </div>
  );
}

function StackedBarChartBody({
  stackedBarChart,
  visibleMetricKeys,
  isAnimationEnabled,
  onDayClick,
}: {
  stackedBarChart: NonNullable<
    AnalyticsPocChartPlaceholderProps["stackedBarChart"]
  >;
  visibleMetricKeys?: string[];
  isAnimationEnabled: boolean;
  onDayClick?: (index: number, label: string) => void;
}) {
  const chartHoverRootRef = useRef<HTMLDivElement>(null);
  const chartPlotAreaRef = useRef<HTMLDivElement>(null);
  const activeMetricKeys = useMemo(
    () =>
      createActiveMetricKeySet(
        visibleMetricKeys,
        stackedBarChart.series.map((series) => series.key),
      ),
    [stackedBarChart.series, visibleMetricKeys],
  );

  const chartPoints = useMemo(
    () =>
      stackedBarChart.points.map((point) => ({
        ...point,
        instagram: activeMetricKeys.has("instagram") ? point.instagram : 0,
        tiktok: activeMetricKeys.has("tiktok") ? point.tiktok : 0,
        x: activeMetricKeys.has("x") ? point.x : 0,
        youtube: activeMetricKeys.has("youtube") ? point.youtube : 0,
      })),
    [activeMetricKeys, stackedBarChart.points],
  );
  // On mobile, show fewer bars (weekly view ~7 points)
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const obs = new MutationObserver(checkDark);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const displayPoints = useMemo(() => {
    if (!isMobile || chartPoints.length <= 7) return chartPoints;
    // Show last 7 data points for weekly view on mobile
    return chartPoints.slice(-7);
  }, [chartPoints, isMobile]);

  const renderedStackSeries = [...stackedBarChart.series].reverse();
  // Find the topmost VISIBLE series key (last in renderedStackSeries that is active)
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

  const topVisibleSeriesKey = useMemo(() => {
    for (let i = renderedStackSeries.length - 1; i >= 0; i--) {
      if (activeMetricKeys.has(renderedStackSeries[i].key)) {
        return renderedStackSeries[i].key;
      }
    }
    return null;
  }, [renderedStackSeries, activeMetricKeys]);
  const isInteractionEnabled = activeMetricKeys.size > 0;
  const { activeHover, handleChartClick, handleMouseLeave, handleMouseMove } =
    useAnalyticsPocChartHover({
      chartContainerRef: chartHoverRootRef,
      data: chartPoints,
      isEnabled: isInteractionEnabled,
    });

  const handleBarChartClick = (eventState: unknown) => {
    handleChartClick(eventState);
    if (!onDayClick || !eventState || typeof eventState !== "object") return;
    const state = eventState as {
      activeTooltipIndex?: number | string;
      activePayload?: Array<{ payload?: { label?: string } }>;
    };
    const index =
      typeof state.activeTooltipIndex === "number"
        ? state.activeTooltipIndex
        : undefined;
    const label = state.activePayload?.[0]?.payload?.label;
    if (index !== undefined && label) {
      onDayClick(index, label);
    }
  };

  const chartPlotWidth = chartPlotAreaRef.current?.clientWidth ?? 0;
  const activeHoverX =
    activeHover && chartPlotWidth > 0
      ? clampNumber(activeHover.x, 0, chartPlotWidth)
      : undefined;
  const tooltipLeft = resolveTooltipLeft({ activeHoverX, chartPlotWidth });
  const tooltipRows = useMemo<AnalyticsPocChartTooltipRow[]>(() => {
    return buildStackedTooltipRows({
      activeHover,
      activeMetricKeys,
      dataset: chartPoints,
      seriesList: stackedBarChart.series,
    });
  }, [activeHover, activeMetricKeys, chartPoints, stackedBarChart.series]);
  const activeHoverLabel = activeHover?.label ?? "";
  const shouldShowHoverState = Boolean(
    activeHoverLabel &&
      activeHoverX !== undefined &&
      tooltipLeft !== undefined &&
      tooltipRows.length > 0,
  );

  // Compute dynamic max from visible data
  const dynamicMax = useMemo(() => {
    const seriesKeys = stackedBarChart.series.map((s) => s.key);
    const visibleKeys = seriesKeys.filter((k) => activeMetricKeys.has(k));
    if (visibleKeys.length === 0) return 1;
    return Math.max(
      ...displayPoints.map((point) =>
        visibleKeys.reduce((sum, key) => sum + (Number((point as unknown as Record<string, unknown>)[key]) || 0), 0),
      ),
      1,
    );
  }, [displayPoints, activeMetricKeys, stackedBarChart.series]);

  // Compute nice yLabels from dynamic max
  const dynamicYLabels = useMemo(() => {
    const steps = stackedBarChart.yLabels.length - 1;
    if (steps <= 0) return stackedBarChart.yLabels;
    // Round max up to a nice number
    const magnitude = 10 ** Math.floor(Math.log10(dynamicMax));
    const niceMax = Math.ceil(dynamicMax / magnitude) * magnitude;
    const labels: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = niceMax * (1 - i / steps);
      if (val >= 1000) {
        const k = val / 1000;
        labels.push(k === Math.round(k) ? `${Math.round(k)}k` : `${k.toFixed(1)}k`);
      } else {
        labels.push(`${Math.round(val)}`);
      }
    }
    return labels;
  }, [dynamicMax, stackedBarChart.yLabels.length]);

  const animatedYLabels = useAnimatedLabels(dynamicYLabels);
  const maxValue = useMemo(() => {
    const parsed = parseYLabel(dynamicYLabels[0]);
    return parsed.value || dynamicMax;
  }, [dynamicYLabels, dynamicMax]);

  return (
    <div className="absolute inset-0 flex gap-4 overflow-visible chart-no-focus-ring" ref={chartHoverRootRef}>
      <div className="flex h-full w-16 shrink-0 flex-col justify-between pb-7 pt-[7px]">
        {animatedYLabels.map((label, i) => (
          <div className="flex items-center justify-end" key={`left-${i}`}>
            <span
              className="inline-flex h-5 items-center justify-center rounded-md border border-[var(--ap-border,#e5e5e5)] bg-[var(--card-bg,#fff)] px-1.5 font-inter text-[10px] font-normal leading-[1.2] tracking-[0.1px] text-[var(--ap-text-tertiary)]"
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10 min-w-0 flex-1 overflow-visible">
        <div
          className="group/bars absolute inset-x-0 bottom-7 top-0 flex touch-none items-end gap-1"
          ref={chartPlotAreaRef}
          onMouseLeave={() => setHoveredBarIdx(null)}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            const rect = chartPlotAreaRef.current?.getBoundingClientRect();
            if (!touch || !rect) return;
            e.preventDefault();
            const x = touch.clientX - rect.left;
            const barWidth = rect.width / displayPoints.length;
            const idx = Math.min(Math.max(Math.floor(x / barWidth), 0), displayPoints.length - 1);
            setHoveredBarIdx(idx);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const rect = chartPlotAreaRef.current?.getBoundingClientRect();
            if (!touch || !rect) return;
            e.preventDefault();
            const x = touch.clientX - rect.left;
            const barWidth = rect.width / displayPoints.length;
            const idx = Math.min(Math.max(Math.floor(x / barWidth), 0), displayPoints.length - 1);
            setHoveredBarIdx(idx);
          }}
          onTouchEnd={() => {
            setTimeout(() => setHoveredBarIdx(null), 600);
          }}
        >
          {displayPoints.map((point, pointIdx) => {
            const record = point as unknown as Record<string, unknown>;
            const label = String(record.label ?? pointIdx);
            // Stack heights: each visible series contributes a segment
            const segments = renderedStackSeries.map((series) => ({
              key: series.key,
              color: series.color,
              value: Number(record[series.key]) || 0,
              visible: activeMetricKeys.has(series.key),
            }));
            const totalVisible = segments.filter((s) => s.visible).reduce((sum, s) => sum + s.value, 0);
            const totalHeight = maxValue > 0 ? (totalVisible / maxValue) * 100 : 0;

            // Build cumulative heights for overlapping bars (tallest in back)
            const visibleSegments = segments
              .filter((s) => s.visible && s.value > 0)
              .map((s) => ({
                ...s,
                heightPct: maxValue > 0 ? (s.value / maxValue) * 100 : 0,
              }))
              .sort((a, b) => b.value - a.value); // tallest first (renders behind)

            // Cumulative height for stacking — all segments rendered, hidden ones get 0 height
            let cumValue = 0;
            const stackedSegments = segments.map((s) => {
              if (s.visible && s.value > 0) cumValue += s.value;
              return { ...s, cumHeight: s.visible && s.value > 0 ? (maxValue > 0 ? (cumValue / maxValue) * 100 : 0) : 0 };
            }).reverse(); // reverse so tallest (cumulative) renders first (behind)

            const tallestPct = stackedSegments.length > 0 ? Math.max(...stackedSegments.map((s) => s.cumHeight)) : 0;

            return (
              <div
                key={pointIdx}
                className="group/bar relative flex-1 self-end transition-[height,opacity] duration-300 ease-out group-hover/bars:opacity-40 hover:!opacity-100"
                style={{
                  maxWidth: 40,
                  height: `${Math.max(tallestPct, 0.5)}%`,
                }}
                onMouseEnter={() => setHoveredBarIdx(pointIdx)}
              >
                {/* Overlapping bar pills — tallest behind, shortest in front */}
                {stackedSegments.map((seg, i) => {
                  const lightColorMap: Record<string, string> = {
                    "#00994D": "rgba(0,153,77,0.3)",
                    "#AE4EEE": "rgba(174,78,238,0.3)",
                    "#FF3355": "rgba(255,51,85,0.3)",
                    "#8B8D98": "rgba(139,141,152,0.3)",
                  };
                  const darkColorMap: Record<string, string> = {
                    "#00994D": "rgba(52,211,153,0.3)",
                    "#AE4EEE": "rgba(192,132,252,0.3)",
                    "#FF3355": "rgba(251,113,133,0.3)",
                    "#8B8D98": "rgba(139,141,152,0.3)",
                  };
                  const base = isDark ? "#1C1C1C" : "#FFFFFF";
                  const colorMap = isDark ? darkColorMap : lightColorMap;
                  const segColor = colorMap[seg.color] ?? `color-mix(in srgb, ${seg.color} 30%, transparent)`;
                  return (
                    <div
                      key={seg.key}
                      className="absolute inset-x-0 bottom-0 cursor-pointer"
                      style={{
                        height: tallestPct > 0 && seg.cumHeight > 0 ? `${(seg.cumHeight / tallestPct) * 100}%` : 0,
                        background: `linear-gradient(0deg, ${segColor}, ${segColor}), ${base}`,
                        borderWidth: "1px 1px 0 1px",
                        borderStyle: "solid",
                        borderColor: base,
                        borderRadius: 8,
                        zIndex: i,
                        transition: "height 300ms ease-out",
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
          {/* Floating tooltip — two layers: outer fades, inner slides */}
          {(() => {
            const idx = hoveredBarIdx ?? 0;
            const pt = displayPoints[idx];
            const rec = pt ? (pt as unknown as Record<string, unknown>) : {};
            const lbl = String(rec.label ?? idx);
            const segs = renderedStackSeries
              .map((sr) => ({ key: sr.key, color: sr.color, value: Number(rec[sr.key]) || 0, label: stackedBarChart.series.find((s) => s.key === sr.key)?.label ?? sr.key }))
              .filter((s) => activeMetricKeys.has(s.key) && s.value > 0);
            const barCount = displayPoints.length || 1;
            const pct = ((idx + 0.5) / barCount) * 100;
            return (
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-50"
                style={{
                  opacity: hoveredBarIdx !== null ? 1 : 0,
                  transition: "opacity 150ms ease-out",
                }}
              >
                <div
                  className="absolute top-1"
                  style={{
                    left: `${pct}%`,
                    transform: `translateX(${idx <= 1 ? '0%' : idx >= barCount - 2 ? '-100%' : '-50%'})`,
                    transition: "left 120ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <AnalyticsPocChartTooltip
                    label={lbl}
                    rows={segs.map((s) => ({ key: s.key, color: s.color, label: s.label, value: s.value >= 1000 ? `${(s.value / 1000).toFixed(1)}K` : String(s.value) }))}
                  />
                </div>
              </div>
            );
          })()}
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex h-6 items-center justify-between gap-2">
          {(isMobile ? stackedBarChart.xTicks.slice(-7) : stackedBarChart.xTicks).map((tick) => (
            <span
              className="font-inter text-[10px] font-normal leading-[1.2] tracking-[0.1px] text-[var(--ap-text-tertiary)]"
              key={`tick-${tick.index}-${tick.label}`}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyChartState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full items-center justify-center rounded-[14px] border border-dashed border-[var(--ap-border)] bg-background/40",
        className,
      )}
    >
      <span className="font-inter text-xs text-muted-foreground/70">
        Chart data unavailable
      </span>
    </div>
  );
}

export function AnalyticsPocChartPlaceholder({
  variant,
  chartStylePreset = "default",
  lineChart,
  stackedBarChart,
  activeLineDataset = "daily",
  visibleMetricKeys,
  heightClassName = "h-[260px]",
  className,
  onDayClick,
}: AnalyticsPocChartPlaceholderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAnimationEnabled = !prefersReducedMotion;

  if (variant === "line" && lineChart) {
    const isPerformanceMain = chartStylePreset === "performance-main";

    return (
      <div
        className={cn(
          "relative overflow-visible",
          "card-enter-anim [--enter-d:0]",
          isPerformanceMain ? "" : "rounded-[14px] border border-[var(--ap-border)]",
          heightClassName,
          className,
        )}
      >
        <PerformanceMainLineChartBody
          activeLineDataset={activeLineDataset}
          lineChart={lineChart}
          onDayClick={onDayClick}
          visibleMetricKeys={visibleMetricKeys}
        />
      </div>
    );
  }

  if ((variant === "stacked" || variant === "bar") && stackedBarChart) {
    return (
      <div
        className={cn(
          "relative overflow-visible card-enter-anim [--enter-d:0]",
          heightClassName,
          className,
        )}
      >
        <StackedBarChartBody
          isAnimationEnabled={isAnimationEnabled}
          onDayClick={onDayClick}
          stackedBarChart={stackedBarChart}
          visibleMetricKeys={visibleMetricKeys}
        />
      </div>
    );
  }

  return (
    <div className={cn("relative", heightClassName, className)}>
      <EmptyChartState className="h-full" />
    </div>
  );
}
