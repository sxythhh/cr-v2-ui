function Flag({ type }: { type: string }) {
  switch (type) {
    case "en":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F0F0F0" />
          <rect x="0" y="0" width="12" height="12" fill="#0054BB" />
          <rect x="0" y="15" width="24" height="3" rx="0.5" fill="#EC0017" />
          <rect x="0" y="9" width="24" height="3" rx="0.5" fill="#EC0017" />
          <rect x="10" y="0" width="3" height="24" rx="0.5" fill="#EC0017" />
        </svg>
      );
    case "ru":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F0F0F0" />
          <rect x="0" y="8" width="24" height="8" fill="#0054BB" />
          <rect x="1" y="16" width="22" height="8" rx="2" fill="#EC0017" />
        </svg>
      );
    case "fr":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F0F0F0" />
          <rect x="16" y="1" width="8" height="22" rx="2" fill="#EC0017" />
          <rect x="0" y="1" width="8" height="22" rx="2" fill="#0054BB" />
        </svg>
      );
    case "de":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F0F0F0" />
          <rect x="1" y="0" width="22" height="9" rx="2" fill="#000000" />
          <rect x="0" y="8" width="24" height="8" fill="#EC0017" />
          <rect x="1" y="15" width="22" height="9" rx="2" fill="#FFD800" />
        </svg>
      );
    case "hi":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F0F0F0" />
          <rect x="1" y="0" width="22" height="7" rx="2" fill="#FF9100" />
          <rect x="1" y="17" width="22" height="7" rx="2" fill="#5AA731" />
          <circle cx="12" cy="12" r="4" fill="#0054BB" />
          <circle cx="12" cy="12" r="2.5" fill="#F0F0F0" />
          <circle cx="12" cy="12" r="1.5" stroke="#0054BB" strokeWidth="0.5" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

function GreenCheck() {
  return (
    <div
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{ background: "#00BF76" }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M4 7.5L6.5 10L11 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

interface LanguageRowProps {
  flag: string;
  label: string;
  selected?: boolean;
}

export function LanguageRow({ flag, label, selected }: LanguageRowProps) {
  return (
    <div
      className="flex items-center gap-4 rounded-[32px] px-4 py-4"
      style={{
        border: "0.5px solid #D6D4D1",
        background: selected ? "#F7F7F6" : "transparent",
        paddingRight: selected ? 19 : 16,
      }}
    >
      <Flag type={flag} />
      <span className="flex-1 text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>
        {label}
      </span>
      {selected && <GreenCheck />}
    </div>
  );
}
