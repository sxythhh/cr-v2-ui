"use client";

import { useState } from "react";
import { BusinessOnboardingTypeform } from "@/components/forms/business-onboarding-typeform";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

export default function FormsDemo() {
  const [open, setOpen] = useState(false);
  const [formKey] = useState(0);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 cursor-pointer items-center justify-center rounded-xl px-5 font-inter text-sm font-semibold tracking-[-0.05em] text-white transition-all active:scale-[0.97] bg-[#252525] shadow-[0_1px_2px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#1a1a1a]"
      >
        Get Started
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="max-w-sm"
        showClose={false}
        className="[&]:border-0 [&]:shadow-lg"
      >
        <BusinessOnboardingTypeform
          key={formKey}
          onComplete={(data) => {
            toast.success(`Welcome, ${data.companyName || data.fullName}!`);
            console.log("Business onboarding complete:", data);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
