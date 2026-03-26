import { SocialIconStack } from "@/components/creator-mobile/social-icons";

interface CampaignCardProps {
  width: number;
  imageColor: string;
  brandName: string;
  title: string;
  subtitle: string;
  price: string;
  views: string;
  matchBadge?: string;
  zIndex: number;
  marginTop: number;
}

function SocialIcons() {
  return <SocialIconStack size={30} platforms={["instagram", "tiktok", "youtube"]} />;
}

export function CampaignCard({
  width,
  imageColor,
  brandName,
  title,
  subtitle,
  price,
  views,
  matchBadge,
  zIndex,
  marginTop,
}: CampaignCardProps) {
  return (
    <div
      className="flex flex-col self-center overflow-hidden rounded-[32px]"
      style={{
        width,
        background: "white",
        boxShadow: "0 16px 32px 16px rgba(36, 35, 31, 0.025)",
        zIndex,
        marginTop,
      }}
    >
      {/* Image area */}
      <div className="p-1 pb-0">
        <div
          className="relative overflow-hidden rounded-[28px]"
          style={{
            height: 196,
            background: imageColor,
          }}
        >
          {matchBadge && (
            <div
              className="absolute left-4 top-4 flex items-center rounded-xl px-[9px] py-1.5"
              style={{ background: "rgba(36, 35, 31, 0.5)" }}
            >
              <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em] text-white">
                {matchBadge}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-7 p-5">
        {/* Brand + title */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-[18px] w-[18px] rounded-[5.6px]" style={{ background: "#D6D4D2" }} />
            <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
              {brandName}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
              {title}
            </span>
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
              {subtitle}
            </span>
          </div>
        </div>

        {/* Price + stats + socials */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-end">
            <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
              {price}
            </span>
            <div className="flex items-end">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path d="M8 12.5H17" stroke="#D6D4D1" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>
                {views}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-8">
            {/* Tags */}
            <div className="flex items-center gap-1">
              <div className="flex items-center rounded-[10px] px-[9px] py-1.5 pl-1.5" style={{ background: "#F5F5F4" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9L6 12L15 3" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 6L9 2" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
                  9
                </span>
              </div>
              <div className="flex items-center rounded-[10px] px-[9px] py-1.5" style={{ background: "#F5F5F4" }}>
                <span className="text-[15px] font-extrabold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
                  $756
                </span>
              </div>
            </div>
            {/* Social icons */}
            <SocialIcons />
          </div>
        </div>
      </div>
    </div>
  );
}
