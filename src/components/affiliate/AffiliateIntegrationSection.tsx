"use client";

import { Fragment } from "react";
import Link from "next/link";
import { THEME, type Theme } from "./affiliate-theme";
import { CarouselRow, GAP } from "./AffiliateCarouselRow";

const SettingsIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
);
const ActivityIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M3 12h4l3-9l4 18l3-9h4"/></svg>
);
const CashIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}><path d="M16 6H3v8h13"/><path d="M21 10v8H8"/><path d="M12 10a2 2 0 1 0 0-4a2 2 0 0 0 0 4z"/></svg>
);

const FEATS = [
  { icon: SettingsIcon, label: "Easy setup" },
  { icon: ActivityIcon, label: "Live tracking" },
  { icon: CashIcon, label: "Auto payouts" },
];

const ROWS = 3;

export function AffiliateIntegrationSection({ theme }: { theme: Theme }) {
  const c = THEME[theme];
  const dk = theme === "dark";
  const bdr = dk ? c.border : "#E0E0E0";

  return (
    <section className="pt-16 sm:pt-24 pb-16 px-5 overflow-clip">
      <style>{`
        @keyframes carousel-left {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - ${GAP}px)); }
        }
        @keyframes carousel-right {
          from { transform: translateX(calc(-100% - ${GAP}px)); }
          to { transform: translateX(0); }
        }
      `}</style>
      <div className="max-w-[818px] mx-auto flex flex-col items-center gap-5">
        <div className="relative w-full">
          <div className="flex flex-col items-center justify-center" style={{ padding: "0 0 20px" }}>
            <h1 className="text-[28px] sm:text-[40px] font-semibold leading-[1.08] tracking-[-0.3px] text-center" style={{ color: c.textPrimary }}>Refer Brands or Creators.</h1>
            <h1 className="text-[28px] sm:text-[40px] font-semibold leading-[1.08] tracking-[-0.3px] text-center" style={{ color: c.textPrimary }}>Earn Commission.</h1>
          </div>

          <div className="relative overflow-hidden flex items-start justify-center mx-auto" style={{ height: 180, maxWidth: 680 }}>
            <div className="w-full h-full" style={{
              perspective: "900px",
              maskImage: "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%), radial-gradient(ellipse 80% 150% at 50% -10%, #000 40%, transparent 80%)",
              WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 15%, #000 85%, transparent 100%), radial-gradient(ellipse 80% 150% at 50% -10%, #000 40%, transparent 80%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "destination-in",
            }}>
              <div style={{ transform: "rotateX(50deg)", transformOrigin: "center top" }}>
                <div className="flex flex-col" style={{ gap: GAP }}>
                  {Array.from({ length: ROWS }, (_, ri) => (
                    <CarouselRow key={ri} ri={ri} dk={dk} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-7 w-full max-w-[750px] -mt-4">
          <Link
            href="/affiliate/dashboard"
            className="inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-90"
            style={{
              padding: "12px 80px",
              height: 48,
              background: "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.35) 0%, rgba(255,63,213,0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.31) 0%, rgba(255,144,37,0) 100%), #110D0C",
              boxShadow: "27px 40px 19px rgba(0,0,0,0.03), 15px 23px 16px rgba(0,0,0,0.09), 7px 10px 12px rgba(0,0,0,0.15), 2px 3px 7px rgba(0,0,0,0.18), inset 0px 1.5px 0px rgba(255,255,255,0.36)",
            }}
          >
            <span className="text-[15px] font-semibold leading-6 text-white text-center" style={{ textShadow: "0px -0.5px 0px #000000" }}>
              Become an Affiliate
            </span>
          </Link>

          <div className="flex items-center justify-center gap-6">
            {FEATS.map((f, i) => (
              <Fragment key={f.label}>
                {i > 0 && <div className="w-px h-[25.5px]" style={{ backgroundColor: bdr }} />}
                <span className="flex items-center gap-1.5 text-[15.8px] tracking-[-0.17px] leading-[26px]" style={{ color: c.textPrimary }}>
                  <f.icon className="w-4 h-4" style={{ color: c.textSecondary }} />
                  {f.label}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
