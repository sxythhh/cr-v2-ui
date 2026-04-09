"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";
import { Modal } from "@/components/ui/modal";
import { CreatorHeader } from "@/components/creator-header";
import { VerifiedBadge } from "@/components/verified-badge";
import { AnalyticsPocChartPlaceholder } from "@/components/analytics-poc/AnalyticsPocChartPlaceholder";
import type { AnalyticsPocPerformanceLineChartData } from "@/components/analytics-poc/types";
import { UsersIcon } from "@/components/sidebar/icons/users";
import { GamepadIcon } from "@/components/sidebar/icons/gamepad";
import US from "country-flag-icons/react/3x2/US";
import GB from "country-flag-icons/react/3x2/GB";
import CA from "country-flag-icons/react/3x2/CA";
import DE from "country-flag-icons/react/3x2/DE";
import BR from "country-flag-icons/react/3x2/BR";
import IN from "country-flag-icons/react/3x2/IN";
import PH from "country-flag-icons/react/3x2/PH";
import NG from "country-flag-icons/react/3x2/NG";
import MX from "country-flag-icons/react/3x2/MX";
import AU from "country-flag-icons/react/3x2/AU";
import FR from "country-flag-icons/react/3x2/FR";
import JP from "country-flag-icons/react/3x2/JP";
import KR from "country-flag-icons/react/3x2/KR";
import ES from "country-flag-icons/react/3x2/ES";
import PT from "country-flag-icons/react/3x2/PT";
import SA from "country-flag-icons/react/3x2/SA";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CircleFlag({ Flag }: { Flag: any }) {
  return (
    <span className="relative flex size-4 shrink-0 overflow-hidden rounded-full">
      <Flag style={{ position: "absolute", top: "-1px", left: "-25%", width: "150%", height: "calc(100% + 2px)" }} />
    </span>
  );
}

const optionFlags: Record<string, React.ReactNode> = {
  "United States": <CircleFlag Flag={US} />,
  "United Kingdom": <CircleFlag Flag={GB} />,
  "Canada": <CircleFlag Flag={CA} />,
  "Germany": <CircleFlag Flag={DE} />,
  "Brazil": <CircleFlag Flag={BR} />,
  "India": <CircleFlag Flag={IN} />,
  "Philippines": <CircleFlag Flag={PH} />,
  "Nigeria": <CircleFlag Flag={NG} />,
  "Mexico": <CircleFlag Flag={MX} />,
  "Australia": <CircleFlag Flag={AU} />,
  "France": <CircleFlag Flag={FR} />,
  "Japan": <CircleFlag Flag={JP} />,
  "South Korea": <CircleFlag Flag={KR} />,
  "English": <CircleFlag Flag={GB} />,
  "Spanish": <CircleFlag Flag={ES} />,
  "Portuguese": <CircleFlag Flag={PT} />,
  "French": <CircleFlag Flag={FR} />,
  "German": <CircleFlag Flag={DE} />,
  "Arabic": <CircleFlag Flag={SA} />,
  "Hindi": <CircleFlag Flag={IN} />,
  "Japanese": <CircleFlag Flag={JP} />,
  "Korean": <CircleFlag Flag={KR} />,
  // Niche icons
  "Entertainment": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.908.507a.5.5 0 0 1 .578.41l.001.006v.003c.02.123.032.247.04.372.012.21.014.506-.04.801-.065.346-.225.657-.352.865a3.5 3.5 0 0 1-.18.26l-.002.002a.5.5 0 0 1-.77-.643 2.5 2.5 0 0 0 .172-.245c.1-.163.19-.353.221-.526.034-.185.036-.391.026-.561a3.9 3.9 0 0 0-.027-.264.5.5 0 0 1 .41-.578Z" fill="currentColor"/><path d="M9.541 1.281a.5.5 0 0 1 .302.641l-.226.626a.5.5 0 0 1-.866-.34l.225-.626a.5.5 0 0 1 .565-.301Z" fill="currentColor"/><path d="M10.947 3.532a.5.5 0 0 1-.224.672l-.501.25a.5.5 0 0 1-.673-.223.5.5 0 0 1 .224-.672l.501-.25a.5.5 0 0 1 .673.223Z" fill="currentColor"/><path d="M8.599 3.402a.5.5 0 0 1 0 .708l-.501.501a.5.5 0 0 1-.708-.708l.501-.501a.5.5 0 0 1 .708 0Z" fill="currentColor"/><path d="M8.495 5.488a.5.5 0 0 1 .522.48l.001.001.002.002a3 3 0 0 0 .278.027c.159.02.316.049.44.089.148.048.305.136.489.216a4 4 0 0 0 .749.275.5.5 0 0 1-.69.84 5 5 0 0 1-.222-.127c-.138-.074-.293-.148-.417-.188-.149-.048-.305-.076-.43-.093a3 3 0 0 0-.19-.02.5.5 0 0 1-.48-.521Z" fill="currentColor"/><path d="M2.96 4.243c.397-1.007 1.696-1.277 2.461-.512l2.849 2.849c.765.765.495 2.064-.512 2.461l-4.7 1.851c-1.223.482-2.431-.726-1.95-1.949l1.852-4.7Z" fill="currentColor"/></svg>,
  "Gaming": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.524 1.5c-.492 0-.953.242-1.233.646L4.101 5.309l2.59 2.59 3.163-2.19c.405-.28.646-.741.646-1.233V2a.5.5 0 0 0-.5-.5H7.524Z" fill="currentColor"/><path d="M2.853 5.146a.5.5 0 0 0-.77.077l-.117.175a1.5 1.5 0 0 0 .028 1.704l.603.844-1.097 1.097a1 1 0 0 0 0 1.414l.043.043a1 1 0 0 0 1.414 0l1.097-1.097.844.603a1.5 1.5 0 0 0 1.704.027l.175-.117a.5.5 0 0 0 .077-.77l-4-4Z" fill="currentColor"/></svg>,
  "Tech": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.5 1.05A4 4 0 0 0 5 1c-1.054 0-1.955.652-2.323 1.574C1.712 2.827 1 3.705 1 4.75c0 .462.14.893.379 1.25A2.25 2.25 0 0 0 1 7.25c0 .856.478 1.6 1.18 1.98A2.751 2.751 0 0 0 4.75 11c.26 0 .511-.036.75-.104V8.501 8.5A1.5 1.5 0 0 0 4 7.5a.5.5 0 0 1 0-1c.364 0 .706.097 1 .268V3.5v-.001V1.05Z" fill="currentColor"/><path d="M6.5 10.896c.239.068.49.104.75.104a2.751 2.751 0 0 0 2.57-1.77c.702-.38 1.18-1.124 1.18-1.98 0-.462-.14-.893-.379-1.25.24-.358.379-.788.379-1.25 0-.995-.712-1.873-1.677-2.126A2.751 2.751 0 0 0 7 1c-.171 0-.338.017-.5.05V3.502A1.5 1.5 0 0 1 8 4.5a.5.5 0 0 1 0 1 2.24 2.24 0 0 1-1-.268v5.664Z" fill="currentColor"/></svg>,
  "Lifestyle": <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.248 9.186c4.264-2.39 5.313-5.235 4.511-7.235-.39-.97-1.207-1.666-2.171-1.881-.849-.19-1.776 0-2.585.642-.808-.641-1.735-.831-2.584-.642C1.455.285.638.98.248 1.951c-.802 2-1.246 4.845 4.511 7.235a.5.5 0 0 0 .49 0Z" fill="currentColor"/></svg>,
  "Sports": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.581 1.288C3.534 1.92 1.92 3.534 1.288 5.58l5.131 5.131C8.466 10.08 10.08 8.466 10.712 6.42L5.581 1.288Zm1.648 4.19a.5.5 0 1 0-.707-.707l-1.75 1.75a.5.5 0 0 0 .707.708l1.75-1.75Z" fill="currentColor"/><path d="M1 7.5c0-.254.015-.504.043-.75L5.25 10.957c-.246.029-.496.043-.75.043H2a1 1 0 0 1-1-1V7.5Z" fill="currentColor"/><path d="M10.957 5.25c.029-.246.043-.496.043-.75V2a1 1 0 0 0-1-1H7.5c-.254 0-.504.015-.75.043l4.207 4.207Z" fill="currentColor"/></svg>,
  "Beauty": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.589 2.011c.632-.065 1.212.171 1.694.497.484.327.912.771 1.261 1.2.351.433.638.869.836 1.195.1.163.177.301.23.398.174.315.147.493.015.767a8.3 8.3 0 0 1-.245.464c-.218.38-.549.887-1.004 1.396C9.467 8.943 8.029 10 6 10s-3.467-1.057-4.376-2.073a8.2 8.2 0 0 1-1.005-1.396 8.3 8.3 0 0 1-.245-.464c-.127-.264-.159-.434-.004-.742.046-.092.114-.223.201-.379.173-.311.425-.728.74-1.148.312-.418.697-.855 1.14-1.192.443-.335.98-.598 1.582-.598.508 0 1.076.192 1.477.354.19.078.357.155.483.217.098-.053.223-.116.362-.18.333-.154.807-.365 1.237-.41ZM6 5.125c-1.213 0-2.79.269-4.091.547a20 20 0 0 0-.409.09c.15.058.306.119.467.178C3.257 6.423 4.8 6.875 6 6.875s2.743-.452 4.033-.935c.161-.06.317-.12.467-.179a20 20 0 0 0-.409-.089C8.79 5.393 7.213 5.125 6 5.125Z" fill="currentColor"/></svg>,
  "Music": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.855 2.365a.5.5 0 0 1 .644.479v3.391a2.16 2.16 0 0 0-1-.236c-1.016 0-2 .702-2 1.75s.984 1.75 2 1.75 2-.702 2-1.75V2.844a1.5 1.5 0 0 0-1.931-1.437l-3 .9A1.5 1.5 0 0 0 4.5 3.744v3.992a2.16 2.16 0 0 0-1-.237c-1.015 0-2 .702-2 1.75s.985 1.75 2 1.75 2-.702 2-1.75V3.744a.5.5 0 0 1 .356-.479l3-.9Z" fill="currentColor"/></svg>,
  "Health": <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path d="M3.19 4.406 4 1.64l2.28 7.791a.5.5 0 0 0 .94 0l1.049-3.586A.5.5 0 0 1 8.749 5.485H10.5a.5.5 0 0 0 0-1H9.249a1.5 1.5 0 0 0-1.44 1.079L7 8.33 4.72.54a.5.5 0 0 0-.94 0L2.231 4.125A.5.5 0 0 1 1.751 4.485H.5a.5.5 0 0 0 0 1h1.251a1.5 1.5 0 0 0 1.44-1.079Z" fill="currentColor"/></svg>,
  "News": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 5.5V4.5h1.5v1H4Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M1 3c0-.828.672-1.5 1.5-1.5H7c.828 0 1.5.672 1.5 1.5v2.5h1c.828 0 1.5.672 1.5 1.5v1.75c0 .966-.784 1.75-1.75 1.75H2.75C1.784 10.5 1 9.716 1 8.75V3Zm8.25 6.5a.75.75 0 0 0 .75-.75V7a.5.5 0 0 0-.5-.5h-1v2.25c0 .414.336.75.75.75ZM3 8a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H3.5A.5.5 0 0 1 3 8Zm.5-4.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H6a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H3.5Z" fill="currentColor"/></svg>,
  "Crypto": <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.625 7.25a.375.375 0 0 0 0-.75H5.5v.75h1.125Z" fill="currentColor"/><path d="M5.5 4.75h1.125a.375.375 0 0 1 0 .75H5.5v-.75Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M1 6a5 5 0 1 1 10 0A5 5 0 0 1 1 6Zm3.25-2.25a.5.5 0 0 0 0 1h.25v2.5h-.25a.5.5 0 0 0 0 1H5.5v.25a.5.5 0 0 0 1 0v-.25h.125A1.375 1.375 0 0 0 7.68 6a1.37 1.37 0 0 0-.315-.875c.196-.238.315-.538.315-.875A1.375 1.375 0 0 0 6.625 3.75H6.5v-.25a.5.5 0 0 0-1 0v.25H4.25Z" fill="currentColor"/></svg>,
};

