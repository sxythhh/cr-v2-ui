"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CentralIcon } from "@central-icons-react/all";
import { FancyProgress } from "@/components/ui/fancy-progress";
import { useInteractiveDemo } from "@/components/interactive-demo";
import { PLATFORM_DEMO } from "@/components/interactive-demo/demo-configs";
import { StarsLogo } from "@/components/sidebar/icons/stars-logo";

/* ── Step components ── */
import { WelcomeStep } from "@/components/onboarding-v2/welcome-step";
import { RoleSelectStep } from "@/components/onboarding-v2/role-select-step";
import { AgencyConfirmStep } from "@/components/onboarding-v2/agency-confirm-step";
import { BrandMigrationStep } from "@/components/onboarding-v2/brand-migration-step";
import { EmailStep } from "@/components/onboarding-v2/email-step";
import { PhoneStep } from "@/components/onboarding-v2/phone-step";
import { AddressStep, type AddressData } from "@/components/onboarding-v2/address-step";
import { MessagingStep } from "@/components/onboarding-v2/messaging-step";
import { WebsiteStep } from "@/components/onboarding-v2/website-step";
import { CategoryStep } from "@/components/onboarding-v2/category-step";
import { TermsStep } from "@/components/onboarding-v2/terms-step";
import { TeamStep, type TeamMember } from "@/components/onboarding-v2/team-step";
import { WalkthroughStep } from "@/components/onboarding-v2/walkthrough-step";
import { SocialStep } from "@/components/onboarding-v2/social-step";

/* ── Step IDs ── */

type StepId =
  | "welcome"
  | "role-select"
  | "agency-confirm"
  | "brand-migration"
  | "email"
  | "phone"
  | "social"
  | "address"
  | "messaging"
  | "website"
  | "category"
  | "terms"
  | "team"
  | "walkthrough";

interface StepDef {
  id: StepId;
  label: string;
}

