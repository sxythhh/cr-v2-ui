"use client";
// @ts-nocheck

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function Header({ title, description, action, className }: HeaderProps) {
  return (
    <div className={cn('relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8', className)}>
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-400 hidden sm:block">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
