export function ReviewBanner() {
  return (
    <div
      className="flex items-center gap-[13px] rounded-[18px] py-[6.5px] pl-[6.5px] pr-4"
      style={{
        background: "rgba(255, 162, 34, 0.25)",
        border: "2px solid white",
      }}
    >
      {/* Stacked thumbnails */}
      <div className="relative h-[57px] shrink-0" style={{ width: 98 }}>
        {/* Back card */}
        <div
          className="absolute rounded-[11.5px]"
          style={{
            width: 98,
            height: 57,
            left: 0,
            top: 0,
            background: "#667677",
            border: "2px solid white",
          }}
        />
        {/* Middle card */}
        <div
          className="absolute rounded-[11.5px]"
          style={{
            width: 98,
            height: 57,
            left: "calc(50% - 49px - 1px)",
            top: "calc(50% - 28.5px)",
            background: "linear-gradient(135deg, #8BA4A6 0%, #667677 100%)",
            border: "2px solid white",
            boxShadow: "0 4px 8px rgba(36, 35, 31, 0.05)",
            transform: "rotate(-3deg)",
          }}
        />
        {/* Top card */}
        <div
          className="absolute rounded-[11.5px]"
          style={{
            width: 98,
            height: 57,
            left: "calc(50% - 49px - 2px)",
            top: "calc(50% - 28.5px + 1.5px)",
            background: "linear-gradient(135deg, #9DB8BA 0%, #7A9496 100%)",
            border: "2px solid white",
            boxShadow: "0 4px 8px rgba(36, 35, 31, 0.05)",
            transform: "rotate(-6deg)",
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-[5px]">
        <span className="text-[15px] font-bold leading-[120%] tracking-[0.03em]" style={{ color: "#613905" }}>
          3 clips are under review
        </span>
        <span className="text-[15px] font-medium leading-[120%] tracking-[0.03em]" style={{ color: "rgba(97, 57, 5, 0.6)" }}>
          you&apos;re doing great this week
        </span>
      </div>
    </div>
  );
}
