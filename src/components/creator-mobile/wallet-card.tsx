function QuestItem({ label, xp }: { label: string; xp: string }) {
  return (
    <div className="flex w-full items-center gap-2">
      {/* Checkbox */}
      <div
        className="h-[18px] w-[18px] shrink-0 rounded-[7px]"
        style={{
          background: "white",
          border: "2px solid #CDC8C2",
        }}
      />
      {/* Label */}
      <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]"
        style={{ color: "#24231F" }}
      >
        {label}
      </span>
      {/* XP */}
      <span className="text-[13px] font-extrabold uppercase leading-[120%] tracking-[0.1em]"
        style={{ color: "#9D9890" }}
      >
        {xp}
      </span>
    </div>
  );
}

export function WalletCard() {
  return (
    <div
      className="flex flex-col items-center rounded-3xl p-0.5"
      style={{
        background: "white",
        border: "2px solid white",
        boxShadow: "0 16px 32px rgba(36, 35, 31, 0.05)",
      }}
    >
      <div className="flex w-full flex-col" style={{ background: "#F7F7F6" }}>
        {/* Balance */}
        <div className="flex flex-col items-center gap-1 px-3.5 py-3">
          <span className="w-full text-[21px] font-semibold leading-[120%] tracking-[0.02em]"
            style={{ color: "#24231F" }}
          >
            $0.00
          </span>
        </div>

        {/* Quest list */}
        <div className="flex flex-col items-center gap-3 rounded-[22px] p-3.5"
          style={{ background: "white" }}
        >
          <QuestItem label="join your first campaign" xp="90 XP" />
          <QuestItem label="submit your first clip" xp="90 XP" />
          <QuestItem label="get approved" xp="50 XP" />
          <QuestItem label="earn $10" xp="50 XP" />
        </div>
      </div>
    </div>
  );
}
