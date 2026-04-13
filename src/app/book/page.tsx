"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import Script from "next/script";

export default function BookPage() {
  const { darkMode } = useTheme();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const win = window as any;
    const setup = () => {
      if (!win.Cal) return;
      win.Cal("init", "discovery-call", { origin: "https://cal.com" });
      win.Cal.ns["discovery-call"]("inline", {
        elementOrSelector: "#cal-embed",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
        calLink: "team/content-rewards/discovery-call",
      });
      win.Cal.ns["discovery-call"]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };

    if (win.Cal?.loaded) {
      setup();
    } else {
      // Cal script will fire setup after loading
      const check = setInterval(() => {
        if (win.Cal?.loaded) { clearInterval(check); setup(); }
      }, 200);
      setTimeout(() => clearInterval(check), 10000);
    }
  }, []);

  return (
    <div className="book-root min-h-dvh bg-[#fafafa] text-[#1a1a1a] dark:bg-[#0a0a0a] dark:text-white">
      <Script
        src="https://app.cal.com/embed/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          const win = window as any;
          if (win.Cal && !win.Cal.loaded) win.Cal.loaded = true;
        }}
      />
      <style>{`
        .book-root, .book-root *, #cal-embed, #cal-embed *,
        #cal-embed iframe { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        .book-root::-webkit-scrollbar, .book-root *::-webkit-scrollbar,
        #cal-embed::-webkit-scrollbar, #cal-embed *::-webkit-scrollbar,
        #cal-embed iframe::-webkit-scrollbar { display: none !important; }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.05)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2.5);opacity:0} }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 30%{transform:translate(3%,5%)} 50%{transform:translate(-8%,2%)} 70%{transform:translate(5%,-5%)} 90%{transform:translate(-3%,8%)} }
      `}</style>

      {/* ═══ SPLIT LAYOUT ═══ */}
      <div className="flex min-h-dvh flex-col lg:flex-row">

        {/* ─── LEFT: Visual storytelling ─── */}
        <div className="relative flex flex-col justify-between overflow-hidden px-8 py-10 lg:w-[480px] lg:shrink-0 lg:px-12 lg:py-14 xl:w-[540px]">
          {/* Ambient background */}
          <div className="pointer-events-none absolute inset-0">
            {/* Gradient orb */}
            <div
              className="absolute -left-[100px] -top-[100px] h-[400px] w-[400px] rounded-full opacity-30 blur-[100px] dark:opacity-20"
              style={{ background: "radial-gradient(circle, #FF8000 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-[80px] -right-[80px] h-[300px] w-[300px] rounded-full opacity-20 blur-[80px] dark:opacity-15"
              style={{ background: "radial-gradient(circle, #FFBB00 0%, transparent 70%)" }}
            />
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", animation: "grain 8s steps(10) infinite" }}
            />
          </div>

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-[7px]">
            <svg width="22" height="25" viewBox="0 0 30 34" fill="none" className="shrink-0">
              <g clipPath="url(#bk_clip)">
                <path d="M3.168 10.936l2.074-3.205.734 3.875 3.352 1.226-3.051 1.983-.002 3.962-2.621-2.65-3.353 1.223 1.433-3.621L.663 10.523l3.505.413z" fill="currentColor"/>
                <path d="M1.733 25.324L.301 22.61l3.353.917 2.62-1.988.001 2.971 3.052 1.487-3.352.92-.734 2.906-2.074-2.403-3.505.31 2.07-2.405z" fill="currentColor"/>
                <path d="M13.157 32.073l-2.449-.217 1.829-1.387-.511-2.026 2.133 1.035 2.134-1.035-.511 2.026 1.83 1.387-2.45.217-.999 1.892-1.006-1.892z" fill="currentColor"/>
                <path d="M25.652 27.42l-1.777 2.403-.63-2.907-2.873-.919 2.616-1.487.001-2.971 2.246 1.988 2.874-.918-1.228 2.715 1.775 2.405-3.005-.31z" fill="currentColor"/>
                <path d="M27.967 13.73l1.432 3.62-3.353-1.223-2.62 2.65-.002-3.962-3.051-1.983 3.352-1.226.734-3.875 2.073 3.205 3.506-.413-2.071 3.207z" fill="currentColor"/>
                <path d="M16.855 3.704l4.898.49-3.659 3.12 1.023 4.559-4.267-2.329-4.266 2.329 1.021-4.56-3.659-3.12 4.899-.489L14.85-.553l2.005 4.257z" fill="currentColor"/>
              </g>
              <defs><clipPath id="bk_clip"><rect width="29.7" height="33.41" fill="white"/></clipPath></defs>
            </svg>
            <div className="flex flex-col" style={{ gap: "0.5px" }}>
              <span className="font-inter text-[14px] font-semibold leading-[13px] tracking-[-0.02em]">Content</span>
              <span className="font-inter text-[14px] font-semibold leading-[13px] tracking-[-0.02em]">Rewards</span>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-1 flex-col justify-center gap-8 py-10 lg:py-0">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <div className="absolute h-full w-full rounded-full bg-emerald-500" style={{ animation: "pulse-ring 2s ease-out infinite" }} />
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="font-inter text-[12px] font-semibold uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400">Spots available this week</span>
            </div>

            <h1 className="font-inter text-[36px] font-bold leading-[40px] tracking-[-0.04em] sm:text-[44px] sm:leading-[48px]">
              Let&apos;s talk about
              <br />
              <span className="bg-gradient-to-r from-[#FF8000] to-[#FFBB00] bg-clip-text text-transparent">
                growing your brand.
              </span>
            </h1>

            <p className="max-w-[380px] font-inter text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-[#787878]">
              30 minutes. No pitch deck needed. Just tell us what you&apos;re building and we&apos;ll show you how creator-led content can scale it.
            </p>

            {/* What to expect */}
            <div className="flex flex-col gap-3">
              {[
                { icon: "🎯", text: "Custom creator strategy for your brand" },
                { icon: "📊", text: "ROI projections based on your niche" },
                { icon: "🚀", text: "Live walkthrough of the platform" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#FF8000]/10 text-[14px] dark:bg-[#FF8000]/20">{item.icon}</span>
                  <span className="font-inter text-[14px] font-medium tracking-[-0.02em] text-[#555] dark:text-[#aaa]">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Floating stat cards */}
            <div className="flex gap-3">
              {[
                { value: "77M+", label: "Views delivered" },
                { value: "430+", label: "Brands" },
                { value: "$0.20", label: "Avg CPM" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-0.5 rounded-2xl border border-[#e8e8e8] bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]"
                  style={{ animation: `float${Math.floor(Math.random() * 3) + 1} ${5 + Math.random() * 3}s ease-in-out infinite`, animationDelay: `${Math.random() * 2}s` }}
                >
                  <span className="font-inter text-[20px] font-bold tracking-[-0.04em]">{stat.value}</span>
                  <span className="font-inter text-[11px] font-medium tracking-[-0.02em] text-[#999]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="relative z-10 flex flex-col gap-3">
            <div className="h-px w-full bg-[#e8e8e8] dark:bg-white/10" />
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8000] to-[#FF5300] text-[13px] font-bold text-white">
                P
              </div>
              <div>
                <p className="font-inter text-[13px] font-medium italic leading-[18px] tracking-[-0.02em] text-[#666] dark:text-[#999]">
                  &ldquo;77M views in 30 days. Content Rewards made Polymarket feel like it was everywhere.&rdquo;
                </p>
                <p className="mt-1 font-inter text-[12px] font-semibold tracking-[-0.02em] text-[#999] dark:text-[#666]">
                  Polymarket Growth Team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Cal embed ─── */}
        <div className="relative flex flex-1 flex-col">
          {/* Top border accent */}
          <div className="hidden h-px bg-gradient-to-r from-transparent via-[#FF8000]/30 to-transparent lg:absolute lg:inset-y-0 lg:left-0 lg:block lg:h-auto lg:w-px lg:bg-gradient-to-b" />

          <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
            {/* Mobile heading */}
            <div className="mb-6 text-center lg:hidden">
              <h1 className="font-inter text-[28px] font-bold leading-[32px] tracking-[-0.04em]">
                Book a <span className="text-[#FF8000]">Discovery Call</span>
              </h1>
              <p className="mt-2 font-inter text-[14px] font-medium text-[#787878]">30 min &middot; No commitment</p>
            </div>

            <div
              className="w-full max-w-[700px] overflow-hidden rounded-[20px] border border-[#e4e4e4] bg-white dark:border-white/10 dark:bg-[#141414]"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div
                id="cal-embed"
                style={{ width: "100%", height: "100%", minHeight: 680, overflow: "scroll" }}
              />
            </div>

            {/* Bottom note */}
            <p className="mt-4 text-center font-inter text-[12px] font-medium tracking-[-0.02em] text-[#bbb] dark:text-[#555]">
              Powered by Cal.com &middot; Your data is private and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
