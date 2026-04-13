"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

const glassButtonShadow =
  "inset 0px 6px 10px 0px rgba(255,255,255,0.50), 0px 1px 1px rgba(0,0,0,0.04), 0px 2px 2px rgba(0,0,0,0.03), 0px 3px 4px rgba(0,0,0,0.02), 0px 4px 6px rgba(0,0,0,0.02), 0px 6px 8px rgba(0,0,0,0.01), 0px 8px 12px rgba(0,0,0,0.01), 0px 12px 16px rgba(0,0,0,0.01)";

const secondaryButtonShadow =
  "inset 0px 14px 10px 0px #ffffff, 0px 1px 1px rgba(0,0,0,0.04), 0px 2px 2px rgba(0,0,0,0.03), 0px 3px 4px rgba(0,0,0,0.02), 0px 4px 6px rgba(0,0,0,0.02), 0px 6px 8px rgba(0,0,0,0.01), 0px 8px 12px rgba(0,0,0,0.01), 0px 12px 16px rgba(0,0,0,0.01)";

/* ═══════════════════════════════════════════════════════════════════════════
   ICONS (SVG)
   ═══════════════════════════════════════════════════════════════════════════ */

function AppleIcon({ color = "#ffffff" }: { color?: string }) {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
      <path d="M18.3 13.7C18.28 10.8 20.65 9.4 20.75 9.34C19.42 7.38 17.38 7.11 16.65 7.08C14.87 6.9 13.15 8.14 12.25 8.14C11.33 8.14 9.93 7.1 8.44 7.13C6.47 7.16 4.66 8.27 3.65 10.02C1.59 13.59 3.12 18.86 5.09 21.75C6.07 23.16 7.22 24.74 8.72 24.69C10.18 24.63 10.74 23.75 12.49 23.75C14.24 23.75 14.74 24.69 16.28 24.65C17.86 24.63 18.86 23.22 19.82 21.81C20.95 20.18 21.42 18.57 21.44 18.5C21.42 18.47 18.32 17.28 18.3 13.7ZM15.43 5.22C16.22 4.25 16.75 2.93 16.6 1.6C15.47 1.65 14.07 2.38 13.26 3.33C12.53 4.18 11.89 5.55 12.07 6.83C13.35 6.92 14.64 6.19 15.43 5.22Z" fill={color}/>
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none">
      <path d="M1.57 0.46C1.2 0.85 1 1.45 1 2.22V23.78C1 24.55 1.2 25.15 1.57 25.54L1.65 25.62L13.84 13.43V13.17V12.91L1.65 0.38L1.57 0.46Z" fill="#4285F4"/>
      <path d="M17.9 17.49L13.84 13.43V13.17V12.91L17.9 8.85L17.99 8.91L22.73 11.55C24.09 12.31 24.09 13.55 22.73 14.31L17.99 16.95L17.9 17.49Z" fill="#FBBC04"/>
      <path d="M17.99 16.95L13.84 12.8L1.57 25.07C2.04 25.57 2.82 25.63 3.7 25.14L17.99 16.95Z" fill="#EA4335"/>
      <path d="M17.99 8.91L3.7 0.86C2.82 0.37 2.04 0.43 1.57 0.93L13.84 13.2L17.99 8.91Z" fill="#34A853"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path d="M7 0.5L8.76 4.94L13.5 5.49L9.96 8.66L10.97 13.3L7 11.05L3.03 13.3L4.04 8.66L0.5 5.49L5.24 4.94L7 0.5Z" fill="#FFC021"/>
    </svg>
  );
}

