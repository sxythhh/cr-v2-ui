"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { loadShowcaseConfig, type ShowcaseConfig } from "@/lib/showcase-data";

// ── Inline Icons (from creator dashboard) ──────────────────────────

function FireStatIcon({ color = "#E57100" }: { color?: string }) {
  return (
    <svg width="20" height="24" viewBox="0 0 17 21" fill="none">
      <path d="M8.51417 0.20807C8.25075 0.00496697 7.90358 -0.0538602 7.58795 0.0511242C7.27232 0.156108 7.02956 0.411161 6.94027 0.731583C6.40268 2.66083 5.30022 3.72289 3.88331 5.08789C3.6924 5.2718 3.49579 5.46121 3.29407 5.65898L3.29335 5.65969C2.66354 6.27845 2.01349 6.97938 1.47951 7.77371C-0.105263 10.1326 -0.494758 12.8046 0.691926 15.4909L0.692385 15.492C2.67042 19.956 7.09823 21.2419 10.797 20.1104C14.5101 18.9744 17.5549 15.3981 16.915 10.244C16.7173 8.63861 16.1746 6.97873 14.8334 5.67122C14.6227 5.46584 14.3322 5.36366 14.0394 5.3919C13.7465 5.42014 13.4809 5.57593 13.3133 5.81778C13.1732 6.02011 12.8541 6.41009 12.4715 6.86098C12.4053 6.05854 12.2383 5.28655 11.9546 4.54124C11.3323 2.9062 10.1855 1.49673 8.51417 0.20807Z" fill={color} />
    </svg>
  );
}

function DollarStatIcon({ color = "#AE4EEE" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10 3.5C10.5523 3.5 11 3.94772 11 4.5V5.12367C11.804 5.32711 12.5135 5.77457 12.9759 6.41405C13.2995 6.86159 13.199 7.48674 12.7515 7.81035C12.304 8.13396 11.6788 8.03349 11.3552 7.58595C11.1379 7.28549 10.6534 7 10 7H9.72222C8.82744 7 8.5 7.54492 8.5 7.77778V7.8541C8.5 8.05137 8.64913 8.38262 9.15254 8.58398L11.5902 9.55906C12.6572 9.98584 13.5 10.9386 13.5 12.1459C13.5 13.6189 12.323 14.6144 11 14.9091V15.5C11 16.0523 10.5523 16.5 10 16.5C9.44771 16.5 9 16.0523 9 15.5V14.8763C8.19595 14.6729 7.4865 14.2254 7.02411 13.586C6.7005 13.1384 6.80096 12.5133 7.24851 12.1897C7.69605 11.866 8.32119 11.9665 8.6448 12.414C8.86206 12.7145 9.34658 13 10 13H10.1824C11.1298 13 11.5 12.4209 11.5 12.1459C11.5 11.9486 11.3509 11.6174 10.8475 11.416L8.40976 10.4409C7.34283 10.0142 6.5 9.0614 6.5 7.8541V7.77778C6.5 6.31377 7.68936 5.33904 9 5.07331V4.5C9 3.94772 9.44771 3.5 10 3.5Z" fill={color} />
    </svg>
  );
}