// ── Inline Icons ────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.33C4.32 1.33 1.33 3.87 1.33 7C1.33 8.75 2.29 10.3 3.78 11.29L3.11 13.78L5.97 12.43C6.61 12.59 7.29 12.67 8 12.67C11.68 12.67 14.67 10.13 14.67 7C14.67 3.87 11.68 1.33 8 1.33Z" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.33C8.47 1.33 8.93 1.4 9.37 1.53C9.06 1.87 8.84 2.28 8.73 2.74C8.5 2.69 8.25 2.67 8 2.67C6.11 2.67 4.56 4.14 4.47 6.03L4.35 8.28C4.34 8.65 4.24 9.01 4.08 9.34L3.41 10.67H12.59L11.92 9.34C11.76 9.01 11.66 8.65 11.65 8.28L11.53 6.03C11.53 6.01 11.53 6 11.53 5.99C12 5.96 12.45 5.8 12.83 5.54C12.84 5.68 12.86 5.82 12.87 5.96L12.98 8.21C12.99 8.4 13.03 8.58 13.12 8.74L13.87 10.25C13.96 10.42 14 10.6 14 10.79C14 11.46 13.46 12 12.79 12H11.27C10.96 13.52 9.61 14.67 8 14.67C6.39 14.67 5.04 13.52 4.73 12H3.21C2.58 12 2.07 11.53 2.01 10.92L2 10.79L2.01 10.65C2.02 10.52 2.06 10.38 2.13 10.25L2.88 8.74C2.96 8.58 3.01 8.4 3.02 8.21L3.14 5.96C3.26 3.37 5.4 1.33 8 1.33ZM6.12 12C6.39 12.78 7.13 13.33 8 13.33C8.87 13.33 9.61 12.78 9.88 12H6.12Z" fill="currentColor" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2.568 0.279712C1.4715 -0.450506 0 0.333566 0 1.65375V11.6821C0 13.0023 1.4715 13.7864 2.568 13.0561L10.0974 8.04196C11.0787 7.38847 11.0787 5.94739 10.0974 5.29389L2.568 0.279712Z" fill="currentColor" fillOpacity="0.5"/>
      <path d="M13.3333 0.834596C13.3333 0.374358 12.9602 0.00126212 12.5 0.00126212C12.0398 0.00126212 11.6667 0.374358 11.6667 0.834596V12.5013C11.6667 12.9615 12.0398 13.3346 12.5 13.3346C12.9602 13.3346 13.3333 12.9615 13.3333 12.5013V0.834596Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.5 0C7.96024 0 8.33333 0.373096 8.33333 0.833333V6.66667H14.1667C14.6269 6.66667 15 7.03976 15 7.5C15 7.96024 14.6269 8.33333 14.1667 8.33333H8.33333V14.1667C8.33333 14.6269 7.96024 15 7.5 15C7.03976 15 6.66667 14.6269 6.66667 14.1667V8.33333H0.833333C0.373096 8.33333 0 7.96024 0 7.5C0 7.03976 0.373096 6.66667 0.833333 6.66667H6.66667V0.833333C6.66667 0.373096 7.03976 0 7.5 0Z" fill="white"/>
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.33333 0C3.73096 0 0 3.73096 0 8.33333C0 12.9357 3.73096 16.6667 8.33333 16.6667C12.9357 16.6667 16.6667 12.9357 16.6667 8.33333C16.6667 3.73096 12.9357 0 8.33333 0ZM6.66667 7.5C6.66667 7.03976 7.03976 6.66667 7.5 6.66667H8.33333C8.79357 6.66667 9.16667 7.03976 9.16667 7.5V11.6667C9.16667 12.1269 8.79357 12.5 8.33333 12.5C7.8731 12.5 7.5 12.1269 7.5 11.6667V8.33333C7.03976 8.33333 6.66667 7.96024 6.66667 7.5ZM8.33333 4.16667C7.8731 4.16667 7.5 4.53976 7.5 5C7.5 5.46024 7.8731 5.83333 8.33333 5.83333C8.79357 5.83333 9.16667 5.46024 9.16667 5C9.16667 4.53976 8.79357 4.16667 8.33333 4.16667Z" fill="currentColor" fillOpacity="0.5"/>
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
      <path d="M0.666626 4.66675L4.66661 0.666748L8.66663 4.66675M4.66661 1.33341V11.3334" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
      <path d="M8.66663 7.33341L4.66664 11.3334L0.666626 7.33341M4.66664 10.6667V0.666748" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}


function TikTokIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M11.623 5.476C10.436 5.476 9.338 5.099 8.44 4.458V9.115C8.44 11.445 6.551 13.333 4.22 13.333c-.87 0-1.678-.263-2.35-.714C.743 11.863 0 10.575 0 9.115 0 6.786 1.89 4.897 4.22 4.897c.194 0 .388.013.58.039v.517l-.001 1.816c-.185-.059-.38-.09-.586-.09-1.066 0-1.931.865-1.931 1.93 0 .753.432 1.406 1.073 1.724.261.132.555.206.858.206 1.064 0 1.928-.86 1.932-1.923V0h2.296v.294c.009.087.02.175.035.262.16.909.704 1.687 1.458 2.158.507.317 1.093.484 1.69.483v1.78Z" fill="currentColor"/></svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.333 1.141c1.691 0 1.891.007 2.56.037.4.005.8.079 1.175.218.275.102.524.264.728.474.21.204.372.453.474.728.14.377.213.774.218 1.176.03.675.037.876.037 2.566s-.006 1.891-.037 2.56a3.6 3.6 0 0 1-.218 1.175 2.16 2.16 0 0 1-.474.728 2.16 2.16 0 0 1-.728.474c-.377.14-.774.213-1.176.218-.675.03-.876.037-2.559.037s-1.891-.006-2.56-.037a3.6 3.6 0 0 1-1.175-.218 2.16 2.16 0 0 1-.728-.474 2.16 2.16 0 0 1-.474-.728 3.6 3.6 0 0 1-.218-1.176c-.03-.675-.037-.876-.037-2.559s.007-1.891.037-2.56c.005-.4.079-.8.218-1.175.102-.275.264-.524.474-.728a2.16 2.16 0 0 1 .728-.474c.377-.14.774-.213 1.176-.218.675-.03.876-.037 2.559-.037Zm0-1.141C4.614 0 4.398.007 3.722.038A4.75 4.75 0 0 0 2.185.332a3.3 3.3 0 0 0-1.122.731A3.3 3.3 0 0 0 .332 2.185 4.75 4.75 0 0 0 .039 3.722C.007 4.398 0 4.614 0 6.333s.007 1.936.038 2.611c.01.526.11 1.045.294 1.537.16.423.409.806.731 1.122.316.322.7.572 1.122.731.493.184 1.012.284 1.537.294.676.032.891.039 2.611.039s1.936-.008 2.611-.038a4.75 4.75 0 0 0 1.537-.294 3.3 3.3 0 0 0 1.122-.731c.322-.316.572-.7.731-1.122.184-.493.284-1.012.294-1.537.032-.676.039-.891.039-2.611s-.008-1.936-.038-2.611a4.75 4.75 0 0 0-.294-1.537 3.3 3.3 0 0 0-.731-1.122A3.3 3.3 0 0 0 10.482.332 4.75 4.75 0 0 0 8.944.039C8.269.007 8.053 0 6.333 0Zm0 3.08a3.253 3.253 0 1 0 0 6.506 3.253 3.253 0 0 0 0-6.505Zm0 5.364a2.111 2.111 0 1 1 0-4.222 2.111 2.111 0 0 1 0 4.222Zm3.381-6.252a.76.76 0 1 0 0 1.52.76.76 0 0 0 0-1.52Z" fill="currentColor"/></svg>
  );
}


function MatchCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M8.665.665c1.948 0 3.83.71 5.29 2C15.417 3.952 16.358 5.73 16.602 7.662c.244 1.933-.225 3.888-1.32 5.5a8.003 8.003 0 0 1-4.627 3.251 8.003 8.003 0 0 1-5.622-.62 8.003 8.003 0 0 1-3.806-4.183 8.003 8.003 0 0 1-.089-5.655A8.003 8.003 0 0 1 4.811 1.654" stroke="#34D399" strokeWidth="1.33" strokeLinecap="round"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      <defs>
        <filter id="sparkle_drop" x="0" y="0" width="88" height="88" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="2"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.145098 0 0 0 0 0.145098 0 0 0 0 0.145098 0 0 0 0.12 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
        </filter>
        <filter id="sparkle_inner" x="10.1667" y="8.1665" width="67.6667" height="68.6665" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
          <feBlend mode="plus-lighter" in2="shape" result="effect1_innerShadow"/>
        </filter>
        <linearGradient id="sparkle_fill" x1="44" y1="8.6665" x2="44" y2="75.3332" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9025"/>
          <stop offset="1" stopColor="#FF3FD5"/>
        </linearGradient>
        <linearGradient id="sparkle_stroke1" x1="44" y1="8.6665" x2="44" y2="75.3332" gradientUnits="userSpaceOnUse">
          <stop/><stop offset="0.5"/><stop offset="1"/>
        </linearGradient>
        <linearGradient id="sparkle_stroke2" x1="44" y1="8.6665" x2="44" y2="75.3332" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9025"/>
          <stop offset="1" stopColor="#FF3FD5"/>
        </linearGradient>
        <linearGradient id="sparkle_overlay" x1="44" y1="8.6665" x2="44" y2="75.3332" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9025"/>
          <stop offset="0.5" stopColor="#FF3FD5"/>
          <stop offset="1" stopColor="#FF3FD5" stopOpacity="0.2"/>
        </linearGradient>
        <radialGradient id="sparkle_rad1" cx="0" cy="0" r="1" gradientTransform="matrix(-2.66667 -36.2838 -21.0531 20.5668 32.5715 76.8814)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00994D"/>
          <stop offset="1" stopColor="#00994D" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="sparkle_rad2" cx="0" cy="0" r="1" gradientTransform="matrix(2.47521 -33.6787 21.1705 20.6814 53.9048 75.6786)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00994D"/>
          <stop offset="1" stopColor="#00994D" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <g filter="url(#sparkle_drop)">
        <path d="M43.9997 8.4165C45.5821 8.4165 46.9776 9.45452 47.4323 10.9702C49.8224 18.9373 52.9138 24.5962 57.1589 28.8413C61.404 33.0863 67.063 36.1778 75.03 38.5679C76.5454 39.0227 77.5835 40.4173 77.5837 41.9995C77.5837 43.5819 76.5455 44.9773 75.03 45.4321C67.0628 47.8223 61.404 50.9136 57.1589 55.1587C52.9138 59.4038 49.8224 65.0627 47.4323 73.0298C46.9775 74.5453 45.582 75.5835 43.9997 75.5835C42.4175 75.5834 41.0228 74.5452 40.5681 73.0298C38.1779 65.0628 35.0865 59.4038 30.8415 55.1587C26.5964 50.9136 20.9375 47.8223 12.9704 45.4321C11.4547 44.9774 10.4167 43.5819 10.4167 41.9995C10.4168 40.4172 11.4548 39.0226 12.9704 38.5679C20.9375 36.1777 26.5964 33.0864 30.8415 28.8413C35.0866 24.5962 38.1779 18.9373 40.5681 10.9702C41.0227 9.45464 42.4174 8.41665 43.9997 8.4165Z" fill="url(#sparkle_fill)"/>
        <path d="M43.9997 8.4165C45.5821 8.4165 46.9776 9.45452 47.4323 10.9702C49.8224 18.9373 52.9138 24.5962 57.1589 28.8413C61.404 33.0863 67.063 36.1778 75.03 38.5679C76.5454 39.0227 77.5835 40.4173 77.5837 41.9995C77.5837 43.5819 76.5455 44.9773 75.03 45.4321C67.0628 47.8223 61.404 50.9136 57.1589 55.1587C52.9138 59.4038 49.8224 65.0627 47.4323 73.0298C46.9775 74.5453 45.582 75.5835 43.9997 75.5835C42.4175 75.5834 41.0228 74.5452 40.5681 73.0298C38.1779 65.0628 35.0865 59.4038 30.8415 55.1587C26.5964 50.9136 20.9375 47.8223 12.9704 45.4321C11.4547 44.9774 10.4167 43.5819 10.4167 41.9995C10.4168 40.4172 11.4548 39.0226 12.9704 38.5679C20.9375 36.1777 26.5964 33.0864 30.8415 28.8413C35.0866 24.5962 38.1779 18.9373 40.5681 10.9702C41.0227 9.45464 42.4174 8.41665 43.9997 8.4165Z" stroke="url(#sparkle_stroke1)" strokeOpacity="0.1" strokeWidth="0.5"/>
        <path d="M43.9997 8.4165C45.5821 8.4165 46.9776 9.45452 47.4323 10.9702C49.8224 18.9373 52.9138 24.5962 57.1589 28.8413C61.404 33.0863 67.063 36.1778 75.03 38.5679C76.5454 39.0227 77.5835 40.4173 77.5837 41.9995C77.5837 43.5819 76.5455 44.9773 75.03 45.4321C67.0628 47.8223 61.404 50.9136 57.1589 55.1587C52.9138 59.4038 49.8224 65.0627 47.4323 73.0298C46.9775 74.5453 45.582 75.5835 43.9997 75.5835C42.4175 75.5834 41.0228 74.5452 40.5681 73.0298C38.1779 65.0628 35.0865 59.4038 30.8415 55.1587C26.5964 50.9136 20.9375 47.8223 12.9704 45.4321C11.4547 44.9774 10.4167 43.5819 10.4167 41.9995C10.4168 40.4172 11.4548 39.0226 12.9704 38.5679C20.9375 36.1777 26.5964 33.0864 30.8415 28.8413C35.0866 24.5962 38.1779 18.9373 40.5681 10.9702C41.0227 9.45464 42.4174 8.41665 43.9997 8.4165Z" stroke="url(#sparkle_stroke2)" strokeWidth="0.5"/>
        <g filter="url(#sparkle_inner)">
          <path d="M47.1928 11.042C46.7698 9.63206 45.472 8.6665 44 8.6665C42.528 8.6665 41.2303 9.63206 40.8073 11.042C38.4095 19.0347 35.3012 24.7346 31.018 29.0178C26.7348 33.301 21.0349 36.4093 13.0422 38.8071C11.6322 39.2301 10.6667 40.5278 10.6667 41.9998C10.6667 43.4719 11.6322 44.7696 13.0422 45.1926C21.0349 47.5904 26.7348 50.6986 31.018 54.9819C35.3012 59.2651 38.4095 64.965 40.8073 72.9577C41.2303 74.3676 42.528 75.3332 44 75.3332C45.472 75.3332 46.7698 74.3676 47.1928 72.9577C49.5906 64.965 52.6988 59.2651 56.982 54.9819C61.2653 50.6986 66.9652 47.5904 74.9578 45.1926C76.3678 44.7696 77.3334 43.4719 77.3334 41.9998C77.3334 40.5278 76.3678 39.2301 74.9578 38.8071C66.9652 36.4093 61.2653 33.301 56.982 29.0178C52.6988 24.7346 49.5906 19.0347 47.1928 11.042Z" fill="url(#sparkle_overlay)" fillOpacity="0.2"/>
          <path d="M43.9997 8.4165C45.5821 8.4165 46.9776 9.45452 47.4323 10.9702C49.8224 18.9373 52.9138 24.5962 57.1589 28.8413C61.404 33.0863 67.063 36.1778 75.03 38.5679C76.5454 39.0227 77.5835 40.4173 77.5837 41.9995C77.5837 43.5819 76.5455 44.9773 75.03 45.4321C67.0628 47.8223 61.404 50.9136 57.1589 55.1587C52.9138 59.4038 49.8224 65.0627 47.4323 73.0298C46.9775 74.5453 45.582 75.5835 43.9997 75.5835C42.4175 75.5834 41.0228 74.5452 40.5681 73.0298C38.1779 65.0628 35.0865 59.4038 30.8415 55.1587C26.5964 50.9136 20.9375 47.8223 12.9704 45.4321C11.4547 44.9774 10.4167 43.5819 10.4167 41.9995C10.4168 40.4172 11.4548 39.0226 12.9704 38.5679C20.9375 36.1777 26.5964 33.0864 30.8415 28.8413C35.0866 24.5962 38.1779 18.9373 40.5681 10.9702C41.0227 9.45464 42.4174 8.41665 43.9997 8.4165Z" stroke="url(#sparkle_rad1)" strokeWidth="0.5"/>
          <path d="M43.9997 8.4165C45.5821 8.4165 46.9776 9.45452 47.4323 10.9702C49.8224 18.9373 52.9138 24.5962 57.1589 28.8413C61.404 33.0863 67.063 36.1778 75.03 38.5679C76.5454 39.0227 77.5835 40.4173 77.5837 41.9995C77.5837 43.5819 76.5455 44.9773 75.03 45.4321C67.0628 47.8223 61.404 50.9136 57.1589 55.1587C52.9138 59.4038 49.8224 65.0627 47.4323 73.0298C46.9775 74.5453 45.582 75.5835 43.9997 75.5835C42.4175 75.5834 41.0228 74.5452 40.5681 73.0298C38.1779 65.0628 35.0865 59.4038 30.8415 55.1587C26.5964 50.9136 20.9375 47.8223 12.9704 45.4321C11.4547 44.9774 10.4167 43.5819 10.4167 41.9995C10.4168 40.4172 11.4548 39.0226 12.9704 38.5679C20.9375 36.1777 26.5964 33.0864 30.8415 28.8413C35.0866 24.5962 38.1779 18.9373 40.5681 10.9702C41.0227 9.45464 42.4174 8.41665 43.9997 8.4165Z" stroke="url(#sparkle_rad2)" strokeWidth="0.5"/>
        </g>
      </g>
    </svg>
  );
}

function SparkleStarBg() {
  const starPath = "M33.833 0.25C35.4154 0.25 36.8109 1.28802 37.2656 2.80371C39.6558 10.7708 42.7471 16.4297 46.9922 20.6748C51.2373 24.9198 56.8963 28.0113 64.8633 30.4014C66.3787 30.8561 67.4168 32.2508 67.417 33.833C67.417 35.4154 66.3788 36.8108 64.8633 37.2656C56.8962 39.6558 51.2373 42.7471 46.9922 46.9922C42.7471 51.2373 39.6558 56.8962 37.2656 64.8633C36.8108 66.3788 35.4154 67.417 33.833 67.417C32.2508 67.4168 30.8561 66.3787 30.4014 64.8633C28.0113 56.8963 24.9198 51.2373 20.6748 46.9922C16.4297 42.7471 10.7708 39.6558 2.80371 37.2656C1.28802 36.8109 0.25 35.4154 0.25 33.833C0.250143 32.2507 1.28814 30.8561 2.80371 30.4014C10.7708 28.0112 16.4297 24.9199 20.6748 20.6748C24.9199 16.4297 28.0112 10.7708 30.4014 2.80371C30.8561 1.28814 32.2507 0.250143 33.833 0.25Z";
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <defs>
        <linearGradient id="star_bg_fill" x1="33.8333" y1="0.5" x2="33.8333" y2="67.1667" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9025"/>
          <stop offset="1" stopColor="#FF3FD5"/>
        </linearGradient>
        <linearGradient id="star_bg_stroke1" x1="33.8333" y1="0.5" x2="33.8333" y2="67.1667" gradientUnits="userSpaceOnUse">
          <stop/><stop offset="0.5"/><stop offset="1"/>
        </linearGradient>
        <linearGradient id="star_bg_stroke2" x1="33.8333" y1="0.5" x2="33.8333" y2="67.1667" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9025"/>
          <stop offset="1" stopColor="#FF3FD5"/>
        </linearGradient>
        <radialGradient id="star_bg_green1" cx="0" cy="0" r="1" gradientTransform="matrix(-2.2 -29.9 -17.4 17 22.3 69.5)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00994D"/>
          <stop offset="1" stopColor="#00994D" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="star_bg_green2" cx="0" cy="0" r="1" gradientTransform="matrix(2 -27.8 17.5 17.1 44.1 69.5)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00994D"/>
          <stop offset="1" stopColor="#00994D" stopOpacity="0"/>
        </radialGradient>
        <filter id="star_bg_inner" x="0" y="0" width="68" height="68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg"/>
          <feBlend mode="normal" in="SourceGraphic" in2="bg" result="shape"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="1"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"/>
          <feBlend mode="plus-lighter" in2="shape" result="innerShadow"/>
        </filter>
      </defs>
      <g filter="url(#star_bg_inner)">
        <path d={starPath} fill="url(#star_bg_fill)"/>
        <path d={starPath} stroke="url(#star_bg_stroke1)" strokeOpacity="0.1" strokeWidth="0.5"/>
        <path d={starPath} stroke="url(#star_bg_stroke2)" strokeWidth="0.5"/>
        <path d={starPath} stroke="url(#star_bg_green1)" strokeWidth="0.5"/>
        <path d={starPath} stroke="url(#star_bg_green2)" strokeWidth="0.5"/>
      </g>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 1a5 5 0 1 0 0 10A5 5 0 0 0 6 1ZM6.5 3.5a.5.5 0 0 0-1 0V6c0 .18.1.34.25.43l2 1.2a.5.5 0 0 0 .5-.86L6.5 5.72V3.5Z" fill="currentColor" fillOpacity="0.4" />
    </svg>
  );
}

