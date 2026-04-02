"use client";

import { createPortal } from "react-dom";
import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────

const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as const;

const ENTER_SPRING = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

const EXIT_TRANSITION = { duration: 0.15, ease: EASE_OUT_QUINT };
const OVERLAY_TRANSITION = { duration: 0.18, ease: EASE_OUT_QUINT };

// ── Size presets ─────────────────────────────────────────────────────

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-[400px]",
  md: "max-w-[520px]",
  lg: "max-w-[640px]",
  xl: "max-w-[800px]",
  full: "max-w-[calc(100vw-48px)]",
};

// ── Body scroll lock ─────────────────────────────────────────────────

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

// ── Focus trap ───────────────────────────────────────────────────────

function useFocusTrap(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;

    // Focus first focusable element
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length > 0) {
      requestAnimationFrame(() => focusable[0].focus());
    }

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [ref, active]);
}

// ── Modal ────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Size preset — defaults to "md" */
  size?: ModalSize;
  /** Custom max-width class (overrides size) */
  maxWidth?: string;
  /** Additional classes on the card */
  className?: string;
  /** Show close button — defaults to true */
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  size = "md",
  maxWidth,
  className,
  showClose = true,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useBodyScrollLock(open);
  useFocusTrap(cardRef, open);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-neutral-100/50 backdrop-blur-md dark:bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: OVERLAY_TRANSITION }}
            exit={{ opacity: 0, transition: EXIT_TRANSITION }}
          />

          {/* Card */}
          <motion.div
            ref={cardRef}
            className={cn(
              "relative flex w-full flex-col overflow-y-auto rounded-[20px] border border-border bg-card-bg shadow-xl dark:bg-page-bg",
              "max-h-[90dvh] scrollbar-hide",
              maxWidth ?? sizeClasses[size],
              className,
            )}
            style={{ willChange: "transform, opacity" }}
            initial={{ opacity: 0, scale: 0.96, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)", transition: ENTER_SPRING }}
            exit={{ opacity: 0, scale: 0.97, y: 10, transition: EXIT_TRANSITION }}
            onClick={(e) => e.stopPropagation()}
          >
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-3 z-10 flex size-4 cursor-pointer items-center justify-center text-foreground/50 transition-opacity hover:opacity-80"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M0.762 0.762L10.095 10.095M10.095 0.762L0.762 10.095"
                    stroke="currentColor"
                    strokeWidth="1.524"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ── Sub-components ───────────────────────────────────────────────────

export function ModalHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t border-border px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Dropdown animation helper (preserved for existing usage) ─────────

interface DropdownAnimationProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
}

const SLIDE_OFFSETS = {
  top: { y: 2, x: 0 },
  bottom: { y: -2, x: 0 },
  left: { y: 0, x: 2 },
  right: { y: 0, x: -2 },
} as const;

export function DropdownAnimation({
  open,
  children,
  className,
  side = "bottom",
}: DropdownAnimationProps) {
  const dir = SLIDE_OFFSETS[side];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={className}
          initial={{ opacity: 0, x: dir.x, y: dir.y }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: dir.x, y: dir.y }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
