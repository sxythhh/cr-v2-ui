"use client";

import { useRef, useState, useCallback, useEffect, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, onComplete, disabled = false }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, digit: string) => {
      if (!/^\d?$/.test(digit)) return;

      const next = [...values];
      next[index] = digit;
      setValues(next);

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      if (digit && next.every(Boolean)) {
        onComplete?.(next.join(""));
      }
    },
    [values, length, focusInput, onComplete],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        focusInput(index - 1);
      }
    },
    [values, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (!pasted) return;

      const next = [...values];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      setValues(next);

      const focusIdx = Math.min(pasted.length, length - 1);
      focusInput(focusIdx);

      if (next.every(Boolean)) {
        onComplete?.(next.join(""));
      }
    },
    [values, length, focusInput, onComplete],
  );

  // Focus first input on mount
  useEffect(() => {
    if (!disabled) focusInput(0);
  }, [disabled, focusInput]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2.5">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={(e) => e.target.select()}
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border text-center font-inter text-lg font-semibold tracking-[-0.02em] outline-none transition-colors sm:size-12",
            "border-border bg-card-bg text-page-text",
            "focus:border-[#FF6207]",
            "disabled:opacity-40",
          )}
        />
      ))}
    </div>
  );
}
