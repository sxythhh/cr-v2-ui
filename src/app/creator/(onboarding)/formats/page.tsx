"use client";

import Link from "next/link";
import { useState } from "react";
import { FormatCard } from "@/components/creator-mobile/onboarding/format-card";

const formats = [
  { title: "short-form", subtitle: "reels, tiktoks, shorts", iconColor: "#FF009D", selectedBg: "#FFE6EF", selectedBorder: "#FF009D", selectedTitleColor: "#540029", selectedSubtitleColor: "rgba(84,0,41,0.7)" },
  { title: "long-form", subtitle: "youtube videos, vlogs", iconColor: "#FF005B", selectedBg: "#FFE7E9", selectedBorder: "#FF005B", selectedTitleColor: "#4D0010", selectedSubtitleColor: "#4D0010" },
  { title: "clips / reposts", subtitle: "clipping existing content", iconColor: "#00BF76" },
  { title: "livestreams", subtitle: "live broadcasts", iconColor: "#A52BFF" },
];

export default function FormatsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["short-form", "long-form"]));

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center px-[34px] pt-[34px]" style={{ minHeight: 200 }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>almost there!</span>
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>what formats do you create?</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[17px] px-[34px] pb-[34px]">
        <span className="text-center text-[15px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>multiple can be selected</span>
        <div className="flex flex-col">
          {formats.map((f) => (
            <FormatCard key={f.title} {...f} selected={selected.has(f.title)} />
          ))}
        </div>
      </div>

      <div className="px-[34px] pb-[34px]">
        <div className="flex items-start gap-[17px]">
          <Link href="/creator/sub-niches" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl" style={{ border: "0.5px solid #D6D4D1" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link href="/creator/languages" className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: selected.size > 0 ? "#24231F" : "#D6D4D2" }}>
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">next</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
