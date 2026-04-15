"use client";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Brand {
  id: string;
  name: string;
  logo?: string;
  campaignCount: number;
}

interface BrandMigrationStepProps {
  brands: Brand[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function BrandMigrationStep({ brands, selected, onToggle }: BrandMigrationStepProps) {
  const selectedCount = selected.size;

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Confirm your brands
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          Select the brands you want to bring over to v2.{" "}
          <span className="text-page-text-subtle">
            {selectedCount} of {brands.length} selected
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {brands.map((brand, i) => {
          const checked = selected.has(brand.id);
          return (
            <motion.button
              key={brand.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onToggle(brand.id)}
              className={cn(
                "flex cursor-pointer items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-all",
                checked
                  ? "border-[#FF6207]/30 bg-[#FF6207]/[0.03]"
                  : "border-border bg-card-bg opacity-60 hover:opacity-80",
              )}
            >
              {/* Checkbox */}
              <div className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                checked
                  ? "border-[#FF6207] bg-[#FF6207]"
                  : "border-foreground/20",
              )}>
                <AnimatePresence>
                  {checked && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      width="12" height="12" viewBox="0 0 24 24" fill="none"
                    >
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* Brand avatar */}
              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-foreground/[0.06]">
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="size-full object-cover" />
                ) : (
                  <span className="text-[13px] font-semibold text-page-text-muted">
                    {brand.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Brand info */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] font-medium text-page-text">{brand.name}</span>
                <span className="text-[12px] font-medium text-page-text-subtle">
                  {brand.campaignCount} campaign{brand.campaignCount !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info callout */}
      <div className="flex items-start gap-2.5 rounded-xl bg-foreground/[0.03] px-3.5 py-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-page-text-subtle">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-[12px] font-medium leading-[18px] text-page-text-subtle">
          Brands you deselect will remain in v1 read-only mode. You can migrate them later from Settings.
        </span>
      </div>
    </div>
  );
}
