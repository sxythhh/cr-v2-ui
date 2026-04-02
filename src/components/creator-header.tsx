"use client";

function ChatBubbleIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
      <path d="M7.00001 0C9.04313 0 10.7932 0.527739 12.045 1.57127C13.3112 2.62695 14 4.15565 14 6C14 7.84435 13.3112 9.37305 12.045 10.4287C10.7932 11.4723 9.04313 12 7.00001 12C5.92049 12 4.70496 11.9003 3.6105 11.4252C3.42443 11.5292 3.16822 11.6556 2.86398 11.7612C2.22983 11.9811 1.30602 12.1365 0.381281 11.6984C0.199835 11.6125 0.066787 11.4493 0.0190906 11.2543C-0.0286059 11.0593 0.0141315 10.8532 0.13543 10.6932C0.59436 10.0879 0.738984 9.61846 0.779036 9.31825C0.817583 9.02932 0.763619 8.86377 0.757363 8.84586L0.757801 8.84694C0.757801 8.84694 0.757405 8.84594 0.756819 8.84434L0.757363 8.84586C0.757363 8.84586 0.756661 8.84416 0.756063 8.84274L0.750947 8.83071L0.742427 8.81055C0.691371 8.68815 0.51072 8.24607 0.34173 7.71863C0.179561 7.21249 5.64251e-06 6.54433 5.64251e-06 6C5.64251e-06 4.15565 0.688781 2.62695 1.95505 1.57127C3.20677 0.527739 4.95688 0 7.00001 0Z" fill="currentColor" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 14" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.404 0 1.264 2.036 1.134 4.628L1.015 7.021a.667.667 0 0 1-.07.265L.127 8.921A.667.667 0 0 0 0 9.461C0 10.127.54 10.667 1.206 10.667h1.527a3.334 3.334 0 0 0 6.534 0h1.527c.666 0 1.206-.54 1.206-1.206a.667.667 0 0 0-.127-.54l-.818-1.636a.667.667 0 0 1-.07-.265l-.12-2.392C10.736 2.036 8.596 0 6 0Zm0 12a2 2 0 0 1-1.886-1.333h3.772A2 2 0 0 1 6 12Z" fill="currentColor" />
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
    <header className={`sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between bg-page-bg px-4 sm:px-5 ${className ?? ""}`}>
      <h1 className="text-sm font-medium tracking-[-0.02em] text-page-text">{title}</h1>
      <div className="flex items-center gap-2.5">
        {/* Chat */}
        <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
          <ChatBubbleIcon />
        </button>
        {/* Notifications */}
        <button className="flex size-9 items-center justify-center rounded-full bg-foreground/[0.06] text-page-text transition-colors hover:bg-foreground/[0.10] dark:bg-[rgba(224,224,224,0.03)] dark:hover:bg-white/[0.06]">
          <BellIcon />
        </button>
        {/* Tier pill */}
        <div className="flex h-9 items-center gap-2.5 rounded-2xl border border-foreground/[0.06] bg-white py-0 pl-3 pr-0 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-[rgba(224,224,224,0.03)] dark:bg-[rgba(224,224,224,0.03)] dark:shadow-none">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium tracking-[-0.02em] text-[#E57100] dark:text-[#FB923C]">Recruit</span>
            <span className="text-sm font-medium tracking-[-0.02em] text-foreground/20">&middot;</span>
            <span className="text-sm font-medium tracking-[-0.02em] text-foreground/40">36%</span>
          </div>
          {/* Avatar circle */}
          <div className="size-9 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>
      </div>
    </header>
  );
}
