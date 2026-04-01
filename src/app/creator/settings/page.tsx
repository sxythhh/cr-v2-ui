"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CreatorHeader } from "@/components/creator-header";

// ── Types ──────────────────────────────────────────────────────────

type Tab = "profile" | "accounts" | "contracts" | "preferences" | "notifications";

const tabs: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "accounts", label: "Accounts" },
  { id: "contracts", label: "Contracts" },
  { id: "preferences", label: "Application preferences" },
  { id: "notifications", label: "Notifications" },
];

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg";

// ── Niche icons ────────────────────────────────────────────────────

const nicheIcons: Record<string, React.ReactNode> = {
  Entertainment: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.908.507a.5.5 0 0 1 .578.41l.001.006v.003c.02.123.032.247.04.372.012.21.014.506-.04.801-.065.346-.225.657-.352.865a3.5 3.5 0 0 1-.18.26l-.002.002a.5.5 0 0 1-.77-.643 2.5 2.5 0 0 0 .172-.245c.1-.163.19-.353.221-.526.034-.185.036-.391.026-.561a3.9 3.9 0 0 0-.027-.264.5.5 0 0 1 .41-.578Z" fill="currentColor"/><path d="M9.541 1.281a.5.5 0 0 1 .302.641l-.226.626a.5.5 0 0 1-.866-.34l.225-.626a.5.5 0 0 1 .565-.301Z" fill="currentColor"/><path d="M10.947 3.532a.5.5 0 0 1-.224.672l-.501.25a.5.5 0 0 1-.673-.223.5.5 0 0 1 .224-.672l.501-.25a.5.5 0 0 1 .673.223Z" fill="currentColor"/><path d="M8.599 3.402a.5.5 0 0 1 0 .708l-.501.501a.5.5 0 0 1-.708-.708l.501-.501a.5.5 0 0 1 .708 0Z" fill="currentColor"/><path d="M8.495 5.488a.5.5 0 0 1 .522.48l.001.001.002.002a3 3 0 0 0 .278.027c.159.02.316.049.44.089.148.048.305.136.489.216a4 4 0 0 0 .749.275.5.5 0 0 1-.69.84 5 5 0 0 1-.222-.127c-.138-.074-.293-.148-.417-.188-.149-.048-.305-.076-.43-.093a3 3 0 0 0-.19-.02.5.5 0 0 1-.48-.521Z" fill="currentColor"/><path d="M2.96 4.243c.397-1.007 1.696-1.277 2.461-.512l2.849 2.849c.765.765.495 2.064-.512 2.461l-4.7 1.851c-1.223.482-2.431-.726-1.95-1.949l1.852-4.7Z" fill="currentColor"/></svg>,
  Gaming: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.524 1.5c-.492 0-.953.242-1.233.646L4.101 5.309l2.59 2.59 3.163-2.19c.405-.28.646-.741.646-1.233V2a.5.5 0 0 0-.5-.5H7.524Z" fill="currentColor"/><path d="M2.853 5.146a.5.5 0 0 0-.77.077l-.117.175a1.5 1.5 0 0 0 .028 1.704l.603.844-1.097 1.097a1 1 0 0 0 0 1.414l.043.043a1 1 0 0 0 1.414 0l1.097-1.097.844.603a1.5 1.5 0 0 0 1.704.027l.175-.117a.5.5 0 0 0 .077-.77l-4-4Z" fill="currentColor"/></svg>,
  Tech: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M5.5 1.05A4 4 0 0 0 5 1c-1.054 0-1.955.652-2.323 1.574C1.712 2.827 1 3.705 1 4.75c0 .462.14.893.379 1.25A2.25 2.25 0 0 0 1 7.25c0 .856.478 1.6 1.18 1.98A2.751 2.751 0 0 0 4.75 11c.26 0 .511-.036.75-.104V8.501 8.5A1.5 1.5 0 0 0 4 7.5a.5.5 0 0 1 0-1c.364 0 .706.097 1 .268V3.5v-.001V1.05Z" fill="currentColor"/><path d="M6.5 10.896c.239.068.49.104.75.104a2.751 2.751 0 0 0 2.57-1.77c.702-.38 1.18-1.124 1.18-1.98 0-.462-.14-.893-.379-1.25.24-.358.379-.788.379-1.25 0-.995-.712-1.873-1.677-2.126A2.751 2.751 0 0 0 7 1c-.171 0-.338.017-.5.05V3.502A1.5 1.5 0 0 1 8 4.5a.5.5 0 0 1 0 1 2.24 2.24 0 0 1-1-.268v5.664Z" fill="currentColor"/></svg>,
  Lifestyle: <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.248 9.186c4.264-2.39 5.313-5.235 4.511-7.235-.39-.97-1.207-1.666-2.171-1.881-.849-.19-1.776 0-2.585.642-.808-.641-1.735-.831-2.584-.642C1.455.285.638.98.248 1.951c-.802 2-1.246 4.845 4.511 7.235a.5.5 0 0 0 .49 0Z" fill="currentColor"/></svg>,
  Sports: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M5.581 1.288C3.534 1.92 1.92 3.534 1.288 5.58l5.131 5.131C8.466 10.08 10.08 8.466 10.712 6.42L5.581 1.288Zm1.648 4.19a.5.5 0 1 0-.707-.707l-1.75 1.75a.5.5 0 0 0 .707.708l1.75-1.75Z" fill="currentColor"/><path d="M1 7.5c0-.254.015-.504.043-.75L5.25 10.957c-.246.029-.496.043-.75.043H2a1 1 0 0 1-1-1V7.5Z" fill="currentColor"/><path d="M10.957 5.25c.029-.246.043-.496.043-.75V2a1 1 0 0 0-1-1H7.5c-.254 0-.504.015-.75.043l4.207 4.207Z" fill="currentColor"/></svg>,
  Beauty: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.589 2.011c.632-.065 1.212.171 1.694.497.484.327.912.771 1.261 1.2.351.433.638.869.836 1.195.1.163.177.301.23.398.174.315.147.493.015.767a8.3 8.3 0 0 1-.245.464c-.218.38-.549.887-1.004 1.396C9.467 8.943 8.029 10 6 10s-3.467-1.057-4.376-2.073a8.2 8.2 0 0 1-1.005-1.396 8.3 8.3 0 0 1-.245-.464c-.127-.264-.159-.434-.004-.742.046-.092.114-.223.201-.379.173-.311.425-.728.74-1.148.312-.418.697-.855 1.14-1.192.443-.335.98-.598 1.582-.598.508 0 1.076.192 1.477.354.19.078.357.155.483.217.098-.053.223-.116.362-.18.333-.154.807-.365 1.237-.41ZM6 5.125c-1.213 0-2.79.269-4.091.547a20 20 0 0 0-.409.09c.15.058.306.119.467.178C3.257 6.423 4.8 6.875 6 6.875s2.743-.452 4.033-.935c.161-.06.317-.12.467-.179a20 20 0 0 0-.409-.089C8.79 5.393 7.213 5.125 6 5.125Z" fill="currentColor"/></svg>,
  Music: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.855 2.365a.5.5 0 0 1 .644.479v3.391a2.16 2.16 0 0 0-1-.236c-1.016 0-2 .702-2 1.75s.984 1.75 2 1.75 2-.702 2-1.75V2.844a1.5 1.5 0 0 0-1.931-1.437l-3 .9A1.5 1.5 0 0 0 4.5 3.744v3.992a2.16 2.16 0 0 0-1-.237c-1.015 0-2 .702-2 1.75s.985 1.75 2 1.75 2-.702 2-1.75V3.744a.5.5 0 0 1 .356-.479l3-.9Z" fill="currentColor"/></svg>,
  Health: <svg width="11" height="10" viewBox="0 0 11 10" fill="none"><path d="M3.19 4.406 4 1.64l2.28 7.791a.5.5 0 0 0 .94 0l1.049-3.586A.5.5 0 0 1 8.749 5.485H10.5a.5.5 0 0 0 0-1H9.249a1.5 1.5 0 0 0-1.44 1.079L7 8.33 4.72.54a.5.5 0 0 0-.94 0L2.231 4.125A.5.5 0 0 1 1.751 4.485H.5a.5.5 0 0 0 0 1h1.251a1.5 1.5 0 0 0 1.44-1.079Z" fill="currentColor"/></svg>,
  News: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 5.5V4.5h1.5v1H4Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M1 3c0-.828.672-1.5 1.5-1.5H7c.828 0 1.5.672 1.5 1.5v2.5h1c.828 0 1.5.672 1.5 1.5v1.75c0 .966-.784 1.75-1.75 1.75H2.75C1.784 10.5 1 9.716 1 8.75V3Zm8.25 6.5a.75.75 0 0 0 .75-.75V7a.5.5 0 0 0-.5-.5h-1v2.25c0 .414.336.75.75.75ZM3 8a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H3.5A.5.5 0 0 1 3 8Zm.5-4.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5H6a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5H3.5Z" fill="currentColor"/></svg>,
  Crypto: <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6.625 7.25a.375.375 0 0 0 0-.75H5.5v.75h1.125Z" fill="currentColor"/><path d="M5.5 4.75h1.125a.375.375 0 0 1 0 .75H5.5v-.75Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M1 6a5 5 0 1 1 10 0A5 5 0 0 1 1 6Zm3.25-2.25a.5.5 0 0 0 0 1h.25v2.5h-.25a.5.5 0 0 0 0 1H5.5v.25a.5.5 0 0 0 1 0v-.25h.125A1.375 1.375 0 0 0 7.68 6a1.37 1.37 0 0 0-.315-.875c.196-.238.315-.538.315-.875A1.375 1.375 0 0 0 6.625 3.75H6.5v-.25a.5.5 0 0 0-1 0v.25H4.25Z" fill="currentColor"/></svg>,
};

