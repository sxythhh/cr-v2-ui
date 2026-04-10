"use client";
// @ts-nocheck

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active' | 'paused' | 'inactive' | 'instagram' | 'tiktok';
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400',
  paused: 'bg-amber-500/10 text-amber-400',
  inactive: 'bg-zinc-500/10 text-zinc-400',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-700/50 text-zinc-300',
      active: statusColors['active'],
      paused: statusColors['paused'],
      inactive: statusColors['inactive'],
      instagram: 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-400',
      tiktok: 'bg-cyan-500/10 text-cyan-400',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      >
        {variant === 'active' && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
