"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Home } from "./icons/home";
import { Creators } from "./icons/creators";
import { PieChart } from "./icons/pie-chart";
import { Gear } from "./icons/gear";
import { useSideNav } from "./sidebar-context";
import {
  Command,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
  CommandFooter,
} from "@/components/ui/command";

export function SearchCommand({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  const router = useRouter();
  const { searchOpen: open, setSearchOpen } = useSideNav();

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setSearchOpen(next);
      onOpenChange?.(next);
    },
    [setSearchOpen, onOpenChange],
  );

  const navigate = useCallback(
    (href: string) => {
      handleOpenChange(false);
      router.push(href);
    },
    [router, handleOpenChange],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <CommandDialogTrigger className="relative z-10 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-sidebar-text-muted">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11.3333 11.3327L8.69998 8.69934M9.99999 5.33268C9.99999 7.91001 7.91065 9.99935 5.33332 9.99935C2.75599 9.99935 0.666656 7.91001 0.666656 5.33268C0.666656 2.75535 2.75599 0.666016 5.33332 0.666016C7.91065 0.666016 9.99999 2.75535 9.99999 5.33268Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round"/></svg>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandPanel>
            <CommandList>
              <CommandGroup>
                <CommandGroupLabel>Pages</CommandGroupLabel>
                <CommandItem value="Home" onClick={() => navigate("/")}>
                  <Home className="size-4" />
                  Home
                  <CommandShortcut>H</CommandShortcut>
                </CommandItem>
                <CommandItem value="Creators" onClick={() => navigate("/creators")}>
                  <Creators className="size-4" />
                  Creators
                  <CommandShortcut>C</CommandShortcut>
                </CommandItem>
                <CommandItem value="Insights" onClick={() => navigate("/analytics")}>
                  <PieChart className="size-4" />
                  Insights
                  <CommandShortcut>A</CommandShortcut>
                </CommandItem>
                <CommandItem value="Settings" onClick={() => navigate("/settings")}>
                  <Gear className="size-4" />
                  Settings
                  <CommandShortcut>S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandGroupLabel>Actions</CommandGroupLabel>
                <CommandItem value="Create new campaign">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  Create new campaign
                </CommandItem>
                <CommandItem value="Create short link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15l6-6"/><path d="M11 6l.463-.536a5 5 0 0 1 7.071 7.072L18 13"/><path d="M13 18l-.397.534a5.068 5.068 0 0 1-7.127 0a4.972 4.972 0 0 1 0-7.071L6 11"/></svg>
                  Create short link
                </CommandItem>
                <CommandItem value="Invite team member">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0"/><path d="M6 21v-2a4 4 0 0 1 4-4h3"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>
                  Invite team member
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <span>Navigate with arrow keys</span>
            <span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">ESC</kbd>
              {" "}to close
            </span>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
