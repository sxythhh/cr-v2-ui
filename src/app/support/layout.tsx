"use client";

import { DubNav } from "@/components/lander/dub-nav";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="support-root min-h-dvh">
      <style>{`
        html:has(.support-root) {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html:has(.support-root)::-webkit-scrollbar {
          display: none;
        }
        html:has(.support-root) body {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          min-height: 100dvh;
        }
      `}</style>
      <DubNav />
      <main>{children}</main>
    </div>
  );
}
