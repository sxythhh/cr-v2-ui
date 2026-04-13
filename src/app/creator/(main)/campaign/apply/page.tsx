"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";
import { UsersIcon } from "@/components/sidebar/icons/users";
import { GamepadIcon } from "@/components/sidebar/icons/gamepad";

const cardCls = "rounded-2xl border border-foreground/[0.06] bg-card-bg shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:shadow-none";

const CAMPAIGN = {
  brand: "Clipping Culture",
  brandAvatar: "https://i.pravatar.cc/40?img=33",
  verified: true,
  ago: "5d",
  approvalRate: "72%",
  title: "Call of Duty BO7 Official Clipping Campaign",
  creators: "121.4K",
  cpm: "$1.50/1k",
  cpmColor: "#1A67E5",
  category: "Gaming",
  platforms: ["youtube", "tiktok", "instagram"] as const,
  spent: "$8,677",
  total: "$37,500",
  progress: 23,
};

const CONNECTED_ACCOUNTS = [
  { platform: "tiktok" as const, name: "TikTok", username: "@vladclips" },
  { platform: "instagram" as const, name: "Instagram", username: "@vladclips" },
  { platform: "youtube" as const, name: "Youtube", username: "@vladclips" },
  { platform: "tiktok" as const, name: "TikTok", username: "@vladclips" },
];

const VIDEO_STANDOUT_OPTIONS = [
  "Hook", "Virality", "Attentionspan", "Video length", "Name of the video", "Background music", "Volume",
];

