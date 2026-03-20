"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

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

// ── Logos (from dub logos.tsx) ───────────────────────────────────────────────

const logos = [
  "cal",
  "framer",
  "twilio",
  "hubermanlab",
  "vercel",
  "perplexity",
  "raycast",
  "clerk",
  "whop",
  "viator",
  "sketch",
  "supabase",
  "hashnode",
];

function LogoCarousel() {
  return (
    <div className="group relative mx-auto block w-full max-w-screen-lg overflow-hidden">
      <p className="mx-auto max-w-sm text-balance text-center text-sm text-slate-500 transition-[filter,opacity] duration-300 group-hover:opacity-30 group-hover:blur-sm sm:max-w-xl">
        Giving marketing superpowers to world-class companies
      </p>
      <div className="relative flex w-full items-center overflow-hidden px-5 pb-8 pt-8 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] md:px-0">
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className={cn(
              "flex w-max min-w-max items-center gap-5 pl-5",
              "motion-safe:animate-[scroll_40s_linear_infinite]",
              "transition-[filter,opacity] duration-300 group-hover:opacity-30 group-hover:blur-sm"
            )}
            aria-hidden={idx !== 0}
          >
            {logos.map((logo) => (
              <img
                key={logo}
                src={`https://assets.dub.co/clients/${logo}.svg`}
                alt={logo.toUpperCase()}
                width={520}
                height={182}
                draggable={false}
                className={cn(
                  "h-12 w-auto",
                  logo === "cal" && "-mx-5 h-14",
                  logo === "viator" && "h-11",
                  logo === "perplexity" && "h-14",
                  logo === "hubermanlab" && "h-14"
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center text-sm font-medium text-slate-900">
          See more of our fantastic customers
          <svg className="ml-1 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

// ── CTA section (from dub cta.tsx) ──────────────────────────────────────────

export function ConnectTools() {
  const ratings = [
    { name: "G2", logo: "https://assets.dub.co/companies/g2.svg", stars: 5 },
    { name: "Product Hunt", logo: "https://assets.dub.co/companies/product-hunt-logo.svg", stars: 5 },
    { name: "Trustpilot", logo: "https://assets.dub.co/companies/trustpilot.svg", stars: 4.5 },
  ];

  return (
    <section
      className={cn(
        "relative mx-auto mb-20 mt-12 w-full max-w-screen-lg overflow-hidden rounded-2xl bg-neutral-50 px-6 pb-16 pt-10 text-center sm:mt-0 sm:px-12"
      )}
    >
      <Grid
        cellSize={80}
        patternOffset={[1, -20]}
        className="inset-[unset] left-1/2 top-0 w-[1200px] -translate-x-1/2 text-neutral-200 [mask-image:linear-gradient(black_50%,transparent)]"
      />
      <div className="absolute -left-1/4 -top-1/2 h-[135%] w-[150%] opacity-5 blur-[130px] [transform:translate3d(0,0,0)]">
        <div className="size-full bg-[conic-gradient(from_-66deg,#855AFC_-32deg,#f00_63deg,#EAB308_158deg,#5CFF80_240deg,#855AFC_328deg,#f00_423deg)] [mask-image:radial-gradient(closest-side,black_100%,transparent_100%)]" />
      </div>

      {/* Ratings */}
      <div className="relative mx-auto my-8 flex w-fit gap-8">
        {ratings.map(({ name, logo, stars }) => (
          <div key={name} className="flex flex-col items-center">
            <img src={logo} alt={name} className="size-6" />
            <div className="mt-4 flex items-center gap-1.5">
              {[...Array(Math.floor(stars))].map((_, i) => (
                <svg key={i} className="size-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              {stars % 1 > 0 && (
                <svg className="size-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <defs>
                    <linearGradient id="half-star">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-star)" stroke="currentColor" strokeWidth={1} />
                </svg>
              )}
            </div>
            <p className="mt-2 text-xs text-neutral-500">{stars} out of 5</p>
          </div>
        ))}
      </div>

      {/* Heading */}
      <div className="relative mx-auto mt-1.5 flex w-full max-w-xl flex-col items-center">
        <h2 className="font-display text-balance text-4xl font-medium text-neutral-900 sm:text-[2.5rem] sm:leading-[1.15]">
          Supercharge your marketing efforts
        </h2>
        <p className="mt-5 text-balance text-base text-neutral-500 sm:text-xl">
          See why Dub is the link management platform of choice for modern
          marketing teams.
        </p>
      </div>

      {/* CTA buttons */}
      <div className="relative mx-auto mt-10 flex max-w-fit space-x-4">
        <a
          href="https://app.dub.co/register"
          className="flex h-10 w-fit items-center whitespace-nowrap rounded-lg border border-black bg-black px-5 text-base text-white transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
        >
          Start for free
        </a>
        <a
          href="https://dub.co/enterprise"
          className="flex h-10 w-fit items-center whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-5 text-base text-neutral-900 transition-all hover:bg-neutral-50"
        >
          Get a demo
        </a>
      </div>

      {/* Logo carousel */}
      <div className="relative mt-8">
        <LogoCarousel />
      </div>
    </section>
  );
}
