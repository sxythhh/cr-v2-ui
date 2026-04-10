"use client";
// @ts-nocheck

import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list';
export type SortField = 'date' | 'title';
export type SortDirection = 'asc' | 'desc';

interface ContractExplorerToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  search: string;
  onSearchChange: (search: string) => void;
  totalCount: number;
  onMobileSidebarToggle?: () => void;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'title', label: 'Title' },
];

export function ContractExplorerToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  sortDirection,
  onSortChange,
  search,
  onSearchChange,
  totalCount,
  onMobileSidebarToggle,
}: ContractExplorerToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false);

  const handleSortSelect = (field: SortField) => {
    if (field === sortBy) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
    setSortOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Mobile */}
      <div className="flex lg:hidden items-center gap-2">
        {onMobileSidebarToggle && (
          <button
            onClick={onMobileSidebarToggle}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        )}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
        {/* Mobile sort */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-zinc-700',
                      sortBy === opt.value ? 'text-orange-400' : 'text-zinc-300'
                    )}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <span className="text-xs text-zinc-500">
                        {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-0.5 flex-shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'grid' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'list' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-zinc-500 flex-shrink-0">{totalCount}</span>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>

        <div className="flex-1" />

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
            <ChevronDown className="w-3 h-3" />
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-zinc-700',
                      sortBy === opt.value ? 'text-orange-400' : 'text-zinc-300'
                    )}
                  >
                    {opt.label}
                    {sortBy === opt.value && (
                      <span className="text-xs text-zinc-500">
                        {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'grid' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              viewMode === 'list' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Count */}
        <span className="text-sm text-zinc-500">{totalCount} contracts</span>
      </div>
    </div>
  );
}
