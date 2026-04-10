"use client";
// @ts-nocheck

import Link from 'next/link';
import { motion } from 'motion/react';
import { Instagram, Video, Eye } from 'lucide-react';
import { Creator } from '@/types/virality-nexus';
import { Card } from '@/components/vn/ui/card';
import { Avatar } from '@/components/vn/ui/avatar';
import { Badge } from '@/components/vn/ui/badge';
import { formatNumber } from '@/lib/vn-utils';

interface CreatorCardProps {
  creator: Creator;
  index?: number;
}

export function CreatorCard({ creator, index = 0 }: CreatorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/creators/${creator.id}`}>
        <Card className="p-5 group" hover>
          <div className="flex items-start gap-4">
            <Avatar
              src={creator.avatar_url}
              name={creator.name}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-100 truncate group-hover:text-orange-400 transition-colors">
                  {creator.name}
                </h3>
                <Badge variant={creator.status}>{creator.status}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-400">
                {creator.instagram_handle && (
                  <span className="flex items-center gap-1">
                    <Instagram className="w-3.5 h-3.5" />
                    @{creator.instagram_handle}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-zinc-800">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Views</p>
              <p className="mt-1 text-lg font-semibold text-zinc-100 flex items-center gap-1">
                <Eye className="w-4 h-4 text-zinc-400" />
                {formatNumber(creator.total_views)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Videos</p>
              <p className="mt-1 text-lg font-semibold text-zinc-100 flex items-center gap-1">
                <Video className="w-4 h-4 text-zinc-400" />
                {creator.total_videos}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Engagement</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400">
                {creator.engagement_rate}%
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
