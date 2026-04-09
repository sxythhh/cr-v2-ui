"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { useCfPortalContainer } from "./CampaignFlowContext";

interface CampaignFlowSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string; icon?: React.ReactNode }[];
}

export function CampaignFlowSelect({ value, onValueChange, placeholder = "Select\u2026", options }: CampaignFlowSelectProps) {
  const portalContainer = useCfPortalContainer();
  return (
    <SelectPrimitive.Root onValueChange={onValueChange} value={value || undefined}>
      <SelectPrimitive.Trigger
        className="flex h-10 w-full items-center rounded-[14px] px-3.5 bg-[rgba(37,37,37,0.04)] dark:bg-[rgba(255,255,255,0.06)] text-sm tracking-[-0.02em] text-page-text outline-none data-[placeholder]:text-[rgba(37,37,37,0.4)] dark:data-[placeholder]:text-[rgba(255,255,255,0.4)]"
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className="ml-auto"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[rgba(37,37,37,0.4)] dark:text-[rgba(255,255,255,0.4)]"><path d="M6 9l6 6l6-6"/></svg></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal container={portalContainer}>
        <SelectPrimitive.Content
          className="z-50 max-h-60 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-border bg-card-bg shadow-lg shadow-black/10 animate-in fade-in-0 zoom-in-95 duration-150"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((opt) => (
              <SelectPrimitive.Item
                className="relative flex h-9 cursor-pointer select-none items-center gap-2 rounded-xl px-3 pr-8 text-sm tracking-[-0.02em] text-page-text-subtle outline-none hover:bg-[rgba(37,37,37,0.04)] dark:hover:bg-[rgba(255,255,255,0.06)] hover:text-[#252525] dark:hover:text-[#e5e5e5] data-[state=checked]:text-[#252525] dark:data-[state=checked]:text-[#e5e5e5]"
                key={opt.value}
                value={opt.value}
              >
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5l10-10"/></svg></SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