const SCREENING_QUESTIONS = [
  { label: "What makes you a good fit for this brand?", required: true, type: "textarea" as const },
  { label: "What makes you a good fit for this brand?", required: true, type: "textarea" as const },
];

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 0L8.5 1.2L10.4 0.8L11 2.6L12.9 3.4L12.3 5.3L13.3 7L12.3 8.7L12.9 10.6L11 11.4L10.4 13.2L8.5 12.8L7 14L5.5 12.8L3.6 13.2L3 11.4L1.1 10.6L1.7 8.7L0.7 7L1.7 5.3L1.1 3.4L3 2.6L3.6 0.8L5.5 1.2L7 0Z" fill="url(#vb_g)"/>
      <path d="M4.5 7L6 8.5L9.5 5" stroke="#000" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs><linearGradient id="vb_g" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#FDDC87"/><stop offset="1" stopColor="#FCB02B"/></linearGradient></defs>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.99984 1.33398H2.6665V14.6673H13.3332V6.66732H7.99984V1.33398ZM5.33317 8.66732H8.6665V10.0007H5.33317V8.66732ZM5.33317 11.334V12.6673H10.9998V11.334H5.33317Z" fill="currentColor"/>
      <path d="M12.9426 5.33398L9.33317 1.72451V5.33398H12.9426Z" fill="currentColor"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3.91702 12.7554L4.66536 12.7055L3.91702 12.7554ZM12.083 12.7554L11.3346 12.7055L12.083 12.7554ZM2 3.25C1.58579 3.25 1.25 3.58579 1.25 4C1.25 4.41421 1.58579 4.75 2 4.75V4V3.25ZM14 4.75C14.4142 4.75 14.75 4.41421 14.75 4C14.75 3.58579 14.4142 3.25 14 3.25V4V4.75ZM7.41667 7.33333C7.41667 6.91912 7.08088 6.58333 6.66667 6.58333C6.25245 6.58333 5.91667 6.91912 5.91667 7.33333H6.66667H7.41667ZM5.91667 10.6667C5.91667 11.0809 6.25245 11.4167 6.66667 11.4167C7.08088 11.4167 7.41667 11.0809 7.41667 10.6667H6.66667H5.91667ZM10.0833 7.33333C10.0833 6.91912 9.74755 6.58333 9.33333 6.58333C8.91912 6.58333 8.58333 6.91912 8.58333 7.33333H9.33333H10.0833ZM8.58333 10.6667C8.58333 11.0809 8.91912 11.4167 9.33333 11.4167C9.74755 11.4167 10.0833 11.0809 10.0833 10.6667H9.33333H8.58333ZM9.85634 4.18694C9.95959 4.58808 10.3685 4.82957 10.7696 4.72633C11.1708 4.62308 11.4122 4.2142 11.309 3.81306L10.5827 4L9.85634 4.18694ZM3.33333 4L2.58499 4.04989L3.16869 12.8052L3.91702 12.7554L4.66536 12.7055L4.08167 3.95011L3.33333 4ZM5.2474 14V14.75H10.7526V14V13.25H5.2474V14ZM12.083 12.7554L12.8313 12.8052L13.415 4.04989L12.6667 4L11.9183 3.95011L11.3346 12.7055L12.083 12.7554ZM12.6667 4V3.25H3.33333V4V4.75H12.6667V4ZM2 4V4.75H3.33333V4V3.25H2V4ZM12.6667 4V4.75H14V4V3.25H12.6667V4ZM10.7526 14V14.75C11.8494 14.75 12.7584 13.8996 12.8313 12.8052L12.083 12.7554L11.3346 12.7055C11.3142 13.0119 11.0597 13.25 10.7526 13.25V14ZM3.91702 12.7554L3.16869 12.8052C3.24164 13.8996 4.1506 14.75 5.2474 14.75V14V13.25C4.9403 13.25 4.68579 13.0119 4.66536 12.7055L3.91702 12.7554ZM6.66667 7.33333H5.91667V10.6667H6.66667H7.41667V7.33333H6.66667ZM9.33333 7.33333H8.58333V10.6667H9.33333H10.0833V7.33333H9.33333ZM8.00001 2V2.75C8.89208 2.75 9.64353 3.36011 9.85634 4.18694L10.5827 4L11.309 3.81306C10.9298 2.33959 9.59307 1.25 8.00001 1.25V2ZM5.41736 4L6.14369 4.18694C6.3565 3.36011 7.10795 2.75 8.00001 2.75V2V1.25C6.40696 1.25 5.07028 2.33959 4.69103 3.81306L5.41736 4Z" fill="currentColor" fillOpacity="0.7"/>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M4.08333 2.08333H2.88333C2.1366 2.08333 1.76323 2.08333 1.47801 2.22866C1.22713 2.35649 1.02316 2.56046 0.895325 2.81135C0.75 3.09656 0.75 3.46993 0.75 4.21667V9.28333C0.75 10.0301 0.75 10.4034 0.895325 10.6887C1.02316 10.9395 1.22713 11.1435 1.47801 11.2713C1.76323 11.4167 2.1366 11.4167 2.88333 11.4167H7.95C8.69674 11.4167 9.07011 11.4167 9.35532 11.2713C9.6062 11.1435 9.81018 10.9395 9.93801 10.6887C10.0833 10.4034 10.0833 10.0301 10.0833 9.28333V8.08333M7.41667 0.75H11.4167M11.4167 0.75V4.75M11.4167 0.75L5.41667 6.75" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-normal text-page-text-muted">{label}</span>
      {required && <span className="text-[12px] font-medium text-page-text-muted">Required</span>}
    </div>
  );
}

