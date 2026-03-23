import type { CampaignModel } from "@/types/campaign-flow.types";

const ILLUSTRATIONS: Record<CampaignModel, { light: string; dark: string }> = {
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
  },
};

export function CardIllustration({ model }: { model: CampaignModel }) {
  const { light, dark } = ILLUSTRATIONS[model];
  return (
    <div className="absolute inset-0 top-[100px] flex items-end justify-center overflow-hidden rounded-b-2xl pointer-events-none z-0">
      <img
        src={light}
        alt=""
        draggable={false}
        className="w-[110%] max-w-none object-contain object-bottom select-none dark:hidden"
      />
      <img
        src={dark}
        alt=""
        draggable={false}
        className="w-[110%] max-w-none object-contain object-bottom select-none hidden dark:block"
      />
      {/* Bottom fade mask so footer text is visible */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card-bg to-transparent" />
    </div>
  );
}
