interface CampaignListRowProps {
  iconColor: string;
  title: string;
  avatarCount: number;
  price: string;
  views: string;
  budget: string;
  socialColors: string[];
}

function MiniSocialIcons({ colors }: { colors: string[] }) {
  return (
    <div className="flex items-start">
      {colors.map((c, i) => (
        <div
          key={i}
          className="flex items-center justify-center"
          style={{
            width: 15,
            height: 15,
            background: c,
            border: "1.07px solid white",
            borderRadius: 4.57,
            marginLeft: i > 0 ? -4.3 : 0,
            zIndex: colors.length - i,
          }}
        />
      ))}
    </div>
  );
}

function MiniAvatars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full"
            style={{
              width: 15,
              height: 15,
              background: "#BB4347",
              border: "1px solid #FEFEFD",
              marginLeft: i > 0 ? -4 : 0,
              zIndex: 3 - i,
            }}
          />
        ))}
      </div>
      <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>
        {count}
      </span>
    </div>
  );
}

export function CampaignListRow({
  iconColor,
  title,
  avatarCount,
  price,
  views,
  budget,
  socialColors,
}: CampaignListRowProps) {
  return (
    <div className="flex items-center gap-[17px]">
      {/* Brand icon */}
      <div
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px]"
        style={{ background: iconColor }}
      >
        <div className="h-3 w-[23px] rounded-sm" style={{ background: "white" }} />
      </div>

      {/* Middle: title + meta */}
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
          {title}
        </span>
        <div className="flex items-center gap-2.5">
          <MiniAvatars count={avatarCount} />
          <div className="h-[3px] w-[3px] rounded-full" style={{ background: "#CDC8C2" }} />
          <MiniSocialIcons colors={socialColors} />
        </div>
      </div>

      {/* Right: price + budget */}
      <div className="flex flex-col items-end gap-1.5">
        <div className="flex items-start gap-0">
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-right" style={{ color: "#24231F" }}>
            {price}
          </span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M6 9H12" stroke="#D6D4D1" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-right" style={{ color: "#9D9890" }}>
            {views}
          </span>
        </div>
        <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-right" style={{ color: "#9D9890" }}>
          {budget}
        </span>
      </div>
    </div>
  );
}
