"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import type { ChatPlatform, ContactData } from "@/types/campaign-flow.types";

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM10 6.667a.833.833 0 1 1 0 1.666.833.833 0 0 1 0-1.666ZM10 9.167c.46 0 .833.373.833.833v3.333a.833.833 0 0 1-1.666 0V10c0-.46.373-.833.833-.833Z" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon() {
  return <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.03)]", className)}>
      {children}
    </div>
  );
}

function WhatsAppIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.52516 3.47035C4.6398 3.475 4.76679 3.48043 4.88748 3.74851C4.96968 3.93142 5.10788 4.27202 5.21826 4.54406C5.30005 4.74562 5.36656 4.90954 5.38371 4.9438C5.42399 5.02428 5.45071 5.11852 5.39711 5.2258C5.38887 5.2423 5.38127 5.25784 5.37401 5.27268C5.33407 5.35437 5.30457 5.41471 5.23631 5.49424C5.20904 5.52601 5.18084 5.56029 5.15267 5.59453C5.09754 5.66157 5.0425 5.72848 4.99468 5.77624C4.91393 5.85647 4.82985 5.9437 4.92391 6.10475C5.01797 6.26581 5.34106 6.79287 5.81968 7.21965C6.33483 7.67899 6.78218 7.87294 7.00865 7.97113C7.05262 7.99019 7.08826 8.00564 7.11446 8.01873C7.27561 8.09921 7.3694 8.08572 7.46338 7.97826C7.55735 7.8708 7.86554 7.50831 7.973 7.34716C8.08047 7.18602 8.18775 7.21273 8.33532 7.2665C8.48289 7.32028 9.27435 7.70974 9.4355 7.79032C9.4672 7.80617 9.49682 7.82045 9.52425 7.83367C9.63629 7.88769 9.71193 7.92416 9.74422 7.97826C9.78442 8.04561 9.78433 8.36773 9.65025 8.74371C9.51616 9.11969 8.85887 9.48236 8.56355 9.50916C8.53512 9.51174 8.50687 9.51506 8.4778 9.51847C8.20491 9.55054 7.86055 9.591 6.63146 9.10629C5.11757 8.50931 4.11978 7.02924 3.91502 6.72552C3.89843 6.7009 3.88704 6.68402 3.88101 6.67595L3.8791 6.6734C3.79191 6.55681 3.22364 5.79696 3.22364 5.0108C3.22364 4.26968 3.58783 3.88104 3.75554 3.70207C3.76709 3.68974 3.77771 3.67841 3.78721 3.66802C3.9347 3.50687 4.10916 3.46659 4.21653 3.46659L4.52516 3.47035Z" fill="currentColor" /><path fillRule="evenodd" clipRule="evenodd" d="M0 13L0.914246 9.66198C0.349436 8.68276 0.0527599 7.57194 0.0541243 6.4415C0.0556132 2.88961 2.9461 0 6.49807 0C8.22173 0.000875818 9.83959 0.67165 11.0563 1.88927C12.2731 3.10689 12.9425 4.72537 12.9419 6.44666C12.9404 9.99829 10.0494 12.8884 6.49799 12.8884H6.49518C5.41681 12.888 4.35718 12.6175 3.41596 12.1042L0 13ZM6.5 1.08818C3.54567 1.08818 1.14309 3.48988 1.14204 6.44193C1.14058 7.44997 1.42445 8.43785 1.96082 9.29134L2.08825 9.49391L1.5471 11.4695L3.57422 10.938L3.76996 11.054C4.59207 11.5419 5.53469 11.7999 6.49597 11.8004H6.49798C9.45004 11.8004 11.8526 9.39845 11.8538 6.44622C11.856 5.74257 11.7186 5.04547 11.4496 4.39527C11.1806 3.74507 10.7853 3.15469 10.2865 2.65831C9.79054 2.15922 9.2005 1.76346 8.55054 1.49394C7.90058 1.22443 7.20362 1.08651 6.5 1.08818Z" fill="currentColor" /></svg>;
}

