function TaskRow({ label, xp }: { label: string; xp: string }) {
  return (
    <div className="flex w-full items-center gap-2">
      {/* Checkbox */}
      <div
        className="h-[18px] w-[18px] shrink-0 rounded-[7px]"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "2px solid rgba(255, 255, 255, 0.25)",
        }}
      />
      {/* Label */}
      <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-white">
        {label}
      </span>
      {/* XP */}
      <span className="shrink-0 text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-white/50">
        {xp}
      </span>
    </div>
  );
}

export function DarkTaskCard() {
  return (
    <div
      className="flex flex-col rounded-3xl p-0.5"
      style={{
        background: "rgba(85, 20, 0, 0.5)",
        border: "2px solid rgba(85, 20, 0, 0.25)",
        boxShadow: "0 16px 32px rgba(36, 35, 31, 0.05)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-1 px-3.5 py-[12.5px]">
        <span className="w-full text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-white">
          next tasks
        </span>
      </div>

      {/* Task list */}
      <div
        className="flex flex-col items-center gap-3 rounded-[22px] p-3.5"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)",
          border: "2px solid rgba(85, 20, 0, 0.25)",
        }}
      >
        <TaskRow label="submit clip today" xp="+50 XP" />
        <TaskRow label="hit 10K views" xp="+100 XP" />
        <TaskRow label="7 day streak" xp="+500 XP" />
      </div>
    </div>
  );
}
