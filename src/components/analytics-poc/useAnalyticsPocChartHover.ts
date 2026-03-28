"use client";

import { type RefObject, useEffect, useMemo, useState, useCallback, useRef } from "react";

export interface AnalyticsPocChartHoverPoint {
  index: number;
  x: number;
  label: string;
}

interface RechartsHoverState {
  isTooltipActive?: boolean;
  activeTooltipIndex?: number | string;
  activeCoordinate?: {
    x?: number | string;
  };
  activePayload?: Array<{
    payload?: {
      label?: string;
    };
  }>;
}

interface UseAnalyticsPocChartHoverOptions {
  chartContainerRef: RefObject<HTMLElement | null>;
  data: Array<{
    label: string;
  }>;
  isEnabled: boolean;
}

function toFiniteNumber(value: number | string | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function isTouchPointerEnvironment() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

function normalizeHoverState(
  eventState: unknown,
  data: Array<{ label: string }>,
): AnalyticsPocChartHoverPoint | null {
  if (!eventState || typeof eventState !== "object") {
    return null;
  }

  const {
    activeCoordinate,
    activePayload,
    activeTooltipIndex,
    isTooltipActive,
  } = eventState as RechartsHoverState;

  if (!isTooltipActive) {
    return null;
  }

  const index = toFiniteNumber(activeTooltipIndex);
  const x = toFiniteNumber(activeCoordinate?.x);

  if (index === undefined || x === undefined) {
    return null;
  }

  if (index < 0 || index >= data.length) {
    return null;
  }

  // Clamp x to valid range — Recharts can report coordinates outside the plot area on touch
  const clampedX = Math.max(0, x);

  const payloadLabel = activePayload?.[0]?.payload?.label;
  const fallbackLabel = data[index]?.label;
  const label = payloadLabel ?? fallbackLabel;

  if (!label) {
    return null;
  }

  return { index, label, x: clampedX };
}

export function useAnalyticsPocChartHover({
  chartContainerRef,
  data,
  isEnabled,
}: UseAnalyticsPocChartHoverOptions) {
  const [transientHover, setTransientHover] =
    useState<AnalyticsPocChartHoverPoint | null>(null);
  const [pinnedHover, setPinnedHover] =
    useState<AnalyticsPocChartHoverPoint | null>(null);
  const [touchDragging, setTouchDragging] = useState(false);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isEnabled) {
      return;
    }

    setTransientHover(null);
    setPinnedHover(null);
    setTouchDragging(false);
  }, [isEnabled]);

  useEffect(() => {
    if (!pinnedHover) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const container = chartContainerRef.current;
      const target = event.target;

      if (!container || !(target instanceof Node)) {
        return;
      }

      if (container.contains(target)) {
        return;
      }

      setPinnedHover(null);
      setTransientHover(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [chartContainerRef, pinnedHover]);

  // Native mouseleave fallback — Recharts' onMouseLeave can miss fast exits
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !isEnabled) return;

    const handleNativeLeave = () => {
      if (!pinnedHover && !touchDragging) {
        setTransientHover(null);
      }
    };

    container.addEventListener("mouseleave", handleNativeLeave);
    return () => container.removeEventListener("mouseleave", handleNativeLeave);
  }, [chartContainerRef, isEnabled, pinnedHover, touchDragging]);

  // Touch drag support: long press activates, drag updates, release dismisses
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container || !isEnabled) return;

    // Find the Recharts SVG element inside the container
    const findChartSvg = () => container.querySelector(".recharts-wrapper svg") as SVGSVGElement | null;

    const getIndexFromTouch = (clientX: number): AnalyticsPocChartHoverPoint | null => {
      const svg = findChartSvg();
      if (!svg || data.length === 0) return null;

      const rect = svg.getBoundingClientRect();
      // Find the line paths to determine actual plot bounds
      const linePaths = svg.querySelectorAll(".recharts-line-curve");
      let plotLeft = rect.left + 4;
      let plotRight = rect.right - 4;
      if (linePaths.length > 0) {
        let minX = Infinity;
        let maxX = -Infinity;
        linePaths.forEach((path) => {
          const pathRect = path.getBoundingClientRect();
          if (pathRect.width > 0) {
            minX = Math.min(minX, pathRect.left);
            maxX = Math.max(maxX, pathRect.right);
          }
        });
        if (minX < Infinity && maxX > -Infinity) {
          plotLeft = minX;
          plotRight = maxX;
        }
      }
      const plotWidth = plotRight - plotLeft;

      if (plotWidth <= 0) return null;

      const fraction = Math.max(0, Math.min(1, (clientX - plotLeft) / plotWidth));
      const index = Math.round(fraction * (data.length - 1));
      const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
      const x = plotLeft - rect.left + (clampedIndex / Math.max(1, data.length - 1)) * plotWidth;

      return {
        index: clampedIndex,
        x,
        label: data[clampedIndex]?.label ?? "",
      };
    };

    let isLongPressing = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);

      touchTimerRef.current = setTimeout(() => {
        isLongPressing = true;
        setTouchDragging(true);

        const touch = e.touches[0];
        if (touch) {
          const point = getIndexFromTouch(touch.clientX);
          if (point) {
            setPinnedHover(null);
            setTransientHover(point);
          }
        }

        // Prevent scroll while dragging chart
        const preventScroll = (ev: TouchEvent) => {
          if (isLongPressing) ev.preventDefault();
        };
        container.addEventListener("touchmove", preventScroll, { passive: false });
        const cleanup = () => {
          container.removeEventListener("touchmove", preventScroll);
        };
        container.addEventListener("touchend", cleanup, { once: true });
        container.addEventListener("touchcancel", cleanup, { once: true });
      }, 200); // 200ms long press threshold
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isLongPressing) return;

      const touch = e.touches[0];
      if (touch) {
        // Dismiss if touch is far outside the chart container
        const svg = findChartSvg();
        if (svg) {
          const rect = svg.getBoundingClientRect();
          if (touch.clientX < rect.left - 20 || touch.clientX > rect.right + 20) {
            setTransientHover(null);
            return;
          }
        }
        const point = getIndexFromTouch(touch.clientX);
        if (point) {
          setTransientHover(point);
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
      isLongPressing = false;
      setTouchDragging(false);
      setTransientHover(null);
      setPinnedHover(null);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [chartContainerRef, data, isEnabled]);

  useEffect(() => {
    if (pinnedHover && pinnedHover.index >= data.length) {
      setPinnedHover(null);
    }

    if (transientHover && transientHover.index >= data.length) {
      setTransientHover(null);
    }
  }, [data.length, pinnedHover, transientHover]);

  const handleMouseMove = useCallback((eventState: unknown) => {
    if (!isEnabled || pinnedHover || touchDragging) {
      return;
    }

    setTransientHover(normalizeHoverState(eventState, data));
  }, [isEnabled, pinnedHover, touchDragging, data]);

  const handleMouseLeave = useCallback(() => {
    if (!isEnabled || pinnedHover || touchDragging) {
      return;
    }

    setTransientHover(null);
  }, [isEnabled, pinnedHover, touchDragging]);

  const handleChartClick = useCallback((eventState: unknown) => {
    if (!isEnabled || !isTouchPointerEnvironment() || touchDragging) {
      return;
    }

    const nextHoverPoint = normalizeHoverState(eventState, data);
    if (!nextHoverPoint) {
      setPinnedHover(null);
      setTransientHover(null);
      return;
    }

    setPinnedHover((previousPinnedHover) => {
      if (previousPinnedHover?.index === nextHoverPoint.index) {
        return null;
      }

      return nextHoverPoint;
    });
    setTransientHover(null);
  }, [isEnabled, touchDragging, data]);

  const activeHover = useMemo(
    () => pinnedHover ?? transientHover,
    [pinnedHover, transientHover],
  );

  return {
    activeHover,
    handleChartClick,
    handleMouseLeave,
    handleMouseMove,
    pinnedHover,
    transientHover,
  };
}
