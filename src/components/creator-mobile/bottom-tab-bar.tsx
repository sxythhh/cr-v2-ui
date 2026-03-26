interface BottomTabBarProps {
  centerBadge?: number;
  activeTab?: "home" | "discover" | "clips" | "saved" | "watch";
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.48 0.9C7.95-0.3 10.05-0.3 11.52 0.9L16.52 4.96C17.46 5.72 18 6.86 18 8.06V15.63C18 17.84 16.21 19.63 14 19.63H4C1.79 19.63 0 17.84 0 15.63V8.06C0 6.86 0.54 5.72 1.48 4.96L6.48 0.9Z" fill={active ? "#24231F" : "#9C9891"} />
    </svg>
  );
}

function DiscoverIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.54 2C5.23 0.8 6.52 0 8 0H12C13.48 0 14.77 0.8 15.46 2H16C18.21 2 20 3.79 20 6V12C20 14.21 18.21 16 16 16H15.46C14.77 17.2 13.48 18 12 18H8C6.52 18 5.23 17.2 4.54 16H4C1.79 16 0 14.21 0 12V6C0 3.79 1.79 2 4 2H4.54ZM4 4C2.9 4 2 4.9 2 6V12C2 13.1 2.9 14 4 14V4ZM16 14C17.1 14 18 13.1 18 12V6C18 4.9 17.1 4 16 4V14Z" fill={active ? "#24231F" : "#9C9891"} />
    </svg>
  );
}

function ClipsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3.42 12.02C3.19 9.83 4.78 7.86 6.98 7.63L8.97 7.42C11.16 7.19 13.13 8.78 13.36 10.98L13.99 16.98C14.22 19.17 12.63 21.14 10.43 21.37L8.44 21.58C6.25 21.81 4.28 20.22 4.05 18.02L3.42 12.02Z" fill="white" />
      <path d="M10.76 5.86C11.05 3.73 12.99 2.19 15.14 2.42L17.13 2.63C19.33 2.86 20.92 4.83 20.69 7.02L20.06 13.02C19.83 15.22 17.86 16.81 15.67 16.58L15.66 16.58L15.05 10.8C14.8 8.35 13.02 6.43 10.76 5.86Z" fill="white" />
    </svg>
  );
}

function SavedIcon({ active }: { active?: boolean }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M4 0C1.79 0 0 1.79 0 4V18C0 19.61 1.82 20.56 3.15 19.63L6.85 17.03C7.54 16.55 8.46 16.55 9.15 17.03L12.85 19.63C14.18 20.56 16 19.61 16 18V4C16 1.79 14.21 0 12 0H4Z" fill={active ? "#24231F" : "#9C9891"} />
    </svg>
  );
}

function WatchIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2 1C2 0.45 2.45 0 3 0H17C17.55 0 18 0.45 18 1C18 1.55 17.55 2 17 2H3C2.45 2 2 1.55 2 1ZM0 7C0 4.79 1.79 3 4 3H16C18.21 3 20 4.79 20 7V14C20 16.21 18.21 18 16 18H4C1.79 18 0 16.21 0 14V7ZM8.57 7.6C8.91 7.43 9.32 7.48 9.62 7.72L12.12 9.72C12.36 9.91 12.5 10.2 12.5 10.5C12.5 10.8 12.36 11.09 12.12 11.28L9.62 13.28C9.32 13.52 8.91 13.57 8.57 13.4C8.22 13.23 8 12.88 8 12.5V8.5C8 8.12 8.22 7.77 8.57 7.6Z" fill={active ? "#24231F" : "#9C9891"} />
    </svg>
  );
}

export function BottomTabBar({ centerBadge, activeTab = "home" }: BottomTabBarProps) {
  return (
    <div
      className="relative flex w-full items-center justify-center pb-[34px] pt-[34px]"
      style={{
        background: "linear-gradient(180deg, rgba(245, 245, 244, 0) 0%, #F5F5F4 100%)",
      }}
    >
      {/* Pill container */}
      <div className="relative">
        {/* White bg with shadow */}
        <div
          className="absolute -top-1 left-0 h-20 w-[276px] rounded-2xl"
          style={{
            background: "white",
            boxShadow: "0 16px 32px rgba(36, 35, 31, 0.075)",
            backdropFilter: "blur(24px)",
          }}
        />
        {/* Purple track */}
        <div
          className="absolute left-0 top-2 h-14 w-[276px] rounded-full"
          style={{ background: "#6C2AFF" }}
        />

        {/* Gray circle behind center button */}
        <div
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            left: 98,
            top: -4,
            background: "#D9D9D9",
          }}
        />

        {/* Tab buttons row */}
        <div
          className="relative flex items-start rounded-full p-0.5"
          style={{ backdropFilter: "blur(24px)", width: 276 }}
        >
          {/* Home */}
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
            style={{ background: activeTab === "home" ? "#F5F5F4" : "transparent" }}
          >
            <HomeIcon active={activeTab === "home"} />
          </div>

          {/* Discover */}
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
            style={{ background: activeTab === "discover" ? "#F5F5F4" : "transparent" }}
          >
            <DiscoverIcon active={activeTab === "discover"} />
          </div>

          {/* Center button */}
          <div className="relative flex h-[52px] w-16 items-center justify-center">
            <div
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                background: centerBadge ? undefined : "#FF5600",
                border: "4px solid white",
                overflow: "hidden",
              }}
            >
              {centerBadge ? (
                <>
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(255, 86, 0, 0.25)" }}
                  />
                  <span
                    className="relative z-10 text-[21px] font-bold leading-[120%] tracking-[-0.009em] text-white"
                    style={{ textShadow: "0 4px 8px rgba(36, 35, 31, 0.5)" }}
                  >
                    {centerBadge}
                  </span>
                </>
              ) : (
                <ClipsIcon />
              )}
            </div>
            {/* Orange ring */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ border: "2px solid #FF5600" }}
            />
          </div>

          {/* Saved */}
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
            style={{ background: activeTab === "saved" ? "#F5F5F4" : "transparent" }}
          >
            <SavedIcon active={activeTab === "saved"} />
          </div>

          {/* Watch */}
          <div
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
            style={{ background: activeTab === "watch" ? "#F5F5F4" : "transparent" }}
          >
            <WatchIcon active={activeTab === "watch"} />
          </div>
        </div>
      </div>
    </div>
  );
}
