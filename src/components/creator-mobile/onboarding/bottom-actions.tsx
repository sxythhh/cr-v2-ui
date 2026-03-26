export function BottomActions({
  label,
  disabled,
  showBack = true,
  fullWidth = false,
}: {
  label: string;
  disabled?: boolean;
  showBack?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className="flex items-start gap-[17px] px-[34px] pb-[34px]">
      {showBack && (
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl"
          style={{ border: "0.5px solid #D6D4D1" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div
        className="flex h-14 flex-1 items-center justify-center rounded-3xl"
        style={{
          background: disabled ? "#D6D4D2" : "#24231F",
        }}
      >
        <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">
          {label}
        </span>
      </div>
    </div>
  );
}
