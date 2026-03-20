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
}

export function AnalyticsPocDateRangePicker({
  value,
  onValueChange,
  presets = DEFAULT_PRESETS,
  className,
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
      className={className}
    >
      <button
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full px-3.5",
          "border border-foreground/[0.06] dark:border-white/[0.08]",
          "bg-white dark:bg-white/[0.06]",
          "shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]",
          "font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.02em] text-page-text",
          "outline-none transition-colors hover:bg-foreground/[0.03] dark:hover:bg-white/[0.08]",
          "focus-visible:ring-2 focus-visible:ring-foreground/[0.12] dark:focus-visible:ring-white/[0.15] focus-visible:ring-offset-0",
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
    </FilterSelect>
  );
}
