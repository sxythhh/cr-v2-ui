import { SocialIconStack } from "@/components/creator-mobile/social-icons";

function BudgetBar() {
  return (
    <div className="flex items-center gap-1">
      <div className="relative flex flex-1 items-center rounded-[10px]" style={{ height: 30, background: "#F5F5F4" }}>
        <div className="absolute left-0 top-0 h-[30px] rounded-[10px]" style={{ width: 84, background: "#00CE2A" }} />
        <span className="relative z-10 flex-1 pl-[9px] text-[15px] font-extrabold leading-[120%] tracking-[0.03em] text-white">
          $756
        </span>
        <span className="relative z-10 flex-1 pr-[9px] text-right text-[15px] font-extrabold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
          $2.5K
        </span>
      </div>
    </div>
  );
}

function CoinStack({ count }: { count: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 16,
            height: 16,
            background: `linear-gradient(212deg, ${i === 0 ? "#673A00 10%, #A55900 81%" : i < 2 ? "#A55900 10%, #E57C00 81%" : "#FFB100 10%, #FFC735 81%"})`,
            border: "0.5px solid #171717",
            marginLeft: i > 0 ? -6 : 0,
            zIndex: i,
          }}
        />
      ))}
    </div>
  );
}

function EarningsCard({ amount, label, coins }: { amount: string; label: string; coins: number }) {
  return (
    <div
      className="flex flex-1 flex-col justify-between rounded-[22px] p-[14.5px_16px]"
      style={{ background: "rgba(36, 35, 31, 0.025)", minHeight: coins === 1 ? 116 : coins === 2 ? 140 : 156 }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>{amount}</span>
        <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>{label}</span>
      </div>
      <CoinStack count={coins} />
    </div>
  );
}

function VideoCard({ views, earnings, username }: { views: string; earnings: string; username: string }) {
  return (
    <div
      className="relative flex w-[209px] shrink-0 flex-col overflow-hidden rounded-3xl"
      style={{ height: 372, background: "#667677", border: "2px solid white" }}
    >
      {/* Badges */}
      <div className="absolute left-3 top-3 flex gap-1.5">
        <div className="flex items-center gap-[3px] rounded-xl px-[9px] py-1.5 pl-1.5" style={{ background: "rgba(36, 35, 31, 0.5)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9L9 4V7H15V11H9V14L3 9Z" fill="white" />
          </svg>
          <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em] text-white">{views}</span>
        </div>
        <div className="flex items-center rounded-xl px-[9px] py-1.5" style={{ background: "rgba(36, 35, 31, 0.5)" }}>
          <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em] text-white">{earnings}</span>
        </div>
      </div>

      {/* Bottom overlay */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-3.5 py-[12.5px]"
        style={{ background: "linear-gradient(180deg, rgba(36,35,31,0) 0%, #24231F 100%)" }}
      >
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-white">{username}</span>
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-white/50">legend</span>
        </div>
        <div className="h-10 w-10 rounded-[10px]" style={{ background: "#9D9890" }} />
      </div>
    </div>
  );
}

export function CampaignDetailScreen() {
  return (
    <div className="flex flex-col" style={{ background: "#FCFCFB" }}>
      {/* Hero image */}
      <div className="px-[17px] pt-[17px]">
        <div className="relative overflow-hidden rounded-[28px]" style={{ height: 201, background: "#667677" }}>
          <div className="absolute left-4 top-4 flex items-center gap-0.5 rounded-xl px-[9px] py-1.5 pl-1.5" style={{ background: "rgba(36, 35, 31, 0.5)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3L13 9L5 15V3Z" fill="white" />
              <path d="M6 2L6 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em] text-white">FINANCE</span>
          </div>
        </div>
      </div>

      {/* Brand + Title */}
      <div className="flex flex-col gap-[34px] p-[34px]">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-1.5">
            <div className="h-[18px] w-[18px] rounded-[5.6px]" style={{ background: "#FFBF00" }} />
            <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>Lemon Squeeze</span>
            <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>1d ago</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>Post your lifts or funny feed</span>
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>posts – fast pay out</span>
          </div>
        </div>

        {/* Price + Budget bar */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-end">
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>$3</span>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M8 12.5H17" stroke="#D6D4D1" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>1k views</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="flex items-center rounded-[10px] py-1.5 pl-1.5 pr-[9px]" style={{ background: "#F5F5F4" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9L6 12L15 3" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 6L9 2" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>9</span>
              </div>
              <div className="flex-1"><BudgetBar /></div>
            </div>
            {/* Social icons */}
            <SocialIconStack size={30} platforms={["instagram", "tiktok", "youtube"]} />
          </div>
        </div>
      </div>

      {/* Deadline + Requirements cards */}
      <div className="flex flex-col gap-0.5 px-[17px]">
        <div className="flex flex-col gap-2.5 rounded-3xl p-[15.5px_17px]" style={{ background: "white", boxShadow: "0 12px 24px rgba(36,35,31,0.05)" }}>
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>deadline</span>
          <div className="flex items-start gap-1.5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L9 3M3 9L9 5L15 9V15H3V9Z" fill="#FFAC00" /></svg>
            <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>submit within 30min of posting</span>
          </div>
          <div className="flex items-start gap-1.5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="6" rx="1" fill="#FF002C" /><rect x="3" y="10" width="12" height="6" rx="1" fill="#FF002C" /></svg>
            <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>campaign ends apr 15</span>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-3xl" style={{ background: "white", boxShadow: "0 12px 24px rgba(36,35,31,0.05)" }}>
          <div className="flex flex-col gap-2.5 p-[15.5px_17px]">
            <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>requirements</span>
            <p className="text-[15px] font-medium leading-[160%] tracking-[0.03em]" style={{ color: "#24231F" }}>
              Post high-performing TikTok videos from our approved list and start generating strong organic reach with proven content. Stay consistent, follow the campaign guidelines, and maximize your views by leveraging already validated, viral-ready videos.
            </p>
          </div>
          <div className="px-1 pb-1">
            <div className="flex items-center gap-[7px] rounded-[20px] p-[13px]" style={{ background: "#F7F7F6" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 11L2 5L8 2L14 5V11L8 14L2 11Z" fill="#00AF36" />
                <path d="M8 2L14 5V11" stroke="#FFB600" strokeWidth="1" />
                <path d="M2 5L8 8V14" stroke="#0068E2" strokeWidth="1" />
                <path d="M14 5L8 8" stroke="#FE2B25" strokeWidth="1" />
              </svg>
              <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>Google Drive</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 9L9 5M9 5L13 9M9 5V13" stroke="#9D9890" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Earnings */}
      <div className="flex flex-col gap-[17px] p-[34px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>estimated earnings</span>
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>based on your avg 24K views</span>
        </div>
        <div className="flex gap-0.5">
          <EarningsCard amount="$72" label="low" coins={1} />
          <EarningsCard amount="$120" label="avg" coins={2} />
          <EarningsCard amount="$240" label="viral" coins={3} />
        </div>
      </div>

      {/* Top Performing Videos */}
      <div className="flex flex-col gap-[17px] px-[34px] pb-[34px] pt-[17px]">
        <span className="text-[18px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>top performing videos</span>
        <div className="flex gap-[17px] overflow-x-auto">
          <VideoCard views="32K" earnings="$16" username="mamedgasanov" />
          <VideoCard views="32K" earnings="$16" username="mamedgasanov" />
        </div>
      </div>
    </div>
  );
}
