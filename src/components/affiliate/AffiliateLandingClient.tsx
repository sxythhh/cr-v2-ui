"use client";

import { Fragment, useEffect } from "react";
import { THEME, type Theme } from "./affiliate-theme";
import { DubNav } from "@/components/lander/dub-nav";
import { AffiliateIntegrationSection } from "./AffiliateIntegrationSection";
import { AffiliateNetworkSphere } from "./AffiliateNetworkSphere";
import { AFFILIATE_CONTENT } from "./affiliate-content";
import { useTheme } from "@/components/theme-provider";

import type { AffiliateVariant } from "./affiliate-content";

export function AffiliateLandingClient({ variant = "brand" }: { variant?: AffiliateVariant }) {
  const { darkMode } = useTheme();
  const theme: Theme = darkMode ? "dark" : "light";
  const content = AFFILIATE_CONTENT[variant];

  useEffect(() => {
    document.body.classList.add("no-glow");
    return () => { document.body.classList.remove("no-glow"); };
  }, []);

  const c = THEME[theme];

  return (
    <div className="min-h-screen font-inter antialiased flex flex-col transition-colors duration-200" style={{ backgroundColor: c.pageBg }}>
      <DubNav theme={theme} transparent />

      <main className="flex-1">
        <AffiliateNetworkSphere />
        <AffiliateIntegrationSection theme={theme} />
        <HowItWorksSection c={c} steps={content.steps} />
      </main>
    </div>
  );
}

function HowItWorksSection({ c, steps }: { c: (typeof THEME)[Theme]; steps: { num: string; title: string; desc: string }[] }) {
  return (
    <section className="py-16 px-5">
      <div className="max-w-[720px] mx-auto">
        <h2 className="text-[22px] sm:text-[28px] font-bold tracking-[-1px] text-center mb-6" style={{ color: c.textPrimary }}>How it works</h2>
        <div className="flex flex-col items-center gap-5">
          {steps.map((s) => (
            <Fragment key={s.num}>
                <div className="w-full flex items-start gap-5 p-5 rounded-2xl" style={{
                  background: "radial-gradient(168.69% 348.94% at 10.02% -68.75%, rgba(233,230,227,0.5) 0%, rgba(237,237,237,0.5) 60%, rgba(244,244,244,0.5) 100%)",
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  boxShadow: "0px -2px 4px -1px rgba(255,255,255,0.8) inset, 5px 5px 10px -9px rgba(37,37,37,0.16) inset, -5px 5px 10px -9px rgba(37,37,37,0.12) inset, 0px 8px 9px -12.5px rgba(37,37,37,0.08) inset, 0px 4px 8px -2px rgba(0,0,0,0.06)",
                }}>
                  <span className="text-[24px] font-bold tracking-[-1px] shrink-0" style={{
                    background: "linear-gradient(135deg, #FF8003 0%, #EC3EFF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>{s.num}</span>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-[-0.5px] mb-1" style={{ color: c.textPrimary }}>{s.title}</h3>
                    <p className="text-[14px] leading-[1.6] tracking-[-0.2px]" style={{ color: c.textSecondary }}>{s.desc}</p>
                  </div>
                </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
