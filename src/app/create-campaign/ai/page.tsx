"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/* ─── Types ─── */
type Message = { from: "ai" | "user"; text: string };
type QuestionStep = {
  id: string;
  label: string;
  question: string;
  options?: string[];
  multiSelect?: boolean;
  summaryKey: string;
  progress: number;
};

/* ─── Questions flow ─── */
const QUESTIONS: QuestionStep[] = [
  { id: "agency", label: "Getting started", question: "Are you working with an agency?", options: ["Yes, I have an agency", "Not yet, help me find one later", "No, I'll manage it myself"], summaryKey: "Agency", progress: 0 },
  { id: "agency-name", label: "Getting started", question: "Great! Which agency are you with?", summaryKey: "Agency", progress: 7 },
  { id: "brand", label: "Getting started", question: "Which brand is this campaign for?", summaryKey: "Brand", progress: 14 },
  { id: "type", label: "Category", question: "What type of campaign is this?", options: ["Clipping", "UGC (original content)", "Reaction videos", "Reviews"], summaryKey: "Type", progress: 21 },
  { id: "category", label: "Category", question: "What category best describes this campaign?", options: ["Gaming", "Music", "Entertainment", "Sports", "Lifestyle", "Technology"], summaryKey: "Category", progress: 28 },
  { id: "platforms", label: "Platforms", question: "Which platforms should creators post on?", options: ["TikTok", "Instagram Reels", "Youtube Shorts", "All platforms"], multiSelect: true, summaryKey: "Platforms", progress: 42 },
  { id: "name", label: "Details", question: "What should we name this campaign?", summaryKey: "Name", progress: 56 },
  { id: "model", label: "Pricing", question: "What payment model do you want to use?", options: ["CPM (per 1K views)", "Per video (flat fee)", "Retainer (monthly)"], summaryKey: "Model", progress: 70 },
  { id: "access", label: "Access", question: "Should this campaign be open to all creators or require applications?", options: ["Open to public", "Application required"], summaryKey: "Access", progress: 84 },
  { id: "done", label: "Campaign ready", question: "Here's a preview of how your campaign will look on the discover page:", summaryKey: "", progress: 100 },
];

/* ─── Robot icon (16px, orange) ─── */
function RobotIcon16() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 14" fill="none" className="shrink-0">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C6.36819 0 6.66667 0.298477 6.66667 0.666667V1.33333H9.33333C10.4379 1.33333 11.3333 2.22876 11.3333 3.33333V6.66667C11.3333 7.259 11.0758 7.79119 10.6667 8.1574V9.05719L11.8047 10.1953C12.0651 10.4556 12.0651 10.8777 11.8047 11.1381C11.5444 11.3984 11.1223 11.3984 10.8619 11.1381L10.454 10.7302C9.86034 12.6251 8.09073 14 6 14C3.90927 14 2.13966 12.6251 1.54598 10.7302L1.13807 11.1381C0.877722 11.3984 0.455612 11.3984 0.195262 11.1381C-0.0650874 10.8777 -0.0650874 10.4556 0.195262 10.1953L1.33333 9.05719V8.1574C0.924167 7.79119 0.666667 7.259 0.666667 6.66667V3.33333C0.666667 2.22876 1.5621 1.33333 2.66667 1.33333H5.33333V0.666667C5.33333 0.298477 5.63181 0 6 0ZM2.66667 2.66667C2.29848 2.66667 2 2.96514 2 3.33333V6.66667C2 7.03486 2.29848 7.33333 2.66667 7.33333H9.33333C9.70152 7.33333 10 7.03486 10 6.66667V3.33333C10 2.96514 9.70152 2.66667 9.33333 2.66667H2.66667ZM4 4C4.36819 4 4.66667 4.29848 4.66667 4.66667V5.33333C4.66667 5.70152 4.36819 6 4 6C3.63181 6 3.33333 5.70152 3.33333 5.33333V4.66667C3.33333 4.29848 3.63181 4 4 4ZM8 4C8.36819 4 8.66667 4.29848 8.66667 4.66667V5.33333C8.66667 5.70152 8.36819 6 8 6C7.63181 6 7.33333 5.70152 7.33333 5.33333V4.66667C7.33333 4.29848 7.63181 4 8 4Z" fill="#E57100" />
    </svg>
  );
}

/* ─── Summary row ─── */
function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] border border-foreground/[0.06] px-3 py-3 dark:border-[rgba(224,224,224,0.03)]">
      <span className="text-sm tracking-[-0.02em] text-page-text-muted">{label}</span>
      <span className="text-sm font-medium leading-[120%] tracking-[-0.02em] text-page-text">{value}</span>
    </div>
  );
}

