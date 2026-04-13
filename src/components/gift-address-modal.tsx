"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Modal } from "@/components/ui/modal";

/* ── Gift icon (dark circle with present) ─────────────────────── */

function GiftIcon() {
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-full"
      style={{
        background: "radial-gradient(60.93% 50% at 51.43% 0%, rgba(255,255,255,0.265) 0%, rgba(255,255,255,0.0053) 100%), #231F1E",
        boxShadow: "27.5px 40.7px 19.4px rgba(0,0,0,0.03), 15.3px 23.4px 16.3px rgba(0,0,0,0.09), 7.1px 10.2px 12.2px rgba(0,0,0,0.15), 2px 3.1px 7.1px rgba(0,0,0,0.18), inset 0px 1.5px 0px rgba(255,255,255,0.36)",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 12V22H4V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 7H2V12H22V7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Toggle switch ────────────────────────────────────────────── */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative flex h-5 w-10 cursor-pointer items-center rounded-full p-0.5 transition-colors"
      style={{
        background: checked
          ? "radial-gradient(42.53% 86.44% at 50.57% 0%, rgba(0,0,0,0.2232) 0%, rgba(0,0,0,0.186) 100%)"
          : "radial-gradient(42.53% 86.44% at 50.57% 0%, rgba(0,0,0,0.0992) 0%, rgba(0,0,0,0.0496) 100%)",
      }}
    >
      <motion.div
        className="h-4 w-5 rounded-full bg-white/90"
        style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
      />
    </button>
  );
}

/* ── Input field ──────────────────────────────────────────────── */

function FormField({ label, placeholder, value, onChange, className }: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label className="text-xs text-black/70">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border border-black/15 bg-transparent px-3 text-sm tracking-[-0.09px] text-black outline-none placeholder:text-black/30 focus:border-black/30"
      />
    </div>
  );
}

/* ── Modal ────────────────────────────────────────────────────── */

export function GiftAddressModal({ open, onClose, onPublish }: {
  open: boolean;
  onClose: () => void;
  onPublish: (data: { wantsGifts: boolean; address?: { street: string; apt: string; city: string; state: string; zip: string } }) => void;
}) {
  const [wantsGifts, setWantsGifts] = useState(false);
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const handlePublish = () => {
    onPublish({
      wantsGifts,
      address: wantsGifts ? { street, apt, city, state, zip } : undefined,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
        className="relative flex w-full max-w-[560px] flex-col overflow-hidden font-inter"
        style={{
          background: "linear-gradient(0deg, rgba(37,37,37,0.05), rgba(37,37,37,0.05)), #FFFFFF",
          backdropFilter: "blur(30px)",
          borderRadius: 24,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-center bg-white px-6 py-3">
          <span className="text-sm font-medium tracking-[-0.09px] text-black/55">
            One more thing
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-8">
          {/* Gift banner */}
          <div className="flex flex-col items-center gap-4 rounded-xl bg-black/[0.03] px-[72px] py-6">
            <GiftIcon />
            <div className="flex flex-col items-center gap-2">
              <span className="text-center text-base font-medium tracking-[-0.18px] text-black">
                We&apos;d like to send you a gift
              </span>
              <span className="text-center text-sm tracking-[-0.09px] text-black/55">
                By giving us your address we can send you merch, gifts and other things. Isn&apos;t that fun?!
              </span>
            </div>
          </div>

          {/* Toggle row */}
          <div
            className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all"
            style={wantsGifts ? {
              background: "radial-gradient(60.93% 50% at 51.43% 0%, #FFFFFF 0%, rgba(255,255,255,0.01) 100%), linear-gradient(0deg, #EBEBEB, #EBEBEB), linear-gradient(0deg, rgba(255,255,255,0.5), rgba(255,255,255,0.5)), #333333",
              backgroundBlendMode: "normal, plus-darker, normal, color-dodge",
              boxShadow: "0px 4px 4px rgba(0,0,0,0.07), 0px 1px 2px rgba(0,0,0,0.08)",
              borderRadius: 12,
            } : {
              background: "rgba(0,0,0,0.03)",
              borderRadius: 16,
            }}
          >
            <span className="text-sm font-medium tracking-[-0.09px] text-black">
              I would love to receive free gifts
            </span>
            <Toggle checked={wantsGifts} onChange={setWantsGifts} />
          </div>

          {/* Address form — animated */}
          <AnimatePresence>
            {wantsGifts && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.05 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3">
                  <FormField label="Street address" value={street} onChange={setStreet} />
                  <FormField label="Apt., ste., bldg." value={apt} onChange={setApt} />
                  <div className="flex gap-3">
                    <FormField label="City" value={city} onChange={setCity} className="flex-1" />
                    <FormField label="State" value={state} onChange={setState} className="flex-1" />
                  </div>
                  <FormField label="Zip code" value={zip} onChange={setZip} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center px-4 py-4">
          <button
            type="button"
            onClick={handlePublish}
            className="flex h-9 cursor-pointer items-center justify-center rounded-full bg-black px-4 text-sm font-medium tracking-[-0.09px] text-white transition-opacity hover:opacity-90"
          >
            Publish campaign
          </button>
        </div>
      </motion.div>
    </div>
  );
}
