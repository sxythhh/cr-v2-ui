// Utility functions ported from virality-nexus

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString();
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateEngagementRate(views: number, likes: number, comments: number): number {
  if (views === 0) return 0;
  return Number((((likes + comments) / views) * 100).toFixed(2));
}

export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function getPlatformColor(platform: 'instagram' | 'tiktok'): string {
  return platform === 'instagram' ? '#E1306C' : '#00f2ea';
}

export function getPlatformGradient(platform: 'instagram' | 'tiktok'): string {
  return platform === 'instagram' ? 'from-pink-500 to-purple-600' : 'from-cyan-400 to-pink-500';
}

export function getStatusColor(status: 'active' | 'paused' | 'inactive'): string {
  switch (status) {
    case 'active': return 'bg-emerald-500/10 text-emerald-400';
    case 'paused': return 'bg-yellow-500/10 text-yellow-400';
    case 'inactive': return 'bg-zinc-500/10 text-zinc-400';
    default: return 'bg-zinc-500/10 text-zinc-400';
  }
}

export function getInitials(name: string): string {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
}

export function formatDateForQuery(date: Date): string {
  return date.toISOString().split('T')[0];
}
