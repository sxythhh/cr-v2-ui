"use client";

import Image from "next/image";

const BRAND_LOGOS = [
  "/logos/brand1.png",
  "/logos/brand2.png",
  "/logos/brand3.png",
  "/logos/brand4.png",
  "/logos/brand5.png",
  "/logos/brand6.png",
  "/logos/brand7.jpeg",
  "/logos/brand10.png",
];

const CREATOR_FACES = [
  "/creators/CreatorFace1.avif",
  "/creators/CreatorFace2.avif",
  "/creators/CreatorFace3.avif",
  "/creators/CreatorFace4.avif",
];

function seededImage(images: string[], row: number, col: number) {
  return images[(row * 7 + col * 3) % images.length];
}

export const COLS = 20;
export const GAP = 12;
const CELL = 60;
const ROW_SPEEDS = [50, 65, 45, 60, 48, 55];

export function CarouselRow({ ri, dk }: { ri: number; dk: boolean }) {
  const duration = ROW_SPEEDS[ri % ROW_SPEEDS.length];
  const reverse = ri % 2 === 1;
  const totalWidth = COLS * (CELL + GAP);

  const cells = Array.from({ length: COLS }, (_, ci) => {
    const isBrand = (ri + ci) % 3 !== 0;
    const img = isBrand
      ? seededImage(BRAND_LOGOS, ri, ci)
      : seededImage(CREATOR_FACES, ri, ci);

    if (isBrand) {
      return (
        <div key={ci} className="shrink-0 rounded-[16px] relative overflow-hidden" style={{
          width: CELL, height: CELL,
          backgroundColor: dk ? "#1e1e1e" : "#ffffff",
          border: `1px solid ${dk ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)"}`,
          boxShadow: dk
            ? "0 2px 8px rgba(0,0,0,.5)"
            : "0px 4px 4px rgba(0,0,0,.05), 0px 2px 2px rgba(0,0,0,.1)",
          willChange: "transform",
          transform: "translateZ(0)",
        }}>
          <div className="absolute inset-[5px] overflow-hidden rounded-[10px]">
            <div className="relative w-full h-full">
              <Image src={img} alt="" fill className="object-cover" draggable={false} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={ci} className="shrink-0 rounded-[12px] relative flex items-center justify-center" style={{
        width: CELL, height: CELL,
        background: "radial-gradient(48.86% 30.62% at 51.14% 96.87%, rgba(255,126,0,0.23) 0%, rgba(255,126,0,0) 100%), linear-gradient(180deg, #FFFFFF 12.5%, rgba(255,255,255,0.01) 68.75%), #EAE8E6",
        willChange: "transform",
        transform: "translateZ(0)",
      }}>
        <div className="rounded-full overflow-hidden relative" style={{
          width: 40, height: 40,
        }}>
          <Image src={img} alt="" fill className="object-cover" draggable={false} />
        </div>
      </div>
    );
  });

  return (
    <div className="flex overflow-visible" style={{ gap: GAP, padding: "4px 0" }}>
      <div
        className="flex shrink-0"
        style={{
          gap: GAP,
          animation: `${reverse ? "carousel-right" : "carousel-left"} ${duration}s linear infinite`,
          width: totalWidth,
        }}
      >
        {cells}
      </div>
      <div
        className="flex shrink-0"
        style={{
          gap: GAP,
          animation: `${reverse ? "carousel-right" : "carousel-left"} ${duration}s linear infinite`,
          width: totalWidth,
        }}
      >
        {cells}
      </div>
    </div>
  );
}
