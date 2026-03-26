import type { CampaignModel } from "@/types/campaign-flow.types";

const ILLUSTRATIONS: Record<CampaignModel, { light: string; dark: string; mobile?: string }> = {
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
    mobile: "/campaign-flow/per-video-illustration-mobile.png",
  },
};

export function CardIllustration({ model }: { model: CampaignModel }) {
  const { light, dark, mobile } = ILLUSTRATIONS[model];
  return (
    <div className="absolute inset-0 flex items-end justify-end overflow-hidden rounded-b-2xl pointer-events-none z-0">
      {/* Light mode */}
      <img
        src={light}
        alt=""
        draggable={false}
        className={`w-[70%] sm:w-[110%] max-w-none object-contain object-right-bottom sm:object-bottom select-none dark:hidden ${mobile ? "hidden sm:block" : ""}`}
      />
      {/* Dark mode */}
      <img
        src={dark}
        alt=""
        draggable={false}
        className={`w-[70%] sm:w-[110%] max-w-none object-contain object-right-bottom sm:object-bottom select-none hidden ${mobile ? "sm:dark:block" : "dark:block"}`}
      />
      {/* Mobile — per-video only, both light and dark */}
      {mobile && (
        <img
          src={mobile}
          alt=""
          draggable={false}
          className="absolute max-w-none select-none sm:!hidden"
          style={{
            width: 370,
            height: 208,
            top: -46,
            left: 106,
          }}
        />
      )}
      {/* Bottom fade mask so footer text is visible */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card-bg dark:from-page-bg to-transparent" />
    </div>
  );
}
