function GoldCoin() {
  return (
    <svg width="73" height="60" viewBox="0 0 73 60" fill="none" style={{ transform: "rotate(-5deg)" }}>
      <ellipse cx="36.5" cy="30" rx="34" ry="28" fill="url(#coin-grad)" stroke="#DB9C00" strokeWidth="2" />
      <ellipse cx="36.5" cy="28" rx="24" ry="20" fill="url(#coin-inner)" opacity="0.3" />
      <text x="36.5" y="35" textAnchor="middle" fill="#8B6914" fontSize="18" fontWeight="800" fontFamily="SF Pro Rounded, Inter, sans-serif">$</text>
      <defs>
        <radialGradient id="coin-grad" cx="0.5" cy="0.44" r="0.7">
          <stop offset="0.56" stopColor="#FFE070" stopOpacity="0.2" />
          <stop offset="1" stopColor="#594000" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="coin-inner">
          <stop stopColor="#FDC000" />
          <stop offset="1" stopColor="#DB9C00" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function ActiveWalletCard() {
  return (
    <div className="relative" style={{ height: 248 }}>
      {/* White outer shell */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "white",
          boxShadow: "0 16px 32px rgba(36, 35, 31, 0.05)",
        }}
      />

      {/* Inner card background */}
      <div
        className="absolute bottom-[4px] left-[4px] right-[4px] top-[4px] rounded-[20px]"
        style={{ background: "#F7F7F6" }}
      />

      {/* Bottom white section with dashed cutout */}
      <div
        className="absolute bottom-[4px] left-1/2 -translate-x-1/2 rounded-[20px]"
        style={{
          width: 376,
          height: 168.5,
          background: "white",
        }}
      />

      {/* Dashed border cutout */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-2xl"
        style={{
          width: 368,
          height: 160.5,
          top: 79.5,
          border: "2px dashed rgba(36, 35, 31, 0.075)",
        }}
      />

      {/* Balance section */}
      <div className="absolute left-0 right-0 top-0 flex flex-col px-4 pb-[14.5px] pt-[14.5px]" style={{ height: 75.5 }}>
        <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
          $256.32
        </span>
        <span className="text-[15px] font-medium leading-[120%] tracking-[0.03em]" style={{ color: "#898378" }}>
          available balance
        </span>
      </div>

      {/* Coin decoration */}
      <div className="absolute" style={{ left: "calc(50% - 36.67px - 140px)", top: "calc(50% + 10px)" }}>
        <GoldCoin />
      </div>

      {/* Pending pill */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-2xl px-[17.5px] py-[17.5px]"
        style={{
          left: 16,
          top: 180,
          width: 76,
          height: 52,
          background: "rgba(36, 35, 31, 0.25)",
          border: "2px solid white",
          boxShadow: "0 4px 8px rgba(36, 35, 31, 0.05)",
          borderRadius: "16px 16px 16px 8px",
        }}
      >
        <span className="text-[13px] font-extrabold leading-[120%] tracking-[0.03em] text-white">$128</span>
        <span className="text-[13px] font-semibold leading-[120%] tracking-[0.03em] text-white">pending</span>
      </div>

      {/* Action buttons */}
      <div
        className="absolute flex items-center justify-center rounded-2xl"
        style={{
          width: 67,
          height: 52,
          left: 230,
          top: 180,
          background: "#F7F7F6",
        }}
      >
        {/* Withdraw icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12H19M19 12L14 7M19 12L14 17" stroke="#898378" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div
        className="absolute flex items-center justify-center"
        style={{
          width: 67,
          height: 52,
          left: 301,
          top: 180,
          background: "#F7F7F6",
          borderRadius: "16px 16px 8px 16px",
        }}
      >
        {/* Settings icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="#898378" strokeWidth="2" />
          <path d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07" stroke="#898378" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
