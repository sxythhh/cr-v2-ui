"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import type { AffiliateReferredUser } from "@/types/affiliate.types";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { UserPlusIcon } from "./icons";
import { tinyOrb } from "./styles";

interface RecentActivityProps {
  referredUsers: AffiliateReferredUser[];
}

export function RecentActivity({ referredUsers }: RecentActivityProps) {
  const recentUsers = referredUsers.slice(0, 5);
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(containerRef);

  useEffect(() => { measureItems(); }, [measureItems, referredUsers]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none md:w-[300px] md:shrink-0">
      <div className="flex items-center justify-between pr-4">
        <div className="flex flex-1 items-center gap-1.5">
          <Clock size={16} className="text-page-text-subtle" />
          <span className="font-inter text-sm tracking-[-0.02em] text-page-text-muted leading-[120%]">
            Recent activity
          </span>
        </div>
      </div>

      <div ref={containerRef} className="relative flex flex-col justify-center gap-1" onMouseEnter={handlers.onMouseEnter} onMouseMove={handlers.onMouseMove} onMouseLeave={handlers.onMouseLeave}>
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
              initial={{ opacity: 0, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
              animate={{ opacity: 1, top: activeRect.top, left: activeRect.left, width: activeRect.width, height: activeRect.height }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
            />
          )}
        </AnimatePresence>
        {recentUsers.length === 0 ? (
          <span className="font-inter text-sm tracking-[-0.02em] text-page-text-subtle py-4">
            No recent activity
          </span>
        ) : (
          recentUsers.map((user, i) => (
            <div
              ref={(el) => registerItem(i, el)}
              className="relative z-10 flex cursor-pointer items-center gap-2 rounded-xl py-1.5"
              key={user.id}
            >
              <div style={tinyOrb(28, "#4D81EE")}>
                <UserPlusIcon color="#FFF" size={14} />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-0.5 min-w-0">
                <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text truncate leading-[120%]">
                  New Clipper
                </span>
                <span className="font-inter text-xs tracking-[-0.02em] text-page-text-subtle truncate leading-[120%]">
                  {user.name || user.username || "Unknown"} joined
                </span>
              </div>
              <span className="font-inter text-[10px] font-medium tracking-[0.1px] text-page-text-muted shrink-0 leading-[120%]">
                {formatDistanceToNow(new Date(user.joinedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
