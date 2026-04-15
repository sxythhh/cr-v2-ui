"use client";

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────

export interface DemoStep {
  id: string;
  target: string;
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right";
  actionLabel?: string;
  advanceOnClick?: boolean;
  route?: string;
  onEnter?: () => void;
}

export interface DemoConfig {
  name: string;
  steps: DemoStep[];
}

interface DemoContextValue {
  active: boolean;
  currentStep: number;
  totalSteps: number;
  start: (config: DemoConfig) => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
}

const DemoContext = createContext<DemoContextValue>({
  active: false, currentStep: 0, totalSteps: 0,
  start: () => {}, stop: () => {}, next: () => {}, prev: () => {},
});

export function useInteractiveDemo() {
  return useContext(DemoContext);
}

// ── Helpers ──────────────────────────────────────────────────────────

function getRect(sel: string): DOMRect | null {
  return document.querySelector(sel)?.getBoundingClientRect() ?? null;
}

function getRadius(sel: string): number {
  const el = document.querySelector(sel);
  if (!el) return 10;
  const raw = getComputedStyle(el).borderTopLeftRadius;
  const v = parseFloat(raw);
  if (!Number.isFinite(v)) return 10;
  if (v > 100) return (el.getBoundingClientRect().height) / 2;
  return v;
}

// ── Spotlight ────────────────────────────────────────────────────────

const PAD = 5;

