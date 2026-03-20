"use client";

import { cn } from "@/lib/utils";
import { CSSProperties, useId } from "react";
import Image from "next/image";

// ── Grid pattern (reused from dub) ─────────────────────────────────────────

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

// ── Domains graphic (from dub placeholder) ──────────────────────────────────

const DOMAINS = [
  { domain: "acme.co", clicks: "15.6K", primary: true },
  { domain: "acme.li", clicks: "3.7K" },
  { domain: "acme.me", clicks: "2.4K" },
];

function DomainsGraphic() {
  return (
    <div className="flex size-full flex-col justify-center" aria-hidden>
      <div className="flex flex-col gap-2.5 [mask-image:linear-gradient(90deg,black_70%,transparent)]">
        {DOMAINS.map(({ domain, clicks, primary }, idx) => (
          <div key={domain} className="transition-transform duration-300 hover:translate-x-[-2%]">
            <div
              className={cn(
                "flex cursor-default items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm",
                "ml-[calc((var(--idx)+1)*5%)]"
              )}
              style={{ "--idx": idx } as CSSProperties}
            >
              <div className="flex-none rounded-full border border-neutral-200 bg-gradient-to-t from-neutral-100 p-2">
                <svg className="size-6 text-neutral-700" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M10.82 2.094a2.25 2.25 0 0 1 3.086 3.086l-2.72 2.72a2.25 2.25 0 0 1-3.086 0 .75.75 0 0 0-1.06 1.06 3.75 3.75 0 0 0 5.304 0l2.72-2.72a3.75 3.75 0 0 0-5.304-5.304l-1.53 1.53a.75.75 0 0 0 1.06 1.06l1.53-1.432Z" />
                  <path d="M5.18 13.906a2.25 2.25 0 0 1-3.086-3.086l2.72-2.72a2.25 2.25 0 0 1 3.086 0 .75.75 0 0 0 1.06-1.06 3.75 3.75 0 0 0-5.304 0l-2.72 2.72a3.75 3.75 0 1 0 5.304 5.304l1.53-1.53a.75.75 0 0 0-1.06-1.06L5.18 13.906Z" />
                </svg>
              </div>
              <span className="text-base font-medium text-neutral-900">{domain}</span>
              <div className="ml-2 flex items-center gap-x-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-[0.2rem]">
                <svg className="h-4 w-4 text-neutral-700" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M9 2.25a.75.75 0 0 1 .75.75v4.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3A.75.75 0 0 1 9 2.25ZM3.75 12a.75.75 0 0 1 .75.75v1.5h9v-1.5a.75.75 0 0 1 1.5 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-1.5a.75.75 0 0 1 .75-.75Z" />
                </svg>
                <div className="flex items-center whitespace-nowrap text-sm text-neutral-500">
                  {clicks}
                  <span className="ml-1 hidden sm:inline-block">clicks</span>
                </div>
              </div>
              {primary && (
                <div className="flex items-center gap-x-1 rounded-md border border-blue-100 bg-blue-50 px-2 py-[0.2rem]">
                  <svg className="h-4 w-4 text-blue-700" viewBox="0 0 18 18" fill="currentColor">
                    <path d="M3.375 1.5A1.875 1.875 0 0 0 1.5 3.375v11.25A1.875 1.875 0 0 0 3.375 16.5h11.25A1.875 1.875 0 0 0 16.5 14.625V3.375A1.875 1.875 0 0 0 14.625 1.5H3.375ZM9 4.5a.75.75 0 0 1 .75.75v3l2.25-1.5a.75.75 0 0 1 .833 1.248L10.5 9.75l2.333 1.752a.75.75 0 0 1-.833 1.248L9.75 11.25v3a.75.75 0 0 1-1.5 0v-3L5.917 12.75a.75.75 0 0 1-.834-1.248L7.5 9.75 5.083 7.998a.75.75 0 0 1 .834-1.248L8.25 8.25v-3A.75.75 0 0 1 9 4.5Z" />
                  </svg>
                  <div className="flex items-center whitespace-nowrap text-sm text-blue-600">
                    Primary
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analytics graphic (from dub placeholder) ────────────────────────────────

function AnalyticsGraphic() {
  return (
    <div aria-hidden className="size-full select-none [mask-image:linear-gradient(black_60%,transparent)]">
      <div className="relative mx-3.5 h-full overflow-hidden rounded-t-xl border-x border-t border-neutral-200 shadow-[0_20px_20px_0_#00000017]">
        <Image
          src="https://assets.dub.co/home/analytics.png"
          alt="Analytics"
          fill
          draggable={false}
          className="object-cover object-left-top"
        />
      </div>
    </div>
  );
}

// ── Collaboration graphic (from dub placeholder) ────────────────────────────

function CollaborationGraphic() {
  return (
    <div className="size-full pt-5 [mask-image:linear-gradient(black_50%,transparent)]" aria-hidden>
      <div className="relative size-full rounded-t-2xl border-x-2 border-t-2 border-orange-600 bg-white/70">
        <div className="absolute -top-px left-1/2 flex h-7 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_4px_#EA590D80]">
          <BadgeCap />
          <div className="-mx-px flex h-full items-center bg-orange-600 px-2 font-mono text-sm tracking-wide text-white">
            SAML SSO
          </div>
          <BadgeCap className="-scale-x-100" />
        </div>
        <div className="grid grid-cols-6 gap-4 p-8">
          {Array.from({ length: 36 }).map((_, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg bg-neutral-300 transition-transform hover:scale-110 sm:rounded-xl"
              style={{
                backgroundImage: "url(https://assets.dub.co/home/people.png)",
                backgroundSize: "3600%",
                backgroundPositionX: idx * 100 + "%",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BadgeCap({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" fill="none" viewBox="0 0 28 30" className={cn("h-full text-orange-600", className)}>
      <path fill="currentColor" d="M25.658.14h5.337v29.572h-5.337a9.24 9.24 0 0 1-6.626-2.8l-4.327-4.45A26.2 26.2 0 0 0 .5 14.926a26.2 26.2 0 0 0 14.205-7.535l4.327-4.451a9.24 9.24 0 0 1 6.626-2.8" />
    </svg>
  );
}

// ── Feature card (from dub features-section.tsx) ────────────────────────────

function FeatureCard({
  title,
  description,
  linkText,
  href,
  children,
  className,
  graphicClassName,
}: {
  title: string;
  description: string;
  linkText: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  graphicClassName?: string;
}) {
  return (
    <div className={cn("relative flex flex-col gap-10 px-4 py-14 sm:px-12", className)}>
      <div
        className={cn(
          "absolute left-1/2 top-1/3 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10 blur-[50px]",
          "bg-[conic-gradient(from_270deg,#F4950C,#EB5C0C,transparent,transparent)]"
        )}
      />
      <div className={cn("relative h-64 overflow-hidden sm:h-[302px]", graphicClassName)}>
        {children}
      </div>
      <div className="relative flex flex-col">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
        <p className="mt-2 text-neutral-500">{description}</p>
        <a
          href={href}
          className={cn(
            "mt-6 w-fit whitespace-nowrap rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium leading-none text-neutral-900 transition-colors duration-75",
            "outline-none hover:bg-neutral-50 focus-visible:border-neutral-900 active:bg-neutral-100"
          )}
        >
          {linkText}
        </a>
      </div>
    </div>
  );
}

// ── Main section ────────────────────────────────────────────────────────────

export function MeasureWhatMatters() {
  return (
    <section>
      {/* Section header — "What is Dub?" pill */}
      <div className="mx-auto w-full max-w-xl px-4 text-center">
        <div className="mx-auto flex h-7 w-fit items-center rounded-full border border-neutral-200 bg-white px-4 text-xs text-neutral-800">
          What is Dub?
        </div>
        <h2 className="font-display mt-2 text-balance text-3xl font-medium text-neutral-900 sm:text-4xl">
          Powerful features for modern marketing teams
        </h2>
        <p className="mt-3 text-pretty text-lg text-neutral-500">
          Dub is more than just a link shortener. We&apos;ve built a suite of
          powerful features that gives you marketing superpowers.
        </p>
      </div>

      {/* Feature cards grid — matches dub's features-section layout */}
      <div className="mx-auto mt-14 grid w-full max-w-screen-lg grid-cols-1 px-4 sm:grid-cols-2">
        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x">
          <FeatureCard
            title="Stand out with custom domains"
            description="Create branded short links with your own domain and improve click-through rates by 30%."
            linkText="Learn more"
            href="https://dub.co/help/article/how-to-add-custom-domain"
          >
            <DomainsGraphic />
          </FeatureCard>
          <FeatureCard
            title="Branded QR codes"
            description="QR codes and short links are like peas in a pod. Dub offers free QR codes for every short link you create."
            linkText="Try the demo"
            href="https://dub.co/tools/qr-code"
          >
            {/* QR placeholder */}
            <div className="size-full [mask-image:linear-gradient(black_70%,transparent)]">
              <div className="mx-3.5 flex origin-top scale-95 cursor-default flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_20px_20px_0_#00000017]">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">QR Code Design</h3>
                </div>
                <div className="flex h-40 items-center justify-center rounded-md border border-neutral-300 bg-neutral-50">
                  <svg width="128" height="128" viewBox="0 0 29 29" className="text-neutral-900">
                    <path fill="#fff" d="M0 0h29v29H0z" />
                    <path fill="currentColor" d="M2 2h7v7H2zM20 2h7v7h-7zM2 20h7v7H2zM10 2h1v1h-1zM12 2h2v1h-2zM17 2h1v1h-1zM10 4h2v1h-2zM18 4h1v1h-1zM10 6h1v3h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1z" />
                    <rect x="4" y="4" width="3" height="3" fill="currentColor" />
                    <rect x="22" y="4" width="3" height="3" fill="currentColor" />
                    <rect x="4" y="22" width="3" height="3" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>

        {/* Full-width analytics card */}
        <FeatureCard
          className="border-y border-neutral-200 pt-12 sm:col-span-2"
          graphicClassName="sm:h-96"
          title="Analytics that matter"
          description="Dub provides powerful analytics for your links, including geolocation, device, browser, and referrer information."
          linkText="Explore analytics"
          href="https://dub.co/help/article/dub-analytics"
        >
          <AnalyticsGraphic />
        </FeatureCard>

        <div className="contents divide-neutral-200 max-sm:divide-y sm:divide-x [&>*]:border-t [&>*]:border-neutral-200">
          <FeatureCard
            title="Advanced link features"
            description="Supercharge your links with custom link previews, device targeting, geo targeting, link cloaking, password protection, and more."
            linkText="Learn more"
            href="https://dub.co/help/article/how-to-create-link"
          >
            {/* Personalization graphic placeholder */}
            <div className="size-full overflow-clip [mask-image:linear-gradient(black_70%,transparent)]" aria-hidden>
              <div className="mx-3.5 flex cursor-default flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_20px_20px_0_#00000017]">
                <h3 className="text-base font-medium">Link customization</h3>
                <div className="flex flex-col gap-2.5">
                  {["Link Preview", "UTM", "Expiration", "Targeting", "Password"].map((label, i) => (
                    <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 p-2.5">
                      <div className="flex items-center gap-2 text-neutral-800">
                        <div className="size-5 rounded bg-neutral-200" />
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <div className={cn("h-5 w-9 rounded-full", i === 2 ? "bg-neutral-200" : "bg-orange-600")} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FeatureCard>
          <FeatureCard
            title="Collaborate with your team"
            description="Invite your teammates to collaborate on your links. For enterprises, Dub offers SAML SSO with Okta, Google, and Azure AD for higher security."
            linkText="Learn more"
            href="https://dub.co/help/article/how-to-invite-teammates"
          >
            <CollaborationGraphic />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
