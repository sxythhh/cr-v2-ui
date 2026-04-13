"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

/* ═══════════════════════════════════════════════════════════════════════════
   STEP DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════════ */

const STEPS = [
  { title: "Invite your team", subtitle: "Add teammates so you can collaborate on campaigns together." },
  { title: "Terms of Service & Privacy Policy", subtitle: "Please review and accept our terms and privacy policy to continue." },
  { title: "Create your first campaign", subtitle: "Set up a quick campaign to get started with Content Rewards." },
  { title: "Meet CR AI", subtitle: "Your AI assistant can help you find creators, optimize campaigns, and more." },
  { title: "Book a demo", subtitle: "Schedule a call with our team to get a personalized walkthrough." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TERMS CONTENT
   ═══════════════════════════════════════════════════════════════════════════ */

const TOS_SECTIONS = [
  { heading: "TERMS OF USE / SERVICE AGREEMENT", body: "" },
  { heading: "", body: "Date of last revision: November 5, 2024" },
  { heading: "", body: 'This terms of use or service agreement ("Agreement") is between Content Rewards Technologies, Inc. ("Content Rewards," "Company," "we," "us," "our," or "ourselves") and the person or entity ("you" or "your") that has decided to use our services; any of our websites or apps; or any features, products, graphics, text, images, photos, audio, video, location data, computer code, and all other forms of data and communications (collectively, "Services").' },
  { heading: "", body: "YOU MUST CONSENT TO THIS AGREEMENT TO USE OUR SERVICES. If you do not accept and agree to be bound by all of the terms of this Agreement, including the Privacy Policy, you cannot use Services." },
  { heading: "", body: "If we update this Agreement, we will provide you notice and an opportunity to review and decide whether you would like to continue to use the Services." },
  { heading: "1. Description of the Services", body: "Content Rewards is a platform that connects brands with content creators for performance-based content distribution. It provides tools to manage campaigns, track submissions, process payouts, and analyze content performance." },
  { heading: "2. Accessing the Services", body: "We reserve the right to change the Services and any material we provide in the Services, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Services is unavailable at any time or for any period." },
  { heading: "3. Log-in Information", body: "If you choose, or are provided with, a username, password, or any other piece of information as part of our security procedures, you must treat such information as confidential, and you must not disclose it to any other person or entity. You agree not to provide any other person with access to this Service or portions of it using your username, password, or other security information. You agree to notify us immediately of any unauthorized access to or use of your username or password or any other breach of security." },
  { heading: "4. Intellectual Property", body: "Content Rewards respects the intellectual property of others and expects those who use the Services to do the same. It is our policy, in appropriate circumstances and at our discretion, to disable and/or terminate the accounts of individuals who may infringe or repeatedly infringe the copyrights or other intellectual property rights of Content Rewards or others." },
  { heading: "5. Your Use of the Services", body: "" },
  { heading: "", body: "1) Your Representations and Eligibility to Use Services" },
  { heading: "", body: "By registering and using the Services, you represent and warrant you: (i) have the authority and capacity to enter this Agreement; (ii) are at least 18 years old, or 13 years or older and have the express permission of your parent or guardian to use the Services; and, (iii) are not precluded or restricted in any way from using the Services, either by law or due to previous suspension from the Services." },
  { heading: "", body: "2. Truthfulness of Information" },
  { heading: "", body: "You represent and warrant that all information you submit when employing the Services is complete, accurate, and truthful. You are responsible for maintaining the completeness, accuracy, and truthfulness of such information." },
  { heading: "", body: "3. Limited Use of Services" },
  { heading: "", body: "The Services are only for the uses specified in this Agreement. You agree that you will not use our proprietary information or materials in any way whatsoever except for use of the Services in compliance with this Agreement. We reserve the right to investigate and take legal action in response to illegal and/or unauthorized uses of the Services." },
  { heading: "6. Payments", body: "" },
  { heading: "", body: "1. Third-Party Payment Services" },
  { heading: "", body: "We use third-party payment services (currently, Stripe) to handle payment services. If you have any issue with charges, those issues need to be addressed between you and the third-party payment service. We are not responsible for the payments or any related disputes." },
  { heading: "", body: "2. Online Payment Terms" },
  { heading: "", body: "For users that sign up by the website, you will pay in accordance with the subscription terms you agree to on the website. Company will charge the user's credit card in accordance with the payment terms agreed to by the client." },
  { heading: "", body: "5. No Refunds" },
  { heading: "", body: "We do not provide refunds for any reason on our Services. Users can cancel our Services at any time, and at the end of the current billing period, they will no longer receive any charges related to the Services." },
  { heading: "7. Disclaimers, Waivers, and Indemnification", body: "" },
  { heading: "", body: "1) No Guarantees, Endorsements, or Investigation" },
  { heading: "", body: "We do not provide any guarantees or endorsements of any third-party or user, or its content or links, or any content collected or provided through the Services. We do not investigate or otherwise review any user, or third-party or its content. We are not responsible for the timeliness, propriety, or accuracy of third-party content. You accept all risks associated with any third-party, and its content, links, or related information." },
  { heading: "", body: "2. Disclaimer of Warranties" },
  { heading: "", body: 'All information and services are provided on an "as is" basis without warranty of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.' },
  { heading: "", body: "3. Limitation of Liability" },
  { heading: "", body: "To the maximum extent permitted by law, in no event shall we or our agents be liable to you or any other person or entity for any direct, punitive, incidental, special, consequential, or exemplary damages. In no event shall our liability under this Agreement exceed the total amount of money paid to us by you under any subscription or fees for our Services in the prior six months." },
  { heading: "8. Limitation of Services and Termination", body: "We reserve an unrestricted right to remove content or access to content at any time without advanced notice. We reserve an unrestricted right to refuse, terminate, block, or cancel your application to, account with, or access to the Services at any time, with or without cause." },
  { heading: "9. General Provisions", body: "This Agreement, together with the Privacy Policy, constitutes the entire agreement between us, and supersedes all prior agreements, representations, and understandings, oral or written, between us." },
];

const PRIVACY_SECTIONS = [
  { heading: "PRIVACY POLICY", body: "" },
  { heading: "", body: "Date of last revision: December 26, 2024" },
  { heading: "1. Who We Are?", body: 'The name of our company is Content Rewards Technologies, Inc. ("Content Rewards"), and we\'re registered as a corporation in Delaware. Content Rewards is a platform for connecting brands with content creators for performance-based distribution.' },
  { heading: "2. What Is This?", body: "This is a privacy policy and the reason we have it is to tell you how we collect, manage, store, and use your information." },
  { heading: "3. Why Are We Showing You This?", body: "We value and respect your privacy. That is why we strive to only use your information when we think that doing so improves your experience in using our services. If you feel that we could improve in this mission in any way, or if you have a complaint or concern, please let us know by sending us your feedback to help@contentrewards.com." },
  { heading: "4. Information Collection and Use", body: "In using the services, you may be asked to provide us a variety of information — some of which can personally identify you and some that cannot. We may collect, store, and share this personal information with third parties, but only in the ways we explain in this policy." },
  { heading: "", body: "We collect: name, email address, payment information, company information, IP addresses, browser information, timestamps, page views, load times, referrers, device type and browser information, and information collected on behalf of our clients." },
  { heading: "5. Protecting Your Information", body: "We make reasonable and commercially feasible efforts to keep your information safe. We have appropriate security measures in place to prevent your information from being accidentally lost, used, or accessed in an unauthorized way. We encrypt data during transit via TLS and at rest if requested." },
  { heading: "6. General Information", body: "We will never ask you for your personal information in an unsolicited letter, call, or email. Our business and the services we provide are constantly evolving. We may change our privacy policy at any time." },
  { heading: "", body: "If you have any questions about this privacy policy, contact us at: help@contentrewards.com. By accessing any of our services or content, you are affirming that you understand and agree with the terms of our privacy policy." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative h-5 w-[50px] shrink-0 rounded-full transition-colors"
      style={{
        background: checked ? "#FF6207" : "rgba(0,0,0,0.10)",
        boxShadow: checked ? "none" : "inset 0px 6px 12px rgba(0,0,0,0.02), inset 0px 0.75px 0.75px rgba(0,0,0,0.02), inset 0px 0.25px 0.25px rgba(0,0,0,0.04)",
      }}
    >
      <div
        className="absolute top-[2px] h-4 w-7 rounded-full bg-card-bg transition-[left] duration-200"
        style={{
          left: checked ? 20 : 2,
          boxShadow: "0px 6px 12px -3px rgba(0,0,0,0.06), 0px 3px 6px -1px rgba(0,0,0,0.06), 0px 1px 2px rgba(0,0,0,0.04), 0px 0.5px 0.5px rgba(0,0,0,0.08)",
        }}
      />
    </button>
  );
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 32 : 8,
            height: 8,
            background: i === current ? "#FF6207" : i < current ? "rgba(38,38,38,0.32)" : "rgba(0,0,0,0.10)",
          }}
        />
      ))}
    </div>
  );
}