// ── Decorative particles for quiz card ─────────────────────────────

function QuizParticles() {
  const dots = [
    { x: 46.6, y: 83.6, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 40.1, y: 1.8, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 89.5, y: 142.7, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 97.9, y: 119.3, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 68, y: 29.7, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 31.7, y: 42.1, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 0.5, y: 53.8, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 21.9, y: 68, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 1.2, y: 16.1, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 31, y: 0.5, size: 2.6, blur: 2, opacity: 0.3 },
    { x: 74.5, y: 27.1, size: 2.6, blur: 2, opacity: 0.3 },
    // Smaller right cluster
    { x: 95.6, y: 64.9, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 90.7, y: 3.6, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 127.7, y: 109.3, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 134, y: 91.7, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 111.7, y: 24.5, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 84.4, y: 33.8, size: 1.95, blur: 0.5, opacity: 0.3 },
    // Smaller left cluster (mirrored)
    { x: 3.5, y: 46.9, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 8.3, y: 108.3, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 38, y: 69.3, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 14.7, y: 78.1, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 22, y: 58.6, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 37.6, y: 97.6, size: 1.95, blur: 0.5, opacity: 0.3 },
    { x: 15.2, y: 109.3, size: 1.95, blur: 0.5, opacity: 0.3 },
  ];

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 h-[145px] w-[171px] -translate-x-1/2">
      {dots.map((d, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: "linear-gradient(180deg, #FF9025 0%, #FF3FD5 100%)",
            opacity: d.opacity,
            filter: `blur(${d.blur}px)`,
          }}
        />
      ))}
    </div>
  );
}

// ── Campaign data ──────────────────────────────────────────────────

const campaigns = [
  {
    id: 1,
    brand: "Sound Network",
    brandLogo: "/creator-home/brand-logo-1.png",
    verified: true,
    title: "Call of Duty BO7 Official Clipping Campaign",
    description:
      "We're launching a campaign to promote the new Call of Duty Warzone mode: Black Ops Royale. It is inspired from Call of Duty's first Battle Royale, Blackout.",
    thumbnail: "/creator-home/campaign-thumb-1.png",
    postedAgo: "5d",
    applicationRequired: true,
    matchScore: 92,
    platforms: ["tiktok", "instagram"] as const,
    category: "Gaming",
    creators: "121.4K",
    cpmRate: "$1.50/1k",
    budgetSpent: "$8,677",
    budgetTotal: "$37,500",
    budgetPercent: 23,
  },
  {
    id: 2,
    brand: "Clipping Culture",
    brandLogo: "/creator-home/brand-logo-2.png",
    verified: true,
    title: "Harry Styles Podcast x Shania Twain Clipping [7434]",
    description:
      "Clip the best moments from the Harry Styles podcast featuring Shania Twain. Focus on viral-worthy reactions and highlights.",
    thumbnail: "/creator-home/campaign-thumb-2.png",
    postedAgo: "2d",
    applicationRequired: false,
    matchScore: 87,
    platforms: ["tiktok"] as const,
    category: "Music",
    creators: "54.2K",
    cpmRate: "$2.00/1k",
    budgetSpent: "$3,561",
    budgetTotal: "$15,000",
    budgetPercent: 24,
  },
  {
    id: 3,
    brand: "Scene Society",
    brandLogo: "/creator-home/brand-logo-3.png",
    verified: true,
    title: "Mumford & Sons | Prizefighter Clipping",
    description:
      "Create engaging clips from Mumford & Sons' Prizefighter content. Looking for high-energy moments that resonate with music fans.",
    thumbnail: "/creator-home/campaign-thumb-3.png",
    postedAgo: "1d",
    applicationRequired: true,
    matchScore: 95,
    platforms: ["tiktok", "instagram"] as const,
    category: "Music",
    creators: "32.1K",
    cpmRate: "$1.80/1k",
    budgetSpent: "$1,240",
    budgetTotal: "$10,000",
    budgetPercent: 12,
  },
];

// ── Page Component ─────────────────────────────────────────────────

// ── Quiz stepper icons ─────────────────────────────────────────────

function UserCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.667 13.333c3.682 0 6.666-2.984 6.666-6.666C13.333 2.985 10.349 0 6.667 0 2.985 0 0 2.985 0 6.667c0 3.682 2.985 6.666 6.667 6.666Zm2-8c0 1.105-.896 2-2 2-1.105 0-2-.895-2-2 0-1.104.895-2 2-2 1.104 0 2 .896 2 2ZM6.667 12c-1.492 0-2.841-.613-3.81-1.6.889-1.063 2.213-1.733 3.81-1.733 1.597 0 2.922.67 3.81 1.733A5.321 5.321 0 0 1 6.667 12Z" fill="currentColor"/>
    </svg>
  );
}

function VideoPlaylistStepIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.333.667C1.333.298 1.632 0 2 0h9.333c.369 0 .667.298.667.667 0 .368-.298.666-.667.666H2c-.368 0-.667-.298-.667-.666ZM0 4c0-1.105.895-2 2-2h9.333c1.105 0 2 .895 2 2v6c0 1.105-.895 2-2 2H2c-1.105 0-2-.895-2-2V4Zm5.711 1.066a.667.667 0 0 1 .705.08l1.667 1.333a.667.667 0 0 1 0 1.042L6.416 8.854a.667.667 0 0 1-1.083-.521V5.667c0-.257.148-.49.378-.601Z" fill="currentColor"/>
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12.3843 1.71226C12.1884 1.12457 11.4425 0.948489 11.0045 1.38653L9.25237 3.13865C8.8773 3.51373 8.66659 4.02244 8.66659 4.55287V6.39111L7.52851 7.52918C7.26816 7.78953 7.26816 8.21164 7.52851 8.47199C7.78886 8.73234 8.21097 8.73234 8.47132 8.47199L9.60939 7.33392H11.4476C11.9781 7.33392 12.4868 7.1232 12.8618 6.74813L14.614 4.99601C15.052 4.55797 14.8759 3.81208 14.2882 3.61618L12.8603 3.1402L12.3843 1.71226Z" fill="currentColor"/>
      <path d="M2.66659 8.00016C2.66659 5.05464 5.0544 2.66683 7.99992 2.66683C8.36811 2.66683 8.66659 2.36835 8.66659 2.00016C8.66659 1.63197 8.36811 1.3335 7.99992 1.3335C4.31802 1.3335 1.33325 4.31826 1.33325 8.00016C1.33325 11.6821 4.31802 14.6668 7.99992 14.6668C11.6818 14.6668 14.6666 11.6821 14.6666 8.00016C14.6666 7.63197 14.3681 7.3335 13.9999 7.3335C13.6317 7.3335 13.3333 7.63197 13.3333 8.00016C13.3333 10.9457 10.9454 13.3335 7.99992 13.3335C5.0544 13.3335 2.66659 10.9457 2.66659 8.00016Z" fill="currentColor"/>
      <path d="M7.19969 5.45538C7.55096 5.34506 7.74628 4.97086 7.63595 4.61959C7.52562 4.26831 7.15142 4.07299 6.80015 4.18332C5.17791 4.69283 3.99992 6.20802 3.99992 8.00008C3.99992 10.2092 5.79078 12.0001 7.99992 12.0001C9.79205 12.0001 11.3073 10.822 11.8167 9.19968C11.927 8.8484 11.7317 8.47421 11.3804 8.3639C11.0292 8.25359 10.655 8.44893 10.5447 8.8002C10.2047 9.88276 9.19299 10.6668 7.99992 10.6668C6.52716 10.6668 5.33325 9.47284 5.33325 8.00008C5.33325 6.80705 6.11719 5.79538 7.19969 5.45538Z" fill="currentColor"/>
    </svg>
  );
}

function StepCheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.667 0C2.985 0 0 2.985 0 6.667c0 3.682 2.985 6.666 6.667 6.666 3.682 0 6.666-2.984 6.666-6.666C13.333 2.985 10.349 0 6.667 0Zm2.515 5.422a.667.667 0 0 0-1.032-.938L5.617 7.674l-.812-.812a.667.667 0 0 0-.943.943l1.333 1.333a.667.667 0 0 0 .987-.05l3-3.666Z" fill="currentColor"/>
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.067 3.467a.667.667 0 0 1 .133.933l-2 2.667a.667.667 0 0 1-.903.155l-1-.667a.667.667 0 1 1 .74-1.11l.476.317 1.621-2.162a.667.667 0 0 1 .933-.133ZM8 5.334a.667.667 0 0 1 .667-.667h4.666a.667.667 0 1 1 0 1.333H8.667A.667.667 0 0 1 8 5.334Zm-1.933 3.466a.667.667 0 0 1 .133.934l-2 2.666a.667.667 0 0 1-.903.155l-1-.666a.667.667 0 1 1 .74-1.111l.475.317 1.622-2.162a.667.667 0 0 1 .933-.133ZM8 10.667a.667.667 0 0 1 .667-.667h4.666a.667.667 0 1 1 0 1.333H8.667A.667.667 0 0 1 8 10.667Z" fill="currentColor"/>
    </svg>
  );
}

// ── Quiz step data ─────────────────────────────────────────────────

const quizStepsMeta = [
  { id: "you", label: "You" },
  { id: "content", label: "Content" },
  { id: "experience", label: "Experience" },
  { id: "goals", label: "Goals" },
  { id: "done", label: "All done" },
] as const;

