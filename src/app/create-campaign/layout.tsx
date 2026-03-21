"use client";

import { useEffect } from "react";

export default function CreateCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden tracking-[-0.5px] [&_button]:cursor-pointer bg-page-bg"
      style={{ fontFamily: "var(--font-inter-sans), sans-serif" }}
    >
      {children}
    </div>
  );
}
