interface AvatarProfileProps {
  username: string;
  videoCount: number;
  level: "rookie" | "rising";
}

const levelConfig = {
  rookie: {
    bg: "#9D9890",
    textColor: "#FFFFFF",
    accentColor: "rgba(36, 35, 31, 0.15)",
    iconColor: "#24231F",
    blurBg: "#898378",
    blurOpacity: 0.5,
    badgeBorder: "#FFFFFF",
    dotBorder: "#898378",
  },
  rising: {
    bg: "#FF5600",
    textColor: "#551400",
    accentColor: "rgba(85, 20, 0, 0.1)",
    iconColor: "#551400",
    blurBg: "#FF5600",
    blurOpacity: 0.25,
    badgeBorder: "#FFFFFF",
    dotBorder: "#FF5600",
  },
};

export function AvatarProfile({ username, videoCount, level }: AvatarProfileProps) {
  const config = levelConfig[level];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Avatar + Level */}
      <div className="relative flex flex-col items-center">
        {/* Blur glow behind avatar */}
        <div
          className="absolute -top-[34px] left-1/2 -translate-x-1/2"
          style={{
            width: 192,
            height: 204,
            mixBlendMode: "plus-darker",
            opacity: config.blurOpacity,
            filter: "blur(36px)",
          }}
        >
          <div
            className="h-48 w-48 rounded-[68px]"
            style={{ background: config.blurBg, border: "8px solid white" }}
          />
        </div>

        {/* Avatar circle */}
        <div
          className="relative z-10 flex h-32 w-32 items-center justify-center rounded-[45px]"
          style={{
            background: "white",
            border: "5.33px solid white",
          }}
        >
          {/* Person silhouette */}
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d="M26 24C29.3 24 32 21.3 32 18C32 14.7 29.3 12 26 12C22.7 12 20 14.7 20 18C20 21.3 22.7 24 26 24ZM26 27C21.3 27 12 29.3 12 34V37C12 37.6 12.4 38 13 38H39C39.6 38 40 37.6 40 37V34C40 29.3 30.7 27 26 27Z"
              fill={config.accentColor}
            />
            <path
              d="M26 26C29.9 26 33 22.9 33 19C33 15.1 29.9 12 26 12C22.1 12 19 15.1 19 19C19 22.9 22.1 26 26 26Z"
              fill={config.iconColor}
            />
            <path
              d="M26 29C20.7 29 10 31.7 10 37V40C10 40.6 10.4 41 11 41H41C41.6 41 42 40.6 42 40V37C42 31.7 31.3 29 26 29Z"
              fill={config.iconColor}
            />
          </svg>

          {/* Level progress dot */}
          {level === "rising" && (
            <div
              className="absolute -left-[2px] top-[17px] h-[18px] w-[18px] rounded-full"
              style={{
                background: "white",
                border: `5px solid ${config.dotBorder}`,
              }}
            />
          )}
        </div>

        {/* Level badge */}
        <div
          className="relative z-10 -mt-3 flex items-center rounded-[13px] px-[10.5px] py-[8.5px]"
          style={{
            background: config.bg,
            border: "5px solid white",
            backdropFilter: "blur(24px)",
          }}
        >
          <span
            className="text-[13px] font-extrabold uppercase leading-[120%] tracking-[0.1em]"
            style={{ color: config.textColor }}
          >
            {level}
          </span>
        </div>
      </div>

      {/* Username + video count */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em] text-white">
          {username}
        </span>
        <span className="text-[15px] font-semibold leading-[120%] tracking-[0.025em] text-white/50">
          {videoCount} video{videoCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
