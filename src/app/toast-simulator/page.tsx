"use client";

import { PageShell } from "@/components/page-shell";
import { toastManager } from "@/components/ui/toast";

const TOASTS = [
  {
    type: "info" as const,
    title: "Info",
    description: "This is an informational message.",
  },
  {
    type: "success" as const,
    title: "Success",
    description: "Your changes have been saved.",
  },
  {
    type: "warning" as const,
    title: "Warning",
    description: "This action cannot be undone.",
  },
  {
    type: "error" as const,
    title: "Error",
    description: "Something went wrong. Please try again.",
  },
  {
    type: "loading" as const,
    title: "Loading",
    description: "Processing your request...",
  },
];

function fire(type: typeof TOASTS[number]["type"], title: string, description?: string) {
  toastManager.add({ type, title, description });
}

export default function ToastSimulatorPage() {
  return (
    <PageShell title="Toast Simulator">
      <div className="flex flex-col gap-6 p-5">
        <p className="font-inter text-sm text-page-text-muted">
          Click a button to trigger a toast notification.
        </p>

        <div className="flex flex-wrap gap-3">
          {TOASTS.map((t) => (
            <button
              key={t.type}
              type="button"
              onClick={() => fire(t.type, t.title, t.description)}
              className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-inter text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.10]"
            >
              {t.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fire("success", "Copied!", undefined)}
            className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-inter text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.10]"
          >
            Title only (no description)
          </button>
          <button
            type="button"
            onClick={() =>
              toastManager.add({
                type: "success",
                title: "Campaign published",
                actionProps: { children: "Undo" },
              })
            }
            className="cursor-pointer rounded-full bg-foreground/[0.06] px-4 py-2 font-inter text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.10]"
          >
            With action button
          </button>
        </div>
      </div>
    </PageShell>
  );
}
