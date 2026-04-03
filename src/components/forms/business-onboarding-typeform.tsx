"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  TypeformShell,
  useFormPersistence,
  type TypeformStep,
} from "./typeform-shell";
import { FormField, FormInput } from "@/components/ui/form-field";
import { FormDropdown } from "@/components/ui/form-dropdown";
import { PhoneInput } from "@/components/reui/phone-input";

/* ── Types ── */

type PlanType = "self-serve" | "managed" | "";

interface OnboardingData {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companyLink: string;
  businessType: string;
  monthlyBudget: string;
  planType: PlanType;
}

interface BusinessOnboardingTypeformProps {
  onComplete?: (data: OnboardingData) => void;
}

/* ── Constants ── */

const BUSINESS_TYPES = [
  { label: "SaaS", value: "saas" },
  { label: "Mobile App", value: "mobile-app" },
  { label: "Ecommerce", value: "ecommerce" },
  { label: "Music Label", value: "music-label" },
  { label: "Personal Brand", value: "personal-brand" },
  { label: "Other", value: "other" },
];

const MONTHLY_BUDGETS = [
  { label: "Under $1,000", value: "under-1k" },
  { label: "$1,000 – $5,000", value: "1k-5k" },
  { label: "$5,000 – $10,000", value: "5k-10k" },
  { label: "$10,000 – $25,000", value: "10k-25k" },
  { label: "$25,000 – $50,000", value: "25k-50k" },
  { label: "$50,000+", value: "50k-plus" },
];

/* ── Steps ── */

const STEPS: TypeformStep[] = [
  { id: "contact", label: "Contact" },
  { id: "company", label: "Company" },
  { id: "business", label: "Business" },
  { id: "plan", label: "Plan" },
  { id: "book", label: "Book" },
];

/* ── Cal.com Embed ── */

let calIdCounter = 0;

function CalEmbed() {
  const elRef = React.useRef<HTMLDivElement>(null);
  const nsRef = React.useRef(`discovery-call-${++calIdCounter}`);

  React.useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const ns = nsRef.current;

    // Bootstrap the Cal global if not already present
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    Cal("init", ns, { origin: "https://app.cal.com" });
    Cal.ns[ns]("inline", {
      elementOrSelector: el,
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "light" },
      calLink: "team/content-rewards/discovery-call",
    });
    Cal.ns[ns]("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view" });

    return () => {
      // Clean up the embed iframe
      while (el.firstChild) el.removeChild(el.firstChild);
      delete Cal.ns[ns];
    };
  }, []);

  return (
    <div
      ref={elRef}
      className="w-full"
      style={{ height: 500 }}
    />
  );
}

/* ── Component ── */