const ROLES = ["Admin", "Manager", "Viewer"] as const;

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 1: INVITE TEAM
   ═══════════════════════════════════════════════════════════════════════════ */

function StepTeam() {
  const [invites, setInvites] = useState([
    { email: "", role: "Manager" as string },
  ]);

  const addRow = () => setInvites((prev) => [...prev, { email: "", role: "Manager" }]);
  const updateEmail = (i: number, email: string) => setInvites((prev) => prev.map((inv, j) => j === i ? { ...inv, email } : inv));
  const updateRole = (i: number, role: string) => setInvites((prev) => prev.map((inv, j) => j === i ? { ...inv, role } : inv));
  const removeRow = (i: number) => setInvites((prev) => prev.filter((_, j) => j !== i));

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-5">
        {invites.map((inv, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex h-10 flex-1 items-center rounded-xl border border-border bg-card-bg px-3">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={inv.email}
                onChange={(e) => updateEmail(i, e.target.value)}
                className="w-full bg-transparent text-[14px] font-medium text-page-text outline-none placeholder:text-page-text-subtle"
              />
            </div>
            <div className="relative">
              <select
                value={inv.role}
                onChange={(e) => updateRole(i, e.target.value)}
                className="h-10 appearance-none rounded-xl border border-border bg-card-bg px-3 pr-8 text-[13px] font-medium text-page-text outline-none"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-page-text-subtle">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {invites.length > 1 && (
              <button onClick={() => removeRow(i)} className="flex size-10 shrink-0 items-center justify-center rounded-xl text-page-text-subtle transition-colors hover:bg-foreground/[0.04] hover:text-page-text-muted">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-[13px] font-medium text-page-text-subtle transition-colors hover:border-foreground/20 hover:text-page-text-muted"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
        Add another
      </button>

      <div className="rounded-xl bg-foreground/[0.03] px-4 py-3">
        <p className="text-[12px] font-medium leading-[18px] text-page-text-subtle">
          Team members will receive an email invitation to join your Content Rewards workspace. You can manage roles and permissions later in Settings.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 2: TERMS (existing)
   ═══════════════════════════════════════════════════════════════════════════ */

function StepTerms({ agreedTerms, setAgreedTerms, agreedEmails, setAgreedEmails, scrolledToBottom, setScrolledToBottom }: {
  agreedTerms: boolean; setAgreedTerms: (v: boolean) => void;
  agreedEmails: boolean; setAgreedEmails: (v: boolean) => void;
  scrolledToBottom: boolean; setScrolledToBottom: (v: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) {
      setScrolledToBottom(true);
    }
  }, [setScrolledToBottom]);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Scrollable content */}
      <div className="relative min-h-0 flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-page-bg to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-page-bg to-transparent" />

        <div ref={scrollRef} className="terms-scroll h-full overflow-y-scroll px-6">
          <div className="flex flex-col gap-[15.25px] py-2">
            <div className="flex flex-col gap-[20.2px] pr-2">
              {TOS_SECTIONS.map((s, i) => (
                <p key={`tos-${i}`} className={cn(
                  "text-[12.4px] leading-[21px] text-page-text-muted",
                  s.heading && "font-medium"
                )}>
                  {s.heading && <>{s.heading}{s.body ? " " : ""}</>}
                  {s.body}
                </p>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-[20.3px] pr-2">
              {PRIVACY_SECTIONS.map((s, i) => (
                <p key={`pp-${i}`} className={cn(
                  "text-[12.4px] leading-[21px] text-page-text-muted",
                  s.heading && "font-medium"
                )}>
                  {s.heading && <>{s.heading}{s.body ? " " : ""}</>}
                  {s.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consent toggles */}
      <div className="shrink-0 border-t border-border">
        <div className="flex items-center justify-between gap-3 px-6 py-3">
          <span className={cn(
            "text-[12.3px] leading-[21px] transition-colors",
            agreedTerms ? "text-page-text" : "text-page-text-subtle"
          )}>
            I agree to Content Rewards&apos;s Terms of Service and Privacy Policy.
          </span>
          <div className="flex items-center gap-2">
            {!scrolledToBottom && (
              <button
                onClick={scrollToBottom}
                className="flex items-center rounded-[6px] border border-border bg-foreground/[0.04] px-2 py-1"
              >
                <span className="text-[12px] font-medium leading-[16px] text-page-text-subtle">
                  Scroll to bottom
                </span>
              </button>
            )}
            <Toggle checked={agreedTerms} onChange={setAgreedTerms} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-3">
          <span className="text-[12.5px] leading-[21px] text-page-text">
            I want to receive product updates and launch emails. You can unsubscribe at any time.
          </span>
          <Toggle checked={agreedEmails} onChange={setAgreedEmails} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 3: FIRST CAMPAIGN
   ═══════════════════════════════════════════════════════════════════════════ */

const CAMPAIGN_TYPES = [
  { id: "cpm", label: "CPM", desc: "Pay per 1,000 views", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 20h20M5 20V10l4-6 4 6v10M17 20V4l4 3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "retainer", label: "Retainer", desc: "Fixed fee per creator", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "per-video", label: "Per Video", desc: "Pay per submission", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 10l5-3v10l-5-3M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const NICHES = ["Tech", "Gaming", "Beauty", "Fitness", "Food", "Finance", "Fashion", "Travel", "Education", "Entertainment"];

function StepCampaign() {
  const [name, setName] = useState("");
  const [type, setType] = useState("cpm");
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);

  const toggleNiche = (n: string) => setSelectedNiches((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]);

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6 overflow-y-auto px-6 py-8" style={{ scrollbarWidth: "none" }}>
      {/* Campaign name */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-medium text-page-text-muted">Campaign name</label>
        <div className="flex h-10 items-center rounded-xl border border-border bg-card-bg px-3">
          <input
            type="text"
            placeholder="e.g. Summer Launch 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-[14px] font-medium text-page-text outline-none placeholder:text-page-text-subtle"
          />
        </div>
      </div>

      {/* Campaign type */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-medium text-page-text-muted">Campaign type</label>
        <div className="grid grid-cols-3 gap-3">
          {CAMPAIGN_TYPES.map((ct) => (
            <button
              key={ct.id}
              onClick={() => setType(ct.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-all",
                type === ct.id
                  ? "border-[#FF6207]/40 bg-[#FF6207]/[0.06] text-page-text"
                  : "border-border text-page-text-muted hover:border-foreground/20"
              )}
            >
              <span className={type === ct.id ? "text-[#FF6207]" : ""}>{ct.icon}</span>
              <span className="text-[13px] font-semibold">{ct.label}</span>
              <span className="text-[11px] font-medium text-page-text-subtle">{ct.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Niche selection */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-medium text-page-text-muted">Target niches</label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <button
              key={n}
              onClick={() => toggleNiche(n)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
                selectedNiches.includes(n)
                  ? "border-[#FF6207]/40 bg-[#FF6207]/[0.08] text-[#FF6207]"
                  : "border-border text-page-text-subtle hover:border-foreground/20"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 4: MEET CR AI
   ═══════════════════════════════════════════════════════════════════════════ */

const AI_FEATURES = [
  { title: "Find creators", desc: "Search and filter creators by niche, engagement, and platform.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M16 16l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { title: "Optimize campaigns", desc: "Get AI-powered suggestions to improve your campaign performance.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { title: "Analyze performance", desc: "Understand what content works and why with detailed breakdowns.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { title: "Draft outreach", desc: "Generate personalized messages for creator recruitment.", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

function StepMeetAI() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col gap-6 overflow-y-auto px-6 py-8" style={{ scrollbarWidth: "none" }}>
      {/* AI sparkle header */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6207]/20 to-[#FFBB00]/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" stroke="#FF6207" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-center text-[13px] font-medium leading-[20px] text-page-text-muted">
          CR AI is available anywhere in the platform. Just click the AI button in the bottom-right corner to get started.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3">
        {AI_FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-2.5 rounded-xl border border-border bg-card-bg p-4">
            <span className="text-page-text-muted">{f.icon}</span>
            <span className="text-[13px] font-semibold text-page-text">{f.title}</span>
            <span className="text-[12px] font-medium leading-[17px] text-page-text-subtle">{f.desc}</span>
          </div>
        ))}
      </div>

      {/* Example prompt */}
      <div className="rounded-xl bg-foreground/[0.03] px-4 py-3">
        <p className="text-[12px] font-medium leading-[18px] text-page-text-subtle">
          Try asking: &ldquo;Find me 10 tech creators on YouTube with over 100K subscribers who post weekly&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP 5: BOOK A DEMO
   ═══════════════════════════════════════════════════════════════════════════ */

function StepBookDemo({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "none" }}>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5">
        {/* Context */}
        <div className="flex items-start gap-4 rounded-xl bg-foreground/[0.03] p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6207]/20 to-[#FFBB00]/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 10l5-3v10l-5-3M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" stroke="#FF6207" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-page-text">30-minute discovery call</span>
            <span className="text-[12px] font-medium leading-[17px] text-page-text-subtle">
              Get a personalized walkthrough of Content Rewards, custom creator strategy for your brand, and ROI projections based on your niche.
            </span>
          </div>
        </div>

        {/* Cal iframe — wider than container to push scrollbar out of view */}
        <div className="overflow-hidden rounded-xl border border-border bg-card-bg" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div className="overflow-hidden">
            <iframe
              src={`https://cal.com/team/content-rewards/discovery-call?embed=true&layout=month_view&theme=${darkMode ? "dark" : "light"}`}
              className="h-[480px] border-0"
              style={{ width: "calc(100% + 20px)" }}
            />
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[12px] font-medium text-page-text-subtle/20">
          Powered by Cal.com
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function OnboardingTermsPage() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [step, setStep] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedEmails, setAgreedEmails] = useState(true);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const canContinue = step === 1 ? agreedTerms : true;
  const isLastStep = step === STEPS.length - 1;

  const next = () => { if (step < STEPS.length - 1) setStep(step + 1); };
  const back = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="flex h-dvh w-full font-inter tracking-[-0.02em]">
      <style>{`
        .terms-scroll::-webkit-scrollbar { display: none; }
        .terms-scroll { scrollbar-width: none; }
      `}</style>

      {/* Full-screen container */}
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-page-bg">
        {/* ── HEADER ── */}
        <div className="shrink-0 px-6 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[28px] font-medium leading-[34px] tracking-[-0.32px] text-page-text">
              {STEPS[step].title}
            </h2>
            <p className="text-[13px] leading-[20px] text-page-text-muted">
              {STEPS[step].subtitle}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between pb-4">
            <StepDots current={step} total={STEPS.length} />
            <div
              className="flex items-center rounded-[6px] border border-border bg-foreground/[0.04] px-2 py-[4.25px]"
            >
              <span className="text-[12px] font-medium leading-[16px] text-page-text-subtle">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="min-h-0 flex-1 flex flex-col">
          {step === 0 && <StepTeam />}
          {step === 1 && (
            <StepTerms
              agreedTerms={agreedTerms} setAgreedTerms={setAgreedTerms}
              agreedEmails={agreedEmails} setAgreedEmails={setAgreedEmails}
              scrolledToBottom={scrolledToBottom} setScrolledToBottom={setScrolledToBottom}
            />
          )}
          {step === 2 && <StepCampaign />}
          {step === 3 && <StepMeetAI />}
          {step === 4 && <StepBookDemo darkMode={darkMode} />}
        </div>

        {/* ── FOOTER ── */}
        <div className="flex shrink-0 items-center justify-between border-t border-border px-6 py-5">
          {step > 0 ? (
            <button
              onClick={back}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-foreground/[0.03] px-4 text-[13px] font-medium text-page-text transition-colors hover:bg-foreground/[0.06]"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step !== 1 && !isLastStep && (
              <button
                onClick={next}
                className="flex h-9 items-center px-4 text-[13px] font-medium text-page-text-subtle transition-colors hover:text-page-text-muted"
              >
                Skip
              </button>
            )}
            <button
              onClick={isLastStep ? () => router.push("/") : next}
              disabled={!canContinue}
              className={cn(
                "flex h-9 items-center gap-1.5 rounded-xl px-4 text-[13px] font-medium text-white transition-all",
                canContinue
                  ? "hover:opacity-90"
                  : "cursor-not-allowed opacity-40"
              )}
              style={{ background: "radial-gradient(50% 64.33% at 50% 1.25%, #F59E0B 0%, rgba(245,158,11,0) 100%), #FF6207", borderTop: "1px solid rgba(251,191,36,0.5)" }}
            >
              {isLastStep ? "Finish" : "Continue"}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
