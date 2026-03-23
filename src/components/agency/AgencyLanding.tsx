"use client";

import { AgencyHero } from "./AgencyHero";
import { AgencyCTA } from "./AgencyCTA";

import type { AgencyData } from "./types";

export function AgencyLanding({ agency }: { agency: AgencyData }) {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="flex flex-col items-center px-5 md:px-[30px] pt-12 md:pt-[80px] pb-[70px]">
        <div className="w-full max-w-[1060px] flex flex-col gap-9">
          <AgencyHero agency={agency} />
          <AgencyCTA agency={agency} />
        </div>
      </div>
    </div>
  );
}
