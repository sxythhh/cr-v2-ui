export function CampaignCardsStack() {
  return (
    <div className="flex flex-col items-center gap-[34px] rounded-3xl border-2 border-dashed px-0 py-6"
      style={{
        borderColor: "#E6E4E1",
        background: "rgba(36, 35, 31, 0.025)",
      }}
    >
      {/* Stacked cards illustration */}
      <div className="relative h-[136px] w-[172px]">
        {/* Back card (blurred) */}
        <div
          className="absolute left-[17px] top-[56px] h-20 rounded-[16px]"
          style={{
            width: 138,
            background: "linear-gradient(0deg, rgba(102, 118, 119, 0.25), rgba(102, 118, 119, 0.25)), white",
            border: "2.86px solid white",
          }}
        />
        {/* Middle card (blurred) */}
        <div
          className="absolute left-[8px] top-[36px] h-[90px] rounded-[18px] opacity-50"
          style={{
            width: 155,
            background: "linear-gradient(135deg, #e8e4df 0%, #d4cfc9 100%)",
            border: "3.16px solid white",
            filter: "blur(12px)",
            mixBlendMode: "plus-darker",
          }}
        />
        {/* Middle card */}
        <div
          className="absolute left-[8px] top-[28px] flex h-[90px] flex-col items-end rounded-[18px] p-[19px]"
          style={{
            width: 155,
            background: "linear-gradient(135deg, #f0ece7 0%, #e8e4df 100%)",
            border: "3.16px solid white",
            boxShadow: "0 6.3px 12.6px rgba(36, 35, 31, 0.05)",
          }}
        />
        {/* Top card (blurred) */}
        <div
          className="absolute left-0 top-[8px] h-[100px] rounded-[20px] opacity-50"
          style={{
            width: 172,
            background: "linear-gradient(135deg, #f5f2ed 0%, #ebe7e2 50%, #e0dcd7 100%)",
            border: "3.51px solid white",
            filter: "blur(12px)",
            mixBlendMode: "plus-darker",
          }}
        />
        {/* Top card */}
        <div
          className="absolute left-0 top-0 h-[100px] rounded-[20px]"
          style={{
            width: 172,
            background: "linear-gradient(135deg, #f5f2ed 0%, #ebe7e2 50%, #e0dcd7 100%)",
            border: "3.51px solid white",
            borderRadius: 20,
          }}
        />
      </div>

      {/* Label */}
      <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]"
        style={{ color: "#9D9890" }}
      >
        browse 100+ campaigns
      </span>
    </div>
  );
}