function CheckIcon({ color = "#787878" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="1.2"/>
      <path d="M6.5 10L9 12.5L13.5 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowIcon({ color = "#000000" }: { color?: string }) {
  return (
    <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
      <path d="M1 7H16M16 7L10 1M16 7L10 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 7.5L10 2L17 7.5V16C17 16.55 16.55 17 16 17H4C3.45 17 3 16.55 3 16V7.5Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
      <path d="M2 4C2 2.9 2.9 2 4 2H9L11 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 16 20 18H4C2.9 18 2 17.1 2 16V4Z" fill="#548aff"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING PILL NAV (bottom)
   ═══════════════════════════════════════════════════════════════════════════ */

function FloatingPillNav() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-[5px] rounded-[50px] p-[5px] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      style={{ background: "rgba(0,0,0,0.70)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", boxShadow: "0px 5px 20px rgba(0,0,0,0.25)" }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525]"><HomeIcon /></div>
      <button className="flex h-10 items-center gap-[5px] rounded-[25px] bg-white px-7 py-[9px]">
        <span className="font-inter text-[16px] font-extralight tracking-[-0.16px] text-black">Sign up</span>
        <ArrowIcon />
      </button>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOP NAV
   ═══════════════════════════════════════════════════════════════════════════ */

function TopNavBar() {
  return (
    <div className="sticky top-0 z-40 flex justify-center px-5 pt-5">
      <div
        className="flex w-full max-w-[800px] items-center rounded-[24px] px-2 py-2"
        style={{ background: "rgba(0,0,0,0.70)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-1.5 pl-1">
          <Image src="/lander/icon-logo.png" alt="" width={34} height={34} className="rounded-[12px]" style={{ border: "1px solid rgba(255,255,255,0.10)" }} />
          <span className="hidden font-inter text-[20px] font-extralight tracking-[-0.8px] text-white sm:block">Content Rewards</span>
        </div>

        {/* Links */}
        <div className="ml-auto hidden items-center gap-5 sm:flex">
          {["Benefits", "Features", "Reviews", "Pricing", "FAQs"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="font-inter text-[15px] font-extralight tracking-[-0.6px] text-white/60 transition-colors hover:text-white/90">{l}</a>
          ))}
        </div>

        {/* CTA */}
        <button className="ml-auto rounded-[16px] px-4 sm:ml-4" style={{ background: "#f6f6f6", border: "1px solid rgba(0,0,0,0.06)", boxShadow: secondaryButtonShadow, height: 36 }}>
          <span className="font-inter text-[15px] font-extralight tracking-[-0.6px] text-black">Get the app</span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="flex flex-col items-center px-5 pb-10 pt-[100px] sm:pt-[120px]">
      <div className="flex w-full max-w-[700px] flex-col items-center gap-8">
        {/* Headline with inline social icons */}
        <h1 className="text-center font-inter text-[26px] font-extralight leading-[34px] tracking-[-0.78px] text-[#191919] sm:text-[33px] sm:leading-[39.6px] sm:tracking-[-0.99px]">
          Find opportunities,{" "}
          <span className="inline-flex translate-y-[6px] items-center gap-[6px] px-[5px] align-middle sm:gap-[10px]">
            <Image src="/lander/icon-instagram.png" alt="Instagram" width={30} height={26} className="h-[26px] w-auto rounded-[12px] bg-[#f0f0f0] p-[5px] shadow-[0_0_15px_rgba(0,0,0,0.07)]" style={{ border: "1px solid rgba(0,0,0,0.05)" }} />
            <Image src="/lander/icon-tiktok.png" alt="TikTok" width={24} height={24} className="h-[28px] w-auto rounded-[12px] bg-[#f0f0f0] p-[6px] shadow-[0_0_15px_rgba(0,0,0,0.07)]" style={{ border: "1px solid rgba(0,0,0,0.05)" }} />
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#f0f0f0] shadow-[0_0_15px_rgba(0,0,0,0.07)]" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
              <Image src="/lander/icon-youtube.png" alt="YouTube" width={19} height={19} />
            </span>
          </span>{" "}
          <span className="text-[#e8980e]">make content,</span>{" "}
          and start earning on Content Rewards.
        </h1>

        {/* Subtitle */}
        <p className="max-w-[550px] text-center font-inter text-[16px] font-extralight leading-[25.6px] text-[#787878]">
          Appdrop combines tasks, reminders, and calendar planning into one intelligent productivity system.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-[10px]">
          <a href="#" className="flex items-center gap-[10px] rounded-[18px] px-4 py-2" style={{ background: "#e09f07", border: "1px solid rgba(255,255,255,0.34)", boxShadow: glassButtonShadow }}>
            <AppleIcon />
            <div className="flex flex-col">
              <span className="font-inter text-[10px] font-extralight leading-[10px] text-white">Get it on</span>
              <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-white">App Store</span>
            </div>
          </a>
          <a href="#" className="flex items-center gap-[10px] rounded-[18px] px-4 py-2" style={{ background: "#f6f6f6", border: "1px solid rgba(0,0,0,0.10)", boxShadow: secondaryButtonShadow }}>
            <GooglePlayIcon />
            <div className="flex flex-col">
              <span className="font-inter text-[10px] font-extralight leading-[10px] text-black">Get it on</span>
              <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-black">Google Play</span>
            </div>
          </a>
        </div>

        {/* Rating row */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"].map((a, i) => (
              <Image key={a} src={`/lander/${a}.png`} alt="" width={33} height={33} className="rounded-full shadow-[0_0_0_2px_#ffffff]" style={{ zIndex: 5 - i }} />
            ))}
          </div>
          <div className="flex items-center gap-[3px]">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </div>
          <span className="font-inter text-[13px] font-semibold leading-[15.6px] tracking-[-0.78px] text-black">4.8</span>
          <span className="font-inter text-[13px] font-medium leading-[13px] tracking-[-0.26px] text-[#787878]">500K+ Downloads</span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONNECT — orbital rings with app icons
   ═══════════════════════════════════════════════════════════════════════════ */

const ORBIT_APPS = [
  { src: "app-nfl.png", size: 73, style: { top: "2%", left: "8%" } },
  { src: "app-2.png", size: 60, style: { top: "12%", right: "10%" } },
  { src: "app-3.png", size: 73, style: { top: "55%", left: "-2%" } },
  { src: "app-4.png", size: 65, style: { top: "65%", right: "2%" } },
  { src: "app-5.png", size: 50, style: { bottom: "2%", left: "22%" } },
  { src: "app-6.png", size: 60, style: { bottom: "8%", right: "18%" } },
];

function ConnectSection() {
  return (
    <section className="flex flex-col items-center px-5 py-10">
      <div className="relative flex h-[500px] w-full max-w-[600px] items-center justify-center sm:h-[600px]">
        <div className="absolute h-[400px] w-[400px] rounded-full border border-[#f2f2f2] sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px]" />
        <div className="absolute h-[320px] w-[320px] rounded-full border border-[#f2f2f2] sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]" />

        {ORBIT_APPS.map((app) => (
          <div key={app.src} className="absolute" style={{ ...app.style, width: app.size, height: app.size }}>
            <Image
              src={`/lander/${app.src}`}
              alt=""
              width={app.size}
              height={app.size}
              className="rounded-[24px] shadow-[0_0_15px_rgba(0,0,0,0.05)]"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            />
          </div>
        ))}

        <div className="relative z-10 flex max-w-[280px] flex-col items-center gap-4">
          <h2 className="text-center font-inter text-[28px] font-extralight leading-[36.4px] tracking-[-1.12px] text-[#d1960a] sm:text-[32px] sm:leading-[41.6px] sm:tracking-[-1.28px]">
            Fits perfectly in your workflow.
          </h2>
          <p className="text-center font-inter text-[16px] font-extralight leading-[20.8px] text-[#787878]">
            Integrate easily with the tools you already use. Your productivity system, without switching apps.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THE CHALLENGE
   ═══════════════════════════════════════════════════════════════════════════ */

function ChallengeSection() {
  return (
    <section className="flex flex-col items-center px-5 pb-[140px] pt-5">
      <div className="flex max-w-[400px] flex-col items-center gap-[5px]">
        <span className="font-inter text-[16px] font-medium leading-[22.4px] tracking-[-0.32px] text-[#787878]">The Challenge</span>
        <p className="text-center font-inter text-[22px] font-semibold leading-[32px] tracking-[-0.88px] text-[#787878] sm:text-[26px] sm:leading-[36.4px] sm:tracking-[-1.04px]">
          Managing tasks, reminders, and meetings across different apps slows you down. Appdrop brings everything into one intelligent workflow.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KEY BENEFITS — 3 cards with phone mockups
   ═══════════════════════════════════════════════════════════════════════════ */

const BENEFITS = [
  { title: "AI-Powered Prioritization", desc: "Automatically surfaces what matters most based on deadlines and patterns.", frame: "phone-frame-1.png", screen: "phone-screen-1.png" },
  { title: "Unified Calendar", desc: "Tasks and events live together in one clean timeline.", frame: "phone-frame-2.png", screen: "phone-screen-2.png" },
  { title: "Smart Reminders", desc: "Reminders adjust intelligently to your schedule and behavior.", frame: "phone-frame-3.png", screen: "phone-screen-3.png" },
];

function KeyBenefitsSection() {
  return (
    <section id="benefits" className="flex flex-col items-center px-5 py-10">
      <div className="flex w-full max-w-[1160px] flex-col items-center gap-[38px] px-0 sm:px-5">
        <div className="flex flex-col items-center gap-[6px]">
          <span className="font-inter text-[16px] font-medium leading-[22.4px] tracking-[-0.32px] text-[#787878]">Key Benefits</span>
          <h2 className="text-center font-inter text-[28px] font-extralight leading-[36.4px] tracking-[-1.12px] text-[#787878] sm:text-[32px] sm:leading-[41.6px] sm:tracking-[-1.28px]">
            Smarter Task Management
          </h2>
        </div>

        <div className="flex w-full flex-col gap-[18px] sm:flex-row">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-1 flex-col overflow-hidden rounded-[40px] bg-[#fafafa]">
              {/* Phone mockup */}
              <div className="relative flex items-center justify-center px-8 pt-8">
                <div className="relative h-[280px] w-[137px] sm:h-[340px] sm:w-[170px]">
                  <Image src={`/lander/${b.screen}`} alt="" fill className="rounded-[44px] object-cover object-top" />
                  <Image src={`/lander/${b.frame}`} alt="" fill className="relative z-10 object-contain" />
                </div>
              </div>
              {/* Text */}
              <div className="flex flex-col gap-[7px] px-10 pb-10 pt-6" style={{ padding: "25px 40px 40px 40px" }}>
                <h3 className="font-inter text-[16px] font-medium leading-[22.4px] tracking-[-0.32px] text-[#000000]">{b.title}</h3>
                <p className="font-inter text-[16px] font-extralight leading-[20.8px] text-[#787878]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES — bento grid
   ═══════════════════════════════════════════════════════════════════════════ */

function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center gap-5 px-5 py-10">
      <div className="flex flex-col items-center gap-[6px]">
        <span className="font-inter text-[16px] font-medium leading-[22.4px] tracking-[-0.32px] text-[#787878]">Features</span>
        <h2 className="text-center font-inter text-[28px] font-extralight leading-[36.4px] tracking-[-1.12px] text-[#787878] sm:text-[32px] sm:leading-[41.6px] sm:tracking-[-1.28px]">
          Built for human thinking.{"\n"}Automated Intelligently.
        </h2>
      </div>

      {/* Hero statement */}
      <div className="w-full max-w-[1160px] overflow-hidden rounded-[16px] bg-[#010624] px-8 pb-10 pt-[80px] sm:px-16 sm:pt-[157px]">
        <p className="font-inter text-[24px] font-medium leading-[36px] tracking-[-1.2px] sm:text-[40px] sm:leading-[56px] sm:tracking-[-2.2px]">
          <span className="text-white/70">Great products deserve </span>
          <span className="rounded-[3px] bg-[#2622f5] px-1.5 text-white">great marketing.</span>
          <span className="text-white/70"> We&apos;ll bring creator relationships spanning every </span>
          <span className="font-bold text-white">niche, while you bring the brand worth scaling.</span>{" "}
          <span className="rounded-[3px] bg-[#2622f5] px-1.5 text-white">We&apos;ll deliver attention.</span>
        </p>
      </div>

      {/* Bento grid */}
      <div className="flex w-full max-w-[1160px] flex-col gap-5 lg:flex-row">
        {/* Left — notifications */}
        <div className="flex flex-1 flex-col gap-[10px] overflow-hidden rounded-[16px] bg-[#010624] px-6 pb-12 pt-6 sm:px-[30px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-full max-w-[328px] rounded-[12px] bg-[#141429] p-3 opacity-40">
              <div className="h-3 w-[200px] rounded bg-white/10" />
              <div className="mt-2 h-2 w-[150px] rounded bg-white/5" />
            </div>
            <div className="w-full max-w-[352px] rounded-[12px] bg-[#182354] p-3 opacity-50">
              <div className="h-3 w-[220px] rounded bg-white/10" />
              <div className="mt-2 h-2 w-[180px] rounded bg-white/5" />
            </div>
            <div className="w-full max-w-[380px] rounded-[12px] bg-[#2060df] p-3">
              <div className="flex items-start justify-between">
                <span className="font-inter text-[17px] font-semibold leading-[25.5px] tracking-[-0.85px] text-white">Virality: New Campaign with ____</span>
                <span className="shrink-0 text-[14px] text-white">13:42</span>
              </div>
              <p className="mt-1 text-[14px] leading-[21px] text-white">We&apos;ve just partnered with _____! Here&apos;s everything you need to know to start earning.</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="text-[18px] font-semibold leading-[27px] text-white">Campaign Launch &amp; Content Deployment</h3>
            <p className="text-[18px] leading-[27px] text-[#b5b6b8]">We take your core brand message, campaign goals, and our strategic insights to create a Campaign Playbook. This playbook is then deployed to our creator network, who are tasked with producing hundreds of unique video variations based on proven formats.</p>
          </div>
        </div>

        {/* Right — creator photos + A/B testing */}
        <div className="flex flex-1 flex-col gap-6 overflow-hidden rounded-[16px] bg-[#010624] px-6 pb-14 pt-6">
          <div className="relative flex h-[220px] w-full items-center justify-center">
            <div className="absolute left-[5%] top-[5%] overflow-hidden rounded-[18px] bg-[#1f35de] p-2.5" style={{ width: 109, height: 109 }}>
              <Image src="/lander/creator-v.png" alt="" width={85} height={85} className="rounded-[8px]" />
            </div>
            <div className="absolute right-[10%] top-[0%] overflow-hidden rounded-[18px] bg-[#1f35de] p-2.5" style={{ width: 112, height: 112 }}>
              <Image src="/lander/creator-quittr.png" alt="" width={88} height={88} className="rounded-[8px]" />
            </div>
            <div className="absolute bottom-[5%] left-[20%] overflow-hidden rounded-[18px] bg-[#1f35de] p-2.5" style={{ width: 90, height: 90 }}>
              <Image src="/lander/creator-me.png" alt="" width={70} height={70} className="rounded-[8px]" />
            </div>
            <div className="absolute bottom-0 right-[5%] flex flex-col items-center justify-center gap-1 rounded-[14px] bg-[#1f48de]" style={{ width: 212, height: 152 }}>
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                <path d="M2 4C2 2.9 2.9 2 4 2H9L11 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H4C2.9 18 2 17.1 2 16V4Z" fill="#548aff"/>
              </svg>
              <span className="font-inter text-[18px] font-bold leading-[21.6px] tracking-[-0.9px] text-white">VIRALITY</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] font-semibold leading-[27px] text-white">Mass A/B Testing</h3>
            <p className="text-[18px] leading-[27px] text-[#b5b6b8]">Hundreds of videos start going live. This is the largest A/B test imaginable. We&apos;re testing hundreds of hooks, angles, and formats, allowing the algorithm to decide the winners, based on creators competing against each other.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING
   ═══════════════════════════════════════════════════════════════════════════ */

const FREE_FEATURES = ["Limited AI Analysis", "Unlimited Tasks", "Limited Reminders", "Cloud Sync"];
const PRO_FEATURES = ["Advanced AI Analysis", "Unlimited Reminders", "Smart Scheduling", "Share with Team"];

function PricingSection() {
  return (
    <section id="pricing" className="flex flex-col items-center px-5 py-10">
      <div className="flex w-full max-w-[1120px] flex-col items-end sm:flex-row">
        {/* Free */}
        <div className="flex flex-1 flex-col gap-6 p-10 sm:p-[60px]" style={{ background: "#fafafa", borderRadius: "40px 0px 0px 40px" }}>
          <div className="flex flex-col gap-1">
            <span className="font-inter text-[18px] font-medium leading-[25.2px] tracking-[-0.72px] text-[#787878]">Free Plan</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-inter text-[40px] font-semibold leading-[40px] tracking-[-1.6px] text-black">$0</span>
              <span className="font-inter text-[18px] font-medium leading-[25.2px] tracking-[-0.72px] text-[#787878]">/month</span>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            {FREE_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-[10px]">
                <CheckIcon />
                <span className="font-inter text-[16px] font-extralight leading-[20.8px] text-[#787878]">{f}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 w-fit rounded-[16px] px-6 py-[9px]" style={{ background: "#e8980e", border: "1px solid rgba(255,255,255,0.34)", boxShadow: glassButtonShadow }}>
            <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-white">Start for Free</span>
          </button>
        </div>

        {/* Pro */}
        <div className="flex flex-1 flex-col gap-6 p-10 sm:p-[60px]" style={{ background: "#000000", borderRadius: "40px 40px 40px 0px" }}>
          <div className="flex flex-col gap-1">
            <span className="font-inter text-[18px] font-medium leading-[25.2px] tracking-[-0.72px] text-[#787878]">Pro Plan</span>
            <div className="flex items-baseline gap-0.5">
              <span className="font-inter text-[40px] font-semibold leading-[40px] tracking-[-1.6px] text-white">$20</span>
              <span className="font-inter text-[18px] font-medium leading-[25.2px] tracking-[-0.72px] text-[#787878]">/month</span>
            </div>
          </div>
          <div className="flex flex-col gap-[10px]">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-[10px]">
                <CheckIcon color="#fafafa" />
                <span className="font-inter text-[16px] font-extralight leading-[20.8px] text-[#787878]">{f}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 w-fit rounded-[16px] px-6 py-[9px]" style={{ background: "#e8980e", border: "1px solid rgba(255,255,255,0.34)", boxShadow: glassButtonShadow }}>
            <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-white">Start with Pro</span>
          </button>
        </div>
      </div>
      <p className="mt-4 font-inter text-[14px] font-medium tracking-[-0.56px] text-[#787878]">Save 20% on yearly plan</p>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ — chat-style
   ═══════════════════════════════════════════════════════════════════════════ */

const FAQS = [
  { q: "What is Socius and who is it for?", a: "socius is a private network for internet founders who actually build. if you're shipping products, testing ideas, or figuring things out then you'll fit right in", avatar: "faq-avatar-1.png" },
  { q: "How does Socius differ from other social platforms?", a: "we're not linkedin. not discord. not indie hackers. socius isn't built for lurkers or likes. it's for people who want real convos with other obsessive builders", avatar: "faq-avatar-2.png" },
  { q: "What can I do on Socius?", a: "post what you're working on. get feedback. find people in the same trenches. it's like a group chat for founders except everyone's actually building", avatar: "faq-avatar-3.png" },
];

function FAQSection() {
  return (
    <section id="faqs" className="flex flex-col items-center px-5 py-10">
      <div className="flex w-full max-w-[748px] flex-col gap-[48px]">
        {FAQS.map((faq, i) => (
          <div key={i} className="flex flex-col gap-5">
            {/* Question — right */}
            <div className="flex items-start justify-end gap-2">
              <div className="rounded-[34px] bg-[#e8980e] px-5 py-[11px]" style={{ borderBottomRightRadius: 0 }}>
                <span className="font-inter text-[16px] font-medium leading-[22.4px] tracking-[-0.5px] text-white">{faq.q}</span>
              </div>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                <span className="font-inter text-[8px] font-semibold text-black">YOU</span>
              </div>
            </div>
            {/* Answer — left */}
            <div className="flex items-start gap-2">
              <Image src={`/lander/${faq.avatar}`} alt="" width={24} height={24} className="shrink-0 rounded-full" />
              <div className="rounded-[34px] bg-[#252525] px-5 py-3" style={{ borderBottomLeftRadius: 0 }}>
                <span className="font-inter text-[15px] leading-[18px] text-[#f5f5f5]">{faq.a}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED HERO — dark section with phone + feature cards
   ═══════════════════════════════════════════════════════════════════════════ */

const FEATURES_LEFT = [
  { title: "Smart Capture", desc: "Turn quick thoughts into structured tasks instantly." },
  { title: "AI Scheduling", desc: "Appdrop suggests the best time to complete tasks." },
  { title: "Intelligent Insights", desc: "See productivity trends and improve over time." },
];
const FEATURES_RIGHT = [
  { title: "AI Reminders", desc: "Never miss a deadline. They adapt to your schedule." },
  { title: "Smart Tagging", desc: "Tasks organize themselves automatically with smart tagging." },
  { title: "Smart Views", desc: "Focus on what matters today, this week, or next." },
];

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="w-[250px] rounded-[40px] bg-[#fafafa] p-5 lg:w-[280px]">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#e8980e]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </div>
      <h4 className="font-inter text-[16px] font-medium leading-[22.4px] tracking-[-0.32px] text-black">{title}</h4>
      <p className="mt-1 font-inter text-[16px] font-extralight leading-[20.8px] text-[#787878]">{desc}</p>
    </div>
  );
}

function AnimatedHeroSection() {
  return (
    <section className="bg-[#10100e] px-5 pb-20 pt-20 sm:px-16">
      <div className="flex flex-col items-center">
        <div className="relative flex justify-center">
          {/* Left cards — desktop */}
          <div className="hidden flex-col gap-4 pt-[60px] lg:flex">
            {FEATURES_LEFT.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>

          {/* Phone */}
          <div className="mx-4 flex flex-col items-center sm:mx-8">
            <div className="relative w-[200px] overflow-hidden rounded-[24px]" style={{ height: 416 }}>
              <Image src="/lander/app-screenshot-dark.png" alt="" fill className="object-cover" />
              <Image src="/lander/phone-frame-animated.png" alt="" fill className="relative z-10 object-contain" style={{ opacity: 0.15 }} />
              {/* Bottom card overlay */}
              <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 rounded-t-[20px] px-6 pb-8 pt-6" style={{ background: "linear-gradient(180deg, transparent 0%, #0a0a0a 40%)" }}>
                <span className="font-inter text-[9.4px] font-bold tracking-[-0.2px] text-white">VIRALITY</span>
                <span className="text-center font-inter text-[16px] font-bold leading-[19.2px] tracking-[-0.6px] text-white">Go Viral, Get Paid.</span>
                <button className="rounded-[6px] px-4 py-2" style={{ background: "#2060df", border: "1px solid #548aff", boxShadow: "0px 4px 32px rgba(71,102,255,0.06)" }}>
                  <span className="font-inter text-[10px] font-bold leading-[11px] tracking-[-0.4px] text-white">Get started</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right cards — desktop */}
          <div className="hidden flex-col gap-4 pt-[60px] lg:flex">
            {FEATURES_RIGHT.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {[...FEATURES_LEFT, ...FEATURES_RIGHT].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT — "The Organic Marketing Platform"
   ═══════════════════════════════════════════════════════════════════════════ */

function ContentSection() {
  return (
    <section className="flex flex-col items-center gap-6 overflow-hidden px-5 py-[80px] sm:py-[120px]">
      <div className="flex items-center gap-[10px] rounded-full bg-[#f5f5f5] px-[14px] py-[10px]">
        <Image src="/lander/icon-cr-orange.png" alt="" width={16} height={16} />
        <span className="font-inter text-[15.3px] font-bold leading-[16px] tracking-[-0.32px] text-[#424242]">200k downloads on AppStore</span>
      </div>

      <h2 className="max-w-[900px] text-center font-inter text-[40px] font-bold leading-[1em] tracking-[-0.04em] sm:text-[52px] lg:text-[64px] lg:tracking-[-3.84px]">
        <span className="text-[#1f1f1f]">The </span>
        <span className="rounded-[12px] px-2 py-0.5 sm:px-3 sm:py-1" style={{ background: "rgba(255,128,0,0.15)", color: "#ff8000" }}>Organic</span>
        <br />
        <span className="text-[#1f1f1f]">Marketing Platform</span>
      </h2>

      <p className="max-w-[550px] text-center font-inter text-[17px] font-semibold leading-[30px] tracking-[-0.4px] text-[#424242] sm:text-[19px]">
        Snap a photo, scan a barcode, or describe your meal and get instant calorie and nutrient info.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button className="flex items-center gap-2 rounded-[20px] px-6 py-4" style={{ background: "#1a1c1d", boxShadow: "0px 1px 5px rgba(0,0,0,0.50), 0px 0px 1px rgba(0,0,0,0.06)" }}>
          <AppleIcon color="#ffffff" />
          <span className="font-inter text-[15.5px] font-bold leading-[19.2px] text-white">Download for Mac</span>
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="flex flex-col items-center border-t border-[#f2f2f2] px-5 py-[100px]">
      <div className="flex w-full max-w-[1160px] flex-col gap-[30px]">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="flex max-w-[400px] flex-col gap-4">
            <div className="flex items-center gap-1.5">
              <Image src="/lander/icon-logo.png" alt="" width={34} height={34} className="rounded-[12px]" style={{ border: "1px solid rgba(255,255,255,0.10)" }} />
              <span className="font-inter text-[20px] font-extralight leading-[20px] tracking-[-0.8px] text-[#171717]">Content Rewards</span>
            </div>
            <p className="font-inter text-[14px] font-medium leading-[21px] tracking-[-0.56px] text-[#787878]">
              Appdrop combines tasks, reminders, and calendar planning into one intelligent productivity system.
            </p>
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex h-[34px] w-[34px] items-center justify-center rounded-[16px]" style={{ background: "#f6f6f6", border: "1px solid rgba(0,0,0,0.10)", boxShadow: secondaryButtonShadow }}>
                  <div className="h-3.5 w-3.5 rounded-sm bg-[#c0c0c0]" />
                </div>
              ))}
              <button className="rounded-[16px] px-4 py-2" style={{ background: "#f6f6f6", border: "1px solid rgba(0,0,0,0.06)" }}>
                <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-black">Contact</span>
              </button>
            </div>
          </div>

          <div className="flex gap-[80px]">
            <div className="flex flex-col gap-[6px]">
              <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-black">Product</span>
              {["Benefits", "Features", "Pricing", "Download"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="font-inter text-[14px] font-medium leading-[21px] tracking-[-0.56px] text-[#e8980e] transition-opacity hover:opacity-70">{l}</a>
              ))}
            </div>
            <div className="flex flex-col gap-[6px]">
              <span className="font-inter text-[15px] font-extralight leading-[18px] tracking-[-0.6px] text-black">More</span>
              {["Integration", "Questions", "Reviews", "Support"].map((l) => (
                <a key={l} href="#" className="font-inter text-[14px] font-medium leading-[21px] tracking-[-0.56px] text-[#e8980e] transition-opacity hover:opacity-70">{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#f2f2f2]" />

        <div className="flex items-center justify-between">
          <span className="font-inter text-[14px] font-medium leading-[21px] tracking-[-0.56px] text-[#787878]">AppDrop &copy; 2026. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════════ */

export function ProductLanderClient() {
  const { setMode } = useTheme();
  useEffect(() => {
    setMode("light");
    return () => setMode("system");
  }, [setMode]);

  return (
    <div className="min-h-dvh bg-white font-inter">
      <FloatingPillNav />
      <TopNavBar />
      <HeroSection />
      <ConnectSection />
      <ChallengeSection />
      <KeyBenefitsSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <AnimatedHeroSection />
      <ContentSection />
      <Footer />
    </div>
  );
}
