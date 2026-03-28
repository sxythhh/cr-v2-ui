"use client";

import type { AffiliateCode, AffiliateMetrics } from "@/types/affiliate.types";
import { MoneyBagIcon, BellIcon, ClickIcon, UsersGroupIcon } from "./icons";

interface StatsCardsProps {
  metrics: AffiliateMetrics;
  codes: AffiliateCode[];
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 min-w-0 flex-col justify-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted leading-[120%]">
          {label}
        </span>
      </div>
      <span className="font-inter text-xl font-medium tracking-[-0.02em] text-page-text leading-[120%]">
        {value}
      </span>
    </div>
  );
}

function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`;
}

export function StatsCards({ metrics, codes }: StatsCardsProps) {
  const activeCodes = codes.filter((c) => c.isActive).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 self-stretch gap-2">
      <StatCard
        icon={
          <MoneyBagIcon
            size={16}
            color="var(--af-text-muted)"
          />
        }
        label="Total Earnings"
        value={formatCurrency(metrics.totalEarnings)}
      />
      <StatCard
        icon={<UsersGroupIcon color="var(--af-text-muted)" size={16} />}
        label="Clippers Referred"
        value={metrics.totalReferrals.toLocaleString()}
      />
      <StatCard
        icon={<ClickIcon color="var(--af-text-muted)" size={16} />}
        label="Total Clicks"
        value={metrics.totalClicks.toLocaleString()}
      />
      <StatCard
        icon={<BellIcon color="var(--af-text-muted)" size={16} />}
        label="Active Codes"
        value={activeCodes.toLocaleString()}
      />
    </div>
  );
}
