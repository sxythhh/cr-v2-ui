"use client";
// @ts-nocheck

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScheduledPost } from '@/types/virality-nexus';
import { CalendarMonth } from './calendar-month';
import { CalendarPostCard } from './calendar-post-card';

interface CalendarViewProps {
  posts: ScheduledPost[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onPostClick: (post: ScheduledPost) => void;
}

export function CalendarView({
  posts,
  selectedDate,
  onDateSelect,
  onPostClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    onDateSelect(now);
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Get posts for selected date
  const selectedDatePosts = useMemo(() => {
    if (!selectedDate) return [];
    return posts.filter(
      (p) => new Date(p.scheduled_at).toDateString() === selectedDate.toDateString()
    );
  }, [posts, selectedDate]);

  const formatSelectedDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-zinc-100 min-w-[180px] text-center">
              {monthName}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Month Grid */}
        <CalendarMonth
          currentDate={currentDate}
          selectedDate={selectedDate}
          posts={posts}
          onDateSelect={onDateSelect}
        />
      </div>

      {/* Selected Day Panel */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 h-full">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="text-lg font-semibold text-zinc-100">
              {selectedDate ? formatSelectedDate(selectedDate) : 'Select a Date'}
            </h3>
            {selectedDate && (
              <p className="text-sm text-zinc-500 mt-1">
                {selectedDatePosts.length} post{selectedDatePosts.length !== 1 ? 's' : ''} scheduled
              </p>
            )}
          </div>

          <div className="p-4 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
            {!selectedDate && (
              <p className="text-sm text-zinc-500 text-center py-8">
                Click on a date to view scheduled posts
              </p>
            )}

            {selectedDate && selectedDatePosts.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-8">
                No posts scheduled for this date
              </p>
            )}

            {selectedDatePosts.map((post) => (
              <CalendarPostCard
                key={post.id}
                post={post}
                onEdit={() => onPostClick(post)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
