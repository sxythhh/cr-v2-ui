import type { CampaignModel } from "@/types/campaign-flow.types";

const ILLUSTRATIONS: Record<CampaignModel, { light: string; dark: string; mobile?: string }> = {
  cpm: {
    light: "/campaign-flow/cpm-illustration.png",
    dark: "/campaign-flow/cpm-illustration-dark.png",
  },
  retainer: {
    light: "/campaign-flow/retainer-card-bg-light.png",
    dark: "/campaign-flow/retainer-card-bg.png",
  },
  "per-video": {
    light: "/campaign-flow/per-video-card-light.png",
    dark: "/campaign-flow/per-video-card-dark.png",
    mobile: "/campaign-flow/per-video-card-mobile.png",
  },
};

const desktopTopFadeLight = "linear-gradient(to bottom, #FFFFFF 25%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 70%)";
const desktopTopFadeDark = "linear-gradient(to bottom, #1C1C1C 25%, rgba(28,28,28,0.7) 45%, rgba(28,28,28,0) 70%)";
const mobileCornerFadeLight = "radial-gradient(circle at top right, rgba(255,255,255,0) 30%, #FFFFFF 70%)";
const mobileCornerFadeDark = "radial-gradient(circle at top right, rgba(28,28,28,0) 30%, #1C1C1C 70%)";

export function CardIllustration({ model }: { model: CampaignModel }) {
  const { light, dark, mobile } = ILLUSTRATIONS[model];
  const isPerVideo = model === "per-video";

  const desktopStyle = isPerVideo
    ? { bottom: 0, left: 0, right: 0, width: "100%", objectFit: "contain" as const, objectPosition: "center bottom" }
    : { top: "35%", left: 0, right: 0, width: "100%", height: "75%", objectFit: "contain" as const, objectPosition: "center top" };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {/* Desktop images */}
      <img src={light} alt="" draggable={false} className={`absolute hidden select-none sm:block dark:hidden ${isPerVideo ? "mask-fade-top" : ""}`} style={desktopStyle} />
      <img src={dark} alt="" draggable={false} className={`absolute hidden select-none dark:sm:block ${isPerVideo ? "mask-fade-top" : ""}`} style={desktopStyle} />

      {/* Mobile images — top-right corner with left fade mask (hidden on sm+) */}
      <div className="absolute inset-0 sm:hidden">
        <img src={mobile || light} alt="" draggable={false} className="absolute select-none mask-fade-left dark:hidden" style={{ top: 0, right: 0, width: "65%", height: "100%", objectFit: "contain", objectPosition: "top right" }} />
        <img src={mobile || dark} alt="" draggable={false} className="absolute hidden select-none mask-fade-left dark:block" style={{ top: 0, right: 0, width: "65%", height: "100%", objectFit: "contain", objectPosition: "top right" }} />
      </div>

      {/* Desktop gradient fade */}
      <div className="absolute inset-0 hidden sm:block dark:hidden" style={{ background: desktopTopFadeLight }} />
      <div className="absolute inset-0 hidden dark:sm:block" style={{ background: desktopTopFadeDark }} />

      {/* Mobile radial gradient — fades from corner */}
      <div className="absolute inset-0 sm:hidden dark:hidden" style={{ background: mobileCornerFadeLight }} />
      <div className="absolute inset-0 hidden dark:block sm:dark:hidden" style={{ background: mobileCornerFadeDark }} />

    </div>
  );
}
