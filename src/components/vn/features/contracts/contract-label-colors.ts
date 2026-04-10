// @ts-nocheck
"use client";

// Shared label color utility for contract tags/labels

export const LABEL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'UGC Creator': { bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400' },
  'Brand Deal': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'NDA': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  'Influencer': { bg: 'bg-pink-500/10', text: 'text-pink-400', dot: 'bg-pink-400' },
  'Partnership': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  'Template': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
};

const FALLBACK_COLORS = [
  { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  { bg: 'bg-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-400' },
  { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-400' },
  { bg: 'bg-teal-500/10', text: 'text-teal-400', dot: 'bg-teal-400' },
  { bg: 'bg-lime-500/10', text: 'text-lime-400', dot: 'bg-lime-400' },
  { bg: 'bg-sky-500/10', text: 'text-sky-400', dot: 'bg-sky-400' },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getLabelColor(label: string): { bg: string; text: string; dot: string } {
  if (LABEL_COLORS[label]) return LABEL_COLORS[label];
  return FALLBACK_COLORS[hashString(label) % FALLBACK_COLORS.length];
}

export const SUGGESTED_LABELS = ['UGC Creator', 'Brand Deal', 'NDA', 'Partnership'];