// ── Niches ─────────────────────────────────────────────────────────

const niches = [
  { label: "Entertainment", selected: true },
  { label: "Gaming", selected: true },
  { label: "Tech", selected: true },
  { label: "Lifestyle", selected: true },
  { label: "Sports", selected: false },
  { label: "Beauty", selected: false },
  { label: "Music", selected: false },
  { label: "Health", selected: false },
  { label: "News", selected: false },
  { label: "Crypto", selected: false },
];

// ── Connected accounts ─────────────────────────────────────────────

const platformIcons: Record<string, React.ReactNode> = {
  TikTok: (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none"><path d="M14.528 6.845c-1.483 0-2.856-.472-3.977-1.272v5.821c0 2.912-2.362 5.273-5.276 5.273a5.26 5.26 0 0 1-2.937-.892A5.273 5.273 0 0 1 0 11.394c0-2.912 2.362-5.273 5.276-5.273.242 0 .484.017.724.05v2.916a2.425 2.425 0 0 0-.733-.113 2.413 2.413 0 0 0-2.413 2.413 2.42 2.42 0 0 0 1.327 2.154c.327.165.696.257 1.086.257 1.33 0 2.409-1.075 2.413-2.404V0h2.871v.367c.01.11.025.219.044.328a4.416 4.416 0 0 0 1.822 2.694c.633.395 1.365.604 2.112.603v2.853Z" fill="currentColor"/></svg>
  ),
  Instagram: (
    <svg width="16" height="16" viewBox="0 0 13 13" fill="none"><path d="M6.333 1.141c1.691 0 1.891.007 2.56.037.4.005.8.079 1.175.218.275.102.524.264.728.474.21.204.372.453.474.728.14.377.213.774.218 1.176.03.675.037.876.037 2.566s-.006 1.891-.037 2.56a3.6 3.6 0 0 1-.218 1.175 2.16 2.16 0 0 1-.474.728 2.16 2.16 0 0 1-.728.474c-.377.14-.774.213-1.176.218-.675.03-.876.037-2.559.037s-1.891-.006-2.56-.037a3.6 3.6 0 0 1-1.175-.218 2.16 2.16 0 0 1-.728-.474 2.16 2.16 0 0 1-.474-.728 3.6 3.6 0 0 1-.218-1.176c-.03-.675-.037-.876-.037-2.559s.007-1.891.037-2.56c.005-.4.079-.8.218-1.175.102-.275.264-.524.474-.728a2.16 2.16 0 0 1 .728-.474c.377-.14.774-.213 1.176-.218.675-.03.876-.037 2.559-.037Zm0-1.141C4.614 0 4.398.007 3.722.038A4.75 4.75 0 0 0 2.185.332a3.3 3.3 0 0 0-1.122.731A3.3 3.3 0 0 0 .332 2.185 4.75 4.75 0 0 0 .039 3.722C.007 4.398 0 4.614 0 6.333s.007 1.936.038 2.611c.01.526.11 1.045.294 1.537.16.423.409.806.731 1.122.316.322.7.572 1.122.731.493.184 1.012.284 1.537.294.676.032.891.039 2.611.039s1.936-.008 2.611-.038a4.75 4.75 0 0 0 1.537-.294 3.3 3.3 0 0 0 1.122-.731c.322-.316.572-.7.731-1.122.184-.493.284-1.012.294-1.537.032-.676.039-.891.039-2.611s-.008-1.936-.038-2.611a4.75 4.75 0 0 0-.294-1.537 3.3 3.3 0 0 0-.731-1.122A3.3 3.3 0 0 0 10.482.332 4.75 4.75 0 0 0 8.944.039C8.269.007 8.053 0 6.333 0Zm0 3.08a3.253 3.253 0 1 0 0 6.506 3.253 3.253 0 0 0 0-6.505Zm0 5.364a2.111 2.111 0 1 1 0-4.222 2.111 2.111 0 0 1 0 4.222Zm3.381-6.252a.76.76 0 1 0 0 1.52.76.76 0 0 0 0-1.52Z" fill="currentColor"/></svg>
  ),
  Youtube: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M16.837 3.34c.753.233 1.345.918 1.547 1.79C18.749 6.706 18.75 10 18.75 10s0 3.294-.366 4.871c-.202.871-.794 1.556-1.547 1.79C15.473 17.083 10 17.083 10 17.083s-5.473 0-6.837-.422c-.753-.234-1.345-.919-1.547-1.79C1.25 13.294 1.25 10 1.25 10s0-3.293.366-4.871c.202-.871.794-1.556 1.547-1.789C4.527 2.917 10 2.917 10 2.917s5.473 0 6.837.423ZM12.928 10l-4.763 2.75V7.251L12.928 10Z" fill="#FF3355"/></svg>
  ),
};

