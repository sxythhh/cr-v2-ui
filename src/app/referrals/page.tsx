"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/page-shell";

const REFERRAL_BASE = "contentrewards.com/i/";
const DEFAULT_TAG = "virality";
const REFERRAL_LINK = `${REFERRAL_BASE}${DEFAULT_TAG}`;
const REFERRAL_MESSAGE = `Hey, we've been using Content Rewards for our creator campaigns. If you want to check it out, here's my link to get 10% off your first year: ${REFERRAL_LINK}`;

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

/* ═══════════════════════════════════════════════════════════════════
   Capital Landing (pre-referral terms acceptance)
   ═══════════════════════════════════════════════════════════════════ */

const SLOT_CHARS = ["$", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function DigitTile({ char, blurred = false, spinning = false, delay = 0 }: { char: string; blurred?: boolean; spinning?: boolean; delay?: number }) {
  if (char === ",") {
    return <span className="text-[14px] font-semibold leading-5 text-[#32312C]">,</span>;
  }
  return (
    <div
      className="size-8 overflow-hidden rounded-md"
      style={{
        background: "radial-gradient(97.92% 97.92% at 50% 2.08%, rgba(71,71,71,0.1) 0%, rgba(71,71,71,0) 100%), rgba(242,242,242,0.2)",
        border: "1px solid #E4E2DC",
        borderTop: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0px 1px 0px 0px rgba(0,0,0,0.06) inset, 0px 1px 2px 0px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className={cn("flex flex-col items-center", spinning && "animate-[slot-spin_0.6s_ease-in-out]")}
        style={spinning ? { animationDelay: `${delay}ms` } : undefined}
      >
        {spinning ? (
          <>
            {SLOT_CHARS.map((c) => (
              <span key={c} className={cn("flex size-8 shrink-0 items-center justify-center text-[14px] font-semibold leading-5 text-[#6D685F]", blurred && "blur-[1.25px]")}>{c}</span>
            ))}
            <span className={cn("flex size-8 shrink-0 items-center justify-center text-[14px] font-semibold leading-5 text-[#6D685F]", blurred && "blur-[1.25px]")}>{char}</span>
          </>
        ) : (
          <span className={cn("flex size-8 shrink-0 items-center justify-center text-[14px] font-semibold leading-5 text-[#6D685F]", blurred && "blur-[1.25px]")}>{char}</span>
        )}
      </div>
    </div>
  );
}

function SlotRow() {
  const [spinning, setSpinning] = useState(false);

  return (
    <div
      className="mt-2 flex cursor-pointer items-end justify-center gap-1"
      onMouseEnter={() => { setSpinning(true); setTimeout(() => setSpinning(false), 1200); }}
    >
      <DigitTile char="$" blurred spinning={spinning} delay={0} />
      <DigitTile char="$" blurred spinning={spinning} delay={80} />
      <DigitTile char="$" blurred spinning={spinning} delay={160} />
      <span className="text-[14px] font-semibold leading-5 text-[#32312C]">,</span>
      <DigitTile char="0" spinning={spinning} delay={240} />
      <DigitTile char="0" spinning={spinning} delay={320} />
      <DigitTile char="0" spinning={spinning} delay={400} />
    </div>
  );
}

function FloatingCard({ children, className, style, delay = 0 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
  return (
    <div
      className={cn("capital-float-card absolute rounded-lg border border-[#E4E2DC] bg-white backdrop-blur-[4px] animate-[capital-float_6s_ease-in-out_infinite]", className)}
      style={{ boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)", animationDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

function FadeDivider() {
  return (
    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, #F9F8F7 0%, rgba(249,248,247,0.3) 50%, #F9F8F7 100%)" }} />
  );
}

function SlashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1.9 1.4h12.2c.2 0 .4.1.5.3l-6.1 5.8c-.3.3-.7.3-1 0L1.4 1.7c.1-.2.3-.3.5-.3Z" fill="#32312C" />
      <path d="M.4 12.4V3.6c0-.3.2-.5.4-.5h14.4c.2 0 .4.2.4.5v8.8c0 .3-.2.6-.4.6H.8c-.2 0-.4-.3-.4-.6Z" fill="none" stroke="#32312C" strokeWidth="1.2" />
    </svg>
  );
}

function CapitalLanding({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="flex h-full items-center justify-center bg-page-bg font-inter tracking-[-0.02em]">
      <style>{`
        @keyframes capital-float {
          0%, 100% { transform: translateY(var(--float-y, 0px)); }
          50% { transform: translateY(calc(var(--float-y, 0px) - 8px)); }
        }
        @keyframes slot-spin {
          0% { transform: translateY(0); }
          80% { transform: translateY(calc(-32px * 11)); }
          90% { transform: translateY(calc(-32px * 11 + 4px)); }
          100% { transform: translateY(calc(-32px * 11)); }
        }
        .capital-float-card {
          --float-y: 0px;
          transition: --float-y 0.6s ease, box-shadow 0.6s ease;
        }
        .capital-float-card:hover {
          --float-y: -6px;
          box-shadow: 0px 12px 20px -4px rgba(0,0,0,0.1), 0px 6px 10px -4px rgba(0,0,0,0.06) !important;
        }
        @property --float-y {
          syntax: '<length>';
          inherits: false;
          initial-value: 0px;
        }
      `}</style>
      <div className="flex max-w-[896px] flex-col items-center gap-16 px-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-[24px] font-semibold leading-7 tracking-[-0.15px] text-[#000] dark:text-page-text">
            Fast funding for your business
          </h2>
          <p className="max-w-[576px] text-center text-[14px] font-medium leading-5 text-[#333] dark:text-page-text-muted">
            Fund your growth with up to $5M in as little as 24 hours. Apply in minutes and unlock your business&apos; potential.
          </p>
        </div>

        {/* Illustration area */}
        <div className="flex w-full flex-col items-center">
          <div className="relative mx-auto mb-8 h-[400px] w-full max-w-[848px]">
            {/* Central card */}
            <div
              className="absolute left-1/2 top-1/2 flex h-[256px] w-[472px] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-hidden rounded-[10px] border border-[#E4E2DC] bg-white"
              style={{ boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)" }}
            >
              {/* Stars icon */}
              <div className="mb-1 mt-3">
                <svg width="46" height="52" viewBox="0 0 35 40" fill="none">
                  <g filter="url(#filter0_i_star)">
                    <path d="M3.644 13.142c.108.013.215-.037.274-.13l1.942-3.023c.14-.219.474-.153.522.103l.696 3.7c.019.1.088.183.183.218l3.233 1.191c.222.082.256.384.058.514l-2.961 1.938a.363.363 0 0 0-.15.243l-.002 3.814c0 .258-.31.387-.49.203l-2.45-2.495a.352.352 0 0 0-.302-.068L1.063 20.509c-.232.085-.455-.146-.364-.378l1.388-3.534a.356.356 0 0 0-.026-.263L.047 13.192c-.132-.205.033-.473.274-.444l3.323.394Z" fill="url(#star-grad)" />
                    <path d="M2.013 30.284a.269.269 0 0 0 .036-.324l-1.277-2.438c-.117-.224.087-.481.329-.414l3.152.869a.355.355 0 0 0 .249-.048l2.497-1.908c.189-.144.459-.009.459.23l.001 2.742a.356.356 0 0 0 .161.252l2.728 1.339c.238.117.206.468-.05.539l-3.03.838a.348.348 0 0 0-.202.208l-.684 2.727c-.057.227-.343.295-.495.118l-1.971-2.303a.347.347 0 0 0-.242-.091l-3.256.289c-.256.023-.41-.28-.242-.476l1.836-2.148Z" fill="url(#star-grad)" />
                    <path d="M16.259 38.234a.27.27 0 0 0-.228-.152l-1.973-.177c-.261-.023-.356-.359-.147-.518l1.398-1.069a.272.272 0 0 0 .105-.3l-.401-1.603c-.06-.238.183-.438.403-.331l1.82.89a.272.272 0 0 0 .25 0l1.82-.89c.22-.107.463.093.403.331l-.401 1.602a.272.272 0 0 0 .105.301l1.399 1.069c.209.16.114.495-.148.518l-1.973.177a.27.27 0 0 0-.228.152l-.848 1.612c-.108.205-.419.205-.527 0l-.848-1.612Z" fill="url(#star-grad)" />
                    <path d="M30.311 32.624a.353.353 0 0 0-.26.116l-1.606 2.19c-.147.2-.458.132-.513-.111l-.568-2.642a.35.35 0 0 0-.193-.214l-2.583-.832c-.238-.077-.271-.402-.054-.527l2.35-1.346a.356.356 0 0 0 .145-.254l.001-2.695c0-.249.291-.382.476-.217l2.032 1.812a.352.352 0 0 0 .277.06l2.597-.835c.236-.076.45.167.348.395l-1.103 2.456a.358.358 0 0 0 .031.291l1.593 2.174c.148.202-.012.485-.26.46l-2.71-.281Z" fill="url(#star-grad)" />
                    <path d="M32.94 16.333a.356.356 0 0 1-.026.263l1.388 3.534c.091.232-.131.463-.364.378l-3.154-1.158a.352.352 0 0 0-.302.068l-2.449 2.495c-.18.183-.49.054-.49-.204l-.002-3.814a.363.363 0 0 0-.15-.243l-2.961-1.938c-.198-.13-.164-.432.058-.514l3.233-1.191a.347.347 0 0 0 .183-.218l.696-3.7c.048-.257.382-.323.522-.104l1.942 3.024c.059.092.166.143.274.13l3.323-.394c.241-.029.407.24.274.444l-2.014 3.142Z" fill="url(#star-grad)" />
                    <path d="M19.779 4.485a.27.27 0 0 0 .23.164l4.905.494c.251.025.35.342.158.508l-3.64 3.127a.272.272 0 0 0-.069.284l1.02 4.586c.054.242-.197.437-.417.33l-4.303-2.367a.272.272 0 0 0-.275 0l-4.303 2.367c-.22.107-.471-.088-.417-.33l1.02-4.586a.272.272 0 0 0-.069-.284L9.929 5.651c-.192-.166-.092-.483.158-.508l4.905-.494a.27.27 0 0 0 .23-.164l2.02-4.319c.103-.221.415-.221.518 0l2.02 4.319Z" fill="url(#star-grad)" />
                  </g>
                  <defs>
                    <filter id="filter0_i_star" x="0" y="0" width="35" height="40.36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="bg" />
                      <feBlend in="SourceGraphic" in2="bg" result="shape" />
                      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="ha" />
                      <feOffset dy="0.719" />
                      <feGaussianBlur stdDeviation="0.18" />
                      <feComposite in2="ha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
                      <feBlend in2="shape" />
                    </filter>
                    <linearGradient id="star-grad" x1="17.45" y1="0" x2="17.43" y2="44.85" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#F5D060" />
                      <stop offset="1" stopColor="#D4890A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Dollar tiles — slot machine on hover */}
              <SlotRow />
              <p className="mt-4 text-[14px] font-semibold leading-5 text-[#6D685F]">Sign up to see your credit limit</p>

              {/* Chart */}
              <div className="absolute bottom-0 left-0 right-0 h-[98px]">
                <svg viewBox="0 0 480 98" fill="none" className="absolute bottom-0 h-full w-full" preserveAspectRatio="none">
                  <clipPath id="chart-clip"><rect width="480" height="103" y="-5" /></clipPath>
                  <g clipPath="url(#chart-clip)">
                    <path d="M0.004 96.213L21.642 87.419C22.112 87.228 22.644 87.208 23.13 87.363L27.676 88.815C28.315 89.02 29.021 88.918 29.562 88.546L70.088 60.61C71.146 59.881 72.666 60.259 73.18 61.38L78.403 72.751C78.873 73.774 80.201 74.198 81.258 73.662L94.695 66.848C95.413 66.484 96.298 66.552 96.94 67.021L99.482 68.877C100.483 69.608 101.961 69.318 102.55 68.274L110.755 53.756C111.271 52.843 112.491 52.485 113.487 52.954L132.494 61.918C133.282 62.29 134.242 62.149 134.866 61.569L142.513 54.462L153.318 46.243C153.491 46.112 153.685 46.008 153.893 45.935L170.196 40.253C170.69 40.081 171.093 39.738 171.318 39.298L174.64 32.786C174.821 32.432 175.119 32.138 175.491 31.947L205.493 16.545C205.659 16.46 205.838 16.396 206.024 16.356L225.451 12.219C225.99 12.104 226.555 12.196 227.019 12.474L247.219 24.585C247.492 24.748 247.797 24.848 248.12 24.88C257.791 25.826 274.116 29.003 276.567 29.486C276.782 29.528 276.967 29.595 277.155 29.698C279.062 30.738 290.335 36.874 295.947 39.646C296.393 39.867 296.91 39.919 297.401 39.802L339.577 29.675C339.926 29.591 340.292 29.594 340.64 29.684L365.606 36.13C365.988 36.228 366.395 36.222 366.773 36.11L422.084 19.85C422.235 19.805 422.389 19.778 422.547 19.766L450.132 17.808C450.543 17.779 450.936 17.635 451.257 17.395L480 -4.063V98H0.004V96.213Z" fill="url(#chart-gradient)" />
                    <path d="M0.004 96.213L21.642 87.419C22.112 87.228 22.644 87.208 23.13 87.363L27.676 88.815C28.315 89.02 29.021 88.918 29.562 88.546L70.088 60.61C71.146 59.881 72.666 60.259 73.18 61.38L78.403 72.751C78.873 73.774 80.201 74.198 81.258 73.662L94.695 66.848C95.413 66.484 96.298 66.552 96.94 67.021L99.482 68.877C100.483 69.608 101.961 69.318 102.55 68.274L110.755 53.756C111.271 52.843 112.491 52.485 113.487 52.954L132.494 61.918C133.282 62.29 134.242 62.149 134.866 61.569L142.513 54.462L153.318 46.243C153.491 46.112 153.685 46.008 153.893 45.935L170.196 40.253C170.69 40.081 171.093 39.738 171.318 39.298L174.64 32.786C174.821 32.432 175.119 32.138 175.491 31.947L205.493 16.545C205.659 16.46 205.838 16.396 206.024 16.356L225.451 12.219C225.99 12.104 226.555 12.196 227.019 12.474L247.219 24.585C247.492 24.748 247.797 24.848 248.12 24.88C257.791 25.826 274.116 29.003 276.567 29.486C276.782 29.528 276.967 29.595 277.155 29.698C279.062 30.738 290.335 36.874 295.947 39.646C296.393 39.867 296.91 39.919 297.401 39.802L339.577 29.675C339.926 29.591 340.292 29.594 340.64 29.684L365.606 36.13C365.988 36.228 366.395 36.222 366.773 36.11L422.084 19.85C422.235 19.805 422.389 19.778 422.547 19.766L450.132 17.808C450.543 17.779 450.936 17.635 451.257 17.395L480 -4.063" stroke="#FF9500" strokeWidth="1.72" strokeLinecap="round" fill="none" />
                  </g>
                  <defs>
                    <linearGradient id="chart-gradient" x1="240" y1="-5" x2="240" y2="96.127" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FFC107" stopOpacity="0.1" />
                      <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Floating: active credit line — top-right */}
            <FloatingCard className="p-3" delay={0} style={{ right: "-12%", top: "calc(50% - 150px)", minWidth: 320 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[13px] font-medium text-[#6D685F]">Active credit line</span>
                </div>
                <FadeDivider />
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold tracking-[-0.02em] text-[#32312C]">$75,000.00</span>
                  <span className="text-[13px] font-medium tracking-[-0.02em] text-[#5E5E5E]">Feb 10, 2025 - Jul 10, 2025</span>
                </div>
              </div>
            </FloatingCard>

            {/* Floating: Slash Financial — bottom-left */}
            <FloatingCard className="p-3" delay={2} style={{ left: "-15%", top: "calc(50% + 50px)", minWidth: 300 }}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <SlashIcon />
                  <span className="text-[14px] font-semibold text-[#32312C]">Slash Financial</span>
                </div>
                <span className="text-[13px] font-medium tracking-[0.15px] text-[#6D685F]">Interest 2.47%</span>
                <FadeDivider />
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#32312C]">$250,000.00</span>
                  <span className="text-[13px] font-medium tracking-[0.15px] text-[#6D685F]">Mar 5, 2025 - May 4, 2025</span>
                </div>
              </div>
            </FloatingCard>

            {/* Floating: approval — bottom-right, overlapping central card */}
            <FloatingCard className="flex items-center gap-2 p-3" delay={4} style={{ right: "0%", top: "calc(50% + 100px)" }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/10">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="max-w-[224px] text-[14px] font-medium leading-5 tracking-[-0.02em] text-[#32312C]">Your funding request for <span className="text-[#BDA011]">$250,000</span> has been approved.</p>
            </FloatingCard>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onAccept}
              className="flex h-10 cursor-pointer items-center justify-center rounded-lg px-3 text-[14px] font-semibold tracking-[-0.02em] text-[#FCFCFB] transition-opacity hover:opacity-90"
              style={{
                background: "#BDA011",
                borderTop: "1px solid #E6C000",
                boxShadow: "inset 0px 1.3px 2px 1px rgba(255,255,255,0.25), inset 0px -2px 2px 1px rgba(0,0,0,0.22)",
              }}
            >
              Open capital account
            </button>
            <span className="text-[14px] font-medium leading-5 text-[#958F82]">You will be redirected to Slope</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { num: "1", title: "Invite your friends", desc: "Share your unique referral link or code with brands you think would benefit from Content Rewards." },
  { num: "2", title: "User signs up & activates an account", desc: "Your friend signs up using your link or enters your code during signup." },
  { num: "3", title: "Get your reward", desc: "Earn up to 0.10% of their spend within the first 12 months of them joining." },
];

const REFERRED: { entity: string; name: string; email: string; signedUp: string }[] = [];

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M11 5V4C11 3.448 10.552 3 10 3H4C3.448 3 3 3.448 3 4V10C3 10.552 3.448 11 4 11H5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M8.75 2.25C9.082 1.919 9.531 1.733 10 1.733c.469 0 .918.186 1.25.517.69.69.69 1.81 0 2.5L4.25 11.75H1.75v-2.5l7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 11.75h3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function ReferralsPage() {
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState<"link" | "message" | null>(null);
  const [editingLink, setEditingLink] = useState(false);
  const [tag, setTag] = useState(DEFAULT_TAG);
  const [savedToast, setSavedToast] = useState(false);

  if (!accepted) {
    return <CapitalLanding onAccept={() => setAccepted(true)} />;
  }

  const fullLink = `${REFERRAL_BASE}${tag}`;

  const saveTag = () => {
    setEditingLink(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const copyToClipboard = (text: string, type: "link" | "message") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <PageShell title="Referrals">
      <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 px-4 py-6 font-inter tracking-[-0.02em] sm:px-5">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-inter text-[22px] font-semibold leading-[28px] tracking-[-0.44px] text-page-text">
            Referrals
          </h1>
          <p className="font-inter text-[14px] font-medium leading-[20px] tracking-[-0.14px] text-page-text-muted">
            Invite brands to Content Rewards and earn commission on their creator spend.
          </p>
        </div>

        {/* How it works — 3 steps */}
        <div className={cn(cardCls, "relative overflow-hidden p-4")}>
          {/* Subtle gradient blobs */}
          <div className="pointer-events-none absolute left-[15%] top-[-40px] h-[200px] w-[100px] rotate-[75deg] rounded-full bg-[#AAD2F7] opacity-[0.06] blur-[12px]" />
          <div className="pointer-events-none absolute left-[45%] top-[60px] h-[250px] w-[140px] rotate-[75deg] rounded-full bg-[#FBE4A3] opacity-[0.06] blur-[12px]" />
          <div className="pointer-events-none absolute left-[50%] top-[-60px] h-[220px] w-[130px] rotate-[75deg] rounded-full bg-[#EDC985] opacity-[0.06] blur-[12px]" />
          <div className="pointer-events-none absolute left-[28%] top-[80px] h-[220px] w-[110px] rotate-[75deg] rounded-full bg-[#E3B5F8] opacity-[0.06] blur-[12px]" />

          <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="flex flex-col gap-2 rounded-xl bg-foreground/[0.02] p-4 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card-bg font-inter text-[14px] font-semibold tracking-[0.35px] text-page-text-muted">
                    {step.num}
                  </div>
                  <span className="font-inter text-[14px] font-semibold leading-[20px] tracking-[-0.14px] text-page-text">{step.title}</span>
                </div>
                <p className="font-inter text-[12px] font-medium leading-[17px] tracking-[-0.12px] text-page-text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral link card */}
        <div className={cn(cardCls, "flex flex-col gap-5 p-5")}>
          <div className="flex flex-col gap-1">
            <h2 className="font-inter text-[15px] font-semibold leading-[20px] tracking-[-0.3px] text-page-text">
              Share your referral link
            </h2>
            <p className="font-inter text-[13px] font-medium leading-[20px] tracking-[-0.13px] text-page-text-muted">
              Brands that sign up via your link receive 10% off their first year. You earn 0.10% of their qualified creator spend for 12 months.
            </p>
          </div>

          {/* Referral link row */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 flex-1 items-center rounded-xl border border-border bg-foreground/[0.03] px-3 dark:bg-white/[0.03]"
              style={editingLink ? { borderColor: "rgba(229,113,0,0.4)", boxShadow: "0 0 0 1px rgba(229,113,0,0.2)" } : undefined}
            >
              <span className="font-inter text-[14px] font-medium tracking-[-0.14px] text-page-text-muted">{REFERRAL_BASE}</span>
              {editingLink ? (
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onBlur={saveTag}
                  onKeyDown={(e) => e.key === "Enter" && saveTag()}
                  autoFocus
                  className="w-0 flex-1 bg-transparent font-inter text-[14px] font-medium tracking-[-0.14px] text-page-text outline-none"
                />
              ) : (
                <span className="truncate font-inter text-[14px] font-medium tracking-[-0.14px] text-page-text">{tag}</span>
              )}
            </div>
            <button
              onClick={() => copyToClipboard(fullLink, "link")}
              className="flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-xl px-3 font-inter text-[13px] font-medium tracking-[-0.13px] text-white transition-opacity hover:opacity-90"
              style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207", borderTop: "1px solid rgba(251,191,36,0.5)" }}
            >
              <CopyIcon />
              {copied === "link" ? "Copied!" : "Copy link"}
            </button>
            <button
              onClick={() => setEditingLink((v) => !v)}
              className={cn(
                "flex h-9 shrink-0 items-center justify-center rounded-xl border px-3 transition-colors",
                editingLink
                  ? "border-[#E57100]/30 bg-[#E57100]/10 text-[#E57100]"
                  : "border-border text-page-text-muted hover:bg-foreground/[0.04] hover:text-page-text dark:hover:bg-white/[0.04]"
              )}
              title={editingLink ? "Done editing" : "Edit tag"}
            >
              <EditIcon />
            </button>
          </div>


          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-inter text-[12px] font-medium tracking-[-0.12px] text-page-text-subtle">or share with a message</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Message textarea + copy */}
          <div className="flex flex-col gap-3">
            <textarea
              defaultValue={REFERRAL_MESSAGE}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 font-inter text-[14px] font-medium leading-[20px] tracking-[-0.14px] text-page-text outline-none placeholder:text-page-text-muted dark:bg-white/[0.03]"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={() => copyToClipboard(REFERRAL_MESSAGE, "message")}
              className="flex h-9 w-fit items-center gap-1.5 rounded-xl border border-border bg-foreground/[0.03] px-3 font-inter text-[13px] font-medium tracking-[-0.13px] text-page-text transition-colors hover:bg-foreground/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <CopyIcon />
              {copied === "message" ? "Copied!" : "Copy message"}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className={cn(cardCls, "flex flex-col gap-1 p-4")}>
            <span className="font-inter text-[13px] font-medium tracking-[0.15px] text-page-text-muted">Lifetime earnings</span>
            <span className="font-inter text-[16px] font-semibold tracking-[-0.15px] text-page-text">$0.00</span>
          </div>
          <div className={cn(cardCls, "flex flex-col gap-1 p-4")}>
            <span className="font-inter text-[13px] font-medium tracking-[0.15px] text-page-text-muted">Referred qualified spend</span>
            <span className="font-inter text-[16px] font-semibold tracking-[-0.15px] text-page-text">$0.00</span>
          </div>
        </div>

        {/* Referred entities table */}
        <div className={cn(cardCls, "flex flex-col overflow-hidden")}>
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="font-inter text-[15px] font-medium tracking-[-0.15px] text-page-text">Referred Entities</span>
              <div className="flex items-center justify-center rounded-md border border-border bg-foreground/[0.03] px-1.5 font-mono text-[13px] font-medium tracking-[0.15px] text-page-text dark:bg-white/[0.03]">
                {REFERRED.length}
              </div>
            </div>
            <button
              className="flex items-center gap-1 rounded-md border border-border bg-foreground/[0.03] px-2 py-1 font-inter text-[14px] font-semibold text-page-text-muted transition-colors hover:bg-foreground/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
              disabled
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.4 8h11.2M8 2.4v11.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Redeem
              <span className="text-[14px]">$0.00</span>
            </button>
          </div>

          {/* Column headers */}
          <div className="flex items-center border-y border-border px-5 py-2">
            <span className="flex-1 font-inter text-[13px] font-semibold tracking-[0.15px] text-page-text-muted">Entity</span>
            <span className="flex-1 font-inter text-[13px] font-semibold tracking-[0.15px] text-page-text-muted">Name</span>
            <span className="hidden flex-1 font-inter text-[13px] font-semibold tracking-[0.15px] text-page-text-muted sm:block">Email</span>
            <span className="w-[120px] font-inter text-[13px] font-semibold tracking-[0.15px] text-page-text-muted">Signed Up</span>
          </div>

          {/* Rows */}
          {REFERRED.length > 0 ? (
            <div className="flex flex-col">
              {REFERRED.map((ref, i) => (
                <div key={i} className="flex items-center border-b border-border px-5 py-3 last:border-b-0">
                  <span className="flex-1 truncate font-inter text-[14px] font-medium tracking-[-0.14px] text-page-text">{ref.entity}</span>
                  <span className="flex-1 truncate font-inter text-[14px] tracking-[-0.14px] text-page-text-muted">{ref.name}</span>
                  <span className="hidden flex-1 truncate font-inter text-[14px] tracking-[-0.14px] text-page-text-muted sm:block">{ref.email}</span>
                  <span className="w-[120px] font-inter text-[13px] tracking-[-0.13px] text-page-text-muted">{ref.signedUp}</span>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              {/* Neumorphic icon */}
              <div
                className="flex size-[54px] items-center justify-center rounded-[10px] border border-foreground/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:border-[rgba(224,224,224,0.06)]"
                style={{ background: "radial-gradient(81% 116% at 58% -8%, rgba(255,255,255,0.5) 6%, rgba(230,230,230,0.3) 43%, rgba(200,200,200,0.5) 100%), radial-gradient(137% 95% at 84% 13%, rgba(180,180,180,0) 0%, rgba(180,180,180,0.4) 100%), #F5F5F5" }}
              >
                <div
                  className="flex size-10 items-center justify-center rounded-md"
                  style={{ background: "radial-gradient(98% 141% at 58% -8%, rgba(255,255,255,0.7) 6%, rgba(240,240,240,0.42) 43%, rgba(235,235,235,0.7) 100%), #FEFEFE", boxShadow: "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-page-text-muted">
                    <path d="M1 14h8M15 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M1 10h8M15 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <span className="font-inter text-[15px] font-semibold tracking-[-0.15px] text-page-text">Refer someone to show up here</span>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {savedToast && createPortal(
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 animate-[toast-in_0.25s_ease-out] font-inter">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card-bg px-4 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="flex size-5 items-center justify-center rounded-full bg-emerald-500">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M4 8.5l2.5 2.5L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="text-[13px] font-medium tracking-[-0.13px] text-page-text">Referral tag saved</span>
          </div>
        </div>,
        document.body
      )}
    </PageShell>
  );
}
