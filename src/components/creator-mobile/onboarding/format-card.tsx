interface FormatCardProps {
  title: string;
  subtitle: string;
  iconColor: string;
  selected?: boolean;
  selectedBg?: string;
  selectedBorder?: string;
  selectedTitleColor?: string;
  selectedSubtitleColor?: string;
}

export function FormatCard({
  title,
  subtitle,
  iconColor,
  selected,
  selectedBg,
  selectedBorder,
  selectedTitleColor,
  selectedSubtitleColor,
}: FormatCardProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-[32px] p-4"
      style={{
        border: selected
          ? `0.5px solid ${selectedBorder}`
          : "0.5px solid #D6D4D1",
        background: selected ? selectedBg : "transparent",
      }}
    >
      {/* Icon */}
      <div
        className="flex h-[53px] w-[53px] shrink-0 items-center justify-center rounded-2xl"
        style={{
          background: selected
            ? "radial-gradient(50% 50% at 50% 50%, white 0%, rgba(255,255,255,0.5) 100%)"
            : "#F7F7F6",
          border: selected ? "1px solid white" : "none",
        }}
      >
        <div
          className="rounded-[4px]"
          style={{
            width: 24,
            height: 24,
            background: iconColor,
            borderRadius: 4,
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-[5px]">
        <span
          className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]"
          style={{ color: selected ? selectedTitleColor : "#24231F" }}
        >
          {title}
        </span>
        <span
          className="text-[15px] font-medium leading-[120%] tracking-[0.03em]"
          style={{ color: selected ? selectedSubtitleColor : "#6E6A5E" }}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
