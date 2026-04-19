"use client";

import { BusinessOnboardingTypeform } from "@/components/forms/business-onboarding-typeform";

export default function FormsDemoEmbed() {
  return (
    <div className="min-h-screen bg-transparent p-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          <BusinessOnboardingTypeform
            onComplete={(data) => {
              if (typeof window !== "undefined" && window.parent !== window) {
                window.parent.postMessage(
                  { type: "forms-demo:complete", data },
                  "*",
                );
              }
              console.log("Embed form complete:", data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