export function BusinessOnboardingTypeform({
  onComplete,
}: BusinessOnboardingTypeformProps) {
  const {
    data,
    updateField,
    currentStep,
    setCurrentStep,
    reset,
  } = useFormPersistence<OnboardingData>("business-onboarding-typeform-v3", {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyLink: "",
    businessType: "",
    monthlyBudget: "",
    planType: "",
  });

  const [loading, setLoading] = React.useState(false);

  const canProceed = () => {
    switch (currentStep) {
      case 0: return (data.fullName || "").trim() !== "";
      case 1: return (data.companyName || "").trim() !== "";
      case 2: return data.businessType !== "" && data.monthlyBudget !== "";
      case 3: return data.planType !== "";
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await onComplete?.(data);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <TypeformShell
      steps={STEPS}
      currentStep={currentStep}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed()}
      loading={loading}
      finishLabel="Done"
      onFinish={handleFinish}
      hideFooter={currentStep === 3}
    >
      {/* Step 1: Personal info */}
      {currentStep === 0 && (
        <div className="space-y-3">
          <FormField label="Full Name">
            <FormInput
              type="text"
              value={data.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              placeholder="Jane Doe"
              autoFocus
            />
          </FormField>
          <FormField label="Email">
            <FormInput
              type="email"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="jane@acme.com"
            />
          </FormField>
          <FormField label="Phone">
            <div className="flex h-9 items-center rounded-2xl border border-[rgba(37,37,37,0.14)] shadow-[0_1px_0_#FFFFFF] dark:border-white/[0.08] dark:shadow-none [&_.PhoneInputCountry]:pr-3 [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-r-[rgba(37,37,37,0.14)] [&_.PhoneInputCountry]:self-stretch dark:[&_.PhoneInputCountry]:border-r-white/[0.08]">
              <PhoneInput
                value={data.phone as any}
                onChange={(v) => updateField("phone", v?.toString() ?? "")}
                defaultCountry="US"
                international
                style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
                className="font-inter text-sm font-medium tracking-[-0.05em] text-[#252525] [&_input]:border-0 [&_input]:bg-transparent [&_input]:shadow-none [&_input]:outline-none [&_input]:ring-0 [&_input]:focus-visible:ring-0 [&_input]:focus-visible:border-0 [&_input]:font-[inherit] [&_input]:text-[inherit] [&_input]:tracking-[inherit] [&_input]:placeholder:text-[#878787]/60 [&_input]:autofill:shadow-[inset_0_0_0_100px_white] [&_input]:autofill:[-webkit-text-fill-color:#252525] [&_button]:border-0 [&_button]:bg-transparent [&_button]:shadow-none [&_button]:rounded-none"
              />
            </div>
          </FormField>
        </div>
      )}

      {/* Step 2: Company info */}
      {currentStep === 1 && (
        <div className="space-y-3">
          <FormField label="Company Name">
            <FormInput
              type="text"
              value={data.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="Acme Inc."
              autoFocus
            />
          </FormField>
          <FormField label="Company/Product Link">
            <FormInput
              type="url"
              value={data.companyLink}
              onChange={(e) => updateField("companyLink", e.target.value)}
              placeholder="https://yoursite.com"
            />
          </FormField>
        </div>
      )}

      {/* Step 3: Business details */}
      {currentStep === 2 && (
        <div className="space-y-3">
          <FormField label="Type">
            <FormDropdown
              value={data.businessType}
              onChange={(v) => updateField("businessType", v)}
              options={BUSINESS_TYPES}
              placeholder="ex. SaaS, Mobile App, Ecommerce"
            />
          </FormField>
          <FormField label="Monthly Marketing Budget">
            <FormDropdown
              value={data.monthlyBudget}
              onChange={(v) => updateField("monthlyBudget", v)}
              options={MONTHLY_BUDGETS}
              placeholder="Select budget range"
            />
          </FormField>
        </div>
      )}

      {/* Step 4: Plan selection */}
      {currentStep === 3 && (
        <div className="space-y-3">
          <FormField label="How would you like to get started?">
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => { updateField("planType", "self-serve"); setTimeout(() => setCurrentStep(4), 250); }}
                className={cn(
                  "flex cursor-pointer flex-col justify-center gap-1 rounded-xl border px-4 py-5 text-left transition-all active:scale-[0.98]",
                  data.planType === "self-serve"
                    ? "border-[rgba(37,37,37,0.52)] bg-[#FAFAFA] shadow-[0_0_0_3px_rgba(37,37,37,0.04),inset_0_2px_0_#FFFFFF] dark:border-white/40 dark:bg-white/[0.06]"
                    : "border-[rgba(37,37,37,0.14)] shadow-[0_1px_0_#FFFFFF] dark:border-white/[0.08] dark:shadow-none",
                )}
              >
                <span className="font-inter text-sm font-semibold leading-[140%] tracking-[-0.05em] text-[#252525] dark:text-page-text">
                  Self-Serve
                </span>
                <span className="font-inter text-xs font-medium leading-[140%] text-[#878787]">
                  You're in control
                </span>
              </button>

              <button
                type="button"
                onClick={() => { updateField("planType", "managed"); setTimeout(() => setCurrentStep(4), 250); }}
                className={cn(
                  "flex cursor-pointer flex-col justify-center gap-1 rounded-xl border px-4 py-5 text-left transition-all active:scale-[0.98]",
                  data.planType === "managed"
                    ? "border-[rgba(37,37,37,0.52)] bg-[#FAFAFA] shadow-[0_0_0_3px_rgba(37,37,37,0.04),inset_0_2px_0_#FFFFFF] dark:border-white/40 dark:bg-white/[0.06]"
                    : "border-[rgba(37,37,37,0.14)] shadow-[0_1px_0_#FFFFFF] dark:border-white/[0.08] dark:shadow-none",
                )}
              >
                <span className="font-inter text-sm font-semibold leading-[140%] tracking-[-0.05em] text-[#252525] dark:text-page-text">
                  Managed
                </span>
                <span className="font-inter text-xs font-medium leading-[140%] text-[#878787]">
                  We've got your back
                </span>
              </button>
            </div>
          </FormField>
        </div>
      )}

      {/* Step 5: Cal.com booking */}
      {currentStep === 4 && <CalEmbed />}
    </TypeformShell>
  );
}
