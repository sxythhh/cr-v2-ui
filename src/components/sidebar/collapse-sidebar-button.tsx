"use client";

import { useSideNav } from "./sidebar-context";

export function CollapseSidebarButton() {
  const { collapsed, setCollapsed } = useSideNav();

  return (
    <button
      type="button"
      onClick={() => setCollapsed((c) => !c)}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[rgba(37,37,37,0.5)] transition-colors hover:bg-[rgba(37,37,37,0.06)] hover:text-[#252525]"
    >
      {collapsed ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 4v16"/><path d="M14 10l2 2l-2 2"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4m0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 4v16"/><path d="M15 10l-2 2l2 2"/></svg>
      )}
    </button>
  );
}
