"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

const FLAG_REASONS = [
  "Suspected botting/fake engagement",
  "Explicit or inappropriate content",
  "Something that harms the brand",
  "Copyright or IP violation",
  "Other",
] as const;

function FlagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 20" fill="none">
      <path
        d="M1 12.7292V2.34842C1 1.96902 1.21411 1.61571 1.56677 1.4758C5.85713 -0.226397 9.31062 3.26159 13.4846 2.28131C14.2075 2.11152 15 2.60146 15 3.34409V12.11C15 12.4894 14.7859 12.8427 14.4332 12.9826C9.63491 14.8863 5.88335 10.2981 1 12.7292ZM1 12.7292V18.7292"
        stroke="#252525"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RadioCircle({ checked }: { checked: boolean }) {
  return (
    <div className="relative flex size-5 shrink-0 items-center justify-center">
      {checked ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9.5" fill="#E57100" stroke="rgba(37,37,37,0.06)" />
          <path d="M6.5 10.5L8.5 12.5L13.5 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <div
          className="size-5 rounded-full bg-white dark:bg-card-bg"
          style={{
            border: "1px solid rgba(37,37,37,0.1)",
            boxShadow: "0px -1px 3px rgba(0,0,0,0.06), 0px 2px 2px #FFFFFF, inset 0px 0.5px 2px rgba(0,0,0,0.12)",
          }}
        />
      )}
    </div>
  );
}

export function FlagSubmissionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [note, setNote] = useState("");

  const handleClose = () => {
    setSelected(null);
    setOtherText("");
    setNote("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} size="md" showClose={false}>
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-4 top-4 z-10 flex size-6 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4.667 4.667l6.666 6.666M11.333 4.667l-6.666 6.666" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.52" strokeLinecap="round" />
        </svg>
      </button>

      {/* Body */}
      <div className="flex flex-col items-center gap-4 p-5">
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-[0_0_0_2px_#fff] dark:bg-card-bg dark:shadow-[0_0_0_2px_var(--card-bg)]">
            <FlagIcon />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-lg font-medium tracking-[-0.02em] text-page-text">Flag submission</span>
            <span className="text-sm font-medium tracking-[-0.02em] text-foreground/70">
              Help us understand why you&apos;re flagging this
            </span>
          </div>
        </div>

        {/* Reason options */}
        <div className="flex w-full flex-col gap-2">
          {FLAG_REASONS.map((reason) => {
            const isSelected = selected === reason;
            const isOther = reason === "Other";
            return (
              <button
                key={reason}
                type="button"
                onClick={() => setSelected(reason)}
                className={cn(
                  "flex w-full flex-col rounded-2xl border px-4 py-3 text-left transition-all",
                  isSelected
                    ? "border-[rgba(229,113,0,0.3)] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    : "border-foreground/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06]"
                )}
                style={
                  isSelected
                    ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), #FFFFFF" }
                    : undefined
                }
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{reason}</span>
                  <RadioCircle checked={isSelected} />
                </div>
                {/* Other — expanded textarea */}
                {isOther && isSelected && (
                  <div
                    className="mt-3 w-full rounded-xl bg-foreground/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-white/[0.04]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <textarea
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="E.g., this appears to be promotional content disguised as a normal submission..."
                      className="w-full resize-none bg-transparent text-xs leading-[120%] tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/40"
                      rows={2}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Additional note */}
        <div className="flex w-full flex-col gap-2">
          <span className="text-xs tracking-[-0.02em] text-foreground/50">
            Add an additional note (optional)
          </span>
          <div className="w-full rounded-xl bg-foreground/[0.04] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-white/[0.04]">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g., contains information not meant to be shared..."
              className="w-full resize-none bg-transparent text-xs leading-[120%] tracking-[-0.02em] text-page-text outline-none placeholder:text-foreground/40"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 pb-5">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 rounded-full bg-foreground/[0.06] py-2.5 text-sm font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleClose}
          disabled={!selected}
          className={cn(
            "flex-1 rounded-full bg-page-text py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-all dark:bg-white dark:text-[#252525]",
            selected ? "opacity-100 hover:bg-page-text/90 dark:hover:bg-white/90" : "pointer-events-none opacity-40"
          )}
        >
          Flag submission
        </button>
      </div>
    </Modal>
  );
}
