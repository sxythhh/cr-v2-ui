"use client";
// @ts-nocheck

import { useMemo } from 'react';
import { ScheduledPost } from '@/types/virality-nexus';
import { CalendarDayCell } from './calendar-day-cell';

interface CalendarMonthProps {
  currentDate: Date;
  selectedDate: Date | null;
  posts: ScheduledPost[];
  onDateSelect: (date: Date) => void;
}

export function CalendarMonth({
  currentDate,
  selectedDate,
  posts,
  onDateSelect,
}: CalendarMonthProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Days from previous month to fill the first week
    const startPadding = firstDay.getDay();

    // Days from next month to fill the last week
    const endPadding = 6 - lastDay.getDay();

    const days: Date[] = [];

    // Previous month days
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Next month days
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, [currentDate]);

  // Group posts by date
  const postsByDate = useMemo(() => {
    const map = new Map<string, ScheduledPost[]>();

    posts.forEach((post) => {
      const dateKey = new Date(post.scheduled_at).toDateString();
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, post]);
    });

    return map;
  }, [posts]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-zinc-800/50 border-b border-zinc-800">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => (
          <CalendarDayCell
            key={index}
            date={date}
            isCurrentMonth={isCurrentMonth(date)}
            isToday={isToday(date)}
            isSelected={isSelected(date)}
            posts={postsByDate.get(date.toDateString()) || []}
            onClick={() => onDateSelect(date)}
          />
        ))}
      </div>
    </div>
  );
}