function Spotlight({ target }: { target: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [r, setR] = useState(10);

  useEffect(() => {
    const upd = () => { setRect(getRect(target)); setR(getRadius(target)); };
    upd();
    window.addEventListener("resize", upd);
    window.addEventListener("scroll", upd, true);
    const id = setInterval(upd, 150);
    return () => { window.removeEventListener("resize", upd); window.removeEventListener("scroll", upd, true); clearInterval(id); };
  }, [target]);

  if (!rect) return null;

  const x = rect.left - PAD, y = rect.top - PAD, w = rect.width + PAD * 2, h = rect.height + PAD * 2;
  const br = Math.min(r + PAD, w / 2, h / 2);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998]">
      <svg className="absolute inset-0 size-full">
        <defs>
          <mask id="demo-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={br} ry={br} fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#demo-mask)" />
      </svg>
      <motion.div
        className="pointer-events-none absolute border-2 border-[#FF7A00]/60"
        style={{ left: x, top: y, width: w, height: h, borderRadius: br }}
        animate={{ borderColor: ["rgba(255,122,0,0.6)", "rgba(255,122,0,0.25)", "rgba(255,122,0,0.6)"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ── Tooltip ──────────────────────────────────────────────────────────

function calcPos(target: DOMRect, tw: number, th: number, pref: DemoStep["placement"] = "bottom") {
  const gap = 14, edge = 12;
  const fits = {
    bottom: target.bottom + gap + th < window.innerHeight - edge,
    top: target.top - gap - th > edge,
    right: target.right + gap + tw < window.innerWidth - edge,
    left: target.left - gap - tw > edge,
  };
  const order: Array<"bottom" | "top" | "right" | "left"> =
    pref === "right" ? ["right", "bottom", "left", "top"] :
    pref === "left" ? ["left", "bottom", "right", "top"] :
    pref === "top" ? ["top", "bottom", "right", "left"] :
    ["bottom", "top", "right", "left"];
  const side = order.find((s) => fits[s]) ?? "bottom";
  let top = 0, left = 0;
  if (side === "bottom") { top = target.bottom + gap; left = target.left + target.width / 2 - tw / 2; }
  else if (side === "top") { top = target.top - gap - th; left = target.left + target.width / 2 - tw / 2; }
  else if (side === "right") { top = target.top + target.height / 2 - th / 2; left = target.right + gap; }
  else { top = target.top + target.height / 2 - th / 2; left = target.left - gap - tw; }
  left = Math.max(edge, Math.min(left, window.innerWidth - tw - edge));
  top = Math.max(edge, Math.min(top, window.innerHeight - th - edge));
  return { top, left };
}

function Tooltip({
  step, idx, total, onNext, onPrev, onClose,
}: {
  step: DemoStep; idx: number; total: number;
  onNext: () => void; onPrev: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });
  const [vis, setVis] = useState(false);

  useEffect(() => {
    setVis(false);
    const upd = () => {
      const t = getRect(step.target);
      if (!t || !ref.current) return;
      const { width, height } = ref.current.getBoundingClientRect();
      setPos(calcPos(t, width, height, step.placement));
      setVis(true);
    };
    const timer = setTimeout(upd, 80);
    window.addEventListener("resize", upd);
    window.addEventListener("scroll", upd, true);
    const id = setInterval(upd, 200);
    return () => { clearTimeout(timer); window.removeEventListener("resize", upd); window.removeEventListener("scroll", upd, true); clearInterval(id); };
  }, [step.target, step.placement]);

  const isFirst = idx === 0, isLast = idx === total - 1;

  return (
    <motion.div
      ref={ref}
      className="fixed z-[9999] w-[320px]"
      style={{ top: pos.top, left: pos.left }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: vis ? 1 : 0, y: vis ? 0 : 6 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card-bg shadow-xl dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="h-[3px] bg-foreground/[0.06]">
          <motion.div className="h-full rounded-full bg-[#FF7A00]" initial={false} animate={{ width: `${((idx + 1) / total) * 100}%` }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <div className="p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-inter text-[11px] font-medium tracking-[-0.02em] text-page-text-muted tabular-nums">{idx + 1} / {total}</span>
            <button onClick={onClose} className="flex size-5 cursor-pointer items-center justify-center rounded-full text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
          <h3 className="font-inter text-[13px] font-semibold tracking-[-0.02em] text-page-text leading-tight">{step.title}</h3>
          <p className="mt-1 font-inter text-[13px] leading-[1.5] tracking-[-0.02em] text-page-text-muted">{step.body}</p>
          {step.actionLabel && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-[#FF7A00]" />
              <span className="font-inter text-[11px] font-medium tracking-[-0.02em] text-[#FF7A00]">{step.actionLabel}</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <button onClick={onPrev} disabled={isFirst} className={cn("flex h-7 cursor-pointer items-center gap-0.5 rounded-full px-2.5 font-inter text-[12px] font-medium tracking-[-0.02em] transition-colors", isFirst ? "text-page-text-muted/30 cursor-not-allowed" : "text-page-text-muted hover:bg-foreground/[0.06]")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Back
            </button>
            {!step.advanceOnClick && (
              <button onClick={onNext} className="flex h-7 cursor-pointer items-center gap-0.5 rounded-full bg-[#FF7A00] px-3.5 font-inter text-[12px] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#E56E00]">
                {isLast ? "Finish" : "Next"}
                {!isLast && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Welcome Modal ────────────────────────────────────────────────────

function Welcome({ name, total, onStart, onClose }: { name: string; total: number; onStart: () => void; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div onClick={(e) => e.stopPropagation()} className="relative w-[400px] overflow-hidden rounded-2xl border border-border bg-card-bg shadow-xl" initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
        <div className="relative flex h-[120px] items-center justify-center overflow-hidden bg-[#151515]">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="relative flex items-center gap-3">
            <img src="/images/cr-favicon.png" alt="Content Rewards" className="size-10 rounded-xl" />
            <div>
              <p className="font-inter text-base font-semibold tracking-[-0.02em] text-white">Interactive Demo</p>
              <p className="font-inter text-xs tracking-[-0.02em] text-white/50">{total} steps</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h2 className="font-inter text-sm font-semibold tracking-[-0.02em] text-page-text">Welcome to {name}</h2>
          <p className="mt-1.5 font-inter text-sm leading-[1.6] tracking-[-0.02em] text-page-text-muted">This walkthrough will guide you through the platform — navigating between pages and highlighting key features as you go.</p>
          <div className="mt-4 flex flex-col gap-1.5">
            <button onClick={onStart} className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full bg-[#FF7A00] font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#E56E00]">Start walkthrough</button>
            <button onClick={onClose} className="flex h-9 w-full cursor-pointer items-center justify-center rounded-full font-inter text-sm font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.06]">Maybe later</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── State machine ────────────────────────────────────────────────────

type Phase = "idle" | "welcome" | "touring" | "navigating" | "complete";

interface DemoState {
  phase: Phase;
  config: DemoConfig | null;
  step: number;
  pendingRoute: string | null;
}

const IDLE: DemoState = { phase: "idle", config: null, step: 0, pendingRoute: null };

// ── Provider ─────────────────────────────────────────────────────────

export function InteractiveDemoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<DemoState>(IDLE);
  const [mounted, setMounted] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => setMounted(true), []);

  // Queue for navigation side effects (set step, then effect handles router.push)
  const navQueueRef = useRef<string | null>(null);

  function doStop() {
    navQueueRef.current = null;
    setState(IDLE);
  }

  function moveToStep(idx: number) {
    setState((prev) => {
      if (!prev.config) return prev;
      const step = prev.config.steps[idx];
      if (!step) return prev;

      if (step.route && step.route !== pathname) {
        // Queue navigation — effect will handle router.push
        navQueueRef.current = step.route;
        return { ...prev, step: idx, phase: "navigating" as Phase, pendingRoute: step.route };
      }
      return { ...prev, step: idx, phase: "touring" as Phase, pendingRoute: null };
    });
  }

  function doNext() {
    setState((prev) => {
      if (!prev.config) return prev;
      if (prev.step >= prev.config.steps.length - 1) {
        setTimeout(doStop, 2000);
        return { ...prev, phase: "complete" as Phase };
      }
      const nextIdx = prev.step + 1;
      const step = prev.config.steps[nextIdx];
      if (!step) return prev;

      if (step.route && step.route !== pathname) {
        navQueueRef.current = step.route;
        return { ...prev, step: nextIdx, phase: "navigating" as Phase, pendingRoute: step.route };
      }
      return { ...prev, step: nextIdx, phase: "touring" as Phase, pendingRoute: null };
    });
  }

  function doPrev() {
    setState((prev) => {
      if (!prev.config || prev.step <= 0) return prev;
      const prevIdx = prev.step - 1;
      const step = prev.config.steps[prevIdx];
      if (!step) return prev;

      if (step.route && step.route !== pathname) {
        navQueueRef.current = step.route;
        return { ...prev, step: prevIdx, phase: "navigating" as Phase, pendingRoute: step.route };
      }
      return { ...prev, step: prevIdx, phase: "touring" as Phase, pendingRoute: null };
    });
  }

  function doStart(cfg: DemoConfig) {
    setState({ phase: "welcome", config: cfg, step: 0, pendingRoute: null });
  }

  // Effect: perform queued navigation
  useEffect(() => {
    if (state.phase !== "navigating" || !navQueueRef.current) return;
    const route = navQueueRef.current;
    navQueueRef.current = null;
    router.push(route);
  }, [state.phase, state.step, router]);

  // Effect: once pathname matches pending route, transition to touring
  useEffect(() => {
    if (state.phase !== "navigating" || !state.pendingRoute) return;
    if (pathname === state.pendingRoute) {
      const t = setTimeout(() => {
        setState((prev) => ({ ...prev, phase: "touring" as Phase, pendingRoute: null }));
      }, 400);
      return () => clearTimeout(t);
    }
  }, [state.phase, state.pendingRoute, pathname]);

  // Scroll target into view, or auto-skip if not found
  useEffect(() => {
    if (state.phase !== "touring" || !state.config) return;
    const step = state.config.steps[state.step];
    if (!step) return;
    step.onEnter?.();

    // Check if element exists, retry a few times, then skip if not found
    let attempts = 0;
    const check = setInterval(() => {
      const el = document.querySelector(step.target);
      if (el) {
        clearInterval(check);
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        attempts++;
        if (attempts > 10) { // 2 seconds
          clearInterval(check);
          // Auto-skip to next step
          doNext();
        }
      }
    }, 200);
    return () => clearInterval(check);
  }, [state.phase, state.step, state.config]);

  // advanceOnClick
  useEffect(() => {
    if (state.phase !== "touring" || !state.config) return;
    const step = state.config.steps[state.step];
    if (!step?.advanceOnClick) return;
    const el = document.querySelector(step.target);
    if (!el) return;
    const handler = () => doNext();
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  });

  const currentStepData = state.config?.steps[state.step];

  const ctx: DemoContextValue = {
    active: state.phase === "touring" || state.phase === "navigating",
    currentStep: state.step,
    totalSteps: state.config?.steps.length ?? 0,
    start: doStart,
    stop: doStop,
    next: doNext,
    prev: doPrev,
  };

  return (
    <DemoContext.Provider value={ctx}>
      {children}

      {mounted && createPortal(
        <>
        <AnimatePresence>
          {state.phase === "welcome" && state.config && (
            <Welcome
              key="welcome"
              name={state.config.name}
              total={state.config.steps.length}
              onStart={() => moveToStep(0)}
              onClose={doStop}
            />
          )}

          {state.phase === "navigating" && (
            <motion.div key="nav" className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2.5 rounded-full border border-border bg-card-bg px-4 py-2.5 shadow-lg">
                <motion.div className="size-4 rounded-full border-2 border-[#FF7A00] border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Navigating...</span>
              </div>
            </motion.div>
          )}

          {state.phase === "touring" && currentStepData && (
            <div key={`step-${state.step}`}>
              <Spotlight target={currentStepData.target} />
              <Tooltip step={currentStepData} idx={state.step} total={state.config!.steps.length} onNext={doNext} onPrev={doPrev} onClose={doStop} />
            </div>
          )}

          {state.phase === "complete" && (
            <motion.div key="done" className="fixed inset-x-0 bottom-8 z-[9999] flex justify-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <div className="flex items-center gap-2.5 rounded-full border border-border bg-card-bg px-4 py-2.5 shadow-lg">
                <svg width="16" height="16" viewBox="0 0 17 17" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8.33333 0C3.73096 0 0 3.73096 0 8.33333C0 12.9357 3.73096 16.6667 8.33333 16.6667C12.9357 16.6667 16.6667 12.9357 16.6667 8.33333C16.6667 3.73096 12.9357 0 8.33333 0ZM11.3171 6.64577C11.5356 6.37862 11.4963 5.98486 11.2291 5.76628C10.962 5.5477 10.5682 5.58707 10.3496 5.85423L7.03693 9.90305L5.85861 8.72472C5.61453 8.48065 5.2188 8.48065 4.97472 8.72472C4.73065 8.9688 4.73065 9.36453 4.97472 9.60861L6.64139 11.2753C6.76625 11.4001 6.93811 11.4664 7.11447 11.4576C7.29083 11.4488 7.45524 11.3658 7.56706 11.2291L11.3171 6.64577Z" fill="#00B36E"/></svg>
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Demo complete!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>,
        document.body,
      )}
    </DemoContext.Provider>
  );
}
