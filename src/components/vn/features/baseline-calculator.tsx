"use client";
// @ts-nocheck

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, X, Instagram, Calendar } from 'lucide-react';
import { Button } from '@/components/vn/ui/button';
import { formatNumber } from '@/lib/vn-utils';

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

interface BaselineCalculatorProps {
  platform: 'instagram' | 'tiktok';
  currentValue: number;
  onSave: (value: number) => void;
}

export function BaselineCalculator({ platform, currentValue, onSave }: BaselineCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [totalViews, setTotalViews] = useState('');
  const [numPosts, setNumPosts] = useState('');
  const [recentPostDate, setRecentPostDate] = useState('');
  const [oldestPostDate, setOldestPostDate] = useState('');

  const PlatformIcon = platform === 'instagram' ? Instagram : TikTokIcon;
  const platformName = platform === 'instagram' ? 'Instagram' : 'TikTok';
  const platformColor = platform === 'instagram' ? 'from-pink-500 to-purple-600' : 'from-cyan-400 to-pink-500';

  // Parse view counts (handle K, M suffixes)
  const parseViews = (str: string): number => {
    const cleaned = str.trim().toLowerCase().replace(/,/g, '');
    if (!cleaned) return 0;

    const match = cleaned.match(/^([\d.]+)\s*([km])?$/);
    if (!match) return parseInt(cleaned) || 0;

    const num = parseFloat(match[1]);
    const suffix = match[2];

    if (suffix === 'k') return Math.round(num * 1000);
    if (suffix === 'm') return Math.round(num * 1000000);
    return Math.round(num);
  };

  const parsedTotalViews = parseViews(totalViews);
  const parsedNumPosts = parseInt(numPosts) || 0;
  const averageViews = parsedNumPosts > 0 ? Math.round(parsedTotalViews / parsedNumPosts) : 0;

  const handleSave = () => {
    onSave(averageViews);
    setIsOpen(false);
  };

  const handleOpen = () => {
    // Reset fields
    setTotalViews('');
    setNumPosts('');
    setRecentPostDate('');
    setOldestPostDate('');
    setIsOpen(true);
  };

  return (
    <>
      {/* Trigger Button */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-1.5">
          Avg Views ({platformName})
        </label>
        <button
          type="button"
          onClick={handleOpen}
          className={`w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-left transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 group ${
            currentValue > 0 ? 'text-zinc-100' : 'text-zinc-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>
              {currentValue > 0 ? formatNumber(currentValue) : 'Calculate baseline...'}
            </span>
            <Calculator className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 transition-colors" />
          </div>
        </button>
        <p className="text-xs text-zinc-500 mt-1">
          Used to calculate video outlier scores (views / avg)
        </p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${platformColor} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <PlatformIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Calculate Baseline</h3>
                      <p className="text-sm text-white/80">{platformName} average views</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-zinc-400">
                  Enter stats from their {platformName} profile to calculate the average views per video.
                </p>

                {/* Input fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Total Video Views
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 500000 or 500k or 1.2m"
                      value={totalViews}
                      onChange={(e) => setTotalViews(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Number of Posts
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 25"
                      value={numPosts}
                      onChange={(e) => setNumPosts(e.target.value)}
                      className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Recent Post
                      </label>
                      <input
                        type="date"
                        value={recentPostDate}
                        onChange={(e) => setRecentPostDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Oldest Post
                      </label>
                      <input
                        type="date"
                        value={oldestPostDate}
                        onChange={(e) => setOldestPostDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Total views:</span>
                    <span className="text-zinc-200">{formatNumber(parsedTotalViews)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">Number of posts:</span>
                    <span className="text-zinc-200">{parsedNumPosts}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-700 flex items-center justify-between">
                    <span className="font-medium text-zinc-300">Average per video:</span>
                    <span className="text-lg font-bold text-orange-400">
                      {formatNumber(averageViews)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-800 flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={averageViews === 0}
                >
                  Save Baseline
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
