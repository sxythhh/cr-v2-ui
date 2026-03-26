"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageRow } from "@/components/creator-mobile/onboarding/language-row";

const languages = [
  { flag: "en", label: "English" },
  { flag: "ru", label: "Russian" },
  { flag: "fr", label: "French" },
  { flag: "de", label: "German" },
  { flag: "hi", label: "Hindi" },
];

export default function LanguagesPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["English", "Russian"]));

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center justify-center px-[34px] pt-[34px]" style={{ minHeight: 200 }}>
        <div className="flex flex-col gap-0.5">
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>now, last one.</span>
          <span className="text-center text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>what languages you create in?</span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-[17px] px-[34px] pb-[34px]">
        <span className="text-center text-[15px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#9D9890" }}>multiple can be selected</span>
        <div className="flex flex-col">
          {languages.map((lang) => (
            <LanguageRow key={lang.label} {...lang} selected={selected.has(lang.label)} />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, white 100%)" }} />
      </div>

      <div className="px-[34px] pb-[34px] pt-[17px]">
        <div className="flex items-start gap-[17px]">
          <Link href="/creator/formats" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl" style={{ border: "0.5px solid #D6D4D1" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="#24231F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link href="/creator/feed" className="flex h-14 flex-1 items-center justify-center rounded-3xl" style={{ background: selected.size > 0 ? "#24231F" : "#D6D4D2" }}>
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">finish setup</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
