"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FancyProgress } from "@/components/ui/fancy-progress";

/* ── Types ── */

export interface TypeformStep {
  id: string;
  label: string;
}

interface TypeformShellProps {
  steps: TypeformStep[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  loading?: boolean;
  children: React.ReactNode;
  finishLabel?: string;
  onFinish?: () => void;
  hideFooter?: boolean;
}

/* ── Shell ── */

export function TypeformShell({
  steps,
  currentStep,
  onNext,
  onBack,
  canProceed,
  loading = false,
  children,
  finishLabel = "Finish",
  onFinish,
  hideFooter = false,
}: TypeformShellProps) {
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;
  const shouldFinish = !!onFinish && currentStep === steps.length - 2;
  const handlePrimary = React.useCallback(() => {
    if (shouldFinish) onFinish?.();
    else onNext();
  }, [shouldFinish, onFinish, onNext]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canProceed && !loading && !isLast) {
        e.preventDefault();
        handlePrimary();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canProceed, loading, isLast, handlePrimary]);

  if (isLast) {
    return (
      <div className="flex h-full flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-5">
        <FancyProgress value={progress} />
      </div>


      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-6 py-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {!hideFooter && <div className="px-6 pb-5 pt-2 flex items-center gap-2">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex h-9 cursor-pointer items-center rounded-lg px-3 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.04] hover:text-page-text disabled:opacity-40"
          >
            Back
          </button>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-3">
        {canProceed && !loading && (
          <span className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted hidden sm:block">
            Press <kbd className="rounded border border-foreground/[0.08] bg-foreground/[0.04] px-1 py-0.5 font-inter text-[10px]">Enter</kbd>
          </span>
        )}
        <button
          type="button"
          onClick={handlePrimary}
          disabled={!canProceed || loading}
          className={cn(
            "flex h-10 min-w-[120px] cursor-pointer items-center justify-center rounded-xl px-5 font-inter text-[14px] font-semibold tracking-[-0.02em] transition-all active:scale-[0.97]",
            "bg-[#f97316] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
            "hover:bg-[#ea670d]",
            "disabled:cursor-default disabled:opacity-30",
          )}
        >
          {loading ? (
            <motion.div
              className="size-3.5 rounded-full border-2 border-current border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : shouldFinish ? (
            finishLabel
          ) : (
            "Continue"
          )}
        </button>
        </div>
      </div>}
    </div>
  );
}

/* ── Persistence helper ── */

export function useFormPersistence<T extends Record<string, any>>(
  key: string,
  initialData: T,
) {
  const [data, setData] = React.useState<T>(() => {
    if (typeof window === "undefined") return initialData;
    try {
      const stored = localStorage.getItem(key);
      return stored ? { ...initialData, ...JSON.parse(stored) } : initialData;
    } catch {
      return initialData;
    }
  });

  const [currentStep, setCurrentStep] = React.useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem(`${key}_step`);
      return stored ? Number(stored) : 0;
    } catch {
      return 0;
    }
  });

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  React.useEffect(() => {
    localStorage.setItem(`${key}_step`, String(currentStep));
  }, [key, currentStep]);

  const updateField = React.useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const reset = React.useCallback(() => {
    setData(initialData);
    setCurrentStep(0);
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_step`);
  }, [key, initialData]);

  return { data, updateField, setData, currentStep, setCurrentStep, reset };
}
