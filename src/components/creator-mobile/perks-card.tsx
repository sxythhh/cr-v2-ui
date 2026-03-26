function CheckCircle() {
  return (
    <div
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{ background: "#FF5600" }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M4 7.5L6.5 10L11 5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PerkRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle />
      <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#551400" }}>
        {label}
      </span>
    </div>
  );
}

export function PerksCard() {
  return (
    <div className="relative" style={{ height: 220 }}>
      {/* Dark left card */}
      <div
        className="absolute left-0 top-0 flex flex-col justify-between rounded-3xl p-[12.5px_14px]"
        style={{
          width: 384,
          height: 168,
          background: "rgba(85, 20, 0, 0.5)",
          border: "2px solid rgba(85, 20, 0, 0.25)",
          boxShadow: "0 16px 32px rgba(36, 35, 31, 0.05)",
        }}
      >
        <div className="flex w-[164px] flex-col gap-1.5">
          <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em] text-white">
            your perks
          </span>
          <span className="text-[15px] font-medium leading-[120%] tracking-[0.03em] text-white/50">
            complete tasks to earn bigger perks with us
          </span>
        </div>
      </div>

      {/* White right card */}
      <div
        className="absolute right-0 top-0 flex flex-col justify-between rounded-3xl p-3.5"
        style={{
          width: 192,
          height: 220,
          background: "white",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* User avatar + name */}
        <div className="flex items-center gap-2.5">
          <div
            className="h-[26px] w-[26px] rounded-[10px]"
            style={{
              background: "linear-gradient(135deg, #FF8A50 0%, #FF5600 100%)",
            }}
          />
          <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "rgba(85, 20, 0, 0.6)" }}>
            alithebaker
          </span>
        </div>

        {/* Perks list */}
        <div className="flex flex-col gap-3">
          <PerkRow label="5% platform fee" />
          <PerkRow label="weekly payouts" />
          <PerkRow label="priority support" />
        </div>
      </div>
    </div>
  );
}
