export interface Chip {
  label: string;
  selected?: boolean;
  color?: string;
  icon?: boolean;
}

export function NicheChip({ label, selected, color }: Chip) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-3xl px-[20px] py-[19px]"
      style={{
        height: 56,
        background: selected ? (color || "#FF005B") : "transparent",
        border: selected ? `0.5px solid ${color || "#FF005B"}` : "0.5px solid #D6D4D2",
      }}
    >
      {selected && (
        <div className="h-[18px] w-[18px] rounded-[3px]" style={{ background: "white", opacity: 0.8 }} />
      )}
      <span
        className="text-[15px] font-semibold leading-[120%] tracking-[0.02em]"
        style={{ color: selected ? "white" : "#24231F" }}
      >
        {label}
      </span>
    </div>
  );
}

export function NicheChipGrid({ chips }: { chips: Chip[] }) {
  return (
    <div className="flex flex-wrap gap-0">
      {chips.map((chip, i) => (
        <NicheChip key={i} {...chip} />
      ))}
    </div>
  );
}
