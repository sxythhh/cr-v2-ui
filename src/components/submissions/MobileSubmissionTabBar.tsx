import { cn } from "@/lib/utils";
import { MOBILE_SUB_TABS, type MobileSubTab } from "./types";

export function MobileSubmissionTabBar({ activeTab, onTabChange }: { activeTab: MobileSubTab; onTabChange: (t: MobileSubTab) => void }) {
  return (
    <div className="flex rounded-lg bg-foreground/[0.04] p-[3px]">
      {MOBILE_SUB_TABS.map((t) => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 font-inter text-xs font-medium leading-none tracking-[-0.02em] transition-colors",
            activeTab === t
              ? "bg-white text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:bg-card-bg"
              : "text-page-text-muted",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
