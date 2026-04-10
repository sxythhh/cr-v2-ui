"use client";
// @ts-nocheck

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/vn/ui/card';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/vn-utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  format?: 'number' | 'percent' | 'exact' | 'none';
}

export function StatCard({ title, value, change, icon, format = 'number' }: StatCardProps) {
  const formattedValue = format === 'exact' && typeof value === 'number'
    ? value.toLocaleString() // Exact number with commas (e.g., 1,234 not 1.2k)
    : format === 'number' && typeof value === 'number'
    ? formatNumber(value)
    : format === 'percent' && typeof value === 'number'
    ? `${value}%`
    : value;

  const TrendIcon = change === undefined || change === 0
    ? Minus
    : change > 0
    ? TrendingUp
    : TrendingDown;

  const trendColor = change === undefined || change === 0
    ? 'text-zinc-500'
    : change > 0
    ? 'text-emerald-400'
    : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6" hover>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          {icon && (
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-3xl font-bold text-zinc-100">{formattedValue}</p>
          {change !== undefined && change !== 0 && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(change)}% from last period</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