const connectedAccounts = [
  { platform: "TikTok", handle: "@vladclips", connected: true },
  { platform: "Instagram", handle: "@vladclips", connected: true },
  { platform: "Youtube", handle: "@vladclips", connected: true },
];

// ── Contracts ──────────────────────────────────────────────────────

const contracts = [
  { name: "Flooz Clipping Campaign", detail: "CPM deal \u00b7 $2.50 per 1K views \u00b7 Signed Jan 15, 2026", status: "Active" },
  { name: "Flooz Clipping Campaign", detail: "Monthly retainer - $500/mo - Signed Feb 1, 2026", status: "Active" },
  { name: "Flooz Clipping Campaign", detail: "CPM deal - $1.00 per 1K views - Signed Dec 20, 2025", status: "Active" },
];

// ── Page ───────────────────────────────────────────────────────────

export default function CreatorSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [discoverable, setDiscoverable] = useState(true);
  const [showEarnings, setShowEarnings] = useState(false);
  const [availableForCampaigns, setAvailableForCampaigns] = useState(true);
  const [autoApply, setAutoApply] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  return (
    <div className="flex min-h-screen flex-col font-inter tracking-[-0.02em]">
      <CreatorHeader title="Settings" />

      <div className="mx-auto flex w-full max-w-[756px] flex-col gap-4 px-4 py-4 sm:px-5 md:px-4">
        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-foreground/[0.06] scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap px-4 py-3 text-sm font-medium tracking-[-0.02em] transition-colors sm:px-5",
                activeTab === tab.id
                  ? "border-b border-page-text text-page-text"
                  : "text-page-text-muted hover:text-page-text"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-2 md:flex-row">
            {/* Left: Profile info */}
            <div className={cn(cardCls, "flex flex-1 flex-col gap-4 p-4")}>
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="size-14 shrink-0 rounded-full border border-foreground/[0.06] bg-gradient-to-br from-blue-400 to-purple-500" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-page-text">Vlad Shapoval</span>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M5.8.8C6.5.1 7.5.1 8.2.8L8.9 1.5l1-.2c.9-.2 1.8.4 2 1.3l.2 1 .9.5c.8.4 1.1 1.4.7 2.2l-.5.9.5.9c.4.8.1 1.8-.7 2.2l-.9.5-.2 1c-.2.9-1.1 1.5-2 1.3l-1-.2-.7.7c-.7.7-1.7.7-2.4 0l-.7-.7-1 .2c-.9.2-1.8-.4-2-1.3l-.2-1-.9-.5c-.8-.4-1.1-1.4-.7-2.2l.5-.9-.5-.9c-.4-.8-.1-1.8.7-2.2l.9-.5.2-1C2.3 1.7 3.2 1.1 4.1 1.3l1 .2.7-.7Z" fill="url(#sg)"/>
                      <path d="M5 7l1.5 1.5 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <defs><linearGradient id="sg" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs>
                    </svg>
                  </div>
                  <span className="text-xs text-[#00994D]">Verified creator</span>
                </div>
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-page-text-subtle">Email</span>
                  <div className="flex items-center justify-between rounded-[14px] bg-foreground/[0.04] px-3.5 py-3">
                    <span className="text-sm text-page-text-subtle">vlad@outpacestudios.com</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 1.333A3.333 3.333 0 0 0 4.667 4.667V6A2 2 0 0 0 2.667 8v4.667a2 2 0 0 0 2 2h6.666a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2V4.667A3.333 3.333 0 0 0 8 1.333ZM10 6V4.667a2 2 0 1 0-4 0V6h4Zm-2 2.667a.667.667 0 0 1 .667.666v2a.667.667 0 1 1-1.334 0v-2A.667.667 0 0 1 8 8.667Z" fill="#252525" fillOpacity="0.5"/></svg>
                  </div>
                  <span className="text-xs text-foreground/40">Managed by your Whop account</span>
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-page-text-subtle">Bio</span>
                  <div className="relative rounded-[14px] bg-foreground/[0.04]">
                    <textarea
                      className="w-full resize-none bg-transparent px-3.5 py-3 text-sm text-page-text outline-none"
                      rows={3}
                      defaultValue="Content creator specializing in gaming, tech, and lifestyle content. 350K+ followers across platforms."
                    />
                    <span className="absolute bottom-3.5 right-3.5 text-xs text-page-text-subtle">0/300</span>
                  </div>
                </div>

                {/* City */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-page-text-subtle">City</span>
                  <input
                    className="rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none"
                    defaultValue="Los Angeles, CA"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end">
                <button className="rounded-full bg-page-text px-4 py-2 text-sm font-medium text-white opacity-30">
                  Save changes
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-1 flex-col gap-2">
              {/* Content niches */}
              <div className={cn(cardCls, "flex flex-col gap-3 p-4")}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-page-text">Content niches</span>
                    <span className="text-xs text-[#00994D]">4 selected</span>
                  </div>
                  <span className="text-xs leading-[150%] text-page-text-muted">
                    Select categories that match your content. This helps us recommend relevant campaigns.
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {niches.map((n) => (
                    <span
                      key={n.label}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        n.selected
                          ? "border border-[rgba(255,144,37,0.3)] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#FFFFFF] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                          : "border border-foreground/[0.06] bg-white text-page-text-muted"
                      )}
                    >
                      <span className={n.selected ? "text-page-text" : "text-foreground/50"}>{nicheIcons[n.label]}</span>
                      {n.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-page-text">Visibility</span>
                  <span className="text-xs leading-[150%] text-page-text-muted">
                    Control how brands discover and see your profile.
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <ToggleRow
                    title="Discoverable by brands"
                    description="Brands can find you when browsing creators"
                    enabled={discoverable}
                    onToggle={() => setDiscoverable(!discoverable)}
                  />
                  <ToggleRow
                    title="Show earnings on profile"
                    description="Display your total earnings to brands reviewing you"
                    enabled={showEarnings}
                    onToggle={() => setShowEarnings(!showEarnings)}
                  />
                  <ToggleRow
                    title="Available for new campaigns"
                    description="Set to off if you're not taking new work right now"
                    enabled={availableForCampaigns}
                    onToggle={() => setAvailableForCampaigns(!availableForCampaigns)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "accounts" && (
          <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
            <span className="text-sm font-medium text-page-text">Connected accounts</span>
            <div className="flex flex-col gap-2">
              {connectedAccounts.map((a) => (
                <div key={a.platform} className={cn(cardCls, "flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}>
                  <div className="flex size-9 items-center justify-center rounded-full border border-foreground/[0.06]">
                    {platformIcons[a.platform]}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <span className="text-sm font-medium text-page-text">{a.platform}</span>
                    <span className="text-xs text-page-text-subtle">{a.handle}</span>
                  </div>
                  <span className="text-xs font-medium text-[#00994D]">Connected</span>
                </div>
              ))}
              {/* Add new */}
              <div className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/[0.12] p-4 transition-colors hover:border-foreground/[0.25] hover:bg-foreground/[0.02] dark:hover:border-white/[0.15] dark:hover:bg-white/[0.02]">
                <div className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3v12M3 9h12" stroke="rgba(37,37,37,0.7)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <span className="text-sm font-medium text-page-text">Connect another account</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contracts" && (
          <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-page-text">Your contracts</span>
              <span className="text-xs leading-[150%] text-page-text-muted">
                Active agreements with campaigns you have joined.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {contracts.map((c, i) => (
                <div key={i} className={cn(cardCls, "flex items-center gap-3 p-4")}>
                  <div className="size-9 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div className="flex flex-1 flex-col gap-2">
                    <span className="text-sm font-medium text-page-text">{c.name}</span>
                    <span className="text-xs text-page-text-subtle">{c.detail}</span>
                  </div>
                  <span className="text-xs font-medium text-[#00994D]">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-page-text">Application preferences</span>
              <span className="text-xs leading-[150%] text-page-text-muted">
                Control how your applications are handled and what info brands can see.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <ToggleRow title="Auto-apply to matched campaigns" description="Automatically apply when a campaign matches your niche and audience" enabled={autoApply} onToggle={() => setAutoApply(!autoApply)} />
              <ToggleRow title="Share analytics with brands" description="Let brands see your engagement rate and audience data when reviewing your application" enabled={shareAnalytics} onToggle={() => setShareAnalytics(!shareAnalytics)} />
              <ToggleRow title="Show past campaign history" description="Display your completed campaigns and performance to brands" enabled={showHistory} onToggle={() => setShowHistory(!showHistory)} />
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="flex flex-col gap-2">
            {/* Submissions */}
            <NotificationSection title="Submissions" items={[
              { title: "Submission approved", desc: "Your video was approved and is now earning views", on: true },
              { title: "Submission rejected or flagged", desc: "Your video was rejected or needs changes", on: true },
              { title: "Submission auto-approved", desc: "Your video was automatically approved after the review window", on: true },
            ]} />
            {/* Earnings & Payouts */}
            <NotificationSection title="Earnings & Payouts" items={[
              { title: "Payout sent", desc: "Money has been sent to your connected payout method", on: true },
              { title: "Payout finalized", desc: "Validation period ended and your earnings are locked in", on: true },
              { title: "Clawback notice", desc: "A payout was clawed back due to a policy violation", on: true },
              { title: "Earnings milestone", desc: "You hit an earnings milestone (e.g. $100, $500, $1K)", on: true },
            ]} />
            {/* Campaigns */}
            <NotificationSection title="Campaigns" items={[
              { title: "New campaign matched to you", desc: "A campaign matching your niche and audience is now live", on: true },
              { title: "Campaign ending soon", desc: "A campaign you joined is about to close", on: true },
              { title: "Campaign budget paused", desc: "The brand ran out of budget - submissions are on hold", on: true },
              { title: "Campaign budget resumed", desc: "Budget was topped up and you can submit again", on: true },
            ]} />
            {/* Applications */}
            <NotificationSection title="Applications" items={[
              { title: "Application accepted", desc: "You were accepted into a campaign", on: true },
              { title: "Application rejected", desc: "Your application was not accepted this time", on: true },
            ]} />
            {/* Messages */}
            <NotificationSection title="Messages" items={[
              { title: "New message from a brand", desc: "A brand or agency sent you a direct message", on: true },
              { title: "Brand announcement", desc: "A brand posted an update or announcement to their creators", on: true },
            ]} />
            {/* Performance */}
            <NotificationSection title="Performance" items={[
              { title: "Video going viral", desc: "One of your submissions is getting a surge of views", on: true },
              { title: "Weekly performance summary", desc: "Recap of your views, earnings, and top content this week", on: true },
              { title: "Leaderboard rank change", desc: "Your position on the creator leaderboard changed", on: true },
            ]} />
            {/* Account & System */}
            <NotificationSection title="Account & System" items={[
              { title: "Security alerts", desc: "New login from an unrecognized device or location", on: true },
              { title: "Connected account issues", desc: "A linked social account was disconnected or needs re-auth", on: true },
              { title: "Product updates", desc: "New features, improvements, and platform announcements", on: false },
              { title: "Tips and best practices", desc: "Occasional tips to grow your earnings on Content Rewards", on: false },
            ]} />
            {/* Email digest */}
            <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
              <span className="text-sm font-medium text-page-text">Email digest</span>
              <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium text-page-text">Email summary frequency</span>
                  <span className="text-xs text-page-text-subtle">How often should we bundle your notifications into a digest?</span>
                </div>
                <div className="flex rounded-xl bg-foreground/[0.06] p-0.5">
                  {["Instant", "Daily", "Weekly", "Off"].map((opt, i) => (
                    <button key={opt} className={cn("flex-1 rounded-[10px] px-4 py-2 text-sm font-medium transition-colors", i === 0 ? "bg-white text-page-text shadow-[0_2px_4px_rgba(0,0,0,0.06)]" : "text-page-text-muted")}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Toggle Row ─────────────────────────────────────────────────────

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div onClick={onToggle} className={cn(cardCls, "flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]")}>
      <div className="flex flex-1 flex-col gap-1.5">
        <span className="text-sm font-medium text-page-text">{title}</span>
        <span className="text-xs leading-[120%] text-page-text-subtle">{description}</span>
      </div>
      <div
        className={cn(
          "flex h-5 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors",
          enabled ? "bg-page-text" : "bg-foreground/20"
        )}
      >
        <div
          className={cn(
            "size-4 rounded-full bg-white transition-transform",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </div>
    </div>
  );
}

// ── Notification Section ───────────────────────────────────────────

function NotificationSection({
  title,
  items,
}: {
  title: string;
  items: { title: string; desc: string; on: boolean }[];
}) {
  const [state, setState] = useState(items.map((i) => i.on));
  return (
    <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
      <span className="text-sm font-medium text-page-text">{title}</span>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <ToggleRow
            key={item.title}
            title={item.title}
            description={item.desc}
            enabled={state[i]}
            onToggle={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))}
          />
        ))}
      </div>
    </div>
  );
}
