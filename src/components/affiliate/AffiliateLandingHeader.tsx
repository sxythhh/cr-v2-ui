"use client";

import Link from "next/link";
import { THEME, type Theme } from "./affiliate-theme";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Creators", href: "/creators" },
  { label: "Agencies", href: "/agencies" },
  { label: "Campaigns", href: "/campaigns" },
  { label: "Blog", href: "/blog" },
];

export function AffiliateLandingHeader({ theme }: { theme: Theme }) {
  const c = THEME[theme];
  const dk = theme === "dark";
  const textColor = dk ? "#ffffff" : "#261300";
  const mutedColor = dk ? "rgba(255,255,255,0.7)" : "rgba(37,37,37,0.7)";

  return (
    <header className="sticky top-0 z-50 shrink-0" style={{ backgroundColor: c.pageBg }}>
      <div className="flex justify-center items-center h-[70px] px-5 sm:px-8 lg:px-[120px]">
        <div className="flex items-center justify-between w-full max-w-[1200px] py-3" style={{ gap: 48 }}>
          <Link href="/" className="flex items-center gap-[7px] shrink-0">
            <svg width="30" height="33" viewBox="0 0 30 34" fill="none">
              <g clipPath="url(#cr-hd-logo)">
                <path d="M3.16819 10.9361L5.24136 7.73181L5.97543 11.6066L9.32731 12.8329L6.27621 14.8156L6.27453 18.7773L3.65335 16.1279L0.300625 17.3504L1.73314 13.7297L-0.337463 10.5235L3.16819 10.9361Z" fill={textColor} />
                <path d="M1.73314 25.3237L0.300776 22.6089L3.65372 23.5262L6.27435 21.5387L6.27531 24.5097L9.32731 25.9964L5.97531 26.9162L5.24101 29.8228L3.16843 27.4195L-0.337463 27.7286L1.73314 25.3237Z" fill={textColor} />
                <path d="M13.1567 32.0726L10.708 31.8553L12.5369 30.4681L12.0258 28.442L14.1593 29.477L16.2927 28.442L15.7816 30.4681L17.6114 31.8553L15.1619 32.0726L14.1593 33.9647L13.1567 32.0726Z" fill={textColor} />
                <path d="M27.9668 25.3237L29.3992 27.7286L26.5316 27.4195L24.459 29.8228L23.7247 26.9162L20.3727 25.9964L23.4257 24.5097L23.4257 21.5387L26.0463 23.5262L29.3995 22.6089L27.9668 25.3237Z" fill={textColor} />
                <path d="M27.9668 13.7297L29.3995 17.3504L26.0467 16.1279L23.4264 18.7773L23.4247 14.8156L20.3727 12.8329L23.7246 11.6066L24.4587 7.73181L26.5319 10.9361L30.0375 10.5235L27.9668 13.7297Z" fill={textColor} />
                <path d="M16.8552 3.70467L21.7534 4.19424L18.0947 7.31447L19.1169 11.8739L14.85 9.54489L10.584 11.8739L11.6053 7.31447L7.94659 4.19424L12.8448 3.70467L14.85 -0.552246L16.8552 3.70467Z" fill={textColor} />
              </g>
              <defs><clipPath id="cr-hd-logo"><rect width="29.7" height="33.4125" fill="white" /></clipPath></defs>
            </svg>
            <div className="flex flex-col leading-[16px]" style={{ gap: "0.93px" }}>
              <span className="text-[17.6px] font-semibold tracking-[-0.02em]" style={{ color: textColor, lineHeight: "16px" }}>Content</span>
              <span className="text-[17.6px] font-semibold tracking-[-0.02em]" style={{ color: textColor, lineHeight: "16px" }}>Rewards</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-1 rounded-lg text-[14px] font-medium tracking-[-0.01em] leading-[22px] text-center transition-colors"
                style={{ color: mutedColor }}
                onMouseEnter={(e) => { e.currentTarget.style.color = textColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = mutedColor; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3.5 shrink-0">
            <Link
              href="/onboarding"
              className="text-[14px] font-semibold text-center transition-opacity hover:opacity-70"
              style={{ color: textColor }}
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-[14px] font-semibold text-center transition-opacity hover:opacity-90"
              style={{
                color: dk ? "#ffffff" : "#252525",
                background: dk
                  ? "linear-gradient(180deg, rgba(255,255,255,0.15) -10.42%, rgba(255,255,255,0.01) 68.75%), #333"
                  : "linear-gradient(180deg, #FFFFFF -10.42%, rgba(255,255,255,0.01) 68.75%), #EAE8E6",
                boxShadow: dk
                  ? "0px 4px 4px rgba(0,0,0,.15), 0px 1px 2px rgba(0,0,0,.2), inset 0px 2px 0px rgba(255,255,255,.1), inset 0px -2px 0px rgba(255,255,255,.05)"
                  : "0px 16px 6px rgba(0,0,0,.01), 0px 9px 5px rgba(0,0,0,.04), 0px 4px 4px rgba(0,0,0,.07), 0px 1px 2px rgba(0,0,0,.08), inset 0px 2px 0px #FFFFFF, inset 0px -2px 0px rgba(255,255,255,.7)",
              }}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
