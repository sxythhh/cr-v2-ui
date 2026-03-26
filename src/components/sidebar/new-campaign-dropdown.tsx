"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import { IconChevronDown } from "@tabler/icons-react";
import { Scratch } from "./icons/scratch";
import { Template } from "./icons/template";
import { RichButton } from "@/components/rich-button";
import { CampaignModelModal } from "@/components/campaign-flow/CampaignModelModal";
import type { CampaignModel } from "@/types/campaign-flow.types";
import {
  useFloating,
  offset,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

function NewCampaignDropdown({
  containerRef,
  floatingRef,
  floatingStyles,
  onClose,
  onFromScratch,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  floatingRef: (node: HTMLDivElement | null) => void;
  floatingStyles: React.CSSProperties;
  onClose: () => void;
  onFromScratch: () => void;
}) {
  const floatingElRef = useRef<HTMLDivElement | null>(null);
  const combinedFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      floatingElRef.current = node;
      floatingRef(node);
    },
    [floatingRef],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        (!floatingElRef.current || !floatingElRef.current.contains(target))
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [containerRef, onClose]);

  return (
    <FloatingPortal>
      <div
        ref={combinedFloatingRef}
        style={floatingStyles}
        className="z-[200]"
      >
        <DropdownMenuContent onFromScratch={onFromScratch} onClose={onClose} />
      </div>
    </FloatingPortal>
  );
}

function DropdownMenuContent({ onFromScratch, onClose }: { onFromScratch: () => void; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem, measureItems } = useProximityHover(menuRef);

  useEffect(() => { measureItems(); }, [measureItems]);

  const activeRect = activeIndex !== null ? itemRects[activeIndex] : null;

  return (
    <div className="w-[256px] overflow-hidden rounded-2xl border border-dropdown-border bg-dropdown-bg shadow-lg">
      <div
        ref={menuRef}
        className="relative flex flex-col p-1"
        onMouseEnter={handlers.onMouseEnter}
        onMouseMove={handlers.onMouseMove}
        onMouseLeave={handlers.onMouseLeave}
      >
        <AnimatePresence>
          {activeRect && (
            <motion.div
              key={sessionRef.current}
              className="pointer-events-none absolute rounded-xl bg-foreground/[0.04]"
              initial={{ opacity: 0, ...activeRect }}
              animate={{ opacity: 1, ...activeRect }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ ...springs.moderate, opacity: { duration: 0.16 } }}
            />
          )}
        </AnimatePresence>
        <button
          ref={(el) => registerItem(0, el)}
          type="button"
          className="relative z-10 flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-xl px-3 font-inter text-sm font-medium tracking-[-0.09px] text-dropdown-text"
          onClick={() => { onFromScratch(); onClose(); }}
        >
          <Scratch className="size-4 text-dropdown-text-muted" />
          From scratch...
        </button>
        <button
          ref={(el) => registerItem(1, el)}
          type="button"
          className="relative z-10 flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-xl px-3 font-inter text-sm font-medium tracking-[-0.09px] text-dropdown-text"
        >
          <Template className="size-4 text-dropdown-text-muted" />
          <span className="flex-1 text-left">Choose a template...</span>
          <span className="font-inter text-sm font-normal tracking-[-0.09px] text-dropdown-text-muted">(0)</span>
        </button>
      </div>
    </div>
  );
}

export function NewCampaignButton() {
  const [open, setOpen] = useState(false);
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { refs, floatingStyles } = useFloating({
    open,
    placement: "bottom-start",
    middleware: [offset(6), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  const handleModelSelect = (model: CampaignModel) => {
    setModelModalOpen(false);
    router.push(`/create-campaign?model=${model}`);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setModelModalOpen(true)}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[#252525] pl-3 pr-4 font-inter text-sm font-medium tracking-[-0.02em] text-white transition-colors hover:bg-[#333] dark:bg-white dark:text-[#252525] dark:hover:bg-[#e5e5e5]"
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.08333 0.75V6.08333M6.08333 6.08333V11.4167M6.08333 6.08333H0.75M6.08333 6.08333H11.4167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>New campaign</span>
      </button>
      <CampaignModelModal
        open={modelModalOpen}
        onOpenChange={setModelModalOpen}
        onSelect={handleModelSelect}
      />
    </div>
  );
}
