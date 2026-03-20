"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren, useEffect, useId, useRef } from "react";
import Image from "next/image";

// ── Grid pattern ────────────────────────────────────────────────────────────

function Grid({
  cellSize = 80,
  patternOffset = [0, 0],
  className,
}: {
  cellSize?: number;
  patternOffset?: [number, number];
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 text-black/10", className)}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          x={patternOffset[0] - 1}
          y={patternOffset[1] - 1}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect fill={`url(#grid-${id})`} width="100%" height="100%" />
    </svg>
  );
}

// ── Hero gradient (from dub hero.tsx) ───────────────────────────────────────

const HERO_GRADIENT = `radial-gradient(77% 116% at 37% 67%, #EEA5BA, rgba(238, 165, 186, 0) 50%),
  radial-gradient(56% 84% at 34% 56%, #3A8BFD, rgba(58, 139, 253, 0) 50%),
  radial-gradient(85% 127% at 100% 100%, #E4C795, rgba(228, 199, 149, 0) 50%),
  radial-gradient(82% 122% at 3% 29%, #855AFC, rgba(133, 90, 252, 0) 50%),
  radial-gradient(90% 136% at 52% 100%, #FD3A4E, rgba(253, 58, 78, 0) 50%),
  radial-gradient(102% 143% at 92% 7%, #72FE7D, rgba(114, 254, 125, 0) 50%)`;

function Hero({ children }: PropsWithChildren) {
  return (
    <div className="relative mx-auto mt-4 w-full max-w-screen-lg overflow-hidden rounded-2xl bg-neutral-50 p-6 text-center sm:p-20 sm:px-0">
      <Grid
        cellSize={80}
        patternOffset={[1, -58]}
        className="inset-[unset] left-1/2 top-0 w-[1200px] -translate-x-1/2 text-neutral-300 [mask-image:linear-gradient(transparent,black_70%)]"
      />
      <div className="absolute -inset-x-10 bottom-0 h-[60%] opacity-40 blur-[100px] [transform:translate3d(0,0,0)]">
        <div
          className="size-full -scale-y-100 [mask-image:radial-gradient(closest-side,black_100%,transparent_100%)]"
          style={{ backgroundImage: HERO_GRADIENT }}
        />
      </div>
      {children}
    </div>
  );
}

// ── BubbleIcon (from dub bubble-icon.tsx) ────────────────────────────────────

function BubbleIcon({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width).toString());
      ref.current.style.setProperty("--my", ((e.clientY - rect.top) / rect.height).toString());
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-full [perspective:500px]"
      style={{
        filter: `
          drop-shadow(0 3px 6px #5242511A)
          drop-shadow(0 12px 12px #52425117)
          drop-shadow(0 26px 16px #5242510D)
          drop-shadow(0 47px 19px #52425103)
          drop-shadow(0 73px 20px #52425100)
        `,
      }}
    >
      <div
        className="relative rounded-full bg-gradient-to-b from-neutral-100 to-neutral-300 p-px transition-[transform] duration-[50ms]"
        style={{
          transform: `rotateY(clamp(-20deg, calc(var(--mx, 0.5) * 4deg), 20deg)) rotateX(clamp(-20deg, calc(var(--my, 0.5) * -4deg), 20deg))`,
        }}
      >
        <div className="flex size-[104px] items-center justify-center rounded-full bg-gradient-to-b from-white to-neutral-100">
          {children}
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#fff8]" />
        <div
          className="absolute inset-0 rounded-full opacity-70 blur-sm"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0% 100%, #ffdbe5, transparent 40%),
              radial-gradient(circle at 50% 120%, #c8cff8, transparent 30%),
              radial-gradient(circle at 100% 100%, #ccfac8, transparent 40%)
            `,
          }}
        />
      </div>
    </div>
  );
}

// ── Browser graphic (from dub browser-graphic.tsx) ──────────────────────────

function BrowserGraphic({ domain }: { domain: string }) {
  return (
    <div className="w-full p-1 [mask-image:linear-gradient(black_50%,transparent_90%)]">
      <div className="w-full rounded-t-lg border border-neutral-300 ring ring-black/5">
        <div className="flex items-center justify-between gap-4 rounded-t-[inherit] bg-white px-5 py-3">
          <div className="hidden grow basis-0 items-center gap-2 sm:flex">
            {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c) => (
              <div key={c} className={cn("size-[11px] rounded-full border border-black/10", c)} />
            ))}
          </div>
          <div className="relative min-w-0 grow truncate rounded-lg bg-[radial-gradient(60%_80%_at_50%_0%,#ddd,#f5f5f5)] px-4 py-2 text-sm font-medium leading-none">
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#0001,transparent)]" />
            {domain}
          </div>
          <div className="hidden grow basis-0 sm:block" />
        </div>
        <div className="h-12 border-t border-neutral-200 bg-neutral-100/50" />
      </div>
    </div>
  );
}

// ── Dub Logo SVG ────────────────────────────────────────────────────────────

function DubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 65 64" fill="none" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32.5 64C50.1731 64 64.5 49.6731 64.5 32C64.5 20.1555 58.0648 9.81393 48.5 4.28099V31.9999V47.9998H40.5V45.8594C38.1466 47.2207 35.4143 47.9999 32.5 47.9999C23.6634 47.9999 16.5 40.8364 16.5 31.9999C16.5 23.1633 23.6634 15.9999 32.5 15.9999C35.4143 15.9999 38.1466 16.779 40.5 18.1404V1.00812C37.943 0.350018 35.2624 0 32.5 0C14.8269 0 0.500038 14.3269 0.500038 32C0.500038 49.6731 14.8269 64 32.5 64Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Main export: Hero section ───────────────────────────────────────────────

export function TrustedBy() {
  return (
    <section>
      <Hero>
        <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
          <BubbleIcon>
            <DubLogo className="size-10 text-neutral-900" />
          </BubbleIcon>
          <div className="mt-16 w-full">
            <BrowserGraphic domain="your-brand.link" />
          </div>
          <h2
            className={cn(
              "font-display mt-2 text-center text-4xl font-medium text-neutral-900 sm:text-5xl sm:leading-[1.15]",
              "animate-slide-up-fade motion-reduce:animate-fade-in [--offset:20px] [animation-duration:1s] [animation-fill-mode:both]"
            )}
          >
            Welcome to Dub
          </h2>
          <p
            className={cn(
              "mt-5 text-balance text-base text-neutral-700 sm:text-xl",
              "animate-slide-up-fade motion-reduce:animate-fade-in [--offset:10px] [animation-delay:200ms] [animation-duration:1s] [animation-fill-mode:both]"
            )}
          >
            This custom domain is powered by Dub &ndash; the link management
            platform designed for modern marketing teams.
          </p>
        </div>

        <div
          className={cn(
            "relative mx-auto mt-8 flex max-w-fit flex-col items-center gap-4 xs:flex-row",
            "animate-slide-up-fade motion-reduce:animate-fade-in [--offset:5px] [animation-delay:300ms] [animation-duration:1s] [animation-fill-mode:both]"
          )}
        >
          <a
            href="https://app.dub.co/register"
            className="flex h-10 w-fit items-center whitespace-nowrap rounded-lg border border-black bg-black px-5 text-base text-white transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
          >
            Try Dub today
          </a>
          <a
            href="https://dub.co/links"
            className="flex h-10 w-fit items-center whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-5 text-base text-neutral-900 transition-all hover:bg-neutral-50"
          >
            Learn more
          </a>
        </div>
      </Hero>
    </section>
  );
}
