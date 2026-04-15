"use client";

import { cn } from "@/lib/utils";

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressStepProps {
  address: AddressData;
  onChange: <K extends keyof AddressData>(field: K, value: string) => void;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France",
  "Netherlands", "Sweden", "Singapore", "Japan", "South Korea", "Brazil", "India",
  "South Africa", "United Arab Emirates", "Other",
];

export function AddressStep({ address, onChange }: AddressStepProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold leading-[28px] tracking-[-0.02em] text-page-text">
          Business address
        </h2>
        <p className="text-[13px] leading-[20px] text-page-text-muted">
          Used for billing and legal documentation.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Country */}
        <Field label="Country">
          <div className="relative">
            <select
              value={address.country}
              onChange={(e) => onChange("country", e.target.value)}
              className={cn(
                "flex h-11 w-full appearance-none rounded-xl border border-border bg-card-bg px-4 pr-10 text-[14px] font-medium text-page-text outline-none transition-colors focus:border-[#FF6207] ",
                !address.country && "text-page-text-subtle",
              )}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-page-text-subtle">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Field>

        {/* Street */}
        <Field label="Street address">
          <input
            type="text"
            placeholder="123 Main St, Suite 100"
            value={address.street}
            onChange={(e) => onChange("street", e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border bg-card-bg px-4 text-[14px] font-medium text-page-text outline-none transition-colors placeholder:text-page-text-subtle focus:border-[#FF6207] "
          />
        </Field>

        {/* City + State */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="City">
            <input
              type="text"
              placeholder="San Francisco"
              value={address.city}
              onChange={(e) => onChange("city", e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-card-bg px-4 text-[14px] font-medium text-page-text outline-none transition-colors placeholder:text-page-text-subtle focus:border-[#FF6207] "
            />
          </Field>
          <Field label="State / Province">
            <input
              type="text"
              placeholder="CA"
              value={address.state}
              onChange={(e) => onChange("state", e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-card-bg px-4 text-[14px] font-medium text-page-text outline-none transition-colors placeholder:text-page-text-subtle focus:border-[#FF6207] "
            />
          </Field>
        </div>

        {/* ZIP */}
        <Field label="ZIP / Postal code">
          <input
            type="text"
            placeholder="94105"
            value={address.zip}
            onChange={(e) => onChange("zip", e.target.value)}
            className="flex h-11 w-full rounded-xl border border-border bg-card-bg px-4 text-[14px] font-medium text-page-text outline-none transition-colors placeholder:text-page-text-subtle focus:border-[#FF6207] "
          />
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-page-text-muted">{label}</label>
      {children}
    </div>
  );
}
