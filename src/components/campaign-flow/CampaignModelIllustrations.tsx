import type { CampaignModel } from "@/types/campaign-flow.types";

const ILLUSTRATIONS: Record<CampaignModel, { light: string; dark: string; mobileDark?: string }> = {
  cpm: {
    light: "/campaign-flow/cpm-illustration.png",
    dark: "/campaign-flow/cpm-illustration-dark.png",
  },
  retainer: {
    light: "/campaign-flow/retainer-illustration.png",
    dark: "/campaign-flow/retainer-illustration-dark.png",
  },
  "per-video": {
    light: "/campaign-flow/per-video-illustration.png",
    dark: "/campaign-flow/per-video-illustration-dark.png",
    mobileDark: "/campaign-flow/per-video-illustration-mobile-dark.png",
  },
};

export function CardIllustration({ model }: { model: CampaignModel }) {
  const { light, dark, mobileDark } = ILLUSTRATIONS[model];
  return (
    <div className="absolute inset-0 flex items-end justify-end overflow-hidden rounded-b-2xl pointer-events-none z-0">
      <img
        src={light}
        alt=""
        draggable={false}
        className="w-[70%] sm:w-[110%] max-w-none object-contain object-right-bottom sm:object-bottom select-none dark:hidden"
      />
      {/* Desktop dark */}
      <img
        src={dark}
        alt=""
        draggable={false}
        className={`w-[70%] sm:w-[110%] max-w-none object-contain object-right-bottom sm:object-bottom select-none hidden ${mobileDark ? "sm:dark:block" : "dark:block"}`}
      />
      {/* Mobile dark — per-video only */}
      {mobileDark && (
        <img
          src={mobileDark}
          alt=""
          draggable={false}
          className="w-[70%] max-w-none object-contain object-right-bottom select-none hidden dark:block sm:!hidden"
        />
      )}
      {/* Bottom fade mask so footer text is visible */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card-bg dark:from-page-bg to-transparent" />
    </div>
  );
}
