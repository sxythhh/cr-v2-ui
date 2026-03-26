export function StatusBar({ dark }: { dark?: boolean }) {
  const color = dark ? "#24231F" : "white";
  return (
    <div className="flex w-full items-center justify-center px-4 pb-[19px] pt-[21px]">
      <div className="flex flex-1 items-center justify-center">
        <span
          className="text-[17px] font-semibold leading-[22px]"
          style={{ color }}
        >
          9:41
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center gap-[7px]">
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.5" fill={color} />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill={color} />
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill={color} />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill={color} />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path
            d="M8.5 3.6C10.6 3.6 12.5 4.4 13.9 5.7L15.3 4.3C13.5 2.6 11.1 1.6 8.5 1.6C5.9 1.6 3.5 2.6 1.7 4.3L3.1 5.7C4.5 4.4 6.4 3.6 8.5 3.6ZM8.5 7.2C9.7 7.2 10.8 7.7 11.6 8.5L13 7.1C11.8 5.9 10.2 5.2 8.5 5.2C6.8 5.2 5.2 5.9 4 7.1L5.4 8.5C6.2 7.7 7.3 7.2 8.5 7.2ZM8.5 10.8C9.2 10.8 9.7 10.3 9.7 9.6C9.7 8.9 9.2 8.4 8.5 8.4C7.8 8.4 7.3 8.9 7.3 9.6C7.3 10.3 7.8 10.8 8.5 10.8Z"
            fill={color}
          />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="12"
            rx="3.8"
            stroke={color}
            strokeOpacity="0.35"
          />
          <rect x="2" y="2" width="19" height="9" rx="2.5" fill={color} />
          <path
            d="M24 4.5C24.8 4.9 24.8 8.1 24 8.5"
            stroke={color}
            strokeOpacity="0.4"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
