"use client";
// @ts-nocheck

import Link from 'next/link';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Eye, Video } from 'lucide-react';
import { LeaderboardEntry } from '@/types/virality-nexus';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/vn/ui/card';
import { Avatar } from '@/components/vn/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/vn/ui/table';
import { Skeleton } from '@/components/vn/ui/skeleton';
import { formatNumber } from '@/lib/vn-utils';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  loading?: boolean;
  title?: string;
  showPeriodStats?: boolean;
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-zinc-300',
  3: 'text-amber-600',
};

export function Leaderboard({
  entries,
  loading,
  title = 'Top Creators',
  showPeriodStats = true,
}: LeaderboardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead className="text-right">Total Views</TableHead>
              {showPeriodStats && (
                <>
                  <TableHead className="text-right">Videos</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <motion.tr
                key={entry.creator.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-zinc-800 hover:bg-zinc-800/50"
              >
                <TableCell>
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full font-bold',
                      entry.rank <= 3 ? rankColors[entry.rank] : 'text-zinc-500',
                      entry.rank === 1 && 'bg-yellow-400/10',
                      entry.rank === 2 && 'bg-zinc-300/10',
                      entry.rank === 3 && 'bg-amber-600/10'
                    )}
                  >
                    {entry.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`/creators/${entry.creator.id}`} className="flex items-center gap-3 hover:text-orange-400 transition-colors">
                    <Avatar
                      src={entry.creator.avatar_url}
                      name={entry.creator.name}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-zinc-100">{entry.creator.name}</p>
                      <p className="text-sm text-zinc-500">
                        {entry.creator.engagement_rate}% engagement
                      </p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <span className="flex items-center justify-end gap-1.5 text-zinc-100">
                    <Eye className="w-4 h-4 text-zinc-400" />
                    {formatNumber(entry.creator.total_views)}
                  </span>
                </TableCell>
                {showPeriodStats && (
                  <>
                    <TableCell className="text-right">
                      <span className="flex items-center justify-end gap-1.5 text-zinc-400">
                        <Video className="w-4 h-4" />
                        {entry.videosThisPeriod}
                      </span>
                    </TableCell>
                  </>
                )}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
