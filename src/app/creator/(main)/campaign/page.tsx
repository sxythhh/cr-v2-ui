import Link from "next/link";
import { CampaignDetailScreen } from "@/components/creator-mobile/campaign-detail";

export default function CampaignPage() {
  return (
    <div className="flex flex-1 flex-col bg-[#FCFCFB]">
      <div className="flex-1 overflow-y-auto">
        <CampaignDetailScreen />
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 flex items-start gap-[17px] px-[34px] pb-[34px] pt-[17px]"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, white 100%)" }}
      >
        <Link href="/creator/feed" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl" style={{ border: "0.5px solid #D6D4D1" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <Link href="/creator/campaign/submit" className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: "#24231F" }}>
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">apply now</span>
        </Link>
      </div>
    </div>
  );
}
