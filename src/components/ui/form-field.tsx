"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Form Field ───────────────────────────────────────────────────── */

interface FormFieldProps {
  label: string;
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
        "flex h-10 w-full rounded-lg border border-[rgba(37,37,37,0.14)] bg-transparent px-4 font-inter text-[15px] font-medium leading-[140%] tracking-[-0.05em] text-[#252525] shadow-[0_1px_0_#FFFFFF] outline-none transition-all placeholder:text-[#878787]/60 focus:border-[#f97316] focus:shadow-[0_0_0_1px_#f97316] dark:border-border dark:text-page-text dark:shadow-none dark:placeholder:text-page-text-muted/60 dark:focus:border-[#f97316] dark:focus:shadow-[0_0_0_1px_#f97316] autofill:shadow-[0_1px_0_#FFFFFF,inset_0_0_0_100px_white] autofill:[-webkit-text-fill-color:#252525] dark:autofill:shadow-[inset_0_0_0_100px_var(--card-bg)] dark:autofill:[-webkit-text-fill-color:var(--page-text)]",
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
