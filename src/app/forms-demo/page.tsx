"use client";

import { useState } from "react";
import { BusinessOnboardingTypeform } from "@/components/forms/business-onboarding-typeform";
import { toast } from "sonner";

export default function FormsDemo() {
  const [formKey, setFormKey] = useState(0);

  const resetOnboarding = () => {
    localStorage.removeItem("business-onboarding-typeform-v3");
    localStorage.removeItem("business-onboarding-typeform-v3_step");
    setFormKey((k) => k + 1);
    toast.success("Onboarding progress reset");
  };

  const copyEmbedCode = async () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
    const code = `<iframe src="${origin}/forms-demo/embed" width="100%" height="620" style="border:0;background:transparent;" allow="clipboard-write"></iframe>`;
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Embed code copied");
    } catch {
      toast.error("Copy failed — check clipboard permissions");
    }
  };

  return (
    <div className="min-h-screen bg-page-outer-bg px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={copyEmbedCode}
            className="flex h-9 cursor-pointer items-center justify-center rounded-lg border border-foreground/[0.08] bg-white px-3 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.04] dark:bg-card-bg"
          >
            Copy embed code
          </button>
          <button
            type="button"
            onClick={resetOnboarding}
            className="flex h-9 cursor-pointer items-center justify-center rounded-lg border border-foreground/[0.08] bg-white px-3 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.04] dark:bg-card-bg"
          >
            Reset progress
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:bg-card-bg dark:shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
          <BusinessOnboardingTypeform
            key={formKey}
            onComplete={(data) => {
              toast.success(`Welcome, ${data.companyName || data.fullName}!`);
              console.log("Business onboarding complete:", data);
            }}
          />
        </div>
      </div>
    </div>
  );
}
