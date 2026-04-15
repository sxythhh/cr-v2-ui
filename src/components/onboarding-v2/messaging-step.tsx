"use client";

import { cn } from "@/lib/utils";

type Channel = "email" | "whatsapp" | "slack" | "in-app";

interface MessagingStepProps {
  selected: Set<Channel>;
  onToggle: (channel: Channel) => void;
}

/* ── Channel icons (matching settings/notification style) ── */

function EmailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h7A1.5 1.5 0 0 1 11 3.5v5A1.5 1.5 0 0 1 9.5 10h-7A1.5 1.5 0 0 1 1 8.5v-5Zm1.22-.19L6 5.94l3.78-2.63A.5.5 0 0 0 9.5 3h-7a.5.5 0 0 0-.28.31Z" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10.1 1.84A5.44 5.44 0 0 0 6.02.17C2.87.17.31 2.73.31 5.88a5.67 5.67 0 0 0 .84 2.97L.24 11.83l3.06-.8a5.73 5.73 0 0 0 2.72.69c3.15 0 5.71-2.56 5.71-5.71a5.68 5.68 0 0 0-1.63-4.17Z" fill="currentColor" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.52 7.56a1.26 1.26 0 1 1-1.26-1.26h1.26v1.26Zm.63 0a1.26 1.26 0 1 1 2.52 0v3.15a1.26 1.26 0 0 1-2.52 0V7.56ZM4.41 2.52A1.26 1.26 0 1 1 5.67 1.26V2.52H4.41Zm0 .63a1.26 1.26 0 0 1 0 2.52H1.26a1.26 1.26 0 1 1 0-2.52h3.15ZM9.45 4.41a1.26 1.26 0 1 1 1.26 1.26H9.45V4.41Zm-.63 0a1.26 1.26 0 1 1-2.52 0V1.26a1.26 1.26 0 0 1 2.52 0v3.15ZM7.56 9.45a1.26 1.26 0 1 1-1.26-1.26v1.26h1.26Zm0-.63a1.26 1.26 0 0 1 0-2.52h3.15a1.26 1.26 0 0 1 0 2.52H7.56Z" fill="currentColor" />
    </svg>
  );
}

function InAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M17 17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17H17Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V8.17071C22.1652 8.58254 23 9.69378 23 11V19C23 20.6569 21.6569 22 20 22H15C14.1115 22 13.3132 21.6137 12.7639 21H4C2.34315 21 1 19.6569 1 18V16C1 15.4477 1.44772 15 2 15H3V6ZM14 19C14 19.5523 14.4477 20 15 20H20C20.5523 20 21 19.5523 21 19V11C21 10.4477 20.5523 10 20 10H15C14.4477 10 14 10.4477 14 11V19ZM12 17V19H4C3.44772 19 3 18.5523 3 18V17H12Z" fill="currentColor"/>
    </svg>
  );
}

/* ── Toggle (same as settings pattern) ── */

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
        on ? "bg-page-text dark:bg-white" : "bg-foreground/[0.10]",
      )}
    >
      <div
        className={cn(
          "absolute top-[2px] size-4 rounded-full bg-card-bg transition-[left] duration-200",
        )}
        style={{
          left: on ? 18 : 2,
          boxShadow: "0px 1px 2px rgba(0,0,0,0.06)",
        }}
      />
    </button>
  );
}

const CHANNELS: { id: Channel; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "email", label: "Email", description: "Campaign updates, payout notifications", icon: <EmailIcon /> },
  { id: "whatsapp", label: "WhatsApp", description: "Urgent alerts and security notices", icon: <WhatsAppIcon /> },
  { id: "slack", label: "Slack", description: "Real-time submission updates", icon: <SlackIcon /> },
  { id: "in-app", label: "In-app", description: "Notifications within the platform", icon: <InAppIcon /> },
];

export function MessagingStep({ selected, onToggle }: MessagingStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          How should we reach you?
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          Choose your preferred channels. You can change this later in Settings.
        </p>
      </div>

      {/* Channel rows — settings style */}
      <div className="rounded-2xl border border-foreground/[0.06] bg-card-bg dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
        {CHANNELS.map((ch, i) => {
          const on = selected.has(ch.id);
          return (
            <div
              key={ch.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5",
                i < CHANNELS.length - 1 && "border-b border-foreground/[0.06] dark:border-[rgba(224,224,224,0.03)]",
              )}
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-foreground/[0.06] text-page-text-muted dark:border-[rgba(224,224,224,0.06)]">
                {ch.icon}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13px] font-medium tracking-[-0.02em] text-page-text">{ch.label}</span>
                <span className="text-[11px] font-medium leading-[15px] tracking-[-0.02em] text-page-text-subtle">{ch.description}</span>
              </div>
              <Toggle on={on} onToggle={() => onToggle(ch.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