function WreathIcon({ color = "#00994D" }: { color?: string }) {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.15185 0.398214C5.83573 -0.021243 5.24898 -0.124653 4.80851 0.161462C3.64505 0.917211 2.7985 1.87374 2.58347 3.0844C2.49544 3.58001 2.5215 4.07168 2.64012 4.55546C2.40785 4.47621 2.16601 4.40802 1.91633 4.34989C1.40358 4.23053 0.886086 4.52916 0.732878 5.03284C0.329995 6.35734 0.301512 7.63221 0.920415 8.69641C1.07322 8.95916 1.2569 9.19428 1.4673 9.40412C1.21855 9.45133 0.966763 9.51389 0.713027 9.58996C0.206053 9.74194 -0.0947008 10.2626 0.0269667 10.7777C0.345352 12.1256 0.96251 13.2412 2.0308 13.8535C2.40105 14.0657 2.79671 14.201 3.2112 14.2704C3.02946 14.4129 2.85067 14.5708 2.67563 14.7446C2.29037 15.127 2.28061 15.747 2.65364 16.1414C3.5122 17.0492 4.48241 17.6728 5.57176 17.7882C6.42119 17.8783 7.21999 17.6471 7.95403 17.1907C7.86525 17.4664 7.62204 17.8042 7.01732 18.1043C6.52263 18.3499 6.32066 18.95 6.56622 19.4447C6.81177 19.9394 7.41186 20.1413 7.90656 19.8958C9.12843 19.2893 9.85307 18.3421 9.98048 17.2377C10.2188 15.1719 8.35922 13.4348 6.40378 13.2546C6.42689 13.1242 6.42433 12.9872 6.39207 12.8506C6.14777 11.8163 5.72755 10.9188 5.06258 10.2805C5.12043 10.1971 5.16641 10.1035 5.19744 10.0015C5.55499 8.82602 5.61765 7.68963 5.19459 6.7049C6.26357 5.96894 7.03341 5.05043 7.23702 3.90405C7.45219 2.69263 6.98575 1.50472 6.15185 0.398214Z" fill={color} />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.1919 0.161462C15.7514 -0.124653 15.1647 -0.021243 14.8485 0.398214C14.0146 1.50472 13.5482 2.69262 13.7634 3.90405C13.967 5.05043 14.7368 5.96895 15.8058 6.7049C15.3827 7.68963 15.4454 8.82602 15.8029 10.0015C15.834 10.1035 15.88 10.1971 15.9378 10.2805C15.2728 10.9188 14.8526 11.8163 14.6083 12.8506C14.576 12.9872 14.5735 13.1242 14.5966 13.2546C12.6412 13.4348 10.7816 15.1719 11.0199 17.2377C11.1473 18.3421 11.8719 19.2893 13.0938 19.8958C13.5885 20.1413 14.1886 19.9394 14.4342 19.4447C14.6797 18.95 14.4778 18.3499 13.9831 18.1043C13.3783 17.8042 13.1351 17.4664 13.0463 17.1907C13.7804 17.6471 14.5792 17.8783 15.4286 17.7882C16.518 17.6728 17.4882 17.0492 18.3467 16.1414C18.7198 15.747 18.71 15.127 18.3248 14.7446C18.1497 14.5708 17.9709 14.4129 17.7892 14.2704C18.2037 14.201 18.5993 14.0657 18.9696 13.8535C20.0379 13.2412 20.655 12.1256 20.9734 10.7777C21.0951 10.2626 20.7943 9.74194 20.2874 9.58996C20.0336 9.51389 19.7818 9.45133 19.5331 9.40412C19.7435 9.19428 19.9272 8.95916 20.08 8.69641C20.6989 7.63221 20.6704 6.35734 20.2675 5.03284C20.1143 4.52916 19.5968 4.23053 19.0841 4.34989C18.8344 4.40802 18.5925 4.47621 18.3603 4.55546C18.4789 4.07168 18.5049 3.58001 18.4169 3.0844C18.2019 1.87374 17.3553 0.917211 16.1919 0.161462Z" fill={color} />
    </svg>
  );
}

function EyeStatIcon({ color = "#1A67E5" }: { color?: string }) {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.7463 2.56478e-10C14.698 -2.77745e-05 18.5369 2.27233 21.1031 6.58313C21.6226 7.45583 21.6226 8.54406 21.1031 9.41677C18.5369 13.7276 14.6981 16 10.7463 16C6.79463 16 2.95577 13.7277 0.38963 9.41687C-0.129877 8.54417 -0.129876 7.45594 0.389629 6.58323C2.95577 2.27243 6.79462 2.7777e-05 10.7463 2.56478e-10ZM7.24634 8C7.24634 6.067 8.81334 4.5 10.7463 4.5C12.6793 4.5 14.2463 6.067 14.2463 8C14.2463 9.933 12.6793 11.5 10.7463 11.5C8.81334 11.5 7.24634 9.933 7.24634 8Z" fill={color} />
    </svg>
  );
}

function MoneybagIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <path d="M0.567487 11.3535C0.19617 10.7936 5.6031e-06 10.1187 0 9.33334C0.300044 7.23302 1.68041 5.67287 3.16866 4.16667H8.90142C10.2937 5.64371 11.6971 7.21336 12 9.33333C12 10.1187 11.8038 10.7936 11.4325 11.3535C11.0638 11.9095 10.5486 12.3127 9.96957 12.6017C8.83122 13.1699 7.37236 13.3333 6 13.3333C4.62764 13.3333 3.16878 13.1699 2.03044 12.6017C1.45144 12.3127 0.936236 11.9095 0.567487 11.3535Z" fill="currentColor" fillOpacity="0.5"/>
      <path d="M8.60073 2.08518C8.88036 1.33948 8.5969 0.472331 7.83294 0.247323C7.2636 0.0796353 6.65171 0 6 0C5.34829 0 4.7364 0.0796353 4.16706 0.247323C3.4031 0.472331 3.11964 1.33948 3.39927 2.08518L3.8015 3.15777L3.77778 3.16667H8.22222L8.1985 3.15777L8.60073 2.08518Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function VideoPlaylistIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.33333 0.666667C1.33333 0.298477 1.63181 0 2 0H11.3333C11.7015 0 12 0.298477 12 0.666667C12 1.03486 11.7015 1.33333 11.3333 1.33333H2C1.63181 1.33333 1.33333 1.03486 1.33333 0.666667ZM0 4C0 2.89543 0.895431 2 2 2H11.3333C12.4379 2 13.3333 2.89543 13.3333 4V10C13.3333 11.1046 12.4379 12 11.3333 12H2C0.895431 12 0 11.1046 0 10V4ZM5.71121 5.0658C5.94218 4.95478 6.21635 4.986 6.41646 5.14609L8.08313 6.47942C8.24127 6.60594 8.33333 6.79748 8.33333 7C8.33333 7.20252 8.24127 7.39406 8.08313 7.52058L6.41646 8.85391C6.21635 9.014 5.94218 9.04522 5.71121 8.9342C5.48023 8.82319 5.33333 8.5896 5.33333 8.33333V5.66667C5.33333 5.4104 5.48023 5.17681 5.71121 5.0658Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
      <path d="M5.93698 0.431091C5.66086 -0.143696 4.84062 -0.143698 4.56449 0.431091L3.3835 2.8895L0.663268 3.24567C0.0326199 3.32825 -0.229974 4.10751 0.239584 4.55027L2.22744 6.42466L1.72856 9.1008C1.61012 9.73617 2.28277 10.2072 2.8385 9.9076L5.25074 8.60713L7.66298 9.9076C8.2187 10.2072 8.89136 9.73617 8.77292 9.1008L8.27404 6.42466L10.2619 4.55027C10.7315 4.10751 10.4689 3.32825 9.83821 3.24567L7.11798 2.8895L5.93698 0.431091Z" fill="#E57100"/>
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d="M6.3 0C4.367 0 2.8 1.567 2.8 3.5V9.09999C2.8 10.2598 3.7402 11.2 4.9 11.2C6.05979 11.2 6.99999 10.2598 6.99999 9.09999V3.5C6.99999 3.1134 6.68659 2.8 6.3 2.8C5.9134 2.8 5.6 3.1134 5.6 3.5V9.09999C5.6 9.48659 5.2866 9.79999 4.9 9.79999C4.5134 9.79999 4.2 9.48659 4.2 9.09999V3.5C4.2 2.3402 5.1402 1.4 6.3 1.4C7.45979 1.4 8.39999 2.3402 8.39999 3.5V9.09999C8.39999 11.033 6.83299 12.6 4.9 12.6C2.967 12.6 1.4 11.033 1.4 9.09999V6.3C1.4 5.9134 1.0866 5.6 0.699999 5.6C0.3134 5.6 0 5.9134 0 6.3V9.09999C0 11.8062 2.1938 14 4.9 14C7.60619 14 9.79999 11.8062 9.79999 9.09999V3.5C9.79999 1.567 8.23299 0 6.3 0Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2, style: "currency" }).format(v);
}

function fmtCompact(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(Math.round(v));
}

const cardClass = "rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

// ── Page ────────────────────────────────────────────────────────────

