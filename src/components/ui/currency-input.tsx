"use client";

import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled,
}: CurrencyInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-[14px] h-10 px-3.5 bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.06)] focus-within:ring-1 focus-within:ring-[rgba(37,37,37,0.15)] dark:focus-within:ring-[rgba(255,255,255,0.15)]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="text-sm tracking-[-0.02em] text-[rgba(37,37,37,0.5)] dark:text-[rgba(255,255,255,0.45)] select-none">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
      />
    </div>
  );
}

export { CurrencyInput };
