import { CategoryIcon } from "@/components/creator-mobile/category-icons";
import { SocialIconStack } from "@/components/creator-mobile/social-icons";

export function AppStoreHeroScreen() {
  return (
    <div
      className="flex flex-col items-start justify-between rounded-[48px] p-[34px]"
      style={{ width: 420, height: 850, background: "white" }}
    >
      {/* Logo */}
      <div className="mx-auto">
        <svg width="99" height="32" viewBox="0 0 99 32" fill="none">
          <path d="M13.76 0L15.58 4.09L20.02 4.56L16.7 7.55L17.63 11.93L13.76 9.69L9.9 11.93L10.83 7.55L7.51 4.56L11.95 4.09L13.76 0Z" fill="#252321"/>
          <path d="M13.76 32L14.7 29.9L16.98 29.66L15.27 28.12L15.75 25.87L13.76 27.02L11.78 25.87L12.25 28.12L10.55 29.66L12.83 29.9L13.76 32Z" fill="#252321"/>
          <path d="M5.3 8.02L6 11.31L9.18 12.34L6.28 14.02V17.38L3.79 15.14L0.61 16.17L1.97 13.1L0 10.39L3.33 10.74L5.3 8.02Z" fill="#252321"/>
          <path d="M6.28 19.68V22.69L8.88 24.19L6.03 25.12L5.4 28.06L3.64 25.63L0.66 25.95L2.42 23.51L1.2 20.76L4.05 21.69L6.28 19.68Z" fill="#252321"/>
          <path d="M22.23 8.02L21.53 11.31L18.34 12.34L21.25 14.02V17.38L23.74 15.14L26.92 16.17L25.56 13.1L27.53 10.39L24.2 10.74L22.23 8.02Z" fill="#252321"/>
          <path d="M21.25 19.68V22.69L18.65 24.19L21.5 25.12L22.12 28.06L23.89 25.63L26.87 25.95L25.11 23.51L26.33 20.76L23.47 21.69L21.25 19.68Z" fill="#252321"/>
          <text x="35" y="14" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" letterSpacing="-0.01em" fill="#252321">Content</text>
          <text x="35" y="30" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" letterSpacing="-0.01em" fill="#252321">Rewards</text>
        </svg>
      </div>

      {/* Hero text */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321" }}>
            Post content on
          </span>
          <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321" }}>
            tiktok, instagram
          </span>
          <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321" }}>
            or youtube and
          </span>
          <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321" }}>
            turn your views
          </span>
          <div className="flex items-start gap-2">
            <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321" }}>
              into
            </span>
            {/* Money icons placeholder */}
            <div className="relative" style={{ width: 101, height: 40 }}>
              <div
                className="absolute rounded-[12px]"
                style={{
                  width: 37, height: 37, left: 0, top: 0,
                  background: "conic-gradient(from -51deg, #00CC32, #00A226, #00CC32, #008E20, #00A226, #00CC32)",
                  border: "1.3px solid white",
                  borderRadius: 12,
                  boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
                }}
              />
              <div
                className="absolute rounded-[12px]"
                style={{
                  width: 37, height: 37, left: 61, top: 0,
                  background: "linear-gradient(67deg, #0071DC, #0089FF, #005AB2, #0071DC, #0089FF)",
                  border: "1.3px solid white",
                  borderRadius: 12,
                  boxShadow: "0 16px 32px rgba(0,0,0,0.25)",
                  transform: "rotate(5deg)",
                }}
              />
            </div>
            <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321" }}>
              cash
            </span>
          </div>
        </div>

        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>
          Find brand campaigns. Post your videos. Earn $1+ per 1K views
        </span>
      </div>

      {/* CTA */}
      <div
        className="flex w-full items-center justify-center rounded-[28px] px-7 py-[22.5px]"
        style={{ background: "#FF9900" }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>
          Let&apos;s go
        </span>
      </div>
    </div>
  );
}

function StatRow({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center justify-between">
      {/* Left bar */}
      <div className="h-[70px] rounded-sm" style={{ width: 42, background: "#FF9900", boxShadow: "0 8px 16px rgba(255,153,0,0.25)" }} />
      {/* Center stat */}
      <div className="flex flex-col items-center gap-3">
        <span style={{ fontFamily: "Manrope, Inter, sans-serif", fontSize: 40, fontWeight: 600, lineHeight: "100%", letterSpacing: "-0.02em", color: "#252321", textAlign: "center" }}>
          {value}
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C", textAlign: "center" }}>
          {label}
        </span>
      </div>
      {/* Right bar */}
      <div className="h-[70px] rounded-sm" style={{ width: 41, background: "#FF9900", boxShadow: "0 8px 16px rgba(255,153,0,0.25)" }} />
    </div>
  );
}

export function AppStoreStatsScreen() {
  return (
    <div
      className="flex flex-col items-start justify-between rounded-[48px] p-[34px]"
      style={{ width: 420, height: 850, background: "white" }}
    >
      {/* Logo */}
      <div className="mx-auto">
        <svg width="99" height="32" viewBox="0 0 99 32" fill="none">
          <path d="M13.76 0L15.58 4.09L20.02 4.56L16.7 7.55L17.63 11.93L13.76 9.69L9.9 11.93L10.83 7.55L7.51 4.56L11.95 4.09L13.76 0Z" fill="#252321"/>
          <path d="M13.76 32L14.7 29.9L16.98 29.66L15.27 28.12L15.75 25.87L13.76 27.02L11.78 25.87L12.25 28.12L10.55 29.66L12.83 29.9L13.76 32Z" fill="#252321"/>
          <path d="M5.3 8.02L6 11.31L9.18 12.34L6.28 14.02V17.38L3.79 15.14L0.61 16.17L1.97 13.1L0 10.39L3.33 10.74L5.3 8.02Z" fill="#252321"/>
          <path d="M6.28 19.68V22.69L8.88 24.19L6.03 25.12L5.4 28.06L3.64 25.63L0.66 25.95L2.42 23.51L1.2 20.76L4.05 21.69L6.28 19.68Z" fill="#252321"/>
          <path d="M22.23 8.02L21.53 11.31L18.34 12.34L21.25 14.02V17.38L23.74 15.14L26.92 16.17L25.56 13.1L27.53 10.39L24.2 10.74L22.23 8.02Z" fill="#252321"/>
          <path d="M21.25 19.68V22.69L18.65 24.19L21.5 25.12L22.12 28.06L23.89 25.63L26.87 25.95L25.11 23.51L26.33 20.76L23.47 21.69L21.25 19.68Z" fill="#252321"/>
          <text x="35" y="14" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" letterSpacing="-0.01em" fill="#252321">Content</text>
          <text x="35" y="30" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="12" letterSpacing="-0.01em" fill="#252321">Rewards</text>
        </svg>
      </div>

      {/* Stats */}
      <div className="flex w-full flex-col gap-16">
        <StatRow value="$2M+" label="total paid" />
        <StatRow value="50K+" label="creators" />
        <StatRow value="500+" label="active campaigns" />
      </div>

      {/* CTA */}
      <div
        className="flex w-full items-center justify-center rounded-[28px] px-7 py-[22.5px]"
        style={{ background: "#252321" }}
      >
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>
          Continue
        </span>
      </div>
    </div>
  );
}

export function AppStoreNameScreen() {
  return (
    <div className="flex flex-col" style={{ width: 420, height: 850, background: "white", borderRadius: 48 }}>
      {/* Content */}
      <div className="flex flex-1 flex-col items-start justify-center gap-[34px] px-[34px] py-8">
        <div className="flex w-full flex-col items-start gap-2.5">
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>
            What&apos;s your name?
          </span>
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>
            Will be displayed on your profile
          </span>
        </div>
      </div>

      {/* Input + CTA */}
      <div className="flex flex-col gap-[7px] px-[34px] pb-[34px]">
        <div
          className="flex items-center rounded-3xl px-6 py-[22.5px]"
          style={{ background: "#F5F5F5", border: "0.5px solid #FF9900", boxShadow: "inset 0 -12px 24px rgba(255,255,255,0.5)" }}
        >
          <div className="relative">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#A8A49E" }}>
              John
            </span>
            <div className="absolute -right-1 top-1/2 h-[15px] w-[0.5px] -translate-y-1/2 rounded-full" style={{ background: "#252321" }} />
          </div>
        </div>
        <div
          className="flex items-center justify-center rounded-[28px] px-7 py-[22.5px]"
          style={{ background: "#E7E6E4" }}
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}

const nicheChipsV2 = [
  { label: "Gaming", color: "#FF005B" },
  { label: "Beauty", color: "#AB49FF" },
  { label: "Finance", color: "#00BF76" },
  { label: "Tech", color: "#DA8539" },
  { label: "Fashion", color: "#0084FF" },
  { label: "Lifestyle", color: "#FF009D" },
  { label: "Comedy", color: "#FF5900" },
  { label: "Food", color: "#FFAC00" },
  { label: "Education", color: "#00B5FF" },
];

export function AppStoreNicheScreen() {
  return (
    <div className="flex flex-col" style={{ width: 420, borderRadius: 48 }}>
      {/* Content */}
      <div className="flex flex-1 flex-col items-start justify-center gap-[34px] px-[34px] py-8">
        <div className="flex w-full flex-col items-start gap-2.5">
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>
            Pick your niches
          </span>
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>
            Helps us match you with the right campaigns
          </span>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-0">
          {nicheChipsV2.map((chip, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-3xl px-5 py-[17.5px] pl-[17.5px]"
              style={{ border: "0.5px solid #D6D4D1" }}
            >
              <CategoryIcon name={chip.label} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>
                {chip.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-start gap-[7px] p-[34px]">
        <div
          className="flex h-[63px] w-[63px] shrink-0 items-center justify-center rounded-[28px]"
          style={{ border: "0.5px solid #D6D4D1" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          className="flex h-[63px] flex-1 items-center justify-center rounded-[28px]"
          style={{ background: "#E7E6E4" }}
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}

function SocialConnectRow({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl px-6 pb-6 pt-[22.5px]" style={{ background: "white", border: "1px solid white", boxShadow: "inset 0 -12px 24px rgba(255,255,255,0.5)" }}>
      <div className="flex flex-col gap-[7px]">
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>{name}</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>Connect</span>
      </div>
      <div className="absolute -bottom-9 -right-6" style={{ width: 128, height: 128 }}>{icon}</div>
    </div>
  );
}

function AppStoreCampaignCard({ brandName, brandColor, title, price, views }: { brandName: string; brandColor: string; title: string; price: string; views: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[26px]" style={{ width: 392, background: "white" }}>
      <div className="h-[204px] rounded-[26px]" style={{ background: brandColor }} />
      <div className="flex flex-col gap-7 p-5">
        <div className="flex flex-col gap-[9px]">
          <div className="flex items-center gap-1.5">
            <div className="h-[18px] w-[18px] rounded-[5.6px]" style={{ background: brandColor }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", letterSpacing: "-0.009em", color: "#77756C" }}>{brandName}</span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>{title}</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex items-end">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 450, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>{price}</span>
            <span className="pb-0.5" style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", color: "#77756C" }}> / {views}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="flex items-center rounded-[10px] py-1.5 pl-1.5 pr-[9px]" style={{ background: "#F5F5F4" }}>
                <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.003em", color: "#252321" }}>9</span>
              </div>
              <div className="flex items-center rounded-[10px] py-1.5 pl-1.5 pr-[9px]" style={{ background: "#F5F5F4" }}>
                <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.003em", color: "#252321" }}>756</span>
              </div>
            </div>
            <SocialIconStack size={30} platforms={["instagram", "tiktok", "youtube"]} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppStoreCampaignFeedScreen() {
  return (
    <div className="flex flex-col" style={{ width: 420, borderRadius: 48 }}>
      {/* Title */}
      <div className="px-8 pt-8">
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>
          Pick your first campaign to join
        </span>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-0 px-3.5 py-3.5">
        {["Gaming", "Beauty", "Finance", "Tech", "Fashion", "Lifestyle", "Comedy", "Food", "Education"].map((label) => (
          <div key={label} className="flex items-center gap-1.5 rounded-3xl px-5 py-[17.5px] pl-[17.5px]" style={{ background: "white", border: "0.5px solid #D6D4D1" }}>
            <CategoryIcon name={label} gray />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Campaign cards */}
      <div className="flex flex-col gap-3.5 px-3.5 pb-2.5">
        <AppStoreCampaignCard brandName="Whop" brandColor="#667677" title="Post your lifts or feed posts, earn money" price="$3" views="1k views" />
        <AppStoreCampaignCard brandName="bilboard" brandColor="#AB49FF" title="Cloudbet Soccer" price="$1.50" views="1k views" />
      </div>

      {/* Bottom CTA */}
      <div className="p-[34px]" style={{ background: "linear-gradient(180deg, rgba(245,245,245,0) 0%, #F5F5F5 100%)", backdropFilter: "blur(2px)" }}>
        <div className="flex items-center justify-center rounded-[28px] px-7 py-[22.5px]" style={{ background: "rgba(255,255,255,0.75)", border: "1px solid white", boxShadow: "0 12px 24px rgba(37,35,33,0.05)", backdropFilter: "blur(24px)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>See all</span>
        </div>
      </div>
    </div>
  );
}

export function AppStorePhoneScreen() {
  return (
    <div className="flex flex-col" style={{ width: 420, borderRadius: 48 }}>
      {/* Content */}
      <div className="flex flex-1 flex-col items-start justify-center gap-[34px] px-[34px] py-8">
        <div className="flex w-full flex-col items-start gap-2.5">
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>
            Almost there!
          </span>
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>
            We&apos;ll send deadline reminders and payout alerts
          </span>
        </div>
      </div>

      {/* Phone input + CTA */}
      <div className="flex flex-col gap-[7px] px-[34px] pb-[34px]">
        {/* Country code + phone input */}
        <div className="flex items-start gap-[7px]">
          <div className="flex items-start gap-6 rounded-[28px] px-[22.5px] py-[22.5px]" style={{ background: "#F5F5F5", boxShadow: "inset 0 -12px 24px rgba(255,255,255,0.5)" }}>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect width="18" height="18" rx="4" fill="#F0F0F0"/>
                <rect x="0" y="0" width="9" height="9" fill="#0054BB"/>
                <rect x="0" y="11" width="18" height="3" fill="#EC0017"/>
                <rect x="9" y="6" width="9" height="3" fill="#EC0017"/>
              </svg>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>+1</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 7L9 11L13 7" stroke="#252321" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-1 items-center rounded-[28px] px-6 py-[22.5px]" style={{ background: "#F5F5F5", border: "0.5px solid #FF9900", boxShadow: "inset 0 -12px 24px rgba(255,255,255,0.5)" }}>
            <div className="relative">
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#A8A49E" }}>(123) 456 7890</span>
              <div className="absolute -right-1 top-1/2 h-[15px] w-[0.5px] -translate-y-1/2 rounded-full" style={{ background: "#252321" }} />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-[7px]">
          <div className="flex h-[63px] w-[111.5px] shrink-0 items-center justify-center rounded-[28px]" style={{ border: "0.5px solid #D6D4D1" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#252321" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex h-[63px] flex-1 items-center justify-center rounded-[28px]" style={{ background: "rgba(37, 35, 33, 0.2)" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>Send code</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OtpDigit({ value, active }: { value: string; active?: boolean }) {
  return (
    <div
      className="relative flex flex-1 flex-col items-center overflow-hidden rounded-[28px]"
      style={{
        height: 104,
        background: active ? "#F5F5F5" : "#FF9900",
        border: active ? "0.5px solid #FF9900" : "none",
      }}
    >
      {!active && <div className="h-[52px] w-full rounded-[28px]" style={{ background: "#FFAF48" }} />}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          fontFamily: "Manrope, Inter, sans-serif",
          fontSize: 40,
          fontWeight: 600,
          lineHeight: "100%",
          letterSpacing: "-0.02em",
          color: active ? "#A8A49E" : "white",
          textAlign: "center",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function AppStoreOtpScreen() {
  return (
    <div className="flex flex-col" style={{ width: 420, borderRadius: 48 }}>
      {/* Content */}
      <div className="flex flex-1 flex-col items-start justify-center gap-[34px] px-[34px] py-8">
        <div className="flex w-full flex-col items-start gap-2.5">
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>
            Enter the code
          </span>
          <span className="w-full text-center" style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>
            Sent to +1 (123) 456 7890
          </span>
        </div>
      </div>

      {/* OTP input + CTA */}
      <div className="flex flex-col gap-[7px] px-[34px] pb-[34px]">
        {/* 4 digit boxes */}
        <div className="flex items-center gap-0.5">
          <OtpDigit value="0" />
          <OtpDigit value="2" />
          <OtpDigit value="5" />
          <OtpDigit value="0" active />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-[7px]">
          <div className="flex h-[63px] w-[113px] shrink-0 items-center justify-center rounded-[28px]" style={{ border: "0.5px solid #D6D4D1" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#252321" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex h-[63px] flex-1 items-center justify-center rounded-[28px]" style={{ background: "#F5F5F5", border: "0.5px solid #D6D4D1" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#A8A49E" }}>0:15</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppStoreSocialsScreen() {
  return (
    <div className="flex flex-col rounded-[48px] p-2.5" style={{ width: 420, height: 719 }}>
      {/* Header */}
      <div className="flex flex-col gap-3.5 px-6 py-[22px]">
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>Connect your socials</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>We verify your views and match you to the right campaigns</span>
      </div>

      {/* Social rows */}
      <div className="flex flex-col gap-0.5">
        <SocialConnectRow name="TikTok" icon={
          <svg width="84" height="78" viewBox="0 0 84 78" fill="none">
            <path d="M62.5 0.5V2.2C62.6 2.9 62.7 3.6 62.8 4.2C64 11.2 68.2 17.1 73.9 20.7C77.6 23 81.9 24.3 86.3 24.3V40.4C77.7 40.3 69.8 37.5 63.3 32.9L62.5 32.3V68.1C62.5 85.2 48.6 99.1 31.5 99.1C25.1 99.1 19.2 97.1 14.2 93.8C6 88.2 0.5 78.8 0.5 68.1C0.5 51.2 14 37.5 30.7 37.1L31.5 37.1C32.8 37.1 34.1 37.1 35.3 37.3V53.6C34.1 53.3 32.8 53.1 31.5 53.1C23.2 53.1 16.5 59.8 16.5 68C16.5 73.8 19.9 78.9 24.8 81.3C26.8 82.3 29 82.9 31.5 82.9C39.7 82.9 46.3 76.3 46.4 68.1V0.5H62.5Z" stroke="#D6D4D1"/>
          </svg>
        } />
        <SocialConnectRow name="Instagram" icon={
          <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
            <rect x="12" y="12" width="104" height="104" rx="28" stroke="#E7E6E4" strokeWidth="1"/>
            <circle cx="64" cy="64" r="24" stroke="#E7E6E4" strokeWidth="1"/>
            <circle cx="92" cy="36" r="6" stroke="#E7E6E4" strokeWidth="1"/>
          </svg>
        } />
        <SocialConnectRow name="YouTube" icon={
          <svg width="113" height="79" viewBox="0 0 113 79" fill="none">
            <rect x="0.25" y="0.25" width="112.33" height="78.83" rx="16" stroke="#D6D4D1" strokeWidth="0.5"/>
            <path d="M45.6 29.5C45.6 26.8 48.6 25.1 50.9 26.5L68.1 36.5C70.5 37.8 70.5 41.2 68.1 42.5L50.9 52.5C48.6 53.9 45.6 52.2 45.6 49.5V29.5Z" stroke="#D6D4D1"/>
          </svg>
        } />
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto flex items-start gap-[7px] p-[34px]">
        <div className="flex h-[63px] w-[63px] shrink-0 items-center justify-center rounded-[28px]" style={{ border: "0.5px solid #D6D4D1" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="flex h-[63px] flex-1 items-center justify-center rounded-[28px]" style={{ background: "rgba(37, 35, 33, 0.2)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>Continue</span>
        </div>
      </div>
    </div>
  );
}

export function AppStoreHowItWorksScreen() {
  return (
    <div className="flex flex-col rounded-[48px] p-2.5" style={{ width: 420, height: 719 }}>
      {/* Header */}
      <div className="flex flex-col gap-[7px] px-6 py-[22px]">
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 21, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>
          How it works
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-0.5">
        {/* Step 1 */}
        <div className="relative overflow-hidden rounded-3xl px-6 pb-6 pt-[22.5px]" style={{ background: "white", border: "1px solid white", boxShadow: "inset 0 -12px 24px rgba(255,255,255,0.5)" }}>
          <div className="flex flex-col gap-[7px]">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>Connect your socials</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>Link tiktok, youtube, or instagram</span>
          </div>
          <div className="absolute -bottom-[43px] -right-6" style={{ width: 128, height: 128 }}>
            <svg width="104" height="74" viewBox="0 0 104 74" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M34.5 37.1C44.9 26.7 61.8 26.7 72.2 37.1L74 39C78.4 43.3 80.9 48.8 81.6 54.5C82 57.4 79.9 60.1 77 60.5C74.1 60.8 71.4 58.7 71 55.8C70.6 52.4 69.1 49.1 66.5 46.5L64.6 44.7C58.4 38.4 48.3 38.4 42 44.7L24.2 62.5C17.9 68.8 17.9 78.9 24.2 85.1L26 87C32.3 93.2 42.4 93.2 48.6 87L49.6 86.1C51.6 84 55 84 57.1 86.1C59.2 88.1 59.2 91.5 57.1 93.6L56.2 94.5C45.8 104.9 28.9 104.9 18.5 94.5L16.6 92.7C6.2 82.3 6.2 65.4 16.6 55L34.5 37.1Z" fill="#FF9F00"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M71.8 15.8C82.2 5.4 99.1 5.4 109.5 15.8L111.4 17.6C121.8 28.1 121.8 44.9 111.4 55.4L93.5 73.2C83.1 83.6 66.2 83.6 55.8 73.2L54 71.4C49.6 67 47.1 61.5 46.4 55.8C46 52.9 48.1 50.2 51 49.9C53.9 49.5 56.6 51.6 57 54.5C57.4 57.9 58.9 61.2 61.5 63.8L63.4 65.6C69.6 71.9 79.7 71.9 86 65.6L103.8 47.8C110.1 41.6 110.1 31.4 103.8 25.2L102 23.4C95.7 17.1 85.6 17.1 79.4 23.4L78.4 24.3C76.4 26.4 73 26.4 70.9 24.3C68.8 22.2 68.8 18.8 70.9 16.7L71.8 15.8Z" fill="#FF9F00"/>
            </svg>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative overflow-hidden rounded-3xl" style={{ height: 233, background: "white", border: "1px solid white" }}>
          <div className="flex flex-col gap-[7px] px-6 pt-[22.5px]">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>Find campaigns that match you</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>Browse brands looking for your content</span>
          </div>
          <div className="absolute" style={{ left: 25, top: 79 }}>
            <div className="flex flex-col gap-8 rounded-3xl p-6" style={{ width: 344, background: "white", boxShadow: "0 12px 24px rgba(37,35,33,0.075), 0 0 0 0.5px #E7E6E4", transform: "rotate(-2deg)" }}>
              <div className="flex flex-col gap-[9px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-[18px] w-[18px] rounded-[5.6px]" style={{ background: "linear-gradient(180deg, #FFBE00, #EC9D00)" }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", color: "#77756C" }}>Total</span>
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", color: "#252321" }}>Post your lifts or feed posts, earn money</span>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-end">
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 450, lineHeight: "120%", letterSpacing: "-0.018em", color: "#252321" }}>$3</span>
                  <span className="pb-0.5" style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 450, lineHeight: "120%", color: "#77756C" }}> / 1k views</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center rounded-[10px] py-1.5 pl-1.5 pr-[9px]" style={{ background: "#F5F5F4" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#252321" }}>9</span>
                  </div>
                  <div className="flex items-center rounded-[10px] py-1.5 pl-1.5 pr-[9px]" style={{ background: "#F5F5F4" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "#252321" }}>756</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col gap-6 rounded-3xl px-6 pb-6 pt-[22.5px]" style={{ background: "white" }}>
          <div className="flex flex-col gap-[7px]">
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "#252321" }}>Post & get paid</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 425, lineHeight: "120%", letterSpacing: "-0.009em", color: "#78756C" }}>Earn $1+ per 1K views</span>
          </div>
          <div className="relative" style={{ width: 109, height: 43 }}>
            <div className="absolute rounded-[13px]" style={{ width: 40, height: 40, left: 0, top: 0, background: "conic-gradient(from -51deg, #00CC32, #00A226, #00CC32, #008E20, #00A226, #00CC32)", border: "1.4px solid white", boxShadow: "0 17px 34px rgba(37,35,33,0.2)" }} />
            <div className="absolute rounded-[13px]" style={{ width: 40, height: 40, left: 66, top: 0, background: "linear-gradient(67deg, #0071DC, #0089FF, #005AB2, #0071DC)", border: "1.4px solid white", boxShadow: "0 17px 34px rgba(37,35,33,0.2)", transform: "rotate(5deg)" }} />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto p-[34px] pt-0">
        <div className="flex w-full items-center justify-center rounded-[28px] px-7 py-[22.5px]" style={{ background: "#252321" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 500, lineHeight: "120%", letterSpacing: "-0.009em", color: "white" }}>Start earning</span>
        </div>
      </div>
    </div>
  );
}
