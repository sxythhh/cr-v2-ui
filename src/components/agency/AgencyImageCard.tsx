"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BannerSlideIndicator } from "./BannerSlideIndicator";

import type { AgencyCampaign, CampaignStats } from "./types";

interface AgencyImageCardProps {
  campaigns: AgencyCampaign[];
}

export function AgencyImageCard({ campaigns }: AgencyImageCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % campaigns.length);
  }, [campaigns.length]);

  useEffect(() => {
    if (campaigns.length <= 1) return;
    const interval = setInterval(advance, 4000);
    return () => clearInterval(interval);
  }, [advance, campaigns.length]);

  const activeCampaign = campaigns[activeIndex];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", border: "1px solid #EBF0EF" }}>
      {/* Image carousel — click to advance */}
      <button
        type="button"
        onClick={advance}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#f0f0f0] cursor-pointer"
      >
        {campaigns.map((campaign, i) => (
          <div
            key={campaign.id}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          >
            <Image
              src={campaign.thumbnail}
              alt={campaign.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Info button — top right */}
        <Link
          href={`/discover/${activeCampaign?.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-20 top-4 right-4 flex items-center justify-center size-10 rounded-full border border-white/15 hover:bg-white/10 hover:border-white/30 active:scale-[0.96] transition-[transform,background,border-color] duration-150 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
          aria-label="View campaign details"
          title="View campaign details"
        >
          <Image
            src="/icons/svg/circle-info.svg"
            alt="Info"
            width={20}
            height={20}
            className="opacity-[0.72]"
          />
        </Link>

        {/* Bottom overlay with title + indicator */}
        <div className="absolute inset-0 flex flex-col justify-end items-center p-4 md:p-6 gap-4">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <span className="relative z-10 text-[20px] md:text-[23px] font-bold leading-[28px] tracking-[-1.15px] text-white font-geist">
            {activeCampaign?.title}
          </span>

          {campaigns.length > 1 && (
            <div
              className="relative z-10 [&_button]:!bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <BannerSlideIndicator
                count={campaigns.length}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
                className="p-0"
              />
            </div>
          )}
        </div>
      </button>

      {/* Stats row — counting animation on slide change */}
      <div className="flex h-[80px] md:h-[91px]">
        {activeCampaign?.stats.map((stat, i) => (
          <CountingStatCell key={`${activeIndex}-${i}`} stat={stat} />
        ))}
      </div>
    </div>
  );
}

function useCountUp(target: number, duration = 600) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function CountingStatCell({ stat }: { stat: CampaignStats }) {
  const count = useCountUp(stat.value);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-[3.5px] py-4">
      <span className="text-[11px] md:text-[12px] font-medium leading-[14px] tracking-[-0.24px] text-black">
        {stat.label}
      </span>
      <span className="text-[13px] md:text-[14px] font-medium leading-[17px] tracking-[-0.28px] text-black tabular-nums">
        {stat.prefix}{formatNumber(count)}{stat.suffix}
      </span>
      <span className="text-[11px] md:text-[12px] font-medium leading-[14px] tracking-[-0.24px] text-black/50">
        {stat.sub}
      </span>
    </div>
  );
}
