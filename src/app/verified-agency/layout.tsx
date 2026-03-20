"use client";

import { DubNav } from "@/components/lander/dub-nav";

export default function VerifiedAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="verified-agency-root min-h-dvh bg-white dark:bg-[#0e0e0e]">
      <style>{`
        html:has(.verified-agency-root) {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html:has(.verified-agency-root)::-webkit-scrollbar {
          display: none;
        }
        html:has(.verified-agency-root) body {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100dvh;
          background: #ffffff !important;
        }
        html.dark:has(.verified-agency-root) body {
          background: #0e0e0e !important;
        }
      `}</style>
      <DubNav />
      <main>{children}</main>
    </div>
  );
}
