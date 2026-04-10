"use client";
// @ts-nocheck

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/vn/ui/button';

interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  value: number | DateRange;
  onChange: (value: number | DateRange) => void;
  options?: { value: number; label: string }[];
}

const defaultOptions = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
  { value: 365, label: 'All time' },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateRangePicker({ value, onChange, options = defaultOptions }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const isCustomRange = typeof value === 'object';

  const getDisplayLabel = () => {
    if (isCustomRange) {
      return `${formatDate(value.start)} - ${formatDate(value.end)}`;
    }
    return options.find(o => o.value === value)?.label || 'Select range';
  };

  const handlePresetClick = (presetValue: number) => {
    onChange(presetValue);
    setIsOpen(false);
    setShowCustom(false);
  };

  const handleCustomClick = () => {
    setShowCustom(true);
    // Set defaults to last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setCustomStart(formatDateForInput(start));
    setCustomEnd(formatDateForInput(end));
  };

  const handleApplyCustom = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart + 'T00:00:00');
      const end = new Date(customEnd + 'T23:59:59');
      if (start <= end) {
        onChange({ start, end });
        setIsOpen(false);
        setShowCustom(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        <span className="max-w-[200px] truncate">{getDisplayLabel()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setIsOpen(false);
                setShowCustom(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {!showCustom ? (
                <div className="py-1 w-40">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handlePresetClick(option.value)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors ${
                        !isCustomRange && value === option.value
                          ? 'text-orange-400 bg-zinc-700/50'
                          : 'text-zinc-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <div className="border-t border-zinc-700 mt-1 pt-1">
                    <button
                      onClick={handleCustomClick}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-700 transition-colors ${
                        isCustomRange ? 'text-orange-400 bg-zinc-700/50' : 'text-zinc-300'
                      }`}
                    >
                      Custom range...
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 w-72">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-zinc-200">Custom Range</h4>
                    <button
                      onClick={() => setShowCustom(false)}
                      className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={customStart}
                        onChange={(e) => setCustomStart(e.target.value)}
                        max={customEnd || formatDateForInput(new Date())}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">End Date</label>
                      <input
                        type="date"
                        value={customEnd}
                        onChange={(e) => setCustomEnd(e.target.value)}
                        min={customStart}
                        max={formatDateForInput(new Date())}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCustom(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApplyCustom}
                      disabled={!customStart || !customEnd}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
