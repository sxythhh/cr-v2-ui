"use client";
// @ts-nocheck

import { ScheduledPost } from '@/types/virality-nexus';
import { cn } from '@/lib/utils';

// Twitter/X icon
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Instagram icon
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

interface CalendarDayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  posts: ScheduledPost[];
  onClick: () => void;
}

export function CalendarDayCell({
  date,
  isCurrentMonth,
  isToday,
  isSelected,
  posts,
  onClick,
}: CalendarDayCellProps) {
  const twitterPosts = posts.filter((p) => p.platform === 'twitter');
  const instagramPosts = posts.filter((p) => p.platform === 'instagram');

  return (
    <button
      onClick={onClick}
      className={cn(
        'min-h-[100px] p-2 transition-all text-left flex flex-col relative',
        isCurrentMonth ? 'bg-zinc-900/50' : 'bg-zinc-950/50',
        isSelected
          ? 'bg-orange-500/10 border-2 border-orange-500'
          : 'border border-zinc-800',
        isToday && !isSelected && 'border-orange-500/40',
        !isSelected && 'hover:bg-zinc-800/50 hover:border-zinc-700'
      )}
    >
      {/* Date number */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            'text-sm font-medium',
            isToday
              ? 'bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
              : isCurrentMonth
              ? 'text-zinc-300'
              : 'text-zinc-600'
          )}
        >
          {date.getDate()}
        </span>
        {posts.length > 0 && (
          <span className="text-xs text-zinc-500">{posts.length}</span>
        )}
      </div>

      {/* Post indicators */}
      <div className="flex-1 space-y-1 overflow-hidden">
        {posts.slice(0, 3).map((post) => {
          const PlatformIcon = post.platform === 'twitter' ? TwitterIcon : InstagramIcon;
          const platformColor =
            post.platform === 'twitter' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400';

          return (
            <div
              key={post.id}
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate',
                platformColor
              )}
            >
              <PlatformIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{post.title}</span>
            </div>
          );
        })}
        {posts.length > 3 && (
          <div className="text-xs text-zinc-500 px-1.5">+{posts.length - 3} more</div>
        )}
      </div>

      {/* Platform summary badges */}
      {posts.length > 0 && (
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-zinc-800">
          {twitterPosts.length > 0 && (
            <div className="flex items-center gap-0.5 text-blue-400">
              <TwitterIcon className="w-3 h-3" />
              <span className="text-[10px]">{twitterPosts.length}</span>
            </div>
          )}
          {instagramPosts.length > 0 && (
            <div className="flex items-center gap-0.5 text-pink-400">
              <InstagramIcon className="w-3 h-3" />
              <span className="text-[10px]">{instagramPosts.length}</span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}
