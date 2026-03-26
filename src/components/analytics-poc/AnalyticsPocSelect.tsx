"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";

export interface AnalyticsPocSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface AnalyticsPocSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: AnalyticsPocSelectOption[];
  className?: string;
}

export function AnalyticsPocSelect({
  value,
  onValueChange,
  placeholder = "Select\u2026",
  options,
  className,
}: AnalyticsPocSelectProps) {
  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  // Wrap options as a single-key filter for FilterSelect
  const filters: Filter[] = [
    {
      key: "__select",
      icon: null,
      label: placeholder.replace("…", ""),
      singleSelect: true,
      options: options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        icon: opt.icon,
      })),
    },
  ];

  const activeFilters = value
    ? [{ key: "__select", values: [value] }]
    : [];

  return (
    <FilterSelect
      filters={filters}
      activeFilters={activeFilters}
      onSelect={(_key, val) => {
        const v = Array.isArray(val) ? val[0] : val;
        onValueChange(v);
      }}
      onRemove={() => {}}
      placement="bottom-end"
      className={className}
    >
      <button
        className={cn(
          "inline-flex h-9 max-w-[300px] cursor-pointer items-center gap-2 rounded-full px-3.5",
          "border border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]",
          "bg-white dark:bg-card-bg",
          "shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
          "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-page-text",
          "outline-none transition-colors hover:bg-foreground/[0.03] dark:hover:bg-white/[0.05] dark:hover:border-white/[0.10]",
          "focus-visible:outline-none",
        )}
        type="button"
      >
        {selectedOption?.icon ? (
          <span className="flex shrink-0 items-center justify-center">
            {selectedOption.icon}
          </span>
        ) : null}
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className="size-4 shrink-0 text-page-text-muted transition-transform duration-200 group-data-[open]:rotate-180" />
      </button>
    </FilterSelect>
  );
}
