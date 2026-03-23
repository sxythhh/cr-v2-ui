"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconCheck,
  IconFileText,
  IconSignature,
  IconWorld,
} from "@tabler/icons-react";
import {
  TypeformShell,
  useFormPersistence,
  type TypeformStep,
} from "./typeform-shell";

/* ── Types ── */

interface TaxFormData {
  country: string;
  isUSPerson: "yes" | "no" | "";
  name: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  signatureName: string;
  agreedToTerms: boolean;
}

interface TaxWizardTypeformProps {
  onComplete?: (data: TaxFormData) => void;
  countries?: { code: string; name: string }[];
}

/* ── Default countries ── */

const DEFAULT_COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "BG", name: "Bulgaria" },
  { code: "OTHER", name: "Other" },
];

/* ── Steps ── */

const STEPS: TypeformStep[] = [
  { id: "country", label: "Tax residence" },
  { id: "details", label: "Tax details" },
  { id: "signature", label: "Signature" },
  { id: "complete", label: "Complete" },
];

/* ── Component ── */

export function TaxWizardTypeform({
  onComplete,
  countries = DEFAULT_COUNTRIES,
}: TaxWizardTypeformProps) {
  const {
    data,
    updateField,
    currentStep,
    setCurrentStep,
    reset,
  } = useFormPersistence<TaxFormData>("tax-wizard-typeform", {
    country: "",
    isUSPerson: "",
    name: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    signatureName: "",
    agreedToTerms: false,
  });

  const [loading, setLoading] = React.useState(false);

  const formType = data.country === "US" || data.isUSPerson === "yes" ? "W-9" : "W-8BEN";

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        if (!data.country) return false;
        if (data.country !== "US" && data.isUSPerson === "") return false;
        return true;
      case 1:
        return data.name.length > 0 && data.taxId.length > 0 && data.address.length > 0;
      case 2:
        return data.signatureName.length > 0 && data.agreedToTerms;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && data.country === "US") {
      updateField("isUSPerson", "yes");
    }
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
    >
      {/* Step 1: Country */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-primary">
              <IconWorld size={20} />
              <span className="text-xs font-medium">Tax Information</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Where do you pay taxes?
            </h2>
            <p className="text-sm text-muted-foreground">
              Select the country where you're a tax resident
            </p>
          </div>

          <div className="space-y-2">
            <Label>Country of tax residence</Label>
            <Select
              value={data.country}
              onValueChange={(v) => {
                updateField("country", v);
                if (v === "US") updateField("isUSPerson", "yes");
                else updateField("isUSPerson", "");
              }}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.country && data.country !== "US" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <Label>Are you a US citizen or resident alien?</Label>
              <div className="flex flex-col gap-2">
                {[
                  { value: "no" as const, label: "No", desc: `You'll complete Form W-8BEN` },
                  { value: "yes" as const, label: "Yes", desc: `You'll complete Form W-9` },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("isUSPerson", opt.value)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border transition-colors text-left",
                      data.isUSPerson === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 size-4 rounded-full border-2 flex items-center justify-center shrink-0",
                        data.isUSPerson === opt.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30",
                      )}
                    >
                      {data.isUSPerson === opt.value && (
                        <IconCheck size={10} className="text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{opt.label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {data.country === "US" && (
            <p className="text-sm text-muted-foreground">
              As a US tax resident, you'll complete Form W-9.
            </p>
          )}
        </div>
      )}

      {/* Step 2: Tax form details */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-primary">
              <IconFileText size={20} />
              <span className="text-xs font-medium">Form {formType}</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Your tax details
            </h2>
            <p className="text-sm text-muted-foreground">
              {formType === "W-9"
                ? "Request for Taxpayer Identification Number"
                : "Certificate of Foreign Status"}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Full legal name</Label>
              <Input
                value={data.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="John Doe"
                className="h-11"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>
                {formType === "W-9" ? "SSN or EIN" : "Foreign Tax ID"}
              </Label>
              <Input
                value={data.taxId}
                onChange={(e) => updateField("taxId", e.target.value)}
                placeholder={formType === "W-9" ? "XXX-XX-XXXX" : "Tax ID number"}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={data.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Street address"
                className="min-h-[44px] resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={data.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="City"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={data.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="State"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>ZIP</Label>
                <Input
                  value={data.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  placeholder="00000"
                  className="h-11"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Signature */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-primary">
              <IconSignature size={20} />
              <span className="text-xs font-medium">Certification</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Sign your form
            </h2>
            <p className="text-sm text-muted-foreground">
              By typing your name below, you certify the information is correct
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Type your full name as signature</Label>
              <Input
                value={data.signatureName}
                onChange={(e) => updateField("signatureName", e.target.value)}
                placeholder="John Doe"
                className="h-14 text-lg italic font-serif"
                autoFocus
              />
              {data.signatureName && (
                <p className="text-xs text-muted-foreground">
                  Signed as: <span className="italic font-serif">{data.signatureName}</span>
                </p>
              )}
            </div>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-border cursor-pointer hover:border-muted-foreground/30 transition-colors">
              <input
                type="checkbox"
                checked={data.agreedToTerms}
                onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                className="mt-1 size-4 rounded border-border accent-primary"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Under penalties of perjury, I certify that the information provided
                is true, correct, and complete. I authorize this electronic signature
                as my legal signature.
              </p>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Complete */}
      {currentStep === 3 && (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="size-14 rounded-full bg-primary flex items-center justify-center">
            <IconCheck size={28} className="text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Form submitted
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your {formType} form has been submitted and is pending review.
              You'll be notified once it's approved.
            </p>
          </div>
        </div>
      )}
    </TypeformShell>
  );
}
