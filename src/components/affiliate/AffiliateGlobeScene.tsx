"use client";

import { useState, useRef, useCallback } from "react";
import {
  WireframeSphere,
  GlobeDot,
  AnimatedGlobeArc,
  GlobeOverlay,
  GlobeScene,
} from "@/components/ui/wireframe-globe";

/* ── Tooltip (sidebar-style, self-contained for globe overlays) ── */

function GlobeTooltip({ name, description, children }: {
  name: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setShow(true), 100);
  }, []);
  const onLeave = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setShow(false), 150);
  }, []);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {children}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "calc(100% + 8px)",
          transform: `translateX(-50%) translateY(${show ? "0" : "4px"})`,
          opacity: show ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.15s, transform 0.15s",
          whiteSpace: "nowrap",
        }}
      >
        <div style={{
          background: "rgba(15,15,15,0.92)",
          backdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: description ? "6px 12px" : "4px 10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{name}</span>
          {description && (
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4, marginTop: 1 }}>
              {description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const R = 100;

const WIREFRAME = {
  radius: R,
  meridianCount: 8,
  parallelCount: 8,
  wireframeColor: "#FFFFFF",
  wireframeOpacity: 1,
  meridianDashSize: 1.5,
  meridianGapSize: 3,
  parallelDashSize: 1.5,
  parallelGapSize: 3,
  lineWidth: 1.5,
  autoRotate: true,
  autoRotateSpeed: 0.4,
};

const AXIS_TILT = Math.PI / 4;

// Only dots that have an associated overlay/icon
const DOTS = [
  { lat: 40, lng: 0 },
  { lat: 30, lng: 120 },
  { lat: 10, lng: 180 },
  { lat: 45, lng: -120 },
  { lat: -10, lng: -110 },
  { lat: 20, lng: -60 },
  { lat: -35, lng: -50 },
  { lat: -15, lng: 55 },
  { lat: -35, lng: 130 },
  { lat: -40, lng: 175 },
  { lat: -45, lng: -130 },
];

const ARCS = [
  { startLat: -35, startLng: -50, endLat: 20, endLng: -15, delay: 0, color: "#FFAA33" },
  { startLat: 40, startLng: 0, endLat: 50, endLng: 150, delay: 0.5, color: "#FFAA33" },
  { startLat: 50, startLng: 60, endLat: 30, endLng: 120, delay: 1, color: "#FF8003" },
  { startLat: 30, startLng: 120, endLat: 10, endLng: 180, delay: 2, color: "#FFAA33" },
  { startLat: 10, startLng: 180, endLat: 45, endLng: -120, delay: 0.5, color: "#FF8003" },
  { startLat: 45, startLng: -120, endLat: 20, endLng: -60, delay: 1.5, color: "#FFAA33" },
  { startLat: 20, startLng: -60, endLat: 40, endLng: 0, delay: 3, color: "#FF8003" },
  { startLat: 30, startLng: 120, endLat: -10, endLng: -110, delay: 1.8, color: "#FFAA33" },
  { startLat: -10, startLng: -110, endLat: -35, endLng: -50, delay: 2.5, color: "#FF8003" },
  { startLat: -25, startLng: 10, endLat: -15, endLng: 55, delay: 0.3, color: "#FFAA33" },
  { startLat: -35, startLng: 130, endLat: -40, endLng: 175, delay: 1.2, color: "#FF8003" },
  { startLat: 55, startLng: -55, endLat: 40, endLng: 0, delay: 2.2, color: "#FFAA33" },
  { startLat: -45, startLng: -130, endLat: -35, endLng: -50, delay: 3.2, color: "#FF8003" },
  { startLat: -15, startLng: 55, endLat: -35, endLng: 130, delay: 0.8, color: "#FFAA33" },
  { startLat: 50, startLng: 60, endLat: -25, endLng: 10, delay: 1.6, color: "#FF8003" },
];

/* ── Card styles ───────────────────────────────────────────────────── */

const bubbleStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
  border: "0.565px solid rgba(255,255,255,0.9)",
  boxShadow: "0px 12px 12px rgba(255,128,3,0.1), 0px 3px 7px rgba(255,128,3,0.12), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(255,255,255,0.3)",
  backdropFilter: "blur(12px) saturate(1.4)",
  WebkitBackdropFilter: "blur(12px) saturate(1.4)",
  borderRadius: "16px 16px 16px 2px",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(37,37,37,0.7)",
  whiteSpace: "nowrap" as const,
};

const badgeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "0 8px",
  height: 24,
  background: "rgba(254,248,228,0.75)",
  border: "0.5px solid rgba(255,255,255,0.8)",
  boxShadow: "2px 1px 5px rgba(0,0,0,0.08)",
  backdropFilter: "blur(12px) saturate(1.4)",
  WebkitBackdropFilter: "blur(12px) saturate(1.4)",
  borderRadius: 44,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "#FF8003",
  whiteSpace: "nowrap" as const,
};

const squareCardStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 4,
  background: "radial-gradient(48.86% 30.62% at 51.14% 96.87%, rgba(255,126,0,0.23) 0%, rgba(255,126,0,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.82) 12.5%, rgba(255,255,255,0.5) 68.75%), rgba(234,232,230,0.6)",
  boxShadow: "0px 4px 4px rgba(0,0,0,0.07), 0px 1px 2px rgba(0,0,0,0.08), inset 0px 2px 0px rgba(255,255,255,0.9), inset 0px -2px 0px rgba(255,255,255,0.5)",
  backdropFilter: "blur(12px) saturate(1.4)",
  WebkitBackdropFilter: "blur(12px) saturate(1.4)",
  borderRadius: 12,
};

const nameCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "rgba(255,255,255,0.78)",
  boxShadow: "7px 6px 9px rgba(0,0,0,0.07), 2px 1px 5px rgba(0,0,0,0.08)",
  backdropFilter: "blur(12px) saturate(1.4)",
  WebkitBackdropFilter: "blur(12px) saturate(1.4)",
  borderRadius: 16,
  padding: "8px 14px 8px 8px",
  whiteSpace: "nowrap" as const,
};

/* ── Main scene ────────────────────────────────────────────────────── */

export default function AffiliateGlobeScene() {
  return (
    <GlobeScene config={WIREFRAME} cameraZ={310} tilt={AXIS_TILT}>
      {DOTS.map((d, i) => (
        <GlobeDot key={`dot-${i}`} lat={d.lat} lng={d.lng} radius={R} />
      ))}

      {ARCS.map((a, i) => (
        <AnimatedGlobeArc
          key={`arc-${i}`}
          startLat={a.startLat}
          startLng={a.startLng}
          endLat={a.endLat}
          endLng={a.endLng}
          radius={R}
          arcHeight={0.15}
          color={a.color}
          delay={a.delay}
        />
      ))}

      {/* lng ~0° — brand + badge */}
      <GlobeOverlay lat={40} lng={0} radius={R} offsetY={8}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={bubbleStyle}>Just made my first $1k!</div>
          <GlobeTooltip name="Maya Chen" description="Lifestyle creator · 42k followers">
            <div style={squareCardStyle}>
              <img src="/creators/CreatorFace1.avif" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
            </div>
          </GlobeTooltip>
        </div>
      </GlobeOverlay>

      <GlobeOverlay lat={-25} lng={10} radius={R}>
        <div style={badgeStyle}>$800</div>
      </GlobeOverlay>

      <GlobeOverlay lat={20} lng={-15} radius={R}>
        <GlobeTooltip name="Glossier" description="Beauty brand powered by community">
          <div style={squareCardStyle}>
            <img src="/logos/brand6.png" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
          </div>
        </GlobeTooltip>
      </GlobeOverlay>

      {/* lng ~60° */}
      <GlobeOverlay lat={50} lng={150} radius={R} offsetY={6}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={bubbleStyle}>New campaign!</div>
          <GlobeTooltip name="Nike" description="Global sportswear leader">
            <div style={squareCardStyle}>
              <img src="/logos/brand1.png" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
            </div>
          </GlobeTooltip>
        </div>
      </GlobeOverlay>

      <GlobeOverlay lat={-15} lng={55} radius={R}>
        <div style={{ ...nameCardStyle, flexShrink: 0, minWidth: 150 }}>
          <img src="/creators/CreatorFace2.avif" alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#252525", lineHeight: 1.2 }}>Ethan Cole</div>
            <div style={{ fontSize: 10, color: "rgba(37,37,37,0.5)", lineHeight: 1.2 }}>@ethancole</div>
          </div>
        </div>
      </GlobeOverlay>

      {/* lng ~120° */}
      <GlobeOverlay lat={30} lng={120} radius={R} offsetY={6}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={bubbleStyle}>Collab sent!</div>
          <GlobeTooltip name="Gymshark" description="Fitness apparel & accessories">
            <div style={squareCardStyle}>
              <img src="/logos/brand2.png" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
            </div>
          </GlobeTooltip>
        </div>
      </GlobeOverlay>

      <GlobeOverlay lat={-35} lng={130} radius={R}>
        <div style={badgeStyle}>$2.4k</div>
      </GlobeOverlay>

      {/* lng ~180° */}
      <GlobeOverlay lat={10} lng={180} radius={R} offsetY={6}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={bubbleStyle}>Who's ready?</div>
          <GlobeTooltip name="Fenty Beauty" description="Inclusive beauty by Rihanna">
            <div style={squareCardStyle}>
              <img src="/logos/brand3.png" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
            </div>
          </GlobeTooltip>
        </div>
      </GlobeOverlay>

      <GlobeOverlay lat={-40} lng={175} radius={R}>
        <GlobeTooltip name="Lina Park" description="Tech reviewer · 89k subs">
          <div style={squareCardStyle}>
            <img src="/creators/CreatorFace3.avif" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
          </div>
        </GlobeTooltip>
      </GlobeOverlay>

      {/* lng ~-120° */}
      <GlobeOverlay lat={45} lng={-120} radius={R}>
        <GlobeTooltip name="Athletic Greens" description="Daily nutrition simplified">
          <div style={squareCardStyle}>
            <img src="/logos/brand4.png" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
          </div>
        </GlobeTooltip>
      </GlobeOverlay>

      <GlobeOverlay lat={-10} lng={-110} radius={R} offsetY={6}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={bubbleStyle}>Let's go!</div>
          <div style={squareCardStyle}>
            <img src="/creators/CreatorFace4.avif" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
          </div>
        </div>
      </GlobeOverlay>

      <GlobeOverlay lat={-45} lng={-130} radius={R}>
        <div style={badgeStyle}>$1.8k</div>
      </GlobeOverlay>

      {/* lng ~-60° */}
      <GlobeOverlay lat={20} lng={-60} radius={R}>
        <GlobeTooltip name="Allbirds" description="Sustainable footwear & apparel">
          <div style={squareCardStyle}>
            <img src="/logos/brand5.png" alt="" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "cover" }} />
          </div>
        </GlobeTooltip>
      </GlobeOverlay>

      <GlobeOverlay lat={-35} lng={-50} radius={R}>
        <div style={{ ...nameCardStyle, flexShrink: 0, minWidth: 160 }}>
          <img src="/creators/Sofia.png" alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#252525", lineHeight: 1.2 }}>Sofia Reyes</div>
            <div style={{ fontSize: 10, color: "rgba(37,37,37,0.5)", lineHeight: 1.2 }}>@sofiareyes</div>
          </div>
        </div>
      </GlobeOverlay>

      <GlobeOverlay lat={55} lng={-55} radius={R}>
        <div style={badgeStyle}>$970</div>
      </GlobeOverlay>
    </GlobeScene>
  );
}
