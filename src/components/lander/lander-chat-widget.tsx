"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X, ArrowRight } from "lucide-react";
import { ThinkingIndicator } from "@/components/ui/thinking-indicator";

function IntercomIcon({ className }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className}>
      <g clipPath="url(#clip-intercom-lander)">
        <path d="M22.7477 0.617554H4.47456C2.00333 0.617554 0 2.62088 0 5.09211V17.7714C0 20.2427 2.00333 22.246 4.47456 22.246H22.7477C25.2189 22.246 27.2222 20.2427 27.2222 17.7714V5.09211C27.2222 2.62088 25.2189 0.617554 22.7477 0.617554Z" fill="white"/>
        <path d="M14.0124 27.0029C13.9384 27.0893 13.8465 27.1587 13.7432 27.2062C13.6398 27.2538 13.5273 27.2784 13.4135 27.2784C13.2998 27.2784 13.1873 27.2538 13.0839 27.2062C12.9806 27.1587 12.8887 27.0893 12.8147 27.0029L8.78576 22.3012C8.6879 22.1868 8.62485 22.0467 8.60405 21.8976C8.58326 21.7485 8.60559 21.5965 8.66841 21.4596C8.73123 21.3228 8.83191 21.2068 8.95856 21.1253C9.08521 21.0439 9.23252 21.0004 9.3831 21H17.4432C18.1168 21 18.48 21.7902 18.0421 22.3012L14.0117 27.0029H14.0124Z" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M11.7585 18.0195C10.0516 17.7155 8.43604 17.028 7.03347 16.0089C6.55047 15.6543 6.53802 14.9659 6.95335 14.5343C7.36869 14.1034 8.0578 14.0909 8.55247 14.4277C9.63076 15.1578 10.8501 15.6538 12.1318 15.8837C13.9907 16.2081 16.2882 15.9856 18.7756 14.3251C19.2734 13.9929 19.9531 14.0653 20.3257 14.5351C20.6982 15.0033 20.6212 15.6901 20.1281 16.0284C17.1119 18.0957 14.1921 18.4449 11.7592 18.0195H11.7585ZM10.9286 6.22217C11.5275 6.22217 12.0128 6.7075 12.0128 7.30639V10.1974C12.0128 10.4849 11.8986 10.7607 11.6952 10.9641C11.4919 11.1674 11.2161 11.2816 10.9286 11.2816C10.641 11.2816 10.3652 11.1674 10.1619 10.9641C9.95858 10.7607 9.84435 10.4849 9.84435 10.1974V7.30639C9.84435 6.7075 10.3297 6.22217 10.9286 6.22217ZM16.17 6.22217C16.7689 6.22217 17.2535 6.7075 17.2535 7.30639V10.1974C17.2535 10.4849 17.1392 10.7607 16.9359 10.9641C16.7326 11.1674 16.4568 11.2816 16.1692 11.2816C15.8817 11.2816 15.6059 11.1674 15.4026 10.9641C15.1993 10.7607 15.085 10.4849 15.085 10.1974V7.30639C15.085 6.7075 15.5704 6.22217 16.1692 6.22217H16.17Z" fill="#FF8707"/>
      </g>
      <defs>
        <clipPath id="clip-intercom-lander">
          <rect width="27.2222" height="28" fill="white"/>
        </clipPath>
      </defs>
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
          return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{linkMatch[1]}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

export function LanderChatWidget() {
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

  const getMessageText = useCallback((message: (typeof messages)[number]) => {
    if (!message.parts) return "";
    return message.parts.filter((p): p is { type: "text"; text: string } => p.type === "text").map((p) => p.text).join("");
  }, []);

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

  const handleReset = () => { setMessages([]); setInputValue(""); };

  return (
    <>
      {/* FAB trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ width: 55, height: 55, background: "#FF8707" }}
          aria-label="Open chat"
        >
          <IntercomIcon />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-5 right-5 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{
            height: "min(600px, calc(100dvh - 100px))",
            background: "#FFFFFF",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ background: "#FF8707" }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <IntercomIcon className="scale-[0.65]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Content Rewards</p>
                <p className="text-xs text-white/70">We typically reply in a few minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="New conversation"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M3 21v-5h5" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#F4F3F2] px-4 py-3">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(255,135,7,0.12)" }}>
                  <IntercomIcon className="scale-[0.55]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">How can we help?</p>
                  <p className="mt-1 text-xs text-gray-500">Ask about campaigns, payouts, or anything else.</p>
                </div>
                <div className="mt-2 flex w-full max-w-[260px] flex-col gap-1.5">
                  {[
                    "How does the affiliate program work?",
                    "How do I track my referrals?",
                    "When do I get paid?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => { setInputValue(""); sendMessage({ text: suggestion }); }}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((message) => {
                const text = getMessageText(message);
                if (!text) return null;
                return (
                  <div key={message.id} className={`mb-3 flex ${message.role === "user" ? "justify-end" : "items-start gap-2"}`}>
                    {message.role === "assistant" && (
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: "#FF8707" }}>
                        <IntercomIcon className="scale-[0.4]" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      message.role === "user"
                        ? "text-white"
                        : "bg-white text-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    }`}
                    style={message.role === "user" ? { background: "#FF8707" } : undefined}
                    >
                      <MessageContent content={text} />
                    </div>
                  </div>
                );
              })}

            {isLoading && messages.length > 0 && messages[messages.length - 1]?.role === "user" && (
              <div className="mb-3 flex items-start gap-2">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ background: "#FF8707" }}>
                  <IntercomIcon className="scale-[0.4]" />
                </div>
                <div className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                  <ThinkingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 bg-white px-3 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none"
                style={{ maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-30"
                style={{ background: "#FF8707" }}
                aria-label="Send message"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M0.290678 0.429374C0.430093 0.261721 0.612869 0.135571 0.81907 0.0646817C1.02527 -0.0062072 1.24698 -0.0191124 1.46001 0.027374C3.25268 0.398707 6.10201 1.60404 8.47468 2.84471C9.66801 3.46871 10.77 4.11804 11.5827 4.69671C11.9867 4.98404 12.3393 5.26937 12.598 5.53804C12.7273 5.67137 12.8493 5.81804 12.9413 5.97204C13.03 6.12004 13.124 6.32804 13.124 6.57337C13.124 6.81871 13.03 7.02671 12.9413 7.17404C12.8487 7.32871 12.728 7.47404 12.598 7.60871C12.3393 7.87737 11.9867 8.16204 11.5827 8.45004C10.77 9.02871 9.66801 9.67737 8.47468 10.302C6.10201 11.5427 3.25268 12.748 1.46001 13.1194C1.24682 13.1659 1.02493 13.153 0.818598 13.082C0.612261 13.0109 0.429408 12.8846 0.290011 12.7167C0.158593 12.5562 0.0680974 12.3661 0.0262945 12.1629C-0.0155085 11.9597 -0.00736995 11.7494 0.0500114 11.55L1.24668 7.24004H7.12401C7.30082 7.24004 7.47039 7.1698 7.59542 7.04478C7.72044 6.91975 7.79068 6.75019 7.79068 6.57337C7.79068 6.39656 7.72044 6.22699 7.59542 6.10197C7.47039 5.97695 7.30082 5.90671 7.12401 5.90671H1.24668L0.0506782 1.59671C-0.00670317 1.39734 -0.0148419 1.18702 0.0269611 0.983809C0.068764 0.7806 0.15926 0.590573 0.290678 0.430041V0.429374Z" fill="white"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
