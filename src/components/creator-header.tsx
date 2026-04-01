"use client";

function ChatBubbleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1C4.32 1 1.33 3.54 1.33 6.67c0 1.5.73 2.87 1.92 3.88L2.58 13l2.53-1.18c.57.16 1.19.24 1.89.24 3.68 0 6.67-2.54 6.67-5.67C13.67 3.54 10.68 1 8 1Z" fill="#252525" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.404 0 1.264 2.036 1.134 4.628L1.015 7.021a.667.667 0 0 1-.07.265L.127 8.921A.667.667 0 0 0 0 9.461C0 10.127.54 10.667 1.206 10.667h1.527a3.334 3.334 0 0 0 6.534 0h1.527c.666 0 1.206-.54 1.206-1.206a.667.667 0 0 0-.127-.54l-.818-1.636a.667.667 0 0 1-.07-.265l-.12-2.392C10.736 2.036 8.596 0 6 0Zm0 12a2 2 0 0 1-1.886-1.333h3.772A2 2 0 0 1 6 12Z" fill="#252525" />
    </svg>
  );
}

export function CreatorHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <header className={`sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-page-border bg-page-bg px-4 sm:px-5 ${className ?? ""}`}>
      <h1 className="text-sm font-medium tracking-[-0.02em] text-page-text">{title}</h1>
      <div className="flex items-center gap-2.5">
        {/* Chat */}
        <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10]">
          <ChatBubbleIcon />
        </button>
        {/* Notifications */}
        <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10]">
          <BellIcon />
        </button>
        {/* Tier pill */}
        <div className="flex h-9 items-center rounded-2xl border border-foreground/[0.06] bg-white pl-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.06] dark:bg-card-bg">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-[#E57100]">Recruit</span>
            <span className="text-sm text-foreground/20">&middot;</span>
            <span className="text-sm text-foreground/40">36%</span>
          </div>
          {/* Avatar inside pill */}
          <div className="ml-2.5 size-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>
      </div>
    </header>
  );
}
