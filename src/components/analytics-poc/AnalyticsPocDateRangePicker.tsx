"use client";

import { ChevronDown } from "lucide-react";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { cn } from "@/lib/utils";
import { FilterSelect, type Filter } from "@/components/ui/dub-filter";

export interface AnalyticsPocDateRangePreset {
  label: string;
  value: string;
}

const DEFAULT_PRESETS: AnalyticsPocDateRangePreset[] = [
  { label: "Last 7 days", value: "last-7-days" },
  { label: "Last 30 days", value: "last-30-days" },
  { label: "Last 90 days", value: "last-90-days" },
  { label: "Last 6 months", value: "last-6-months" },
  { label: "Last 12 months", value: "last-12-months" },
];

interface AnalyticsPocDateRangePickerProps {
  value: string;
  onValueChange: (value: string) => void;
  presets?: AnalyticsPocDateRangePreset[];
  className?: string;
  /** Compact 32x32 icon-only mode for mobile card headers */
  compact?: boolean;
}

export function AnalyticsPocDateRangePicker({
  value,
  onValueChange,
  presets = DEFAULT_PRESETS,
  className,
  compact = false,
}: AnalyticsPocDateRangePickerProps) {
  const selectedPreset = presets.find((p) => p.value === value);
  const displayLabel = selectedPreset?.label ?? "Select range";

  const filters: Filter[] = [
    {
      key: "__date",
      icon: null,
      label: "Date range",
      singleSelect: true,
      options: presets.map((p) => ({
        value: p.value,
        label: p.label,
      })),
    },
  ];

  const activeFilters = value
    ? [{ key: "__date", values: [value] }]
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
      hideSearch
      className={className}
    >
      {compact ? (
        <button
          className="flex size-8 cursor-pointer items-center justify-center rounded-xl bg-foreground/[0.06] outline-none transition-colors hover:bg-foreground/[0.10] focus-visible:outline-none dark:bg-[rgba(224,224,224,0.03)]"
          type="button"
        >
          <svg width="9" height="10" viewBox="0 0 9 10" fill="none" className="text-page-text">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.5 0C2.77614 0 3 0.223858 3 0.5V1H6V0.5C6 0.223858 6.22386 0 6.5 0C6.77614 0 7 0.223858 7 0.5V1H7.5C8.32843 1 9 1.67157 9 2.5V8C9 8.82843 8.32843 9.5 7.5 9.5H1.5C0.671573 9.5 0 8.82843 0 8V2.5C0 1.67157 0.671573 1 1.5 1H2V0.5C2 0.223858 2.22386 0 2.5 0ZM1 4.5V8C1 8.27614 1.22386 8.5 1.5 8.5H7.5C7.77614 8.5 8 8.27614 8 8V4.5H1Z" fill="currentColor"/>
          </svg>
        </button>
      ) : (
        <button
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5",
            "border border-foreground/[0.06] dark:border-border",
            "bg-white dark:bg-card-bg",
            "shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
            "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-page-text",
            "outline-none transition-colors hover:bg-foreground/[0.03] dark:hover:bg-white/[0.05] dark:hover:border-white/[0.10]",
            "focus-visible:outline-none",
          )}
          type="button"
        >
          <CalendarIcon
            className="shrink-0 text-page-text"
            height={16}
            width={16}
          />
          <span className="whitespace-nowrap">{displayLabel}</span>
          <ChevronDown className="size-4 shrink-0 text-page-text-muted transition-transform duration-200 group-data-[open]:rotate-180" />
        </button>
      )}
    </FilterSelect>
  );
}
