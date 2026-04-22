"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";

export interface FormDropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FormDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  options: FormDropdownOption[];
  placeholder?: string;
  className?: string;
}

function DropdownList({
  options,
  value,
  onSelect,
}: {
  options: FormDropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, handlers, registerItem, itemRects, sessionRef, measureItems } =
    useProximityHover(containerRef);

  useEffect(() => {
    measureItems();
  }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handlers.onMouseEnter}
      onMouseMove={handlers.onMouseMove}
      onMouseLeave={handlers.onMouseLeave}
      className="relative flex flex-col gap-0.5"
    >
      <AnimatePresence>
        {activeRect && (
          <motion.div
            key={sessionRef.current}
            className="pointer-events-none absolute rounded-lg bg-foreground/[0.04] dark:bg-white/[0.06]"
            initial={{ opacity: 0, ...activeRect }}
            animate={{ opacity: 1, ...activeRect }}
            exit={{ opacity: 0 }}
            transition={{ ...springs.moderate, opacity: { duration: 0.12 } }}
          />
        )}
      </AnimatePresence>

      {options.map((opt, i) => (
        <DropdownOption
          key={opt.value}
          index={i}
          label={opt.label}
          icon={opt.icon}
          checked={opt.value === value}
          onSelect={() => onSelect(opt.value)}
          registerItem={registerItem}
        />
      ))}
    </div>
  );
}

function DropdownOption({
  index,
  label,
  icon,
  checked,
  onSelect,
  registerItem,
}: {
  index: number;
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onSelect: () => void;
  registerItem: (index: number, el: HTMLElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerItem(index, ref.current);
    return () => registerItem(index, null);
  }, [index, registerItem]);

  return (
    <div
      ref={ref}
      data-proximity-index={index}
      onClick={onSelect}
      className="relative z-10 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 font-inter text-[15px] tracking-[-0.05em]"
    >
      <span className={cn("flex min-w-0 items-center gap-2 text-[#252525] dark:text-page-text", checked && "font-semibold")}>
        {icon && (
          <span className="flex size-4 shrink-0 items-center justify-center text-[#252525] dark:text-page-text">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </span>
      {checked && <Check className="size-3.5 shrink-0 text-[#252525] dark:text-page-text" />}
    </div>
  );
}

export function FormDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const selectedOption = options.find((o) => o.value === value);

  const updateRect = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
  }, []);

  useEffect(() => {
    if (!open) return;
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [open, updateRect]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-transparent px-4 font-inter text-[15px] font-medium leading-[140%] tracking-[-0.05em] shadow-[0_1px_0_#FFFFFF] outline-none transition-all dark:shadow-none",
          selectedOption
            ? "text-[#252525] dark:text-page-text"
            : "text-[#878787]/60",
          open && "border-[#f97316] shadow-[0_0_0_1px_#f97316] dark:shadow-[0_0_0_1px_#f97316]",
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <span className="flex size-4 shrink-0 items-center justify-center">
              {selectedOption.icon}
            </span>
          )}
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-[#878787] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && rect && (
              <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="fixed z-[9999] rounded-2xl border border-border bg-white p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:bg-card-bg dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                style={{
                  top: rect.bottom + 4,
                  left: rect.left,
                  width: rect.width,
                }}
              >
                <DropdownList
                  options={options}
                  value={value}
                  onSelect={(v) => {
                    onChange?.(v);
                    setOpen(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
