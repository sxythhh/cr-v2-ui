"use client";

import Link from "next/link";
import { useState } from "react";
import { NicheChipGrid } from "@/components/creator-mobile/onboarding/niche-chips";
import { BottomActions } from "@/components/creator-mobile/onboarding/bottom-actions";

const mainNiches = [
  { label: "Gaming", color: "#FF005B" },
  { label: "Beauty" },
  { label: "Finance" },
  { label: "Tech", color: "#DA8539" },
  { label: "Fashion" },
  { label: "Lifestyle" },
  { label: "Comedy" },
  { label: "Food" },
  { label: "Education" },
];

export default function NichesPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["Gaming", "Tech"]));

  const chips = mainNiches.map((n) => ({
    ...n,
    selected: selected.has(n.label),
  }));

  return (
    <div className="flex flex-1 flex-col">
      {/* Heading */}
      <div className="flex flex-col items-center justify-center px-[34px] pt-[34px]" style={{ minHeight: 200 }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
            confirm your niches.
          </span>
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
            we&apos;ll match campaigns to these
          </span>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-1 flex-col justify-center px-[34px] pb-[34px]">
        <NicheChipGrid chips={chips} />
      </div>

      {/* Bottom */}
      <div className="px-[34px] pb-[34px]">
        <div className="flex items-start gap-[17px]">
          <Link href="/creator/intro" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl" style={{ border: "0.5px solid #D6D4D1" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link
            href="/creator/sub-niches"
            className="flex h-14 flex-1 items-center justify-center rounded-3xl"
            style={{ background: selected.size > 0 ? "#24231F" : "#D6D4D2" }}
          >
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">next</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
