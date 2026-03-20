"use client";

import dynamic from "next/dynamic";

const AffiliateGlobeScene = dynamic(
  () => import("./AffiliateGlobeScene"),
  { ssr: false }
);

export function AffiliateNetworkSphere() {
  return (
    <section className="relative w-full overflow-hidden -mt-14" style={{ height: 772 }}>
      {/* ── gradient backdrop ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {/* main orange glow — right-biased, lower, stronger */}
        <div style={{ position: "absolute", width: 1100, height: "65%", left: "55%", top: "30%", transform: "translateX(-30%) rotate(-20deg)", background: "rgba(255,119,7,0.9)", filter: "blur(200px)", borderRadius: "50%" }} />
        {/* secondary warm wash — bottom right */}
        <div style={{ position: "absolute", width: 800, height: "50%", left: "60%", top: "45%", transform: "translateX(-20%)", background: "rgba(255,160,50,0.6)", filter: "blur(180px)", borderRadius: "50%" }} />
        {/* subtle top white wash */}
        <div style={{ position: "absolute", width: 900, height: "18%", left: "55%", top: "-5%", transform: "translateX(-40%)", background: "#FFFFFF", opacity: 0.5, filter: "blur(111px)", borderRadius: "50%" }} />
      </div>

      {/* ── 3D globe scene ── */}
      <div style={{ position: "absolute", left: "20%", right: "-15%", top: "-5%", bottom: "-10%" }}>
        <AffiliateGlobeScene />
      </div>
    </section>
  );
}