function IMessageIcon() {
  return <svg width="13" height="12" viewBox="0 0 13 12" fill="none"><path d="M6.5 0C4.7761 1.14146e-05 3.1228 0.57042 1.90382 1.58575C0.684835 2.60108 1.1679e-05 3.97817 0 5.41406C0.00157099 6.34804 0.293191 7.26579 0.846519 8.07813C1.39985 8.89048 2.19606 9.56978 3.15779 10.05C2.90164 10.6235 2.51748 11.1612 2.02121 11.6409C2.9836 11.472 3.88701 11.1171 4.66114 10.6039C5.25803 10.7516 5.87731 10.8271 6.5 10.8281C8.2239 10.8281 9.8772 10.2577 11.0962 9.24237C12.3152 8.22704 13 6.84995 13 5.41406C13 3.97817 12.3152 2.60108 11.0962 1.58575C9.8772 0.57042 8.2239 1.13614e-05 6.5 0Z" fill="currentColor" fillOpacity="0.5" /></svg>;
}

function SlackIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.74083 8.21816C2.74083 8.97373 2.13064 9.5844 1.37567 9.5844C0.62069 9.5844 0.0105037 8.97373 0.0105037 8.21816C0.0105037 7.46258 0.62069 6.85191 1.37567 6.85191H2.74083V8.21816ZM3.42341 8.21816C3.42341 7.46258 4.0336 6.85191 4.78858 6.85191C5.54355 6.85191 6.15374 7.46258 6.15374 8.21816V11.6338C6.15374 12.3893 5.54355 13 4.78858 13C4.0336 13 3.42341 12.3893 3.42341 11.6338V8.21816Z" fill="currentColor" fillOpacity="0.5" /><path d="M4.78841 2.73248C4.03344 2.73248 3.42325 2.12181 3.42325 1.36624C3.42325 0.610668 4.03344 0 4.78841 0C5.54339 0 6.15358 0.610668 6.15358 1.36624V2.73248H4.78841ZM4.78841 3.42595C5.54339 3.42595 6.15358 4.03662 6.15358 4.7922C6.15358 5.54777 5.54339 6.15844 4.78841 6.15844H1.36516C0.610187 6.15844 0 5.54777 0 4.7922C0 4.03662 0.610187 3.42595 1.36516 3.42595H4.78841Z" fill="currentColor" fillOpacity="0.5" /><path d="M10.2593 4.7922C10.2593 4.03662 10.8695 3.42595 11.6245 3.42595C12.3795 3.42595 12.9897 4.03662 12.9897 4.7922C12.9897 5.54777 12.3795 6.15844 11.6245 6.15844H10.2593V4.7922ZM9.57675 4.7922C9.57675 5.54777 8.96656 6.15844 8.21159 6.15844C7.45661 6.15844 6.84642 5.54777 6.84642 4.7922V1.36624C6.84642 0.610668 7.45661 0 8.21159 0C8.96656 0 9.57675 0.610668 9.57675 1.36624V4.7922Z" fill="currentColor" fillOpacity="0.5" /><path d="M8.21159 10.2675C8.96656 10.2675 9.57675 10.8782 9.57675 11.6338C9.57675 12.3893 8.96656 13 8.21159 13C7.45661 13 6.84642 12.3893 6.84642 11.6338V10.2675H8.21159ZM8.21159 9.5844C7.45661 9.5844 6.84642 8.97373 6.84642 8.21816C6.84642 7.46258 7.45661 6.85191 8.21159 6.85191H11.6348C12.3898 6.85191 13 7.46258 13 8.21816C13 8.97373 12.3898 9.5844 11.6348 9.5844H8.21159Z" fill="currentColor" fillOpacity="0.5" /></svg>;
}

const CHAT_OPTIONS: { value: ChatPlatform; label: string; icon: () => React.ReactNode }[] = [
  { value: "whatsapp", label: "Whatsapp", icon: WhatsAppIcon },
  { value: "imessage", label: "iMessage", icon: IMessageIcon },
  { value: "slack", label: "Slack", icon: SlackIcon },
];

