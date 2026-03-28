"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion, AnimatePresence } from "motion/react";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";

const SUGGESTIONS = [
  "How does CPM work?",
  "How do I request a payout?",
  "Why was my submission rejected?",
];

function StarIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor" className={className}>
      <path d="M12.8333 6.66667C8.55093 6.66667 6.66667 8.55093 6.66667 12.8333C6.66667 8.55093 4.78241 6.66667 0.5 6.66667C4.78241 6.66667 6.66667 4.78241 6.66667 0.5C6.66667 4.78241 8.55093 6.66667 12.8333 6.66667Z" />
    </svg>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\)|\n)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part === "\n") return <br key={i} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="underline decoration-current/30 underline-offset-2 transition-colors hover:opacity-70">
              {linkMatch[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/support/chat" }),
    []
  );

  const { messages, sendMessage, setMessages, status, error } = useChat({
    transport,
  } as Parameters<typeof useChat>[0]);

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);
  useEffect(() => { if (error) console.error("[SupportChat] Error:", error); }, [error]);

  const getMessageText = useCallback(
    (message: (typeof messages)[number]) => {
      if (!message.parts) return "";
      return message.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
    },
    []
  );

  const buildTranscript = useCallback(() => {
    return messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => `${m.role === "user" ? "User" : "AI"}: ${getMessageText(m)}`)
      .filter((line) => !line.endsWith(": "))
      .join("\n");
  }, [messages, getMessageText]);

  const handleEscalateToHuman = () => {
    const transcript = buildTranscript();
    const firstUserMessage = messages.find((m) => m.role === "user");
    const userQuestion = firstUserMessage ? getMessageText(firstUserMessage) : "";
    const prefill = userQuestion
      ? `I was chatting with the AI assistant about: "${userQuestion.slice(0, 200)}"\n\nI need human help with:`
      : "";
    if ((window as any).Intercom) {
      if (transcript) {
        (window as any).Intercom("update", {
          custom_attributes: { ai_chat_transcript: transcript.slice(-2000), ai_chat_escalated_at: new Date().toISOString() },
        });
      }
      (window as any).Intercom("showNewMessage", prefill);
    } else {
      window.open("https://intercom.help/content-rewards/en", "_blank");
    }
    setIsOpen(false);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    sendMessage({ text });
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const showEscalate =
    messages.length >= 4 ||
    messages.some((m) => {
      const text = getMessageText(m).toLowerCase();
      return /\b(human|person|agent|someone|speak to|talk to|real person|support team|escalat|help center)\b/.test(text);
    });

  const visibleMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");
  const lastIsUser = messages.length > 0 && messages[messages.length - 1]?.role === "user";

  return (
    <>
      {/* Trigger */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            key="trigger"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-20 right-5 z-50 flex h-[55px] w-[55px] cursor-pointer items-center justify-center rounded-full bg-[#FF8707] active:scale-95 md:bottom-5"
            aria-label="Open support chat"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <g clipPath="url(#clip_chat_trigger)">
                <path d="M22.7477 0.617554H4.47456C2.00333 0.617554 0 2.62088 0 5.09211V17.7714C0 20.2427 2.00333 22.246 4.47456 22.246H22.7477C25.2189 22.246 27.2222 20.2427 27.2222 17.7714V5.09211C27.2222 2.62088 25.2189 0.617554 22.7477 0.617554Z" fill="white"/>
                <path d="M14.0124 27.0029C13.9384 27.0893 13.8465 27.1587 13.7432 27.2062C13.6398 27.2538 13.5273 27.2784 13.4135 27.2784C13.2998 27.2784 13.1873 27.2538 13.0839 27.2062C12.9806 27.1587 12.8887 27.0893 12.8147 27.0029L8.78576 22.3012C8.6879 22.1868 8.62485 22.0467 8.60405 21.8976C8.58326 21.7485 8.60559 21.5965 8.66841 21.4596C8.73123 21.3228 8.83191 21.2068 8.95856 21.1253C9.08521 21.0439 9.23252 21.0004 9.3831 21H17.4432C18.1168 21 18.48 21.7902 18.0421 22.3012L14.0117 27.0029H14.0124Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.7585 18.0195C10.0516 17.7155 8.43604 17.028 7.03347 16.0089C6.55047 15.6543 6.53802 14.9659 6.95335 14.5343C7.36869 14.1034 8.0578 14.0909 8.55247 14.4277C9.63076 15.1578 10.8501 15.6538 12.1318 15.8837C13.9907 16.2081 16.2882 15.9856 18.7756 14.3251C19.2734 13.9929 19.9531 14.0653 20.3257 14.5351C20.6982 15.0033 20.6212 15.6901 20.1281 16.0284C17.1119 18.0957 14.1921 18.4449 11.7592 18.0195H11.7585ZM10.9286 6.22217C11.5275 6.22217 12.0128 6.7075 12.0128 7.30639V10.1974C12.0128 10.4849 11.8986 10.7607 11.6952 10.9641C11.4919 11.1674 11.2161 11.2816 10.9286 11.2816C10.641 11.2816 10.3652 11.1674 10.1619 10.9641C9.95858 10.7607 9.84435 10.4849 9.84435 10.1974V7.30639C9.84435 6.7075 10.3297 6.22217 10.9286 6.22217ZM16.17 6.22217C16.7689 6.22217 17.2535 6.7075 17.2535 7.30639V10.1974C17.2535 10.4849 17.1392 10.7607 16.9359 10.9641C16.7326 11.1674 16.4568 11.2816 16.1692 11.2816C15.8817 11.2816 15.6059 11.1674 15.4026 10.9641C15.1993 10.7607 15.085 10.4849 15.085 10.1974V7.30639C15.085 6.7075 15.5704 6.22217 16.1692 6.22217H16.17Z" fill="#FF8707"/>
              </g>
              <defs>
                <clipPath id="clip_chat_trigger">
                  <rect width="27.2222" height="28" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-0 right-0 z-50 flex w-full flex-col overflow-hidden rounded-t-2xl border border-foreground/[0.06] bg-card-bg shadow-[0px_8px_40px_rgba(0,0,0,0.12),0px_2px_8px_rgba(0,0,0,0.06)] sm:bottom-5 sm:right-5 sm:w-[380px] sm:rounded-2xl"
            style={{ height: "min(580px, calc(100dvh - 100px))", transformOrigin: "bottom right" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/[0.06]">
                  <StarIcon size={12} className="text-page-text-muted" />
                </div>
                <div>
                  <p className="font-inter text-[13px] font-semibold tracking-[-0.02em] text-page-text">AI Support</p>
                  <p className="font-inter text-[11px] tracking-[-0.02em] text-page-text-muted">Ask anything about Content Rewards</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setMessages([]); setInputValue(""); }}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
                    title="New conversation"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-page-text-muted transition-colors hover:bg-foreground/[0.06] hover:text-page-text"
                  aria-label="Close chat"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mx-4 border-t border-foreground/[0.04]" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* Empty state */}
              {visibleMessages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/[0.04]">
                    <StarIcon size={16} className="text-page-text-muted" />
                  </div>
                  <div className="text-center">
                    <p className="font-inter text-[15px] font-semibold tracking-[-0.04em] text-page-text">How can we help?</p>
                    <p className="mt-1.5 font-inter text-[13px] tracking-[-0.02em] text-page-text-muted">
                      Ask about campaigns, payouts, or anything else.
                    </p>
                  </div>
                  <div className="flex w-full max-w-[280px] flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setInputValue(""); sendMessage({ text: s }); }}
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-foreground/[0.06] px-3.5 py-3 text-left font-inter text-[12px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.03]"
                      >
                        <span>{s}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-page-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message list */}
              {visibleMessages.map((message, idx) => {
                const text = getMessageText(message);
                if (!text) return null;
                const isUser = message.role === "user";
                const nextMsg = visibleMessages[idx + 1];
                const isLastInGroup = !nextMsg || nextMsg.role !== message.role;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "items-start gap-2"} ${isLastInGroup ? "mb-4" : "mb-1"}`}
                  >
                    {!isUser && (
                      <div className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center">
                        <StarIcon size={11} className="text-page-text-muted" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 font-inter text-[13px] leading-[1.6] tracking-[-0.01em] ${
                        isUser
                          ? "rounded-[18px] rounded-br-[4px] bg-foreground text-background"
                          : "rounded-[18px] text-page-text"
                      }`}
                      style={!isUser ? { backgroundColor: "var(--support-surface-bg, var(--card-bg))" } : undefined}
                    >
                      <MessageContent content={text} />
                    </div>
                  </div>
                );
              })}

              {/* Thinking */}
              {isLoading && lastIsUser && (
                <div className="mb-4 flex items-start gap-2">
                  <div className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center">
                    <StarIcon size={11} className="text-page-text-muted" />
                  </div>
                  <div className="rounded-[18px]" style={{ backgroundColor: "var(--support-surface-bg, var(--card-bg))" }}>
                    <ThinkingIndicator />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Escalate */}
            {showEscalate && (
              <div className="px-4 pb-1">
                <button
                  type="button"
                  onClick={handleEscalateToHuman}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 font-inter text-[12px] tracking-[-0.02em] text-page-text-muted transition-colors hover:bg-foreground/[0.03] hover:text-page-text"
                >
                  <span>Need a human? Talk to our team</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Input */}
            <div className="px-2 pb-2">
              <div className="flex h-[44px] items-center gap-1.5 rounded-xl bg-foreground/[0.04] pr-1 pl-3.5">
                <input
                  ref={inputRef as unknown as React.RefObject<HTMLInputElement>}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown as unknown as React.KeyboardEventHandler<HTMLInputElement>}
                  placeholder="Ask a question..."
                  className="h-full min-w-0 flex-1 border-none bg-transparent font-inter text-[13px] tracking-[-0.01em] text-page-text placeholder:text-page-text-muted focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-[36px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-[#F7890F] transition-all hover:bg-[#e67e0d] active:scale-95 disabled:cursor-default disabled:opacity-20"
                  aria-label="Send message"
                >
                  <svg width="13" height="14" viewBox="-1 0 16 18" fill="white">
                    <path d="M8.50388 2.93386C5.11288 0.673856 3.41688 -0.457144 2.03088 -0.0661441C1.59618 0.0567154 1.19326 0.272331 0.849883 0.565856C-0.245117 1.50186 -0.245117 3.53986 -0.245117 7.61586V10.0999C-0.245117 14.1759 -0.245117 16.2139 0.849883 17.1499C1.19313 17.4428 1.59566 17.658 2.02988 17.7809C3.41688 18.1729 5.11188 17.0429 8.50388 14.7829L10.3659 13.5409C13.1659 11.6739 14.5659 10.7409 14.8199 9.46886C14.8999 9.06613 14.8999 8.65159 14.8199 8.24886C14.5669 6.97686 13.1669 6.04286 10.3669 4.17586L8.50388 2.93386Z" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