/* ─── Streaming text hook ─── */
function useStreamingText(text: string, active: boolean, speed = 20) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(""); setDone(false); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => { i++; if (i >= text.length) { setDisplayed(text); setDone(true); clearInterval(iv); } else { setDisplayed(text.slice(0, i)); } }, speed);
    return () => clearInterval(iv);
  }, [text, active, speed]);
  return { displayed, done };
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function AiCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const q = QUESTIONS[step];
  const isLastStep = step === QUESTIONS.length - 1;

  // Show the first AI question
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => {
      setMessages([{ from: "ai", text: QUESTIONS[0].question }]);
      setTyping(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const advanceStep = useCallback((answer: string) => {
    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: answer }]);

    // Update summary
    if (q.summaryKey) {
      setSummary((prev) => ({ ...prev, [q.summaryKey]: answer }));
    }

    // Advance to next question
    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      setTyping(true);
      setTimeout(() => {
        const nextQ = QUESTIONS[nextStep];
        // Add a transition message for certain steps
        let aiMsg = nextQ.question;
        if (nextQ.id === "category" && answer) {
          aiMsg = `Got it, ${answer} campaign. I'll suggest relevant settings for this category.`;
          setMessages((prev) => [...prev, { from: "ai", text: aiMsg }]);
          // Then ask the actual question after a delay
          setTimeout(() => {
            setMessages((prev) => [...prev, { from: "ai", text: nextQ.question }]);
            setTyping(false);
            setStep(nextStep);
          }, 800);
          return;
        }
        setMessages((prev) => [...prev, { from: "ai", text: aiMsg }]);
        setTyping(false);
        setStep(nextStep);
      }, 500);
    }
  }, [step, q]);

  const handleOptionClick = (opt: string) => {
    if (q.multiSelect) {
      setSelectedOptions((prev) => prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]);
    } else {
      advanceStep(opt);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedOptions.length > 0) {
      advanceStep(selectedOptions.join(", "));
      setSelectedOptions([]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    advanceStep(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-screen flex-col bg-[#FBFBFB] font-inter tracking-[-0.02em] dark:bg-page-bg">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/[0.06] px-5">
        <button onClick={() => router.push("/campaigns")} className="flex items-center gap-2 text-sm font-medium text-page-text transition-opacity hover:opacity-70">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M5 12l6 6"/><path d="M5 12l6-6"/></svg>
          Back to campaigns
        </button>
        <button className="rounded-full bg-foreground/[0.06] px-4 py-2 text-sm font-medium text-page-text transition-colors hover:bg-foreground/[0.10]">
          Save as draft
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 gap-5 overflow-hidden p-5">
        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          {/* Progress bar */}
          <div className="flex items-center gap-3 pb-6">
            <button className="flex size-5 items-center justify-center rounded-full bg-foreground/[0.06]" onClick={() => step > 0 && setStep(step - 1)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 9L4.5 6l3-3" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-page-text">{q.label}</span>
                <span className="text-sm font-medium text-foreground/70">{q.progress}%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-foreground/10">
                <div className="h-full rounded-full bg-[#E57100] transition-all duration-500" style={{ width: `${Math.max(1, q.progress)}%` }} />
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div ref={scrollRef} className="flex flex-1 flex-col gap-2 overflow-y-auto pb-4 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex items-start gap-1.5", msg.from === "user" ? "justify-end" : "")}>
                {msg.from === "ai" && (
                  <div className="flex flex-col items-start justify-end pb-1 pt-1"><RobotIcon16 /></div>
                )}
                <div
                  className={cn(
                    "max-w-[320px] rounded-xl px-2.5 py-1.5 text-sm leading-[140%]",
                    msg.from === "ai"
                      ? "border border-foreground/[0.06] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-page-text dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
                      : "bg-[#E57100] text-white"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-start gap-1.5">
                <div className="flex flex-col items-start justify-end pb-1 pt-1"><RobotIcon16 /></div>
                <div className="flex items-center gap-1 rounded-xl border border-foreground/[0.06] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg">
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            {/* Mobile: inline summary card on final step */}
            {isLastStep && (
              <div className="flex items-start gap-1.5 md:hidden">
                <div className="flex flex-col items-start justify-end pb-1 pt-1"><RobotIcon16 /></div>
                <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-foreground/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg">
                  <SummaryRow label="Payment model" value={summary.Model || "CPM"} />
                  <SummaryRow label="Rate" value="$2.50 CPM" />
                  <SummaryRow label="Platforms" value={summary.Platforms || "TikTok, Instagram"} />
                  <SummaryRow label="Access" value={summary.Access || "Open to public"} />
                  <SummaryRow label="Contract" value="3 months" />
                  <SummaryRow label="Posts" value="20/mo" />
                  <SummaryRow label="Spots" value="13 remaining (47/60)" />
                  <SummaryRow label="Bonuses" value="2 milestones" />
                  <SummaryRow label="Invited" value="3 invited creators" />
                </div>
              </div>
            )}
          </div>

          {/* Options / Input area */}
          <div className="flex flex-col gap-4 pt-2">
            {/* Option buttons (if current question has options and not completed) */}
            {q.options && !isLastStep && (
              <div className="flex flex-wrap gap-2 md:justify-center">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOptionClick(opt)}
                    className={cn(
                      "rounded-full border px-3 py-2.5 text-sm font-medium transition-colors",
                      selectedOptions.includes(opt)
                        ? "border-[rgba(255,144,37,0.3)] text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        : "border-foreground/[0.06] bg-white text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-foreground/[0.02] dark:border-[rgba(224,224,224,0.03)] dark:bg-card-bg"
                    )}
                    style={selectedOptions.includes(opt) ? { background: "radial-gradient(50% 50% at 50% 100%, rgba(255,144,37,0.12) 0%, rgba(255,144,37,0) 50%), var(--card-bg, #FFFFFF)" } : undefined}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Confirm selection button (for multiSelect) */}
            {q.multiSelect && selectedOptions.length > 0 && (
              <div className="flex items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type your answer..." className="flex-1 rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" />
                <button onClick={handleConfirmSelection} className="shrink-0 rounded-full bg-[#252525] px-4 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-[#151515]">
                  Confirm selection
                </button>
              </div>
            )}

            {/* Final buttons */}
            {isLastStep && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => router.push("/create-campaign?model=cpm")} className="flex-1 rounded-full bg-foreground/[0.06] px-4 py-2.5 text-sm font-medium text-page-text shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:flex-none">
                  Edit in Manual wizard
                </button>
                <button className="flex-1 rounded-full bg-[#252525] px-4 py-2.5 text-sm font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] md:flex-none dark:bg-white dark:text-[#151515]">
                  Launch campaign
                </button>
              </div>
            )}

            {/* Text input (for non-option questions) */}
            {!q.options && !isLastStep && !q.multiSelect && (
              <div className="flex items-center gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type your answer..." className="flex-1 rounded-[14px] bg-foreground/[0.04] px-3.5 py-3 text-sm text-page-text outline-none placeholder:text-foreground/40 dark:bg-white/[0.04]" />
                <button onClick={handleSend} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#252525] dark:bg-white">
                  <svg width="15" height="13" viewBox="0 0 15 13" fill="none"><path d="M0.50446 2.37563C-0.481509 1.58905 0.0746884 0 1.33597 0H13.3823C14.4061 0 15.048 1.10618 14.5398 1.99506L8.64431 12.3079C8.0281 13.3858 6.40259 13.1104 6.17585 11.8897L5.2135 6.70834L9.02748 4.54003C9.34756 4.35806 9.45952 3.95107 9.27755 3.63099C9.09558 3.31091 8.68859 3.19895 8.36851 3.38092L4.51251 5.57312L0.50446 2.37563Z" fill="white" className="dark:fill-[#151515]" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Campaign summary sidebar — desktop only */}
        <div className="hidden w-[320px] shrink-0 flex-col gap-2 md:flex">
          <div className="flex items-center justify-center gap-1 py-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2.66667 3.33203C3.03486 3.33203 3.33333 3.63051 3.33333 3.9987V9.9987C3.33333 10.3669 3.63181 10.6654 4 10.6654H11.3333V9.9987C11.3333 9.74243 11.4802 9.50884 11.7112 9.39783C11.9422 9.28682 12.2163 9.31803 12.4165 9.47812L14.0831 10.8115C14.2413 10.938 14.3333 11.1295 14.3333 11.332C14.3333 11.5346 14.2413 11.7261 14.0831 11.8526L12.4165 13.1859C12.2163 13.346 11.9422 13.3772 11.7112 13.2662C11.4802 13.1552 11.3333 12.9216 11.3333 12.6654V11.9987H4C2.89543 11.9987 2 11.1033 2 9.9987V3.9987C2 3.63051 2.29848 3.33203 2.66667 3.33203ZM5.33333 4.66536C5.33333 4.29717 5.63181 3.9987 6 3.9987H11.3333C11.7015 3.9987 12 4.29717 12 4.66536C12 5.03355 11.7015 5.33203 11.3333 5.33203H6C5.63181 5.33203 5.33333 5.03355 5.33333 4.66536ZM5.33333 7.9987C5.33333 7.63051 5.63181 7.33203 6 7.33203H8.66667C9.03486 7.33203 9.33333 7.63051 9.33333 7.9987C9.33333 8.36689 9.03486 8.66536 8.66667 8.66536H6C5.63181 8.66536 5.33333 8.36689 5.33333 7.9987Z" fill="currentColor" fillOpacity="0.5" /></svg>
            <span className="text-sm font-medium text-page-text-subtle">Campaign summary</span>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-2xl border border-foreground/[0.06] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] scrollbar-hide dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)]">
            <SummaryRow label="Agency" value={summary.Agency || "—"} />
            <SummaryRow label="Brand" value={summary.Brand || "—"} />
            <SummaryRow label="Model" value={summary.Model || "—"} />
            <SummaryRow label="Access" value={summary.Access || "—"} />
            <SummaryRow label="Applications" value={summary.Access === "Application required" ? "Required" : "Not required"} />
            <SummaryRow label="Platforms" value={summary.Platforms || "—"} />
            <SummaryRow label="Name" value={summary.Name || "—"} />
            <SummaryRow label="Type" value={summary.Type || "—"} />
            <SummaryRow label="Category" value={summary.Category || "—"} />
            <SummaryRow label="Milestones" value="2" />
            <SummaryRow label="Rules set" value="4" />
          </div>
        </div>
      </div>
    </div>
  );
}
