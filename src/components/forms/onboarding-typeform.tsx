"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  IconCheck,
  IconX,
  IconLoader2,
  IconCamera,
  IconUpload,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandX,
  IconSparkles,
} from "@tabler/icons-react";
import {
  TypeformShell,
  useFormPersistence,
  type TypeformStep,
} from "./typeform-shell";

/* ── Types ── */

type Platform = "tiktok" | "instagram" | "youtube" | "twitter";

interface OnboardingData {
  username: string;
  avatarUrl: string;
  platform: Platform | "";
  socialUsername: string;
}

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid" | "too_short";

interface OnboardingTypeformProps {
  /** Async check — return true if username is available */
  checkUsername?: (username: string) => Promise<boolean>;
  /** Called with final data on completion */
  onComplete?: (data: OnboardingData) => void;
  /** Called on avatar file select — should return a URL */
  onAvatarUpload?: (file: File) => Promise<string>;
}

/* ── Steps ── */

const STEPS: TypeformStep[] = [
  { id: "username", label: "Choose username" },
  { id: "avatar", label: "Profile picture" },
  { id: "social", label: "Connect socials" },
  { id: "done", label: "All set" },
];

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: "tiktok", label: "TikTok", icon: <IconBrandTiktok size={24} /> },
  { id: "instagram", label: "Instagram", icon: <IconBrandInstagram size={24} /> },
  { id: "youtube", label: "YouTube", icon: <IconBrandYoutube size={24} /> },
  { id: "twitter", label: "X", icon: <IconBrandX size={24} /> },
];

/* ── Component ── */

export function OnboardingTypeform({
  checkUsername,
  onComplete,
  onAvatarUpload,
}: OnboardingTypeformProps) {
  const {
    data,
    updateField,
    currentStep,
    setCurrentStep,
    reset,
  } = useFormPersistence<OnboardingData>("onboarding-typeform", {
    username: "",
    avatarUrl: "",
    platform: "",
    socialUsername: "",
  });

  const [usernameStatus, setUsernameStatus] = React.useState<UsernameStatus>("idle");
  const [uploading, setUploading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Username validation
  const handleUsernameChange = (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    updateField("username", clean);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (clean.length === 0) {
      setUsernameStatus("idle");
      return;
    }
    if (clean.length < 3) {
      setUsernameStatus("too_short");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      if (checkUsername) {
        const available = await checkUsername(clean);
        setUsernameStatus(available ? "available" : "taken");
      } else {
        // Demo mode — always available
        setUsernameStatus("available");
      }
    }, 400);
  };

  // Avatar upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    setUploading(true);
    try {
      if (onAvatarUpload) {
        const url = await onAvatarUpload(file);
        updateField("avatarUrl", url);
      } else {
        // Demo mode — use object URL
        updateField("avatarUrl", URL.createObjectURL(file));
      }
    } finally {
      setUploading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return usernameStatus === "available";
      case 1:
        return true; // avatar is optional
      case 2:
        return true; // social is optional
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
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

  const statusIcon = {
    idle: null,
    checking: <IconLoader2 size={18} className="animate-spin text-muted-foreground" />,
    available: (
      <div className="size-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
        <IconCheck size={14} className="text-emerald-500" />
      </div>
    ),
    taken: (
      <div className="size-6 rounded-full border-2 border-red-500 flex items-center justify-center">
        <IconX size={14} className="text-red-500" />
      </div>
    ),
    invalid: (
      <div className="size-6 rounded-full border-2 border-red-500 flex items-center justify-center">
        <IconX size={14} className="text-red-500" />
      </div>
    ),
    too_short: null,
  };

  const statusMessage: Record<UsernameStatus, React.ReactNode> = {
    idle: null,
    checking: null,
    too_short: <span className="text-muted-foreground">At least 3 characters</span>,
    invalid: <span className="text-red-500">Only letters, numbers, and underscores</span>,
    taken: <span className="text-red-500">Already taken</span>,
    available: <span className="text-emerald-500">Available</span>,
  };

  return (
    <TypeformShell
      steps={STEPS}
      currentStep={currentStep}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed()}
      loading={loading}
      finishLabel="Go to Dashboard"
      onFinish={handleFinish}
    >
      {/* Step 1: Username */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Choose your username
            </h2>
            <p className="text-sm text-muted-foreground">
              This will be your unique identity on the platform
            </p>
          </div>

          <div className="space-y-3">
            <Label>Username</Label>
            <div
              className={cn(
                "relative flex items-center rounded-xl border-2 transition-colors",
                "bg-background/50",
                usernameStatus === "available" && "border-emerald-500/50",
                (usernameStatus === "taken" || usernameStatus === "invalid") && "border-red-500/50",
                (usernameStatus === "idle" || usernameStatus === "checking" || usernameStatus === "too_short") && "border-border",
              )}
            >
              <Input
                value={data.username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="yourname"
                className="border-0 bg-transparent h-12 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 pr-12"
                maxLength={20}
                autoFocus
              />
              <div className="absolute right-3">{statusIcon[usernameStatus]}</div>
            </div>
            <div className="text-xs h-4">{statusMessage[usernameStatus]}</div>
          </div>
        </div>
      )}

      {/* Step 2: Avatar */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Add a profile picture
            </h2>
            <p className="text-sm text-muted-foreground">
              Help others recognize you
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <label className="relative group cursor-pointer">
              <div
                className={cn(
                  "size-28 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden",
                  "group-hover:border-primary/50 transition-colors bg-muted/20",
                )}
              >
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt="Avatar"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-muted-foreground/40">
                    {data.username.charAt(0).toUpperCase() || "?"}
                  </span>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                {uploading ? (
                  <IconLoader2 size={28} className="text-white animate-spin" />
                ) : (
                  <IconCamera size={28} className="text-white" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-primary cursor-pointer hover:underline">
              <IconUpload size={16} />
              Upload photo
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Social */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Connect your socials
            </h2>
            <p className="text-sm text-muted-foreground">
              Link your primary platform to get discovered
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  updateField("platform", data.platform === p.id ? "" : p.id)
                }
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                  data.platform === p.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/20 hover:bg-muted/40",
                )}
              >
                {p.icon}
                <span className="text-[10px] font-medium">{p.label}</span>
              </button>
            ))}
          </div>

          {data.platform && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2"
            >
              <Label>
                Username on {PLATFORMS.find((p) => p.id === data.platform)?.label}
              </Label>
              <Input
                value={data.socialUsername}
                onChange={(e) =>
                  updateField("socialUsername", e.target.value.replace("@", ""))
                }
                placeholder="username"
                className="h-11"
                autoFocus
              />
            </motion.div>
          )}

          {!data.platform && (
            <p className="text-xs text-muted-foreground text-center">
              You can skip this and add accounts later
            </p>
          )}
        </div>
      )}

      {/* Step 4: Done */}
      {currentStep === 3 && (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto size-16 bg-primary/10 rounded-full flex items-center justify-center">
            <IconSparkles size={32} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              You're all set!
            </h2>
            <p className="text-sm text-muted-foreground">
              Start discovering campaigns and earning
            </p>
          </div>

          <div className="space-y-3 bg-muted/10 rounded-xl p-4 text-left">
            {["Browse campaigns", "Apply & create content", "Earn & grow"].map(
              (tip, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="shrink-0 size-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="text-sm">{tip}</span>
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </TypeformShell>
  );
}
