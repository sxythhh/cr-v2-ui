"use client";

import { useState, useCallback, useRef, type RefObject } from "react";

export interface MentionCreator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  platform: "tiktok" | "instagram" | "youtube" | "x";
  followers: string;
}

export interface MentionCampaign {
  id: string;
  title: string;
  status: "active" | "paused" | "completed";
  budget: string;
}

export type MentionItem =
  | { type: "creator"; data: MentionCreator }
  | { type: "campaign"; data: MentionCampaign };

export const MENTION_CREATORS: MentionCreator[] = [
  { id: "c1", name: "Alex Rivera", username: "@alexrivera", avatar: "https://i.pravatar.cc/32?img=1", platform: "tiktok", followers: "245K" },
  { id: "c2", name: "Jordan Chen", username: "@jordanchen", avatar: "https://i.pravatar.cc/32?img=2", platform: "youtube", followers: "1.2M" },
  { id: "c3", name: "Mia Thompson", username: "@miathompson", avatar: "https://i.pravatar.cc/32?img=5", platform: "instagram", followers: "89K" },
  { id: "c4", name: "Liam Nakamura", username: "@liamnaka", avatar: "https://i.pravatar.cc/32?img=8", platform: "tiktok", followers: "512K" },
  { id: "c5", name: "Sarah Kim", username: "@sarahkim", avatar: "https://i.pravatar.cc/32?img=9", platform: "youtube", followers: "340K" },
  { id: "c6", name: "Daniel Okafor", username: "@danokafor", avatar: "https://i.pravatar.cc/32?img=11", platform: "instagram", followers: "178K" },
  { id: "c7", name: "Emma Davis", username: "@emmadavis", avatar: "https://i.pravatar.cc/32?img=16", platform: "x", followers: "92K" },
  { id: "c8", name: "Ryan Martinez", username: "@ryanmartinez", avatar: "https://i.pravatar.cc/32?img=12", platform: "tiktok", followers: "1.8M" },
];

export const MENTION_CAMPAIGNS: MentionCampaign[] = [
  { id: "cp1", title: "Call of Duty BO7 Clipping Campaign", status: "active", budget: "$37,500" },
  { id: "cp2", title: "Fortnite OG Season Highlights", status: "active", budget: "$15,000" },
  { id: "cp3", title: "NBA 2K25 Launch", status: "completed", budget: "$22,000" },
  { id: "cp4", title: "GTA VI Trailer Reactions", status: "active", budget: "$50,000" },
  { id: "cp5", title: "Minecraft 2 Beta Access", status: "paused", budget: "$8,500" },
  { id: "cp6", title: "Apple Vision Pro Reviews", status: "completed", budget: "$12,000" },
];

interface UseMentionPopoverOptions {
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  message: string;
  setMessage: (msg: string) => void;
}

export function useMentionPopover({ inputRef, message, setMessage }: UseMentionPopoverOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"creators" | "campaigns">("creators");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const triggerIndexRef = useRef<number | null>(null);

  const detectTrigger = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const pos = el.selectionStart ?? 0;
    const text = el.value;

    for (let i = pos - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === "@" && (i === 0 || /\s/.test(text[i - 1]))) {
        const q = text.slice(i + 1, pos);
        if (/\s/.test(q)) break;
        triggerIndexRef.current = i;
        setQuery(q);
        setIsOpen(true);
        setHighlightIndex(0);
        return;
      }
      if (/\s/.test(ch)) break;
    }

    triggerIndexRef.current = null;
    setIsOpen(false);
    setQuery("");
  }, [inputRef]);

  const filteredCreators = MENTION_CREATORS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCampaigns = MENTION_CAMPAIGNS.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const currentList = activeTab === "creators" ? filteredCreators : filteredCampaigns;

  const selectItem = useCallback((item: MentionItem) => {
    const el = inputRef.current;
    const idx = triggerIndexRef.current;
    if (!el || idx === null) return;

    const label = item.type === "creator" ? item.data.name : item.data.title;
    const before = el.value.slice(0, idx);
    const after = el.value.slice(el.selectionStart ?? 0);
    const newMessage = `${before}@${label} ${after}`;
    setMessage(newMessage);
    setIsOpen(false);
    setQuery("");
    triggerIndexRef.current = null;

    requestAnimationFrame(() => {
      el.focus();
      const newPos = idx + label.length + 2;
      el.setSelectionRange(newPos, newPos);
    });
  }, [inputRef, setMessage]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    triggerIndexRef.current = null;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return false;

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
      return true;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      setActiveTab((t) => t === "creators" ? "campaigns" : "creators");
      setHighlightIndex(0);
      return true;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, currentList.length - 1));
      return true;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      return true;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const item = currentList[highlightIndex];
      if (item) {
        const mentionItem: MentionItem = activeTab === "creators"
          ? { type: "creator", data: item as MentionCreator }
          : { type: "campaign", data: item as MentionCampaign };
        selectItem(mentionItem);
      }
      return true;
    }

    return false;
  }, [isOpen, close, activeTab, currentList, highlightIndex, selectItem]);

  return {
    isOpen,
    query,
    activeTab,
    setActiveTab,
    highlightIndex,
    setHighlightIndex,
    filteredCreators,
    filteredCampaigns,
    detectTrigger,
    selectItem,
    close,
    handleKeyDown,
  };
}