const BRAND_STEPS: StepDef[] = [
  { id: "welcome", label: "Welcome" },
  { id: "role-select", label: "Role" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
  { id: "messaging", label: "Messaging" },
  { id: "website", label: "Website" },
  { id: "category", label: "Category" },
  { id: "terms", label: "Terms" },
  { id: "walkthrough", label: "Get started" },
];

const AGENCY_STEPS: StepDef[] = [
  { id: "welcome", label: "Welcome" },
  { id: "role-select", label: "Role" },
  { id: "agency-confirm", label: "Agency" },
  { id: "brand-migration", label: "Brands" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "address", label: "Address" },
  { id: "messaging", label: "Messaging" },
  { id: "website", label: "Website" },
  { id: "category", label: "Category" },
  { id: "terms", label: "Terms" },
  { id: "team", label: "Team" },
  { id: "walkthrough", label: "Get started" },
];

const CREATOR_STEPS: StepDef[] = [
  { id: "welcome", label: "Welcome" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "social", label: "Socials" },
  { id: "category", label: "Niches" },
  { id: "terms", label: "Terms" },
  { id: "walkthrough", label: "Get started" },
];

/* ── Mock data for agency flow ── */

const MOCK_BRANDS = [
  { id: "1", name: "Acme Corp", campaignCount: 12 },
  { id: "2", name: "TechStart Inc", campaignCount: 5 },
  { id: "3", name: "GreenLeaf Beauty", campaignCount: 8 },
  { id: "4", name: "FitLife Pro", campaignCount: 3 },
];

/* ── Main Page ── */

export default function OnboardingV2Page() {
  const router = useRouter();
  const { start: startDemo } = useInteractiveDemo();

  // Determine user type from query param — default to brand/agency flow
  const [userType, setUserType] = useState<"brand" | "agency" | "creator" | null>(null);
  const [role, setRole] = useState<"brand" | "agency" | "">("");

  // Shared state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [address, setAddress] = useState<AddressData>({ street: "", city: "", state: "", zip: "", country: "" });
  const [messagingChannels, setMessagingChannels] = useState<Set<"email" | "whatsapp" | "slack" | "in-app">>(new Set(["email"]));
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedEmails, setAgreedEmails] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ email: "", role: "Manager" }]);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set(MOCK_BRANDS.map((b) => b.id)));
  const [socialAccounts, setSocialAccounts] = useState<{ platform: string; connected: boolean; handle?: string }[]>([
    { platform: "tiktok", connected: false },
    { platform: "instagram", connected: false },
    { platform: "youtube", connected: false },
    { platform: "x", connected: false },
  ]);

  // Derive active steps based on role/user type
  const steps = useMemo((): StepDef[] => {
    if (userType === "creator") return CREATOR_STEPS;
    if (role === "agency") return AGENCY_STEPS;
    if (role === "brand") return BRAND_STEPS;
    // Before role is selected, show first two steps (welcome + role select)
    return BRAND_STEPS.slice(0, 2);
  }, [userType, role]);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Can proceed logic
  const canProceed = useMemo(() => {
    if (!currentStep) return false;
    switch (currentStep.id) {
      case "welcome": return true;
      case "role-select": return role !== "";
      case "agency-confirm": return true;
      case "brand-migration": return selectedBrands.size > 0;
      case "email": return emailVerified;
      case "phone": return phoneVerified;
      case "social": return socialAccounts.some((a) => a.connected);
      case "address": return address.country !== "" && address.street !== "" && address.city !== "";
      case "messaging": return messagingChannels.size > 0;
      case "website": return websiteUrl.length > 0;
      case "category": return categories.size > 0;
      case "terms": return agreedTerms;
      case "team": return true; // optional
      case "walkthrough": return true;
      default: return true;
    }
  }, [currentStep, role, selectedBrands, emailVerified, phoneVerified, socialAccounts, address, messagingChannels, websiteUrl, categories, agreedTerms]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
    }
  }, [currentStepIndex]);

  const handleRoleSelect = useCallback((r: "brand" | "agency") => {
    setRole(r);
  }, []);

  const handleBrandToggle = useCallback((id: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleMessagingToggle = useCallback((ch: "email" | "whatsapp" | "slack" | "in-app") => {
    setMessagingChannels((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  }, []);

  const handleCategoryToggle = useCallback((cat: string) => {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const handleSocialConnect = useCallback((platform: string) => {
    setSocialAccounts((prev) =>
      prev.map((a) =>
        a.platform === platform ? { ...a, connected: true, handle: `demo_${platform}` } : a,
      ),
    );
  }, []);

  const handleStartDemo = useCallback(() => {
    startDemo(PLATFORM_DEMO);
    router.push("/");
  }, [startDemo, router]);

  const handleAddressChange = useCallback(<K extends keyof AddressData>(field: K, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Enter key handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && canProceed && !isLastStep) {
        e.preventDefault();
        handleNext();
      }
    },
    [canProceed, isLastStep, handleNext],
  );

  // Render current step content
  const renderStep = () => {
    if (!currentStep) return null;

    switch (currentStep.id) {
      case "welcome":
        return <WelcomeStep variant={userType === "creator" ? "creator" : "brand"} />;
      case "role-select":
        return <RoleSelectStep value={role} onChange={handleRoleSelect} />;
      case "agency-confirm":
        return <AgencyConfirmStep agencyName="Stellar Media Group" />;
      case "brand-migration":
        return <BrandMigrationStep brands={MOCK_BRANDS} selected={selectedBrands} onToggle={handleBrandToggle} />;
      case "email":
        return <EmailStep email={email} onEmailChange={setEmail} verified={emailVerified} onVerified={() => setEmailVerified(true)} onNext={handleNext} />;
      case "phone":
        return <PhoneStep phone={phone} onPhoneChange={setPhone} verified={phoneVerified} onVerified={() => setPhoneVerified(true)} onNext={handleNext} />;
      case "social":
        return <SocialStep accounts={socialAccounts} onConnect={handleSocialConnect} />;
      case "address":
        return <AddressStep address={address} onChange={handleAddressChange} />;
      case "messaging":
        return <MessagingStep selected={messagingChannels} onToggle={handleMessagingToggle} />;
      case "website":
        return <WebsiteStep url={websiteUrl} onChange={setWebsiteUrl} />;
      case "category":
        return <CategoryStep selected={categories} onToggle={handleCategoryToggle} variant={userType === "creator" ? "creator" : "brand"} />;
      case "terms":
        return <TermsStep agreed={agreedTerms} onAgreeChange={setAgreedTerms} agreedEmails={agreedEmails} onAgreedEmailsChange={setAgreedEmails} />;
      case "team":
        return <TeamStep members={teamMembers} onUpdate={setTeamMembers} />;
      case "walkthrough":
        return <WalkthroughStep onStartDemo={handleStartDemo} variant={userType === "creator" ? "creator" : "brand"} />;
      default:
        return null;
    }
  };

  /* ── User type gate ── */

  if (userType === null) {
    return (
      <div className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-page-bg font-inter tracking-[-0.02em]" onKeyDown={handleKeyDown}>
        <StarsLogo className="pointer-events-none absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 text-foreground/[0.025] sm:size-[420px]" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex w-full max-w-[380px] flex-col items-center gap-8 px-4 sm:px-6"
        >
          <div className="flex items-center gap-2">
            <StarsLogo className="size-6 text-[#F97316]" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-page-text">Content Rewards</span>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-[28px] font-bold leading-[34px] tracking-[-0.02em] text-page-text">
              Welcome back
            </h1>
            <p className="text-[13px] leading-[20px] text-page-text-muted">
              How do you use Content Rewards?
            </p>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <button
              onClick={() => setUserType("brand")}
              className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-foreground/[0.04] text-[14px] font-semibold text-page-text-muted transition-colors hover:bg-foreground/[0.07] hover:text-page-text active:scale-[0.98]"
            >
              <CentralIcon name="IconHome" size={16} color="currentColor" join="round" fill="filled" stroke="2" radius="2" />
              I&apos;m a brand or agency
            </button>
            <button
              onClick={() => setUserType("creator")}
              className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-foreground/[0.04] text-[14px] font-semibold text-page-text-muted transition-colors hover:bg-foreground/[0.07] hover:text-page-text active:scale-[0.98]"
            >
              <CentralIcon name="IconPlay" size={16} color="currentColor" join="round" fill="filled" stroke="2" radius="2" />
              I&apos;m a creator
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Main onboarding shell ── */

  return (
    <div className={cn("flex w-full flex-col bg-page-bg font-inter tracking-[-0.02em]", currentStep?.id === "terms" ? "h-dvh overflow-hidden" : "min-h-dvh")} onKeyDown={handleKeyDown}>
      {/* Header with progress */}
      {!isLastStep && (
        <div className="shrink-0 px-6 pt-5">
          <div className="mx-auto max-w-full sm:max-w-[560px]">
            <FancyProgress value={progress} />
            <div className="mt-3">
              <span className="text-[12px] font-medium text-page-text-subtle">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      {currentStep?.id === "terms" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          {renderStep()}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Footer with nav buttons */}
      {!isLastStep && (
        <div className="shrink-0 px-6 pb-5 pt-2">
          <div className="mx-auto flex max-w-[560px] items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-9 cursor-pointer items-center rounded-full px-3 font-inter text-[13px] font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.04] hover:text-page-text"
              >
                Back
              </button>
            )}

            {/* Debug skip */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex h-9 cursor-pointer items-center rounded-full px-3 font-inter text-[11px] font-medium tracking-[-0.02em] text-page-text-subtle transition-colors hover:text-page-text"
            >
              Skip all
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              {canProceed && (
                <span className="hidden font-inter text-[11px] tracking-[-0.02em] text-page-text-muted sm:block">
                  Press <kbd className="rounded bg-foreground/[0.04] px-1 py-0.5 font-inter text-[10px]">Enter</kbd>
                </span>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className="flex h-10 min-w-[120px] cursor-pointer items-center justify-center rounded-full px-5 font-inter text-[14px] font-semibold tracking-[-0.02em] text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-default disabled:opacity-30"
                style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207" }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
