export function TikTokIcon({ size = 30 }: { size?: number }) {
  const r = size * 0.3;
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, background: "#252321", borderRadius: r }}
    >
      <svg width={size * 0.56} height={size * 0.65} viewBox="0 0 13 15" fill="none">
        <path d="M13.08 6.16C11.75 6.16 10.51 5.74 9.5 5.02V10.25C9.5 12.88 7.37 15 4.75 15C3.77 15 2.86 14.7 2.1 14.2C0.84 13.35 0 11.9 0 10.25C0 7.63 2.13 5.51 4.75 5.51C4.97 5.51 5.19 5.52 5.4 5.55V8.18C5.19 8.11 4.97 8.08 4.74 8.08C3.54 8.08 2.57 9.05 2.57 10.25C2.57 11.09 3.06 11.83 3.76 12.19C4.06 12.33 4.39 12.42 4.74 12.42C5.94 12.42 6.91 11.45 6.91 10.25V0H9.5V0.33C9.51 0.43 9.52 0.53 9.54 0.62C9.72 1.65 10.33 2.52 11.18 3.05C11.75 3.41 12.41 3.59 13.08 3.59V6.16Z" fill="white" />
      </svg>
    </div>
  );
}

export function YouTubeIcon({ size = 30 }: { size?: number }) {
  const r = size * 0.3;
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size, background: "#FF0000", borderRadius: r }}
    >
      <svg width={size * 0.47} height={size * 0.34} viewBox="0 0 14 10" fill="none">
        <path d="M13.7 1.54C13.62 1.24 13.46 0.97 13.24 0.75C13.02 0.53 12.75 0.38 12.45 0.3C11.37 0 7 0 7 0C7 0 2.63 0.01 1.54 0.31C1.24 0.39 0.97 0.54 0.75 0.76C0.53 0.98 0.38 1.25 0.3 1.54C-0.03 3.47-0.16 6.42 0.31 8.27C0.39 8.57 0.54 8.84 0.76 9.05C0.98 9.27 1.25 9.43 1.54 9.51C2.63 9.81 7 9.81 7 9.81C7 9.81 11.38 9.81 12.46 9.51C12.76 9.43 13.03 9.27 13.25 9.05C13.47 8.84 13.62 8.57 13.7 8.27C14.05 6.34 14.15 3.4 13.7 1.54Z" fill="white" />
        <path d="M5.6 7L9.23 4.9L5.6 2.8V7Z" fill="#FF0000" />
      </svg>
    </div>
  );
}

export function InstagramIcon({ size = 30 }: { size?: number }) {
  const r = size * 0.3;
  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)",
        borderRadius: r,
      }}
    >
      <svg width={size * 0.53} height={size * 0.53} viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3" stroke="white" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2.5" stroke="white" strokeWidth="1.2" />
        <circle cx="11.5" cy="4.5" r="0.8" fill="white" />
      </svg>
    </div>
  );
}

export function SocialIconStack({ size = 30, platforms }: { size?: number; platforms: ("instagram" | "tiktok" | "youtube")[] }) {
  return (
    <div className="flex items-start">
      {platforms.map((p, i) => (
        <div
          key={i}
          style={{
            marginLeft: i > 0 ? -(size * 0.14) : 0,
            zIndex: platforms.length - i,
            border: `${size * 0.07}px solid white`,
            borderRadius: size * 0.3,
            overflow: "hidden",
          }}
        >
          {p === "instagram" && <InstagramIcon size={size - size * 0.14} />}
          {p === "tiktok" && <TikTokIcon size={size - size * 0.14} />}
          {p === "youtube" && <YouTubeIcon size={size - size * 0.14} />}
        </div>
      ))}
    </div>
  );
}