// Maps quiz question index → which stepper step is active
// q0-1 = You; q2-5 = Content; q6-10 = Experience; q11-17 = Goals
const questionToStep = [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3];

const quizQuestions = [
  // ── You (step 0) ──
  { question: "What\u2019s your age range?", subtitle: null, options: ["14-17", "18-24", "25-34", "35-44", "45-54", "55+"], multi: false },
  { question: "Where are you based?", subtitle: null, options: ["United States", "United Kingdom", "Canada", "Germany", "Brazil", "India", "Philippines", "Nigeria", "Mexico", "Australia", "France", "Japan", "South Korea", "Other"], multi: false },
  // ── Content (step 1) ──
  { question: "What language(s) do you create content in?", subtitle: "Pick at least one", options: ["English", "Spanish", "Portuguese", "French", "German", "Arabic", "Hindi", "Japanese", "Korean", "Other"], multi: true },
  { question: "What niches best describe your content?", subtitle: "Select up to 5", options: ["Entertainment", "Gaming", "Tech", "Lifestyle", "Sports", "Beauty", "Music", "Health", "News", "Crypto"], multi: true },
  { question: "What type of gaming content do you create?", subtitle: "Pick at least one", options: ["FPS/Battle Royal", "Sports games", "RPG/MMO", "Mobile gaming", "Strategy/Sim", "Fighting games", "Retro/Indy"], multi: true },
  { question: "What content formats do you create?", subtitle: "Pick at least one", options: ["Short clips (<60s)", "Mid-form (1-3min)", "Long form (10+ min)", "Livestreams", "Stories/Reels"], multi: true },
  // ── Experience (step 2) ──
  { question: "How long have you been creating content?", subtitle: null, options: ["Less than 6 months", "6 months - 1 year", "1-3 years", "3-5 years", "5+ years"], multi: false },
  { question: "Have you done paid brand collaborations?", subtitle: null, options: ["Yes, regularly", "A few times", "Never, but interested", "Not yet"], multi: false },
  { question: "Have you done clipping/reposting campaigns before?", subtitle: "Clipping = taking brand content and reposting to your channels for views", options: ["Yes, I\u2019m experienced", "I\u2019ve tried it once or twice", "No, but I\u2019m interested", "What\u2019s clipping?"], multi: false },
  { question: "How much have you earned total from content creation?", subtitle: "Include all sources: creator funds, brand deals, tips, etc.", options: ["$0 (haven\u2019t earned yet)", "Under $100", "$100-$1,000", "$1,000-$5,000", "$5,000-$25,000", "$25,000-$100,000", "$100,000+"], multi: false },
  { question: "What other creator programs or platforms have you used?", subtitle: "Select at least one", options: ["TikTok Creator Fund", "Youtube Partner Program", "Instagram bonuses/Reels play", "Kick/Twitch", "Whop", "Patreon/Ko-fi", "Clipping networks", "Fiverr/Upwork", "Brand deal platforms", "None yet"], multi: true },
  // ── Goals (step 3) ──
  { question: "What\u2019s your primary goal on Content Rewards?", subtitle: null, options: ["Earn money from my content", "Grow my audience", "Work with top brands", "Build my content portfolio", "All of the above"], multi: false },
  { question: "What monthly earning target would motivate you?", subtitle: null, options: ["$50-$100", "$100-$500", "$500-$2,000", "$2,000-$5,000", "$5,000+"], multi: false },
  { question: "How do you prefer to get paid?", subtitle: "Clipping campaigns pay per view (CPM). Retainers pay a fixed monthly rate for ongoing work.", options: ["CPM - I want to earn per view", "Retainer - I want steady monthly income", "Both - I\u2019ll take either", "Not sure yet"], multi: false },
  { question: "What type of content work are you open to?", subtitle: "Select at least one", options: ["Clipping/reposting brand content", "UGC - creating original videos for brands", "Posting content on my accounts", "Live streaming sponsored content", "Review/unboxing products"], multi: true },
  { question: "What brand categories interest you?", subtitle: "Select at least one", options: ["Entertainment", "Gaming", "Tech", "Lifestyle", "Sports", "Beauty", "Music", "Health", "News", "Crypto"], multi: true },
  { question: "How many hours per week do you spend on content?", subtitle: null, options: ["Less than 5 hours", "5-15 hours", "15-30 hours", "30+ hours", "Full-time creator"], multi: false },
];

