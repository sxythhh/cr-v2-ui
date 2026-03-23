"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "@/components/icons/PlatformIcon";

// ── Icons ──────────────────────────────────────────────────────────

function LeaderboardIcon() {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
      <path d="M8.33333 0C7.41286 0 6.66667 0.746192 6.66667 1.66667V10H12.5V1.66667C12.5 0.746192 11.7538 0 10.8333 0H8.33333Z" fill="currentColor" />
      <path d="M1.66667 2.08333C0.746192 2.08333 0 2.82952 0 3.75V8.33333C0 9.25381 0.746191 10 1.66667 10H5.41667V2.08333H1.66667Z" fill="currentColor" />
      <path d="M13.75 3.33333V10H17.5C18.4205 10 19.1667 9.25381 19.1667 8.33333V5C19.1667 4.07953 18.4205 3.33333 17.5 3.33333H13.75Z" fill="currentColor" />
    </svg>
  );
}

function EyeSlashIcon() {
  return (
    <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M0.865822 0.244078C1.19126 -0.0813593 1.7189 -0.0813593 2.04433 0.244078L5.07826 3.27801L5.08065 3.28039L14.0084 12.2081L14.0106 12.2103L17.0443 15.2441C17.3698 15.5695 17.3698 16.0972 17.0443 16.4226C16.7189 16.748 16.1913 16.748 15.8658 16.4226L13.291 13.8478C11.1917 15.0182 8.8471 15.3027 6.61622 14.6758C4.18077 13.9913 1.94831 12.2414 0.325162 9.51506C-0.107306 8.78867 -0.109154 7.88177 0.324224 7.15364C1.14743 5.77056 2.127 4.6386 3.21211 3.76888L0.865822 1.42259C0.540386 1.09715 0.540386 0.569515 0.865822 0.244078ZM5.62195 8.33352C5.62195 7.71571 5.79052 7.13655 6.08358 6.64035L7.34493 7.9017C7.30817 8.03935 7.28861 8.18407 7.28861 8.33352C7.28861 9.254 8.03481 10.0002 8.95528 10.0002C9.10473 10.0002 9.24945 9.98063 9.38711 9.94387L10.6485 11.2052C10.1523 11.4983 9.5731 11.6669 8.95528 11.6669C7.11433 11.6669 5.62195 10.1745 5.62195 8.33352Z" fill="currentColor" />
      <path d="M17.5852 9.51397C17.0834 10.3571 16.5231 11.1066 15.9169 11.76L6.25651 2.09966C7.13489 1.81239 8.04114 1.66667 8.95463 1.66667C12.2477 1.66664 15.4468 3.56027 17.5852 7.15261C18.0181 7.87986 18.0181 8.78672 17.5852 9.51397Z" fill="currentColor" />
    </svg>
  );
}

function StopwatchIcon() {
  return (
    <svg width="15" height="18" viewBox="0 0 15 18" fill="none">
      <path d="M5.83333 0C5.3731 0 5 0.373096 5 0.833333C5 1.29357 5.3731 1.66667 5.83333 1.66667H9.16667C9.6269 1.66667 10 1.29357 10 0.833333C10 0.373096 9.6269 0 9.16667 0H5.83333Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M15 10C15 14.1421 11.6421 17.5 7.5 17.5C3.35786 17.5 0 14.1421 0 10C0 5.85786 3.35786 2.5 7.5 2.5C11.6421 2.5 15 5.85786 15 10ZM4.41074 8.08926C4.08531 7.76382 4.08531 7.23618 4.41074 6.91074C4.73618 6.58531 5.26382 6.58531 5.58926 6.91074L8.08926 9.41074C8.41469 9.73618 8.41469 10.2638 8.08926 10.5893C7.76382 10.9147 7.23618 10.9147 6.91074 10.5893L4.41074 8.08926Z" fill="currentColor" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
      <path d="M2.5 0C1.11929 0 0 1.11929 0 2.5V14.1667C0 15.5474 1.11929 16.6667 2.5 16.6667H7.93982C7.14809 15.7821 6.66667 14.6139 6.66667 13.3333V10.8333C6.66667 8.07191 8.90524 5.83333 11.6667 5.83333C12.2511 5.83333 12.812 5.93359 13.3333 6.11784V2.5C13.3333 1.11929 12.214 0 10.8333 0H2.5Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M10 10.8333C10 9.91286 10.7462 9.16667 11.6667 9.16667C12.5871 9.16667 13.3333 9.91286 13.3333 10.8333C13.3333 11.2936 13.7064 11.6667 14.1667 11.6667C14.6269 11.6667 15 11.2936 15 10.8333C15 8.99238 13.5076 7.5 11.6667 7.5C9.82572 7.5 8.33333 8.99238 8.33333 10.8333C8.33333 11.2936 8.70643 11.6667 9.16667 11.6667C9.6269 11.6667 10 11.2936 10 10.8333Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M12.5 11.6667C12.5 11.2064 12.1269 10.8333 11.6667 10.8333C11.2064 10.8333 10.8333 11.2064 10.8333 11.6667V12.5C10.8333 12.9602 11.2064 13.3333 11.6667 13.3333C12.1269 13.3333 12.5 12.9602 12.5 12.5V11.6667Z" fill="currentColor" fillOpacity="0.5" />
      <path d="M10 13.3333C10 12.8731 9.6269 12.5 9.16667 12.5C8.70643 12.5 8.33333 12.8731 8.33333 13.3333C8.33333 15.1743 9.82572 16.6667 11.6667 16.6667C13.5076 16.6667 15 15.1743 15 13.3333C15 12.8731 14.6269 12.5 14.1667 12.5C13.7064 12.5 13.3333 12.8731 13.3333 13.3333C13.3333 14.2538 12.5871 15 11.6667 15C10.7462 15 10 14.2538 10 13.3333Z" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────

function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
      {description && <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-foreground/[0.06] bg-card-bg p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0px_1px_2px_rgba(0,0,0,0.15)]">
      {children}
    </div>
  );
}

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={cn(
        "flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
        on ? "bg-[#252525] dark:bg-white" : "bg-foreground/20",
      )}
    >
      <div className={cn("size-4 rounded-full bg-white dark:bg-[#161616] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] transition-transform", on ? "translate-x-5" : "translate-x-0")} />
    </button>
  );
}

