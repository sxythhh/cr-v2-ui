"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Form Field ───────────────────────────────────────────────────── */

interface FormFieldProps {
  label: string;
  /** Accepted for API compatibility; no visual indicator is rendered. */
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col justify-center gap-2", className)}>
      <label className="font-inter text-[15px] font-semibold leading-[140%] tracking-[-0.05em] text-[#252525] dark:text-page-text">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Form Input ───────────────────────────────────────────────────── */

interface FormInputProps extends Omit<React.ComponentProps<"input">, "className"> {
  className?: string;
}

export function FormInput({ className, ...props }: FormInputProps) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border border-[rgba(37,37,37,0.14)] bg-transparent px-4 font-inter text-[15px] font-medium leading-[140%] tracking-[-0.05em] text-[#252525] shadow-[0_1px_0_#FFFFFF] outline-none transition-all placeholder:text-[#878787]/60 focus:border-[#f97316] focus:shadow-[0_0_0_1px_#f97316] dark:border-border dark:text-page-text dark:shadow-none dark:placeholder:text-page-text-muted/60 dark:focus:border-[#f97316] dark:focus:shadow-[0_0_0_1px_#f97316] autofill:[transition:background-color_9999s_ease-out_0s] autofill:[-webkit-text-fill-color:currentColor]",
        className,
      )}
      {...props}
    />
  );
}

/* ── Form Textarea ────────────────────────────────────────────────── */

interface FormTextareaProps extends Omit<React.ComponentProps<"textarea">, "className"> {
  className?: string;
}

export function FormTextarea({ className, rows = 3, ...props }: FormTextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "flex w-full resize-none rounded-lg border border-[rgba(37,37,37,0.14)] bg-transparent px-4 py-2.5 font-inter text-[15px] font-medium leading-[140%] tracking-[-0.05em] text-[#252525] shadow-[0_1px_0_#FFFFFF] outline-none transition-all placeholder:text-[#878787]/60 focus:border-[#f97316] focus:shadow-[0_0_0_1px_#f97316] dark:border-border dark:text-page-text dark:shadow-none dark:placeholder:text-page-text-muted/60 dark:focus:border-[#f97316] dark:focus:shadow-[0_0_0_1px_#f97316]",
        className,
      )}
      {...props}
    />
  );
}

/* ── Form Row ─────────────────────────────────────────────────────── */

export function FormRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-4", className)}>
      {children}
    </div>
  );
}