export default function CreatorForYouPage() {
  const [stage, setStage] = useState<"quiz" | "quiz-questions" | "feed">("quiz");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string[]>>({});
  const [detailOpen, setDetailOpen] = useState(false);
  const campaign = campaigns[currentIndex];

  const goNext = () => setCurrentIndex((i) => Math.min(campaigns.length - 1, i + 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));

  const platformIcon = (p: "tiktok" | "instagram") => {
    if (p === "tiktok") return <TikTokIcon />;
    return <InstagramIcon />;
  };

  // ── Quiz intro stage ──────────────────────────────────────────
  if (stage === "quiz") {
    return (
      <div className="relative flex h-[calc(100svh-60px)] flex-col overflow-hidden bg-page-bg font-inter tracking-[-0.02em] md:min-h-screen md:overflow-visible md:bg-[#FBFBFB] dark:bg-page-bg">
        {/* Background gradients — hidden on mobile */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-12px] hidden h-[712px] md:block" style={{
          background: "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.16) 0%, rgba(255,63,213,0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.5) 0%, rgba(255,144,37,0) 100%)",
        }} />

        {/* Header */}
        <CreatorHeader title="For you" className="relative z-10 md:border-transparent md:bg-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-5 md:px-12 lg:px-[156px]">
          {/* Quiz card */}
          <div className="relative isolate flex w-full max-w-[400px] flex-col items-center gap-6 overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg">

            {/* Subtle ellipse glow — inside card, anchored to bottom */}
            <div
              className="pointer-events-none absolute bottom-[204px] left-1/2 z-[1] h-[642px] w-[636px] -translate-x-1/2 rounded-full"
              style={{
                background: "linear-gradient(180deg, rgba(255,144,37,0.04) 83.1%, rgba(255,63,213,0.04) 91.55%, rgba(255,63,213,0) 100%)",
              }}
            />

            {/* Sparkle icon */}
            <div className="relative z-[2] flex size-20 items-center justify-center">
              <SparkleStarBg />
              <SparkleIcon />
            </div>

            {/* Text */}
            <div className="relative z-[3] flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-lg font-medium tracking-[-0.02em] text-page-text dark:text-[#E0E0E0]">Find your perfect fit</h2>
                <p className="max-w-[320px] text-center text-sm leading-[150%] tracking-[-0.02em] text-page-text-subtle dark:text-[rgba(224,224,224,0.5)]">
                  Answer a few quick questions and we will match you with campaigns that fit your style, audience, and goals.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center gap-2.5">
                <button
                  onClick={() => setStage("quiz-questions")}
                  className="rounded-full px-5 py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-transform hover:scale-105 dark:text-[#252525]"
                  style={{
                    background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207",
                  }}
                >
                  Take the quiz
                </button>
                <div className="flex items-center gap-1">
                  <ClockIcon />
                  <span className="text-xs tracking-[-0.02em] text-foreground/40 dark:text-[rgba(224,224,224,0.4)]">Takes about 2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz questions stage ─────────────────────────────────────
  if (stage === "quiz-questions") {
    const stepIcons = [
      <UserCircleIcon key="you" />,
      <VideoPlaylistStepIcon key="content" />,
      <ChecklistIcon key="experience" />,
      <TargetIcon key="goals" />,
      <StepCheckCircleIcon key="done" />,
    ];

    const activeStepIdx = questionToStep[quizStep] ?? 0;
    const q = quizQuestions[quizStep];
    const selected = quizAnswers[quizStep] ?? [];

    // Compute progress within current step for progressive connector line
    const stepQuestionRanges: [number, number][] = [];
    {
      let prev = -1;
      for (let qi = 0; qi < questionToStep.length; qi++) {
        const si = questionToStep[qi];
        if (si !== prev) { stepQuestionRanges[si] = [qi, qi]; prev = si; }
        else { stepQuestionRanges[si][1] = qi; }
      }
    }
    const getStepProgress = (stepIdx: number) => {
      const range = stepQuestionRanges[stepIdx];
      if (!range) return 0;
      const [start, end] = range;
      const total = end - start + 1;
      const done = Math.max(0, quizStep - start);
      return Math.min(done / total, 1);
    };

    const toggleOption = (opt: string) => {
      setQuizAnswers((prev) => {
        const curr = prev[quizStep] ?? [];
        if (q.multi) {
          return { ...prev, [quizStep]: curr.includes(opt) ? curr.filter((o) => o !== opt) : [...curr, opt] };
        }
        // Single select — replace and auto-advance
        const newAnswers = { ...prev, [quizStep]: curr.includes(opt) ? [] : [opt] };
        if (!curr.includes(opt)) {
          setTimeout(goForward, 0);
        }
        return newAnswers;
      });
    };

    const goBack = () => {
      if (quizStep > 0) setQuizStep((s) => s - 1);
      else setStage("quiz");
    };

    const goForward = () => {
      if (quizStep < quizQuestions.length - 1) setQuizStep((s) => s + 1);
      else setStage("feed");
    };

    return (
      <div className="relative flex h-[calc(100svh-60px)] flex-col overflow-hidden bg-page-bg font-inter tracking-[-0.02em] md:min-h-screen md:overflow-visible md:bg-[#FBFBFB] dark:bg-page-bg">
        {/* Background gradients — hidden on mobile */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[-12px] hidden h-[712px] md:block" style={{
          background: "radial-gradient(31.76% 50.52% at 64.86% 100.52%, rgba(255,63,213,0.16) 0%, rgba(255,63,213,0) 100%), radial-gradient(31.58% 54.43% at 32.86% 102.32%, rgba(255,144,37,0.5) 0%, rgba(255,144,37,0) 100%)",
        }} />

        {/* Header */}
        <CreatorHeader title="For you" className="relative z-10 md:border-transparent md:bg-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-5 md:px-12 lg:px-[156px]">
          {/* Quiz card */}
          <div className="relative isolate flex max-h-[calc(100svh-160px)] w-full max-w-[720px] flex-col items-center gap-6 overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white px-4 pb-6 pt-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-card-bg sm:max-h-[560px] sm:px-6 md:px-8">
            {/* Back button */}
            <button
              onClick={goBack}
              className="absolute left-6 top-6 z-[4] flex size-5 items-center justify-center rounded-full bg-foreground/[0.12] transition-colors hover:bg-foreground/[0.20]"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Skip quiz */}
            <button
              onClick={() => setStage("feed")}
              className="absolute right-6 top-7 z-[4] text-xs font-medium tracking-[-0.02em] text-page-text-subtle transition-colors hover:text-page-text"
            >
              Skip quiz
            </button>


            {/* Subtle ellipse glow */}
            <div
              className="pointer-events-none absolute left-1/2 z-[1] h-[642px] w-[636px] -translate-x-1/2 rounded-full"
              style={{
                top: "-580px",
                background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.06) 0%, rgba(255,63,213,0.03) 60%, rgba(255,63,213,0) 100%)",
              }}
            />

            {/* Sparkle icon */}
            <div className="relative z-[2]">
              <SparkleIcon />
            </div>

            {/* Content */}
            <div className="relative z-[3] flex w-full max-w-[400px] flex-col items-center gap-10">
              {/* Title + stepper */}
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-lg font-medium tracking-[-0.02em] text-page-text">Find your perfect fit</h2>

                {/* Stepper */}
                <div className="flex items-start">
                  {quizStepsMeta.map((step, i) => {
                    const isFirst = i === 0;
                    const isLast = i === quizStepsMeta.length - 1;
                    const isActive = i === activeStepIdx;
                    const isPast = i < activeStepIdx;
                    const isActiveOrPast = isActive || isPast;
                    return (
                      <div key={step.id} className="flex items-start">
                        <div className="flex w-11 flex-col items-center gap-1.5 sm:w-16 sm:gap-2">
                          {/* Icon circle */}
                          <div
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full sm:size-9",
                              isActiveOrPast
                                ? "shadow-[inset_0_0_0_0.9px_rgba(229,113,0,0.08),0_1px_2px_rgba(0,0,0,0.03)]"
                                : "bg-white shadow-[inset_0_0_0_0.9px_rgba(37,37,37,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[inset_0_0_0_0.9px_rgba(224,224,224,0.06)]"
                            )}
                            style={isActiveOrPast ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.2) 0%, rgba(255,144,37,0) 90.69%), var(--card-bg, #FFFFFF)" } : undefined}
                          >
                            <span className={isActiveOrPast ? "text-[#E57100] dark:text-[#FB923C]" : "text-page-text-subtle"}>{stepIcons[i]}</span>
                          </div>
                          <span className={cn(
                            "text-xs font-medium tracking-[-0.02em]",
                            isActive ? "text-page-text" : "text-page-text-subtle"
                          )}>
                            {step.label}
                          </span>
                        </div>
                        {/* Connector line between steps */}
                        {!isLast && (
                          <div className="relative mt-[14px] h-px w-4 bg-foreground/[0.06] sm:mt-[18px] sm:w-8">
                            {isPast ? (
                              <div className="absolute inset-0 bg-[#E57100]" />
                            ) : isActive ? (
                              <div
                                className="absolute inset-y-0 left-0 bg-[#E57100] transition-all duration-300"
                                style={{ width: `${getStepProgress(i) * 100}%` }}
                              />
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question + options (scrollable) */}
              <div className="flex min-h-0 w-full flex-1 flex-col gap-3 self-stretch">
                <div className="flex shrink-0 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{q.question}</span>
                    {selected.length > 0 && (
                      <span className="shrink-0 text-xs tracking-[-0.02em] text-[#00994D]">{selected.length} selected</span>
                    )}
                  </div>
                  {q.subtitle && (
                    <span className="text-xs leading-[150%] tracking-[-0.02em] text-page-text-muted">{q.subtitle}</span>
                  )}
                </div>
                <div className="flex min-h-0 flex-1 content-start flex-wrap gap-1.5 overflow-y-auto pb-1 scrollbar-hide">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => toggleOption(opt)}
                      className={cn(
                        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium tracking-[-0.02em] transition-colors",
                        selected.includes(opt)
                          ? "border-[rgba(255,144,37,0.3)] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#FFFFFF] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                          : "border-foreground/[0.06] bg-white text-page-text-muted hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
                      )}
                    >
                      {optionFlags[opt]}
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continue button — pinned at bottom right, hidden for single-select */}
              {q.multi && (
                <div className="flex w-full shrink-0 justify-end">
                  <button
                    onClick={goForward}
                    disabled={selected.length === 0}
                    className={cn(
                      "shrink-0 rounded-full px-8 py-2.5 text-sm font-medium tracking-[-0.02em] text-white transition-opacity",
                      selected.length === 0 ? "pointer-events-none opacity-30" : "opacity-100"
                    )}
                    style={{
                      background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207",
                    }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Campaign feed stage ───────────────────────────────────────
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-page-bg font-inter tracking-[-0.02em]">
      {/* Blurred campaign thumbnail background */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 z-0 h-[700px] w-full -translate-y-1/2 opacity-50"
        style={{
          filter: "blur(50px)",
          backdropFilter: "blur(100px)",
          WebkitBackdropFilter: "blur(100px)",
          maskImage: "radial-gradient(84.57% 84.57% at 50% 50%, #FFFFFF 0%, rgba(255,255,255,0) 35%)",
          WebkitMaskImage: "radial-gradient(84.57% 84.57% at 50% 50%, #FFFFFF 0%, rgba(255,255,255,0) 35%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${campaign.thumbnail})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <CreatorHeader title="For you" className="relative z-10 border-transparent bg-transparent" />

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-4 md:px-12 lg:px-[156px]">
        <div className="flex w-full max-w-[400px] flex-col gap-6">
          {/* ── Campaign card stack ──────────────────────────── */}
          <div className="flex flex-col gap-2">
            {/* Top meta row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MatchCircleIcon />
                <span className="text-xs font-medium text-page-text">{campaign.matchScore}% match</span>
              </div>
              <div className="flex items-center gap-1">
                {campaign.platforms.map((p) => (
                  <span
                    key={p}
                    className="flex size-6 items-center justify-center rounded-full border border-foreground/[0.06] bg-white text-page-text dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]"
                  >
                    {platformIcon(p)}
                  </span>
                ))}
                <span className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2 text-page-text dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  <GamepadIcon className="size-3 text-page-text" />
                  <span className="text-xs font-medium">{campaign.category}</span>
                </span>
              </div>
            </div>

            {/* Main card */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
              {/* Thumbnail area */}
              <div className="relative isolate flex items-center justify-center overflow-hidden" style={{ height: "294px" }}>
                {/* Blurred bg behind image */}
                <div
                  className="absolute -inset-32 z-0 opacity-100"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 29.62%), url(${campaign.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(50px)",
                  }}
                />
                {/* Actual thumbnail */}
                <div
                  className="relative z-10 h-full w-[478px] max-w-none rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${campaign.thumbnail})` }}
                />
              </div>

              {/* Content below thumbnail */}
              <div className="flex flex-col gap-3 px-4 pb-4 pt-3">
                {/* Brand row */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={campaign.brandLogo}
                        alt={campaign.brand}
                        className="size-4 rounded-full border border-foreground/[0.06] object-cover dark:border-[rgba(224,224,224,0.03)]"
                      />
                      <span className="text-xs font-medium tracking-[-0.24px] text-page-text">{campaign.brand}</span>
                      {campaign.verified && <VerifiedBadge />}
                    </div>
                    <span className="text-xs text-foreground/20">&middot;</span>
                    <span className="text-xs text-page-text-subtle">{campaign.postedAgo}</span>
                  </div>
                  {campaign.applicationRequired && (
                    <span className="text-xs text-page-text-subtle">Application required</span>
                  )}
                </div>

                {/* Title + description */}
                <div className="flex flex-col gap-1.5">
                  <h2 className="line-clamp-2 text-sm font-medium tracking-[-0.28px] text-page-text">{campaign.title}</h2>
                  <p className="line-clamp-2 text-sm leading-[150%] tracking-[-0.28px] text-page-text-muted">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
              <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-1 flex-wrap items-center gap-1">
                  {/* Creators pill */}
                  <span className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <UsersIcon />
                    <span className="text-xs font-medium text-page-text">{campaign.creators}</span>
                  </span>
                  {/* CPM pill */}
                  <span className="flex h-6 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white px-2 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <svg width="12" height="12" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.164 0C9.8.0 12.358 1.515 14.069 4.389c.346.582.346 1.307 0 1.889C12.358 9.152 9.799 10.667 7.164 10.667 4.53 10.667 1.971 9.152.26 6.278c-.346-.582-.346-1.307 0-1.89C1.971 1.515 4.53 0 7.164 0ZM4.831 5.333a2.333 2.333 0 1 1 4.667 0 2.333 2.333 0 0 1-4.667 0Z" fill="#1A67E5"/></svg>
                    <span className="text-xs font-medium text-[#1A67E5]">{campaign.cpmRate}</span>
                  </span>
                </div>
                {/* Budget */}
                <div className="flex items-center gap-0.5 text-xs">
                  <span className="font-medium text-page-text">{campaign.budgetSpent}</span>
                  <span className="text-page-text-muted">/</span>
                  <span className="text-page-text-muted">{campaign.budgetTotal}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full bg-foreground/[0.06] dark:bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-page-text"
                  style={{ width: `${campaign.budgetPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Action buttons ───────────────────────────────── */}
          <div className="flex items-center justify-center gap-4 pb-3 sm:gap-6">
            {/* Skip */}
            <button
              onClick={goNext}
              className="flex flex-col items-center gap-2.5"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10] sm:size-12">
                <SkipIcon />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-page-text-subtle">Skip</span>
                <span className="text-xs text-foreground/30">S</span>
              </div>
            </button>

            {/* Join */}
            <button className="flex flex-col items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-[40px] shadow-lg transition-transform hover:scale-105 sm:size-12" style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}>
                <PlusIcon />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-page-text-subtle">Join</span>
                <span className="text-xs text-foreground/30">J</span>
              </div>
            </button>

            {/* View */}
            <button onClick={() => setDetailOpen(true)} className="flex flex-col items-center gap-2.5">
              <div className="flex size-10 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10] sm:size-12">
                <InfoIcon />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-page-text-subtle">View</span>
                <span className="text-xs text-foreground/30">V</span>
              </div>
            </button>
          </div>
        </div>

        {/* ── Side navigation arrows ────────────────────────── */}
        <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
          <button
            onClick={goPrev}
            className={cn(
              "flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]",
              currentIndex === 0 && "pointer-events-none opacity-30"
            )}
          >
            <ArrowUpIcon />
          </button>
          <button
            onClick={goNext}
            className={cn(
              "flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] transition-colors hover:bg-foreground/[0.10] dark:bg-white/[0.06] dark:hover:bg-white/[0.10]",
              currentIndex === campaigns.length - 1 && "pointer-events-none opacity-30"
            )}
          >
            <ArrowDownIcon />
          </button>
        </div>
      </div>

      {/* ── Campaign detail panel ──────────────────────────── */}
      <CampaignDetail campaign={campaign} open={detailOpen} onClose={() => setDetailOpen(false)} />
    </div>
  );
}

// ── Campaign Detail Panel ──────────────────────────────────────────

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]";

const DETAIL_CHART_POINTS = [
  { index: 0, label: "Jan 5", views: 20000, engagement: 120, likes: 0, comments: 0, shares: 0 },
  { index: 1, label: "Jan 8", views: 35000, engagement: 200, likes: 0, comments: 0, shares: 0 },
  { index: 2, label: "Jan 11", views: 60000, engagement: 350, likes: 0, comments: 0, shares: 0 },
  { index: 3, label: "Jan 14", views: 85000, engagement: 480, likes: 0, comments: 0, shares: 0 },
  { index: 4, label: "Jan 17", views: 120000, engagement: 620, likes: 0, comments: 0, shares: 0 },
  { index: 5, label: "Jan 20", views: 150000, engagement: 780, likes: 0, comments: 0, shares: 0 },
  { index: 6, label: "Jan 23", views: 180000, engagement: 900, likes: 0, comments: 0, shares: 0 },
  { index: 7, label: "Jan 27", views: 160000, engagement: 850, likes: 0, comments: 0, shares: 0 },
  { index: 8, label: "Jan 30", views: 140000, engagement: 780, likes: 0, comments: 0, shares: 0 },
];

const DETAIL_CHART_DATA: AnalyticsPocPerformanceLineChartData = {
  datasets: { daily: DETAIL_CHART_POINTS, cumulative: DETAIL_CHART_POINTS },
  leftDomain: [0, 200000],
  rightDomain: [0, 1000],
  rightYLabels: ["1k", "750", "500", "250", "0"],
  series: [
    { axis: "left", color: "#F59E0B", domain: [0, 200000], key: "views", label: "Views", tooltipValueType: "number", yLabels: ["200k", "150k", "100k", "50k", "0"] },
    { axis: "right", color: "#00994D", domain: [0, 1000], key: "engagement", label: "Submissions", tooltipValueType: "number", yLabels: ["1k", "750", "500", "250", "0"] },
  ],
  xTicks: [
    { index: 0, label: "Jan 5" }, { index: 2, label: "Jan 11" }, { index: 4, label: "Jan 17" },
    { index: 6, label: "Jan 23" }, { index: 8, label: "Jan 30" },
  ],
  yLabels: ["200k", "150k", "100k", "50k", "0"],
};

function CampaignDetail({
  campaign,
  open,
  onClose,
}: {
  campaign: (typeof campaigns)[number];
  open: boolean;
  onClose: () => void;
}) {
  const [chartTab, setChartTab] = useState<"views" | "submissions">("views");
  const [metricState, setMetricState] = useState<Record<string, boolean>>({ views: true, engagement: false });
  const visibleMetricKeys = useMemo(() => Object.entries(metricState).filter(([, on]) => on).map(([k]) => k), [metricState]);
  const [heroMode, setHeroMode] = useState<"thumb" | "preview">("thumb");
  const campaignUrl = `https://outpace.studio/campaigns/${campaign.title.toLowerCase().replace(/\s+/g, "-")}`;

  // Transition to preview mode after 3 seconds when open
  useEffect(() => {
    if (!open) { setHeroMode("thumb"); return; }
    const t = setTimeout(() => setHeroMode("preview"), 3000);
    return () => clearTimeout(t);
  }, [open]);

  const topEarners = [
    { rank: 2, name: "kaazty", views: "442,717 views", color: "#839FB9", bg: "bg-[rgba(131,159,185,0.04)]", hoverBg: "hover:bg-[rgba(131,159,185,0.08)]", height: "h-[160px] lg:h-[197px]", avatarSize: "size-8" },
    { rank: 1, name: "abelix", views: "455,032 views", color: "#FB923C", bg: "bg-[rgba(251,146,60,0.04)]", hoverBg: "hover:bg-[rgba(251,146,60,0.08)]", height: "h-[200px] lg:h-[255px]", avatarSize: "size-10", crown: true },
    { rank: 3, name: "Brent", views: "338,662 views", color: "#9E5200", bg: "bg-[rgba(158,82,0,0.04)]", hoverBg: "hover:bg-[rgba(158,82,0,0.08)]", height: "h-[130px] lg:h-[160px]", avatarSize: "size-8" },
  ];

  const platforms = [
    { name: "YouTube", rate: "$0.50 per 1k views", min: "$0.50 min", max: "$250 max" },
    { name: "TikTok", rate: "$1.50 per 1k views", min: "$1.50 min", max: "$250 max" },
    { name: "Instagram", rate: "$1.50 per 1k views", min: "$1.50 min", max: "$350 max" },
  ];

  const resources = [
    { name: "Google Drive", desc: "Content Bank Folder" },
    { name: "Dropbox", desc: "Content Bank Folder" },
    { name: "YouTube", desc: "Call of Duty S2 Launch" },
  ];


  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-[800px]" showClose={false}>
      <div className="flex max-h-[85vh] flex-col overflow-hidden md:max-h-[704px]">
        {/* Expand/close button — sticky over scroll */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-xl transition-colors hover:bg-black/30"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M10 5a.833.833 0 0 1 .833-.833h2.5A2.5 2.5 0 0 1 15.833 6.667v2.5a.833.833 0 1 1-1.666 0v-2.5a.833.833 0 0 0-.834-.834h-2.5A.833.833 0 0 1 10 5ZM5 10a.833.833 0 0 1 .833.833v2.5c0 .46.373.834.834.834h2.5a.833.833 0 1 1 0 1.666h-2.5a2.5 2.5 0 0 1-2.5-2.5v-2.5A.833.833 0 0 1 5 10Z" fill="white"/></svg>
        </button>
        <div className="relative min-h-0 flex-1 overflow-y-auto scrollbar-hide">
          {/* Hero area */}
          <div className="relative h-[200px] w-full overflow-hidden sm:h-[350px]">
            {/* Static thumbnail */}
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
                heroMode === "preview" ? "opacity-0" : "opacity-100"
              )}
              style={{ backgroundImage: `url(${campaign.thumbnail})` }}
            />
            {/* Preview mode: blurred bg + video card + nav */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-700",
                heroMode === "preview" ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              {/* Blurred background */}
              <div
                className="absolute inset-[-50%] bg-cover bg-center"
                style={{ backgroundImage: `url(${campaign.thumbnail})`, filter: "blur(50px)" }}
              />
              {/* Video card */}
              <div
                className="relative z-10 h-[250px] w-[152px] bg-cover bg-center shadow-2xl sm:h-[350px] sm:w-[214px]"
                style={{ backgroundImage: `url(${campaign.thumbnail})`, padding: 8 }}
              />
              {/* Left/right nav */}
              <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 items-center justify-between">
                <button className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3l3 3-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 px-5 pb-5 pt-4">
            {/* Header section */}
            <div className="flex flex-col gap-4">
              {/* Brand row */}
              <div className="flex items-center gap-2">
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brand}
                  className="size-6 rounded-full shadow-[0_0_0_1.2px_rgba(255,255,255,0.4)] dark:shadow-[0_0_0_1.2px_rgba(224,224,224,0.1)]"
                />
                <div className="flex flex-1 items-center gap-1.5">
                  <span className="text-sm font-medium text-page-text">{campaign.brand}</span>
                  {campaign.verified && <VerifiedBadge />}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-page-text-subtle">
                  <span>{campaign.postedAgo} ago</span>
                  <span className="text-foreground/20">&middot;</span>
                  <span>72% approval rate</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-medium leading-[120%] tracking-[-0.02em] text-page-text">{campaign.title}</h2>

              {/* Pills row */}
              <div className="flex items-center gap-2">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <span className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white py-2 pl-2 pr-2.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <UsersIcon className="size-4 text-page-text" />
                    <span className="text-sm font-medium text-page-text">{campaign.creators}</span>
                  </span>
                  <span className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white py-2 pl-2 pr-2.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.164 0C9.8.0 12.358 1.515 14.069 4.389c.346.582.346 1.307 0 1.889C12.358 9.152 9.799 10.667 7.164 10.667 4.53 10.667 1.971 9.152.26 6.278c-.346-.582-.346-1.307 0-1.89C1.971 1.515 4.53 0 7.164 0ZM4.831 5.333a2.333 2.333 0 1 1 4.667 0 2.333 2.333 0 0 1-4.667 0Z" fill="#1A67E5"/></svg>
                    <span className="text-sm font-medium text-[#1A67E5]">{campaign.cpmRate}</span>
                  </span>
                  <span className="text-xs text-foreground/20">&middot;</span>
                  <span className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-white py-2 pl-2 pr-2.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <GamepadIcon className="size-4 text-page-text" />
                    <span className="text-sm font-medium text-page-text">{campaign.category}</span>
                  </span>
                  <span className="text-xs text-foreground/20">&middot;</span>
                  {["YouTube", "TikTok", "Instagram"].map((p) => (
                    <span key={p} className="flex size-8 items-center justify-center rounded-full border border-foreground/[0.06] bg-white text-page-text dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                      {p === "TikTok" ? <TikTokIcon /> : p === "Instagram" ? <InstagramIcon /> : <YouTubeIcon />}
                    </span>
                  ))}
                </div>
                {/* Budget */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 text-base">
                    <span className="font-medium text-page-text">{campaign.budgetSpent}</span>
                    <span className="text-page-text-muted">/</span>
                    <span className="text-page-text-muted">{campaign.budgetTotal}</span>
                  </div>
                  <div className="h-1 w-32 overflow-hidden rounded-full bg-foreground/[0.06] dark:bg-white/[0.06]">
                    <div className="h-full rounded-full" style={{ width: `${campaign.budgetPercent}%`, background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-[150%] tracking-[-0.02em] text-page-text-muted">
                {campaign.description} Creators should read through this description carefully to fully understand what is required, including the tone, style, audience targeting, and posting schedule.
              </p>
            </div>

            {/* Cards section */}
            <div className="flex flex-col gap-2">
              {/* Creator requirements */}
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <span className="text-sm font-medium text-page-text">Creator requirements</span>
                <div className="flex gap-1">
                  <div className="w-0.5 shrink-0 rounded-full bg-foreground/[0.12] dark:bg-white/[0.12]" />
                  <div className="flex flex-col gap-1 pl-2">
                    <div className="flex items-center gap-1.5">
                      <div className="flex size-4 items-center justify-center"><div className="size-1 rounded-full bg-page-text" /></div>
                      <span className="text-sm leading-[150%] text-page-text">requirement one</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex size-4 items-center justify-center"><div className="size-1 rounded-full bg-page-text" /></div>
                      <span className="text-sm leading-[150%] text-page-text">requirement two (with a link)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content requirements */}
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <span className="text-sm font-medium text-page-text">Content requirements</span>
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-semibold text-page-text">Some title:</span>
                  <div className="flex gap-1">
                    <div className="w-0.5 shrink-0 rounded-full bg-foreground/[0.12] dark:bg-white/[0.12]" />
                    <div className="flex flex-col gap-1 pl-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-4 items-center justify-center"><div className="size-1 rounded-full bg-page-text" /></div>
                        <span className="text-sm leading-[150%] text-page-text">requirement one</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-4 items-center justify-center"><div className="size-1 rounded-full bg-page-text" /></div>
                        <span className="text-sm leading-[150%] text-page-text">requirement two (with a link)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform rate cards */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {platforms.map((p) => (
                  <div key={p.name} className={cn(cardCls, "flex flex-col justify-center gap-4 p-4")}>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full border border-foreground/[0.06] shadow-[0_1.25px_2.5px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.06)] dark:bg-[rgba(224,224,224,0.04)]">
                        {p.name === "YouTube" ? <YouTubeIcon /> : p.name === "TikTok" ? <TikTokIcon /> : <InstagramIcon />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-page-text">{p.name}</span>
                        <span className="text-sm text-page-text-subtle">{p.rate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full border border-foreground/[0.06] bg-white px-2.5 py-2 text-sm font-medium text-page-text dark:border-[rgba(224,224,224,0.06)] dark:bg-[rgba(224,224,224,0.04)]">{p.min}</span>
                      <span className="rounded-full border border-foreground/[0.06] bg-white px-2.5 py-2 text-sm font-medium text-page-text dark:border-[rgba(224,224,224,0.06)] dark:bg-[rgba(224,224,224,0.04)]">{p.max}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resources */}
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <span className="text-sm font-medium text-page-text">Resources</span>
                <div className="grid grid-cols-2 gap-2">
                  {resources.map((r) => (
                    <div key={r.name + r.desc} className={cn(cardCls, "flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}>
                      <div className="flex size-10 items-center justify-center rounded-full border border-foreground/[0.06] shadow-[0_1.25px_2.5px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)]">
                        {r.name === "Google Drive" ? (
                          <svg width="20" height="18" viewBox="0 0 20 18" fill="none"><path d="M1.512 15.314l.882 1.524c.183.32.447.573.756.756L6.3 12.141H0c0 .355.092.71.275 1.031l1.237 2.142Z" fill="#0066DA"/><path d="M10 5.727L6.85.275a1.87 1.87 0 0 0-.756.756L.275 11.111A1.85 1.85 0 0 0 0 12.142h6.3L10 5.727Z" fill="#00AC47"/><path d="M16.85 17.594c.31-.184.573-.448.756-.756l.366-.63 1.753-3.035c.183-.32.275-.676.275-1.031h-6.3l1.34 2.634 1.81 2.818Z" fill="#EA4335"/><path d="M10 5.727l3.15-5.452A1.84 1.84 0 0 0 12.12 0H7.882c-.366 0-.721.103-1.031.275L10 5.727Z" fill="#00832D"/><path d="M13.699 12.141H6.3L3.149 17.594c.31.183.665.275 1.031.275h11.638c.366 0 .722-.103 1.031-.275l-3.15-5.453Z" fill="#2684FC"/><path d="M16.816 6.071l-2.91-5.04a1.871 1.871 0 0 0-.756-.756L10 5.727l3.7 6.415h6.289c0-.355-.091-.71-.275-1.031l-2.898-5.04Z" fill="#FFBA00"/></svg>
                        ) : r.name === "Dropbox" ? (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><g clipPath="url(#dbclip)"><path d="M0 0h20v20H0Z" fill="#0061FE"/><path d="M6.828 5l-3.171 1.992 3.172 1.992L10 6.992l3.172 1.992 3.171-1.992L13.172 5 10 6.992 6.828 5Zm0 7.969L3.657 10.977l3.171-1.993L10 10.977l-3.172 1.992Zm3.172-1.993l3.172-1.992 3.171 1.992-3.171 1.993L10 10.977Zm0 4.648l-3.172-1.992L10 11.641l3.172 1.992L10 15.625Z" fill="#F7F5F2"/></g><defs><clipPath id="dbclip"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
                        ) : (
                          <svg width="20" height="15" viewBox="0 0 20 15" fill="none"><g clipPath="url(#ytclip)"><path d="M19.558 2.193A2.506 2.506 0 0 0 17.788.423C16.236 0 9.99 0 9.99 0S3.743.013 2.191.436A2.506 2.506 0 0 0 .421 2.206c-.469 2.758-.65 6.96.014 9.607.115.424.339.81.65 1.12.31.311.696.535 1.12.65 1.552.423 7.798.423 7.798.423s6.249 0 7.801-.423a2.47 2.47 0 0 0 1.755-1.77c.495-2.761.652-6.96-.001-9.62Z" fill="#FF0000"/><path d="M8.001 10.005l5.182-3.001L8.001 4.002v6.003Z" fill="white"/></g><defs><clipPath id="ytclip"><rect width="20" height="14.063" fill="white"/></clipPath></defs></svg>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <span className="text-sm font-medium text-page-text">{r.name}</span>
                        <span className="text-xs text-page-text-subtle">{r.desc}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.333 3.333a.667.667 0 0 1 0-1.333h4a.667.667 0 0 1 .667.667v4a.667.667 0 1 1-1.333 0V4.276l-4.862 4.862a.667.667 0 0 1-.943-.943l4.862-4.862H9.333ZM4.774 3.333H6a.667.667 0 0 1 0 1.334H4.8c-.384 0-.633 0-.822.016-.181.015-.248.04-.281.057a.667.667 0 0 0-.291.291c-.017.033-.042.1-.057.281-.016.19-.016.438-.016.822v5.067c0 .384 0 .632.016.821.015.181.04.249.057.282a.667.667 0 0 0 .291.29c.033.018.1.043.281.058.19.016.438.016.822.016h5.067c.384 0 .632 0 .821-.016.181-.015.249-.04.282-.057a.667.667 0 0 0 .29-.291c.018-.033.043-.1.058-.282.016-.189.016-.437.016-.821V10a.667.667 0 1 1 1.334 0v1.226c0 .352 0 .655-.02.905-.024.264-.071.526-.2.778a2 2 0 0 1-.874.874c-.252.129-.514.176-.778.2-.25.02-.553.02-.905.02H4.774c-.351 0-.654 0-.904-.02a2.019 2.019 0 0 1-.778-.2 2 2 0 0 1-.874-.874 2.019 2.019 0 0 1-.2-.778c-.02-.25-.02-.553-.02-.905V6.108c0-.352 0-.655.02-.905.024-.264.072-.526.2-.778a2 2 0 0 1 .874-.874c.252-.129.514-.176.778-.2.25-.02.553-.02.905-.02Z" fill="currentColor" fillOpacity="0.5"/>
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top earners */}
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <span className="text-sm font-medium text-page-text">Top earners</span>
                <div className="flex items-end justify-center gap-2">
                  {topEarners.map((e) => (
                    <div
                      key={e.rank}
                      className={cn(
                        "flex w-full flex-col items-center justify-between rounded-2xl border border-foreground/[0.06] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors dark:border-[rgba(224,224,224,0.03)]",
                        e.bg, e.hoverBg, e.height
                      )}
                    >
                      {e.crown ? (
                        <div className="flex h-6 items-center gap-2 rounded-full px-2" style={{ background: e.color }}>
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M5.916.223A.5.5 0 0 0 5.5 0a.5.5 0 0 0-.416.223L3.329 2.855.724 1.553a.5.5 0 0 0-.713.549l1.084 5.204A1.5 1.5 0 0 0 2.563 8.5h5.874a1.5 1.5 0 0 0 1.468-1.194l1.084-5.204a.5.5 0 0 0-.713-.549L7.671 2.855 5.916.223Z" fill="white"/></svg>
                          <span className="text-base font-medium text-white">{e.rank}</span>
                        </div>
                      ) : (
                        <div className="flex size-[26px] items-center justify-center rounded-full text-base font-medium text-white" style={{ background: e.color }}>
                          {e.rank}
                        </div>
                      )}
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn("rounded-full bg-foreground/[0.08]", e.avatarSize)} />
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-medium tracking-[-0.02em] text-page-text">{e.name}</span>
                          <span className="text-xs font-medium tracking-[-0.02em] text-page-text-muted">{e.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics */}
              <div className={cn(cardCls, "flex flex-col justify-center gap-4 p-4")}>
                <div className="flex flex-col gap-4">
                  {/* Tab switcher */}
                  <div className="flex rounded-xl bg-foreground/[0.06] p-0.5 dark:bg-[rgba(224,224,224,0.03)]" style={{ width: "fit-content" }}>
                    <button
                      onClick={() => { setChartTab("views"); setMetricState({ views: true, engagement: false }); }}
                      className={cn("rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", chartTab === "views" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "text-page-text-muted")}
                    >
                      Views
                    </button>
                    <button
                      onClick={() => { setChartTab("submissions"); setMetricState({ views: false, engagement: true }); }}
                      className={cn("rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", chartTab === "submissions" ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]" : "text-page-text-muted")}
                    >
                      Submissions
                    </button>
                  </div>
                  {/* Big number */}
                  <div className="flex flex-col gap-2">
                    <span className="text-5xl font-medium tracking-[-0.02em] text-page-text">1.7m</span>
                    <span className="text-sm leading-[120%] tracking-[-0.02em] text-foreground/50">Total views</span>
                  </div>
                </div>
                <AnalyticsPocChartPlaceholder
                  variant="line"
                  chartStylePreset="performance-main"
                  lineChart={DETAIL_CHART_DATA}
                  activeLineDataset="daily"
                  visibleMetricKeys={visibleMetricKeys}
                  heightClassName="h-[220px]"
                />
              </div>
            </div>
          </div>

          {/* Bottom fade inside scroll area */}
          <div className="pointer-events-none sticky bottom-0 -mt-8 h-8 bg-gradient-to-t from-white to-transparent dark:from-page-bg" />
        </div>

        {/* Bottom action bar */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-foreground/[0.06] bg-white px-5 py-3 dark:border-[rgba(224,224,224,0.03)] dark:bg-page-bg">
          <CopyButton variant="default" size="lg" text={campaignUrl}>
            Copy link
          </CopyButton>
          <button
            className="flex h-10 items-center rounded-full px-5 text-sm font-medium text-white"
            style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
          >
            Join campaign
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── YouTube icon (used in detail panel) ────────────────────────────

function YouTubeIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M12.47.339c.602.186 1.076.734 1.237 1.431C14 3.032 14 5.667 14 5.667s0 2.635-.293 3.897c-.161.697-.635 1.245-1.238 1.431C11.378 11.333 7 11.333 7 11.333s-4.378 0-5.47-.338C.928 10.808.454 10.26.293 9.563 0 8.301 0 5.667 0 5.667S0 3.032.293 1.77C.454 1.073.928.525 1.53.339 2.622 0 7 0 7 0s4.378 0 5.47.339ZM9.342 5.667 5.532 7.867V3.467l3.81 2.2Z" fill="currentColor"/></svg>
  );
}
