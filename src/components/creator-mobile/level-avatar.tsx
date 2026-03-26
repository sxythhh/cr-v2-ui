interface LevelAvatarProps {
  percentage: number;
}

export function LevelAvatar({ percentage }: LevelAvatarProps) {
  return (
    <div className="relative flex flex-row items-start gap-8">
      {/* Large blur behind */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 192,
          height: 204,
          mixBlendMode: "plus-darker" as const,
          opacity: 0.25,
          filter: "blur(36px)",
        }}
      >
        <div
          className="h-48 w-48 rounded-[67px]"
          style={{ background: "white", border: "8px solid white" }}
        />
      </div>

      {/* Main avatar */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar circle */}
        <div
          className="relative flex h-32 w-32 items-center justify-center rounded-[45px]"
          style={{ background: "white", border: "5.33px solid white" }}
        >
          {/* Person silhouette */}
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <path
              d="M26 24C29.3 24 32 21.3 32 18C32 14.7 29.3 12 26 12C22.7 12 20 14.7 20 18C20 21.3 22.7 24 26 24ZM26 27C21.3 27 12 29.3 12 34V37C12 37.6 12.4 38 13 38H39C39.6 38 40 37.6 40 37V34C40 29.3 30.7 27 26 27Z"
              fill="rgba(85, 20, 0, 0.1)"
            />
            <path
              d="M26 26C29.9 26 33 22.9 33 19C33 15.1 29.9 12 26 12C22.1 12 19 15.1 19 19C19 22.9 22.1 26 26 26Z"
              fill="#551400"
            />
            <path
              d="M26 29C20.7 29 10 31.7 10 37V40C10 40.6 10.4 41 11 41H41C41.6 41 42 40.6 42 40V37C42 31.7 31.3 29 26 29Z"
              fill="#551400"
            />
          </svg>

          {/* Progress dot */}
          <div
            className="absolute rounded-full"
            style={{
              width: 18,
              height: 18,
              left: -2,
              top: 17,
              background: "white",
              border: "5px solid #FF5600",
            }}
          />
        </div>

        {/* Percentage badge */}
        <div
          className="relative z-10 -mt-3 flex items-center rounded-[13px] px-[10.5px] py-[8.5px]"
          style={{
            background: "#FF5600",
            border: "5px solid white",
            backdropFilter: "blur(24px)",
          }}
        >
          <span className="text-[13px] font-extrabold uppercase leading-[120%] tracking-[0.1em]" style={{ color: "#551400" }}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
