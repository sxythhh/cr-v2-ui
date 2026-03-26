import Link from "next/link";
import { CampaignCard } from "@/components/creator-mobile/campaign-card";

export default function FeedPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#FCFCFB]">
      {/* Header */}
      <div className="flex items-center justify-between px-[34px] pb-0 pt-[17.5px]">
        <div className="flex items-center gap-2">
          <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>for you</span>
          <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>15</span>
        </div>
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[32px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6H20M7 12H17M10 18H14" stroke="#9D9890" strokeWidth="2" strokeLinecap="round" /></svg>
        </div>
      </div>

      {/* Stacked cards */}
      <div className="flex flex-1 flex-col items-center justify-center px-[18px] pt-[34px]">
        <div className="relative flex flex-col items-center">
          <CampaignCard width={320} imageColor="#DA8539" brandName="Whop" title="Post your lifts or funny feed" subtitle="screenshots – earn money" price="$3" views="1k views" zIndex={0} marginTop={0} />
          <CampaignCard width={352} imageColor="#667677" brandName="Whop" title="Post your lifts or funny feed" subtitle="screenshots – earn money" price="$3" views="1k views" zIndex={1} marginTop={-397} />
          <Link href="/creator/campaign" className="block">
            <CampaignCard width={384} imageColor="#FF5600" brandName="Whop" title="Post your lifts or funny feed" subtitle="posts – fast pay out" price="$3" views="1k views" matchBadge="96% MATCH" zIndex={2} marginTop={-397} />
          </Link>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-center gap-2.5 px-[34px] pb-[34px] pt-[17px]">
        <div className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: "rgba(36,35,31,0.05)" }}>
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em]" style={{ color: "#24231F" }}>ignore</span>
        </div>
        <div className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: "rgba(36,35,31,0.05)" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2H16V18L10 14L4 18V2Z" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </div>
        <Link href="/creator/campaign" className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: "rgba(36,35,31,0.05)" }}>
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em]" style={{ color: "#24231F" }}>apply</span>
        </Link>
      </div>
    </div>
  );
}