export default function ShowcaseDashboardPage() {
  const [cfg, setCfg] = useState<ShowcaseConfig | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setCfg(loadShowcaseConfig());
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  if (!cfg) return null;

  const stats = [
    { value: `${cfg.streak} days`, label: "Streak", icon: (c: string) => <FireStatIcon color={c} />, color: "#E57100", colorDark: "#FB923C", bg: "rgba(229,113,0,0.08)", bgDark: "rgba(251,146,60,0.08)" },
    { value: fmtCurrency(cfg.earnedThisWeek), label: "Earned this week", icon: (c: string) => <DollarStatIcon color={c} />, color: "#AE4EEE", colorDark: "#C084FC", bg: "rgba(174,78,238,0.10)", bgDark: "rgba(192,132,252,0.10)" },
    { value: String(cfg.trustScore), label: "Trust score", icon: (c: string) => <WreathIcon color={c} />, color: "#00994D", colorDark: "#34D399", bg: "rgba(0,153,77,0.08)", bgDark: "rgba(52,211,153,0.08)" },
    { value: fmtCompact(cfg.totalViews), label: "Views", icon: (c: string) => <EyeStatIcon color={c} />, color: "#1A67E5", colorDark: "#60A5FA", bg: "rgba(26,103,229,0.08)", bgDark: "rgba(96,165,250,0.08)" },
  ];

  const feedCards = [
    {
      icon: <MoneybagIcon />,
      topRight: <span className="text-sm font-medium tracking-[-0.28px] text-[#00994D] dark:text-[#34D399]">{fmtCurrency(cfg.balance)}</span>,
      title: "Withdraw your earnings",
      desc: `You have ${fmtCurrency(cfg.balance)} available. Withdraw it to your account anytime.`,
      buttons: [{ label: "Withdraw", primary: true }, { label: "Share" }],
    },
    {
      icon: <VideoPlaylistIcon />,
      topRight: <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] py-1 pl-1.5 pr-2 dark:border-white/[0.06]"><StarIcon /><span className="text-xs font-medium tracking-[-0.24px] text-page-text">50 XP</span></span>,
      title: "Submit a new clip",
      desc: "Keep the momentum going. Your campaigns are waiting for content.",
      buttons: [{ label: "Submit clip", primary: false }],
    },
    {
      icon: <PaperclipIcon />,
      topRight: null,
      title: "Application expiring soon",
      desc: "Your application closes in 2 days. Don\u2019t miss it.",
      buttons: [{ label: "View application", primary: false }],
    },
  ];

  const campaigns = [
    { brand: "Sound Network", title: "Harry Styles Podcast x Shania Twain Clipping [7434]", model: "Retainer", modelColor: "#E57100", paidOut: fmtCurrency(cfg.totalEarnings * 0.6), pending: fmtCurrency(cfg.pendingPayout * 0.4), submissions: `7/${Math.round(cfg.totalSubmissions * 0.1)}` },
    { brand: "Clipping Culture", title: "Call of Duty BO7 Official Clipping Campaign", model: "CPM", modelColor: "#1A67E5", paidOut: fmtCurrency(cfg.totalEarnings * 0.1), pending: "$0", submissions: `2/${Math.round(cfg.totalSubmissions * 0.05)}` },
    { brand: "Scene Society", title: "Mumford & Sons | Prizefighter Clipping", model: "CPM", modelColor: "#1A67E5", paidOut: fmtCurrency(cfg.totalEarnings * 0.3), pending: fmtCurrency(cfg.pendingPayout * 0.15), submissions: `5/${Math.round(cfg.totalSubmissions * 0.04)}` },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <CreatorHeader title="Dashboard" />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-8 pt-6 sm:px-5">
        {/* Balance + gradient */}
        <div className="relative flex flex-col items-center gap-4 rounded-t-2xl pt-4">
          <div className="pointer-events-none absolute inset-0 rounded-t-2xl" style={{ background: isDark ? "linear-gradient(180deg, rgba(224,224,224,0.03) 15.35%, transparent 61.39%)" : "linear-gradient(180deg, var(--card-bg) 15.35%, transparent 61.39%)" }} />
          <div className="pointer-events-none absolute inset-0 rounded-t-2xl" style={{ background: isDark ? "linear-gradient(180deg, rgba(224,224,224,0.03) 15.35%, transparent 61.39%)" : "linear-gradient(180deg, var(--page-border) 15.35%, transparent 61.39%)", mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", maskComposite: "exclude", WebkitMaskComposite: "xor", padding: "1px" }} />

          <div className="relative flex w-full flex-col gap-3 px-4">
            <span className="text-sm font-medium text-page-text">Your balance</span>
            <div className="flex items-center gap-4">
              <div className="flex flex-1 items-center gap-3">
                <span className="text-2xl font-medium tracking-[-0.02em] text-page-text">{fmtCurrency(cfg.balance)}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/[0.06] bg-white py-1 pl-1.5 pr-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10ZM4.5 5.20711V2.5H5.5V4.79289L6.95711 6.25L6.25 6.95711L4.5 5.20711Z" fill={isDark ? "#FB923C" : "#E57100"}/></svg>
                  <span className="text-xs font-medium tracking-[-0.02em] text-page-text">{fmtCurrency(cfg.pendingPayout)} pending</span>
                </span>
              </div>
              <button className="rounded-full bg-foreground/[0.06] px-3 py-2 text-xs font-medium text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)]">Withdraw</button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="relative grid w-full grid-cols-2 gap-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className={cn(cardClass, "flex h-[61px] items-center gap-3 overflow-hidden pr-3")}>
                <div className="relative h-[61px] w-[60px] shrink-0 overflow-hidden">
                  <svg className="absolute inset-0" width="60" height="61" viewBox="0 0 60 61" fill="none">
                    <path d="M-4 0H29.5C46.3447 0 60 13.6553 60 30.5C60 47.3447 46.3447 61 29.5 61H-4V0Z" fill={isDark ? stat.bgDark : stat.bg} />
                  </svg>
                  <div className="relative flex h-full w-full items-center justify-center">{stat.icon(isDark ? stat.colorDark : stat.color)}</div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <span className="text-sm font-medium tracking-[-0.28px] text-page-text">{stat.value}</span>
                  <span className="text-xs tracking-[-0.24px] text-page-text-muted">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feed cards */}
        <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
          <h2 className="text-sm font-medium text-page-text">Feed</h2>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {feedCards.map((card) => (
              <div key={card.title} className="flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-[rgba(37,37,37,0.06)] bg-card-bg p-3 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] sm:h-[172px]">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text shadow-[0_0_0_2px_#fff] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">{card.icon}</div>
                  {card.topRight}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <h3 className="text-sm font-medium tracking-[-0.28px] text-page-text">{card.title}</h3>
                  <p className="text-xs leading-[18px] tracking-[-0.24px] text-page-text-subtle">{card.desc}</p>
                </div>
                <div className="flex gap-2">
                  {card.buttons.map((btn) => (
                    <button key={btn.label} className={cn("flex-1 rounded-full px-3 py-2 text-xs font-medium tracking-[-0.24px] transition-colors", btn.primary ? "bg-page-text text-white hover:bg-page-text/90 dark:bg-white dark:text-page-bg" : "bg-foreground/[0.06] text-page-text hover:bg-foreground/[0.10]")}>{btn.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active campaigns */}
        <div className={cn(cardClass, "flex flex-col gap-4 p-4")}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-page-text">Active campaigns</h2>
            <span className="text-xs font-medium text-page-text-subtle">Browse more</span>
          </div>
          <div className="flex flex-col gap-2">
            {campaigns.map((c) => (
              <div key={c.title} className={cn(cardClass, "flex items-center gap-3 p-3")}>
                <div className="size-12 shrink-0 rounded-xl border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500 dark:border-[rgba(224,224,224,0.03)]" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-xs font-medium text-page-text">{c.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-page-text-muted">{c.brand}</span>
                    <span className="text-xs font-medium" style={{ color: c.modelColor }}>{c.model}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs font-medium text-[#00994D] dark:text-[#34D399]">{c.paidOut}</span>
                  <span className="text-xs text-page-text-muted">{c.submissions} clips</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
