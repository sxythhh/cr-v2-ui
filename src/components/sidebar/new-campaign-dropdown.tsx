"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import { Scratch } from "./icons/scratch";
import { Template } from "./icons/template";
import { RichButton } from "@/components/rich-button";
import { toastManager } from "@/components/ui/toast";
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
        <div className="w-[256px] overflow-hidden rounded-2xl border border-dropdown-border bg-dropdown-bg shadow-lg">
          <div className="flex flex-col p-1">
            <button
              type="button"
              className="flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-xl px-3 font-inter text-sm font-medium tracking-[-0.09px] text-dropdown-text transition-colors hover:bg-dropdown-hover"
              onClick={() => {
                onFromScratch();
                onClose();
              }}
            >
              <Scratch className="size-4 text-dropdown-text-muted" />
              From scratch...
            </button>
            <button
              type="button"
              className="flex h-9 w-full cursor-pointer items-center gap-1.5 rounded-xl px-3 font-inter text-sm font-medium tracking-[-0.09px] text-dropdown-text transition-colors hover:bg-dropdown-hover"
            >
              <Template className="size-4 text-dropdown-text-muted" />
              <span className="flex-1 text-left">Choose a template...</span>
              <span className="font-inter text-sm font-normal tracking-[-0.09px] text-dropdown-text-muted">
                (0)
              </span>
            </button>
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
}

export function NewCampaignButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative" ref={(node) => { containerRef.current = node; refs.setReference(node); }}>
      <RichButton
        size="sm"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full"
      >
        <span>New campaign</span>
        <IconChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </RichButton>
      {open && (
        <NewCampaignDropdown
          containerRef={containerRef}
          floatingRef={setFloatingRef}
          floatingStyles={floatingStyles}
          onClose={() => setOpen(false)}
          onFromScratch={() => {
            toastManager.add({
              title: "Campaign created",
              description: "Your new campaign is ready to go.",
              type: "success",
            });
          }}
        />
      )}
    </div>
  );
}