export function ContactStep({ data, onChange }: { data: ContactData; onChange: (data: ContactData) => void }) {
  const update = (partial: Partial<ContactData>) => onChange({ ...data, ...partial });
  const [address, setAddress] = useState("123 Creator Blvd, Suite 400");
  const [city, setCity] = useState("Los Angeles");
  const [state, setState] = useState("California");
  const [country, setCountry] = useState("United States");
  const [zip, setZip] = useState("90028");
  const chatRef = useRef<HTMLDivElement>(null);
  const chatHover = useProximityHover(chatRef, { axis: "x" });
  useEffect(() => { chatHover.measureItems(); }, [chatHover.measureItems]);
  const chatHoverRect = chatHover.activeIndex !== null ? chatHover.itemRects[chatHover.activeIndex] : null;
  const selectedChatIndex = CHAT_OPTIONS.findIndex((o) => o.value === data.chatPlatform);

  return (
    <div className="flex flex-col gap-6">
      {/* Info banner */}
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.25px] border-foreground/[0.06] bg-white shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)]">
            <span className="text-page-text-muted"><InfoIcon /></span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">For internal use only</span>
            <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">Our team will use this info to keep in touch about your campaign. This data is never shared publicly.</span>
          </div>
        </div>
      </Card>

      {/* Your details */}
      <div className="flex flex-col gap-2">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Your details</span>
        <Card className="flex flex-col gap-4 p-5">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Email address</span>
            <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
              <input type="text" value={data.email} onChange={(e) => update({ email: e.target.value })} placeholder="vlad@outpacestudios.com" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Phone number</span>
            <div className="flex gap-2">
              <button type="button" className="flex h-10 w-[104px] shrink-0 cursor-pointer items-center gap-1.5 rounded-[14px] bg-foreground/[0.04] px-3.5 transition-colors hover:bg-foreground/[0.06]">
                <span className="text-[10px]">🇺🇸</span>
                <span className="font-inter text-sm tracking-[-0.02em] text-page-text">+1</span>
                <ChevronDownIcon />
              </button>
              <div className="flex h-10 flex-1 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="tel" value={data.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="(555) 123-4567" className="w-full flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Address (required for contracts and invoicing)</span>
            <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Creator Blvd, Suite 400" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
            </div>
          </div>

          {/* City + State */}
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">City</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Los Angeles" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">State/Region</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="California" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
              </div>
            </div>
          </div>

          {/* Country + ZIP */}
          <div className="flex gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">Country</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-inter text-xs tracking-[-0.02em] text-page-text-muted">ZIP/Postal code</span>
              <div className="flex h-10 items-center rounded-[14px] bg-foreground/[0.04] px-3.5">
                <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="90028" className="flex-1 bg-transparent font-inter text-sm tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Preferred group chat */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">Preferred group chat platform</span>
          <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">We&apos;ll set up a group chat to keep you in the loop throughout the campaign.</span>
        </div>
        <Card>
          <div
            ref={chatRef}
            className="relative flex items-center gap-0.5 rounded-xl bg-foreground/[0.06] p-0.5"
            onMouseMove={chatHover.handlers.onMouseMove}
            onMouseLeave={chatHover.handlers.onMouseLeave}
          >
            {/* Proximity hover highlight */}
            <AnimatePresence>
              {chatHoverRect && chatHover.activeIndex !== selectedChatIndex && (
                <motion.div
                  key={chatHover.sessionRef.current}
                  className="pointer-events-none absolute rounded-[10px] bg-foreground/[0.04]"
                  initial={{ opacity: 0, ...chatHoverRect }}
                  animate={{ opacity: 1, ...chatHoverRect }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
                />
              )}
            </AnimatePresence>
            {CHAT_OPTIONS.map((opt, i) => (
              <button
                key={opt.value}
                ref={(el) => chatHover.registerItem(i, el)}
                type="button"
                onClick={() => update({ chatPlatform: opt.value })}
                className={cn(
                  "relative z-10 flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[10px] font-inter text-sm font-medium tracking-[-0.02em] transition-all",
                  data.chatPlatform === opt.value
                    ? "bg-white text-page-text shadow-[0px_2px_4px_rgba(0,0,0,0.06)] dark:bg-[#222222] dark:shadow-[0_2px_4px_rgba(0,0,0,0.06)] dark:text-white [&_svg_path]:!opacity-100"
                    : "text-page-text-subtle",
                )}
              >
                <opt.icon />
                {opt.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
