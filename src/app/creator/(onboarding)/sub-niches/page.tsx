"use client";

import Link from "next/link";
import { useState } from "react";
import { NicheChipGrid } from "@/components/creator-mobile/onboarding/niche-chips";

const gamingSubs = ["FPS/Shooter", "RPG", "Sports", "Mobile", "Esports", "Variety"];
const techSubs = ["Reviews", "Gadgets", "AI", "Mobile", "Crypto", "Apps", "How-tos"];

export default function SubNichesPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["FPS/Shooter", "Variety", "Gadgets", "How-tos"]));

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center px-[34px] pt-[34px]" style={{ minHeight: 200 }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>what kind of content?</span>
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>we&apos;ll match campaigns to these</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-12 px-[34px] pb-[34px]">
        {/* Gaming */}
        <div className="flex flex-col gap-[17px]">
          <div className="flex items-start gap-1.5">
            <div className="h-[18px] w-[18px] rounded-[3px]" style={{ background: "#FF005B" }} />
            <span className="text-[15px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>Gaming</span>
          </div>
          <NicheChipGrid chips={gamingSubs.map((l) => ({ label: l, selected: selected.has(l), color: "#FF005B" }))} />
        </div>

        {/* Tech */}
        <div className="flex flex-col gap-[17px]">
          <div className="flex items-start gap-1.5">
            <div className="h-[18px] w-[18px] rounded-[3px]" style={{ background: "#DA8539" }} />
            <span className="text-[15px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>Tech</span>
          </div>
          <NicheChipGrid chips={techSubs.map((l) => ({ label: l, selected: selected.has(l), color: "#DA8539" }))} />
        </div>
      </div>

      <div className="px-[34px] pb-[34px]">
        <div className="flex items-start gap-[17px]">
          <Link href="/creator/niches" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl" style={{ border: "0.5px solid #D6D4D1" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link href="/creator/formats" className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: selected.size > 0 ? "#24231F" : "#D6D4D2" }}>
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">next</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
