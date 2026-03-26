import Link from "next/link";
import { BrandIcons } from "@/components/creator-mobile/onboarding/brand-icons";
import { FeatureRows } from "@/components/creator-mobile/onboarding/feature-rows";

export default function OnboardingIntro() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Brand icons area */}
      <div className="flex flex-col items-center overflow-hidden px-[34px] pt-[34px]" style={{ height: 196 }}>
        <BrandIcons />
      </div>

      {/* Heading */}
      <div className="flex flex-col items-center gap-[34px] px-[34px] pt-[34px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
            campaigns,
          </span>
          <span className="text-[21px] font-semibold leading-[120%] tracking-[0.02em]" style={{ color: "#24231F" }}>
            curated just for you.
          </span>
        </div>
      </div>

      <div className="flex-1" />
      <FeatureRows />

      {/* CTA */}
      <div className="px-[21px] pb-[34px]">
        <Link
          href="/creator/niches"
          className="flex h-14 items-center justify-center rounded-3xl"
          style={{ background: "#24231F" }}
        >
          <span className="text-[18px] font-semibold leading-[120%] tracking-[0.025em] text-white">
            set up your feed
          </span>
        </Link>
      </div>
    </div>
  );
}
