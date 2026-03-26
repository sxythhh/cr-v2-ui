export function LevelProgress() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Level name */}
      <span className="text-[21px] font-extrabold uppercase leading-[120%] tracking-[0.1em] text-white">
        RISING
      </span>

      {/* XP to next */}
      <span className="text-[15px] font-bold leading-[120%] tracking-[0.025em] text-white/60">
        +2.577 XP to PRO
      </span>

      {/* Progress bar segments */}
      <div className="flex items-start gap-1.5" style={{ width: 128 }}>
        {/* Completed segments */}
        <div className="h-[5px] w-[13px] rounded-full" style={{ background: "rgba(85, 20, 0, 0.15)" }} />
        <div className="h-[5px] w-[13px] rounded-full" style={{ background: "rgba(85, 20, 0, 0.15)" }} />
        {/* Active segment (expanded) */}
        <div className="h-[5px] flex-1 rounded-full" style={{ background: "rgba(255, 255, 255, 0.75)" }} />
        {/* Remaining segments */}
        <div className="h-[5px] w-[13px] rounded-full" style={{ background: "rgba(85, 20, 0, 0.15)" }} />
        <div className="h-[5px] w-[13px] rounded-full" style={{ background: "rgba(85, 20, 0, 0.15)" }} />
      </div>
    </div>
  );
}