function ToggleCard({
  icon,
  title,
  description,
  on,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
        on
          ? "border-[rgba(255,144,37,0.3)]"
          : "border-foreground/[0.06] bg-card-bg",
      )}
      style={on ? {
        background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)",
      } : undefined}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.25px] border-foreground/[0.06] bg-white shadow-[0px_1.25px_2.5px_rgba(0,0,0,0.03)] dark:bg-white/10">
        <span className={on ? "text-[#252525] dark:text-white" : "text-page-text-muted"}>{icon}</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-inter text-sm font-medium tracking-[-0.02em] text-page-text">{title}</span>
        <span className="font-inter text-sm font-normal leading-[150%] tracking-[-0.02em] text-page-text-muted">{description}</span>
      </div>
      <ToggleSwitch on={on} onToggle={onToggle} />
    </button>
  );
}

// ── Platforms ───────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
] as const;

// ── Main ───────────────────────────────────────────────────────────

export function PlatformsStep() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [allowHide, setAllowHide] = useState(false);
  const [trackingCutoff, setTrackingCutoff] = useState(false);
  const [linkTracking, setLinkTracking] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Select platforms */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Select platforms" description="Choose which platforms this campaign accepts content from." />
        <Card>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const isOn = selected.has(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-full border px-3 font-inter text-sm font-medium tracking-[-0.02em] transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.03)]",
                    isOn
                      ? "border-[rgba(255,144,37,0.3)] text-page-text"
                      : "border-foreground/[0.06] bg-card-bg text-page-text-subtle hover:bg-foreground/[0.02]",
                  )}
                  style={isOn ? {
                    background: "radial-gradient(50% 50% at 50% 100%, rgba(255, 144, 37, 0.12) 0%, rgba(255, 144, 37, 0) 50%), var(--card-bg)",
                  } : undefined}
                >
                  <PlatformIcon platform={p.id} size={16} />
                  {p.label}
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 2. Visibility and leaderboard */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Visibility and leaderboard" />
        <Card>
          <div className="flex flex-col gap-2">
            <ToggleCard
              icon={<LeaderboardIcon />}
              title="Show top performers"
              description="Showcase a public leaderboard of top creators by views, engagement, and earnings."
              on={showLeaderboard}
              onToggle={() => setShowLeaderboard((v) => !v)}
            />
            <ToggleCard
              icon={<EyeSlashIcon />}
              title="Allow creators to hide their submissions"
              description="Creators can hide their submissions from the leaderboard and campaign showcase."
              on={allowHide}
              onToggle={() => setAllowHide((v) => !v)}
            />
          </div>
        </Card>
      </div>

      {/* 3. Video tracking */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Video tracking" />
        <Card>
          <ToggleCard
            icon={<StopwatchIcon />}
            title="7-day tracking cutoff"
            description="Videos stop being tracked and paid for 7 days after upload. Disable to track indefinitely."
            on={trackingCutoff}
            onToggle={() => setTrackingCutoff((v) => !v)}
          />
        </Card>
      </div>

      {/* 4. Link tracking */}
      <div className="flex flex-col gap-2">
        <SectionLabel title="Link tracking" />
        <Card>
          <ToggleCard
            icon={<LinkIcon />}
            title="Enable link tracking"
            description="Each creator gets a unique tracked link. You can measure clicks, conversions, and attribute sales back to individual creators."
            on={linkTracking}
            onToggle={() => setLinkTracking((v) => !v)}
          />
        </Card>
      </div>
    </div>
  );
}
