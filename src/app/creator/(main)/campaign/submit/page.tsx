"use client";

import Link from "next/link";
import { useState } from "react";
import { SubmitSheet } from "@/components/creator-mobile/submit-sheet";

export default function SubmitPage() {
  const [filled, setFilled] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-[34px]">
        <div className="flex flex-col gap-[34px]">
          {/* Warning banner */}
          <div className="flex items-center gap-2.5 rounded-3xl px-[17px] py-4" style={{ background: "#FFEBC8" }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2L11 5" stroke="#FFAC00" strokeWidth="2" strokeLinecap="round" /><path d="M3 11L11 7L19 11V19H3V11Z" fill="#FFAC00" /></svg>
            <span className="flex-1 text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#634000" }}>submit within 30min of posting</span>
          </div>

          {/* Video link */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>video link</span>
            <input className="flex items-center rounded-3xl px-5 py-4 text-[18px] font-semibold leading-[120%] tracking-[0.03em] outline-none" style={{ background: "#F7F7F6", color: "#24231F" }} placeholder="https://platform.com/..." onChange={() => setFilled(true)} />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>title</span>
            <input className="flex items-center rounded-3xl px-5 py-4 text-[18px] font-semibold leading-[120%] tracking-[0.03em] outline-none" style={{ background: "#F7F7F6", color: "#24231F" }} placeholder="my lemon squeeze video" />
          </div>

          {/* Demographics */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2.5">
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#24231F" }}>audience demographics screenshot</span>
              <p className="text-[15px] font-medium leading-[160%] tracking-[0.03em]" style={{ color: "#6E6A5E" }}>upload a screenshot from your platform&apos;s analytics showing audience demographics</p>
            </div>
            <div className="flex flex-col items-center gap-6 rounded-3xl py-6" style={{ background: "rgba(36,35,31,0.025)", border: "2px dashed #E6E4E1" }}>
              <div className="relative h-[120px] w-[172px]">
                <div className="absolute left-[36px] top-0 flex h-[100px] w-[100px] items-center justify-center rounded-[20px]" style={{ background: "#00CE2A", border: "3.5px solid white" }}>
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 8V28M8 18H28" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg>
                </div>
              </div>
              <span className="text-[15px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>click to upload</span>
            </div>
          </div>

          {/* Agreement */}
          <div className="flex flex-col gap-[17px]">
            <div className="flex items-center gap-2.5">
              <div className="h-5 w-5 rounded-[7px]" style={{ border: "2.5px solid #CDC8C2" }} />
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.03em]" style={{ color: "#9D9890" }}>i agree to the campaign requirements</span>
            </div>
            <Link href="/creator/feed" className="flex h-14 items-center justify-center rounded-3xl" style={{ background: filled ? "#24231F" : "#D6D4D2" }}>
              <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">submit video</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
