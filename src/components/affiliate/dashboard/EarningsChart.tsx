"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  AffiliateChartPoint,
  AffiliateTimeframe,
} from "@/types/affiliate.types";
import { TIMEFRAME_LABELS } from "@/types/affiliate.types";
import { UsersGroupIcon } from "./icons";

interface EarningsChartProps {
  chart: AffiliateChartPoint[];
  timeframe: AffiliateTimeframe;
  onTimeframeChange: (tf: AffiliateTimeframe) => void;
}

const TIMEFRAMES: AffiliateTimeframe[] = ["today", "week", "month", "lifetime"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function EarningsChart({
  chart,
  timeframe,
  onTimeframeChange,
}: EarningsChartProps) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const hasData = chart.length >= 2;

  return (
    <div className="flex flex-1 min-w-0 flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <UsersGroupIcon color="var(--af-text-muted)" size={16} />
          <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted leading-[120%]">
            Earnings over time
          </span>
        </div>

        {/* Timeframe dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 rounded-full bg-foreground/[0.06] px-3 py-1 font-inter text-xs tracking-[-0.02em] text-page-text-muted hover:bg-foreground/[0.10]"
            onClick={() => setOpenDropdown((o) => !o)}
            type="button"
          >
            {TIMEFRAME_LABELS[timeframe]}
          </button>
          {openDropdown && (
            <div className="absolute right-0 top-full z-10 mt-1 flex min-w-[140px] flex-col overflow-hidden rounded-lg border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    onTimeframeChange(tf);
                    setOpenDropdown(false);
                  }}
                  className={`cursor-pointer border-none px-3 py-2 text-left font-inter text-[13px] tracking-[-0.02em] text-page-text-muted ${tf === timeframe ? "bg-foreground/[0.06]" : "bg-transparent hover:bg-foreground/[0.04]"}`}
                  type="button"
                >
                  {TIMEFRAME_LABELS[tf]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart body */}
      {hasData ? (
        <div className="h-[220px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <AreaChart
              data={chart}
              margin={{ bottom: 0, left: -20, right: 4, top: 4 }}
            >
              <defs>
                <linearGradient id="clicksGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#9D5AEF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#9D5AEF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="referralsGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#55B685" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#55B685" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--af-divider)"
                strokeDasharray="none"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="date"
                tick={{
                  fill: "var(--af-text-faint)",
                  fontSize: 10,
                }}
                tickFormatter={formatDate}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{
                  fill: "var(--af-text-faint)",
                  fontSize: 10,
                }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--af-bg-dropdown)",
                  border: "1px solid var(--af-border-subtle)",
                  borderRadius: 8,
                  boxShadow: "var(--af-shadow-card)",
                  color: "var(--af-text)",
                  fontSize: 12,
                }}
              />
              <Area
                dataKey="clicks"
                fill="url(#clicksGrad)"
                name="Clicks"
                stroke="#9D5AEF"
                strokeWidth={2}
                type="monotone"
              />
              <Area
                dataKey="referrals"
                fill="url(#referralsGrad)"
                name="Referrals"
                stroke="#55B685"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[220px] items-center justify-center font-inter text-sm tracking-[-0.02em] text-page-text-subtle">
          Not enough data to display chart
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded bg-[#9D5AEF]" />
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-subtle">
            Clicks
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded bg-[#55B685]" />
          <span className="font-inter text-xs tracking-[-0.02em] text-page-text-subtle">
            Referrals
          </span>
        </div>
      </div>
    </div>
  );
}