export default function CampaignApplyPage() {
  const [motivation, setMotivation] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [uploadedFile, setUploadedFile] = useState<string | null>("cv.pdf");
  const [videoLink, setVideoLink] = useState("https://www.tiktok.com/@fwogsworld/video/7447157783801203990");
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowToast(true);
    setTimeout(() => {
      router.push("/creator/for-you?detail=open");
    }, 1500);
  };

  const toggleChip = (c: string) => {
    setSelectedChips((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  };

  return (
    <div className="flex h-full flex-col bg-page-bg font-inter tracking-[-0.02em]">
      {/* Header */}
      <div className="flex items-center justify-between px-[156px] py-4">
        <Link href="/creator/feed" className="flex items-center gap-2 text-[14px] font-medium text-page-text">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to For you
        </Link>
        <div className="flex items-center gap-2.5">
          {/* Chat */}
          <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text">
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <path d="M7 0c2.043 0 3.793.528 5.045 1.571C13.311 2.627 14 4.156 14 6s-.689 3.373-1.955 4.429C10.793 11.472 9.043 12 7 12c-1.08 0-2.295-.1-3.39-.575-.185.104-.442.23-.746.336-.634.22-1.558.375-2.483-.063a.5.5 0 0 1-.242-.876c.459-.605.604-1.075.644-1.375.038-.29-.016-.455-.022-.473l.001.001-.001-.002-.006-.014-.009-.02a6.8 6.8 0 0 1-.4-1.092C.18 7.212 0 6.544 0 6c0-1.844.689-3.373 1.955-4.429C3.207.528 4.957 0 7 0z" fill="currentColor" />
            </svg>
          </button>
          {/* Bell */}
          <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text">
            <svg width="16" height="16" viewBox="0 0 12 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.404 0 1.264 2.036 1.134 4.628L1.015 7.021a.667.667 0 0 1-.07.265L.127 8.921A.667.667 0 0 0 0 9.461C0 10.127.54 10.667 1.206 10.667h1.527a3.334 3.334 0 0 0 6.534 0h1.527c.666 0 1.206-.54 1.206-1.206a.667.667 0 0 0-.127-.54l-.818-1.636a.667.667 0 0 1-.07-.265l-.12-2.392C10.736 2.036 8.596 0 6 0Zm0 12a2 2 0 0 1-1.886-1.333h3.772A2 2 0 0 1 6 12Z" fill="currentColor" />
            </svg>
          </button>
          {/* Tier pill + avatar */}
          <div className="flex h-9 items-center gap-2.5 rounded-2xl border border-foreground/[0.06] bg-card-bg py-0 pl-3 pr-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-medium text-[#E57100] dark:text-[#FB923C]">Recruit</span>
              <span className="text-[14px] font-medium text-foreground/20">&middot;</span>
              <span className="text-[14px] font-medium text-foreground/40">36%</span>
            </div>
            <img src="https://i.pravatar.cc/36?img=12" alt="" className="size-9 rounded-full" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-[156px] py-4" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col gap-4">

          {/* Campaign info header */}
          <div className="flex flex-col gap-3 rounded-t-2xl bg-gradient-to-b from-card-bg to-transparent px-4 pb-4 pt-4">
            {/* Applying to row */}
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-normal text-page-text-muted">Applying to</span>
              <span className="ml-auto text-[12px] font-medium text-page-text-subtle">View details</span>
            </div>

            {/* Brand info */}
            <div className="flex items-center gap-2">
              <img src={CAMPAIGN.brandAvatar} alt="" className="size-6 rounded-full shadow-[0_0_0_1.2px_rgba(255,255,255,0.4)]" />
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <span className="text-[14px] font-medium text-page-text">{CAMPAIGN.brand}</span>
                {CAMPAIGN.verified && <VerifiedBadge />}
              </div>
              <div className="flex items-center gap-1.5 text-[14px] font-normal text-page-text-subtle">
                <span>{CAMPAIGN.ago} ago</span>
                <span className="text-foreground/20">·</span>
                <span>{CAMPAIGN.approvalRate} approval rate</span>
              </div>
            </div>

            {/* Campaign title */}
            <h1 className="text-[20px] font-medium leading-[120%] text-page-text">{CAMPAIGN.title}</h1>

            {/* Stat pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {/* Creators pill */}
                <div className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-card-bg py-2 pl-2 pr-2.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  <UsersIcon className="size-4 text-page-text" />
                  <span className="text-[14px] font-medium text-page-text">{CAMPAIGN.creators}</span>
                </div>
                {/* CPM pill */}
                <div className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-card-bg py-2 pl-2 pr-2.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M7.164 0C9.8.0 12.358 1.515 14.069 4.389c.346.582.346 1.307 0 1.889C12.358 9.152 9.799 10.667 7.164 10.667 4.53 10.667 1.971 9.152.26 6.278c-.346-.582-.346-1.307 0-1.89C1.971 1.515 4.53 0 7.164 0ZM4.831 5.333a2.333 2.333 0 1 1 4.667 0 2.333 2.333 0 0 1-4.667 0Z" fill="#1A67E5"/></svg>
                  <span className="text-[14px] font-medium text-[#1A67E5]">{CAMPAIGN.cpm}</span>
                </div>
                <span className="text-[12px] font-medium text-foreground/20">·</span>
                {/* Category pill */}
                <div className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/[0.06] bg-card-bg py-2 pl-2 pr-2.5 dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                  <GamepadIcon className="size-4 text-page-text" />
                  <span className="text-[14px] font-medium text-page-text">{CAMPAIGN.category}</span>
                </div>
                <span className="text-[12px] font-medium text-foreground/20">·</span>
                {/* Platform pills */}
                {CAMPAIGN.platforms.map((p) => (
                  <div key={p} className="flex size-8 items-center justify-center rounded-full border border-foreground/[0.06] bg-card-bg dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
                    <PlatformIcon platform={p} size={16} className="text-page-text" />
                  </div>
                ))}
              </div>

              {/* Budget progress */}
              <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  <span className="text-[16px] font-medium text-page-text">{CAMPAIGN.spent}</span>
                  <span className="text-[16px] font-medium text-page-text-muted">/</span>
                  <span className="text-[16px] font-normal text-page-text-muted">{CAMPAIGN.total}</span>
                </div>
                <div className="h-1 w-32 rounded-full bg-foreground/[0.06]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${CAMPAIGN.progress}%`, background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Your information card */}
          <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
            <span className="text-[14px] font-medium text-page-text">Your information</span>

            <div className="flex flex-col gap-2">
              {/* Account selector */}
              <div className="flex flex-col gap-2">
                <FieldLabel label="Select which account(s) you want to apply with" required />
                <div className={cn(cardCls, "flex flex-col gap-2 p-5")}>
                  {/* Connected accounts */}
                  <div className="flex flex-col gap-2">
                    {CONNECTED_ACCOUNTS.map((acc, i) => (
                      <div
                        key={i}
                        className={cn(
                          cardCls,
                          "flex items-center gap-3 p-4"
                        )}
                      >
                        <div className="flex size-9 items-center justify-center rounded-full border border-foreground/[0.06] bg-card-bg">
                          <PlatformIcon platform={acc.platform} size={20} className="text-page-text" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <span className="text-[14px] font-medium text-page-text">{acc.name}</span>
                          <span className="text-[12px] font-normal text-page-text-subtle">{acc.username}</span>
                        </div>
                        <button className="flex items-center gap-1.5 text-[12px] font-medium text-page-text-subtle transition-colors hover:text-page-text">
                          <TrashIcon />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add account */}
                  <div className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/[0.12] p-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06]">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 3v12" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                    <span className="text-[14px] font-medium text-page-text">Add account</span>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div className={cn(cardCls, "flex flex-col gap-2 p-5")}>
                <FieldLabel label="Your motivation" required />
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="I'm a good fit because..."
                  rows={3}
                  className="w-full resize-none rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-[14px] leading-[120%] text-page-text outline-none placeholder:text-page-text-muted dark:bg-white/[0.04]"
                />
              </div>
            </div>
          </div>

          {/* Screening questions card */}
          <div className={cn(cardCls, "flex flex-col gap-4 p-4")}>
            <span className="text-[14px] font-medium text-page-text">Screening questions</span>

            <div className="flex flex-col gap-2">
              {/* Question textareas */}
              {SCREENING_QUESTIONS.map((q, i) => (
                <div key={i} className={cn(cardCls, "flex flex-col gap-2 p-5")}>
                  <FieldLabel label={q.label} required={q.required} />
                  <textarea
                    value={answers[i] ?? ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                    placeholder="I'm a good fit because..."
                    rows={3}
                    className="w-full resize-none rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-[14px] leading-[120%] text-page-text outline-none placeholder:text-page-text-muted dark:bg-white/[0.04]"
                  />
                </div>
              ))}

              {/* What makes a video stand out */}
              <div className={cn(cardCls, "flex flex-col gap-2 p-5")}>
                <FieldLabel label="What makes a video stand out?" required />
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {VIDEO_STANDOUT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleChip(opt)}
                        className={cn(
                          "rounded-full border px-3 py-2 text-[12px] font-medium transition-all",
                          selectedChips.includes(opt)
                            ? "border-[rgba(255,144,37,0.3)] bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),#FFFFFF] text-[#E57100] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,144,37,0.12)_0%,rgba(255,144,37,0)_50%),var(--card-bg)]"
                            : "border-foreground/[0.06] bg-card-bg text-page-text-muted hover:bg-foreground/[0.02]"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <span className="text-[12px] font-normal text-page-text-subtle">Multiple answers allowed</span>
                </div>
              </div>

              {/* File upload + video link row */}
              <div className="grid grid-cols-2 gap-2">
                {/* Upload CV */}
                <div className={cn(cardCls, "flex flex-col gap-2 p-5")}>
                  <FieldLabel label="Upload your CV" required />
                  {uploadedFile ? (
                    <div className="flex items-center gap-1.5 rounded-[14px] bg-foreground/[0.06] px-3.5 py-3 dark:bg-white/[0.06]">
                      <FileIcon />
                      <span className="flex-1 text-[14px] font-normal text-page-text">{uploadedFile}</span>
                      <button onClick={() => setUploadedFile(null)} className="text-page-text-muted transition-colors hover:text-page-text">
                        <TrashIcon />
                      </button>
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 rounded-full bg-foreground/[0.06] px-4 py-2 text-[14px] font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 10v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Upload file
                    </button>
                  )}
                </div>

                {/* Video link */}
                <div className={cn(cardCls, "flex flex-col gap-2 p-5")}>
                  <FieldLabel label="Share a link to your best performing video" required />
                  <div className="flex items-center gap-1.5 rounded-[14px] bg-foreground/[0.06] px-3.5 py-3 dark:bg-white/[0.06]">
                    <PlatformIcon platform="tiktok" size={16} className="shrink-0 text-page-text" />
                    <input
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="https://www.tiktok.com/@..."
                      className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-page-text outline-none placeholder:text-page-text-muted"
                    />
                    <button className="shrink-0 text-page-text-muted transition-colors hover:text-page-text">
                      <ExternalLinkIcon />
                    </button>
                    <button className="shrink-0 text-page-text-muted transition-colors hover:text-page-text">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit bar */}
      <div className="relative flex items-center justify-end gap-2 border-t border-foreground/[0.06] bg-card-bg px-5 py-3">
        {submitted ? (
          <>
            <button className="flex h-10 items-center gap-2 rounded-full bg-foreground/[0.06] px-4 text-[14px] font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 1.5H13a1 1 0 0 1 1 1V4M11.5 14.5H13a1 1 0 0 0 1-1V12M4.5 1.5H3a1 1 0 0 0-1 1V4M4.5 14.5H3a1 1 0 0 1-1-1V12M5.5 5.5h5v5h-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Copy link
            </button>
            <button
              disabled
              className="flex h-10 items-center rounded-full px-5 text-[14px] font-medium text-white opacity-40"
              style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
            >
              Applied
            </button>
          </>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex h-10 items-center rounded-full px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
          >
            Submit application
          </button>
        )}

        {/* Toast */}
        {showToast && (
          <div
            className="absolute bottom-full left-1/2 z-50 mb-4 -translate-x-1/2 animate-[toast-in_0.25s_ease-out]"
          >
            <div className="flex items-center gap-2 rounded-xl border border-foreground/[0.06] bg-card-bg px-3.5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" fill="#00994D"/>
                <path d="M5.5 8l2 2 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="whitespace-nowrap text-[14px] font-medium text-page-text">Your application has been sent!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
