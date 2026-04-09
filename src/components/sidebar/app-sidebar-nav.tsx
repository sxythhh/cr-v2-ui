"use client";

import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  SidebarNav,
  type SidebarNavAreas,
  type AnimatedIcon,
  type NavItemType,
} from "./sidebar-nav";
import { SidebarUsage } from "./sidebar-usage";
import { News } from "./news";
import { SidebarCustomizationProvider } from "./sidebar-customization-provider";
import { useSidebarCustomization, applyCustomization } from "@/hooks/use-sidebar-customization";
import { useSideNav } from "./sidebar-context";

// Animated icons
import { Hyperlink } from "./icons/hyperlink";
import { LinesY } from "./icons/lines-y";
import { CursorRays } from "./icons/cursor-rays";
import { User } from "./icons/user";
import { Gear } from "./icons/gear";
import { MoneyBag } from "./icons/money-bag";
import { PieChart } from "./icons/pie-chart";
import { Submissions } from "./icons/submissions";
import { Creators } from "./icons/creators";
import { ChatBubble } from "./icons/chat-bubble";
import { Robot } from "./icons/robot";
import { NotificationBell } from "./icons/notification-bell";
import { Home } from "./icons/home";
import { Brands } from "./icons/brands";
import { Megaphone } from "./icons/megaphone";
import { Paperclip } from "./icons/paperclip";
import { Payouts } from "./icons/payouts";
import { Sparkle } from "./icons/sparkle";
import { Compass } from "./icons/compass";
import { Contracts } from "./icons/contracts";
import { UsersIcon as UsersGroupIcon } from "./icons/users";
import { Help } from "./icons/help";
import { Trophy } from "./icons/trophy";

import { WorkspaceCard } from "./workspace-card";
import { SidebarWalletCard } from "./sidebar-wallet-card";



const HelpCircle: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
  <svg viewBox="0 0 14 14" fill="currentColor" {...(props as Record<string, unknown>)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M6.66667 0C2.98477 0 0 2.98477 0 6.66667C0 10.3486 2.98477 13.3333 6.66667 13.3333C10.3486 13.3333 13.3333 10.3486 13.3333 6.66667C13.3333 2.98477 10.3486 0 6.66667 0ZM6.66667 4.66667C6.41512 4.66667 6.19509 4.80573 6.08099 5.01434C5.9043 5.33737 5.49921 5.45601 5.17618 5.27933C4.85315 5.10264 4.73452 4.69755 4.9112 4.37452C5.24976 3.75554 5.90843 3.33333 6.66667 3.33333C7.6765 3.33333 8.37793 4.00428 8.57763 4.79267C8.77839 5.58524 8.47339 6.50866 7.5611 6.96481C7.42151 7.0346 7.33334 7.17727 7.33334 7.33333C7.33334 7.70152 7.03486 8 6.66667 8C6.29848 8 6.00001 7.70152 6.00001 7.33333C6.00001 6.67224 6.37352 6.06789 6.96481 5.77224C7.26798 5.62066 7.34585 5.35982 7.28512 5.12006C7.22333 4.87612 7.01888 4.66667 6.66667 4.66667ZM6.66667 10C7.03486 10 7.33333 9.70152 7.33333 9.33333C7.33333 8.96514 7.03486 8.66667 6.66667 8.66667C6.29848 8.66667 6 8.96514 6 9.33333C6 9.70152 6.29848 10 6.66667 10Z" />
  </svg>
);


const FilledBell: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
  <svg viewBox="0 0 12 14" fill="currentColor" {...(props as Record<string, unknown>)}>
    <path fillRule="evenodd" clipRule="evenodd" d="M6 0C3.40402 0 1.26405 2.03564 1.13441 4.62838L1.0148 7.0206C1.0102 7.11274 0.986514 7.20293 0.945254 7.28545L0.127322 8.92131C0.0435915 9.08877 0 9.27343 0 9.46066C0 10.1267 0.53995 10.6667 1.20601 10.6667H2.73335C3.04219 12.1882 4.38736 13.3333 6 13.3333C7.61264 13.3333 8.95781 12.1882 9.26665 10.6667H10.794C11.4601 10.6667 12 10.1267 12 9.46066C12 9.27343 11.9564 9.08877 11.8727 8.92131L11.0547 7.28545C11.0135 7.20293 10.9898 7.11274 10.9852 7.0206L10.8656 4.62839C10.7359 2.03564 8.59598 0 6 0ZM6 12C5.12919 12 4.38836 11.4435 4.1138 10.6667H7.8862C7.61164 11.4435 6.87081 12 6 12Z" />
  </svg>
);

const FilledFinance: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
  <svg viewBox="0 0 14 11" fill="currentColor" {...(props as Record<string, unknown>)}>
    <path d="M2 0C0.895431 0 0 0.895431 0 2V3.33333H13.3333V1.99983C13.3333 0.895158 12.4378 0 11.3333 0H2Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M0 8.66667V4.66667H13.3333V8.66667C13.3333 9.77124 12.4379 10.6667 11.3333 10.6667H2C0.89543 10.6667 0 9.77124 0 8.66667ZM3.33333 6C2.96514 6 2.66667 6.29848 2.66667 6.66667C2.66667 7.03486 2.96514 7.33333 3.33333 7.33333H5.33333C5.70152 7.33333 6 7.03486 6 6.66667C6 6.29848 5.70152 6 5.33333 6H3.33333Z" />
  </svg>
);

// Inline SVG icon wrappers matching AnimatedIcon type
function makeSvgIcon(paths: string, displayName: string): AnimatedIcon {
  const Icon: AnimatedIcon = ({ "data-hovered": _, className, ...props }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...(props as Record<string, unknown>)} dangerouslySetInnerHTML={{ __html: paths }} />
  );
  Icon.displayName = displayName;
  return Icon;
}

const Globe = makeSvgIcon('<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/>', "Globe");
const FolderIcon = makeSvgIcon('<path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2"/>', "FolderIcon");
const TagIcon = makeSvgIcon('<path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/><path d="M3 4.5a1.5 1.5 0 0 1 1.5-1.5h5.586a2 2 0 0 1 1.414.586l7.5 7.5a2 2 0 0 1 0 2.828l-5.172 5.172a2 2 0 0 1-2.828 0l-7.5-7.5A2 2 0 0 1 3 10.086V4.5z"/>', "TagIcon");
const DiamondTurnRight = makeSvgIcon('<path d="M3 17h4v4"/><path d="M7 17l10-10"/><path d="M13 7h4v4"/>', "DiamondTurnRight");
const Receipt = makeSvgIcon('<path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2l-2 2l-2-2l-2 2l-2-2l-3 2"/><path d="M14 8H9.5"/><path d="M14 12H9.5"/>', "Receipt");
const UsersIcon = makeSvgIcon('<path d="M9 7a4 4 0 1 0 0-8a4 4 0 0 0 0 8z" transform="translate(0 3)"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/>', "UsersIcon");
const ShieldCheck = makeSvgIcon('<path d="M12 3l8 4v5c0 5.25-3.5 9.74-8 11c-4.5-1.26-8-5.75-8-11V7l8-4z"/><path d="M9 12l2 2l4-4"/>', "ShieldCheck");
const KeyIcon = makeSvgIcon('<path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1-4.069 0l-3.602-3.602a6.043 6.043 0 0 1-1.643.235a6 6 0 1 1 5.612-8.204"/><path d="M16 9l2 2"/>', "KeyIcon");
const WebhookIcon = makeSvgIcon('<path d="M4.876 13.61A4 4 0 1 0 11 17h6"/><path d="M15.066 20.502A4 4 0 1 0 17 13H7"/><path d="M10.058 5.89A4 4 0 1 0 6 13h2"/>', "WebhookIcon");
const BellIcon = makeSvgIcon('<path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/>', "BellIcon");
const AppsIcon = makeSvgIcon('<path d="M4 4m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M14 4m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M4 14m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M14 14m0 1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/>', "AppsIcon");
const GiftIcon = makeSvgIcon('<path d="M3 8m0 1a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5a2.5 2.5 0 0 1 0 5"/>', "GiftIcon");
const IntegrationsIcon = makeSvgIcon('<path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1-5-5L7 12z"/><path d="M17 12l-5-5l1.5-1.5a3.536 3.536 0 1 1 5 5L17 12z"/><path d="M3 21l2.5-2.5"/><path d="M18.5 5.5L21 3"/><path d="M10 11l-2 2"/><path d="M13 14l-2 2"/>', "IntegrationsIcon");

const NAV_AREAS: SidebarNavAreas = {
  default: () => ({
    headerContent: (
      <WorkspaceCard />
    ),

    content: [
      {
        items: [
          { name: "Home", icon: Home, href: "/", exact: true, description: "Your dashboard overview and short links." },
          { name: "Campaigns", icon: Megaphone, href: "/campaigns", description: "Create and manage marketing campaigns." },
          { name: "Submissions", icon: Submissions, href: "/submissions", description: "Review and manage creator content submissions." },
          { name: "Creators", icon: Creators, href: "/creators", description: "Browse and manage your creator network." },
          { name: "Payouts", icon: Payouts, href: "/payouts", description: "Track earnings and process creator payments." },

          { name: "Insights", icon: PieChart, href: "/analytics", description: "Performance metrics across all campaigns." },

          { name: "Finance", icon: FilledFinance, href: "/finances", description: "Billing, invoices, and financial reports." },
          { name: "Notifications", icon: NotificationBell, href: "/notifications", description: "Activity alerts and updates." },
          { name: "Settings", icon: Gear, href: "/settings", description: "Workspace and account settings." },
          { name: "Help", icon: HelpCircle, href: "/help", description: "Support, docs, and academy." },
        ],
      },
    ],
  }),


  creator: () => ({
    content: [
      {
        items: [
          { name: "Dashboard", icon: Home, href: "/creator/dashboard", description: "Your creator dashboard." },
          { name: "For you", icon: Sparkle, href: "/creator/for-you", description: "Personalized campaign recommendations." },
          { name: "Discover", icon: Compass, href: "/creator/discover", description: "Browse available campaigns." },
          { name: "My clips", icon: Submissions, href: "/creator/submissions", description: "Your content submissions." },
          { name: "Insights", icon: PieChart, href: "/creator/analytics", description: "Your performance metrics." },
          { name: "Rewards", icon: Trophy, href: "/creator/rewards", description: "XP, tiers, quests, and streaks." },
          { name: "Community", icon: UsersGroupIcon, href: "/creator/community", description: "Creator community." },
          { name: "Help", icon: Help, href: "/creator/help", description: "Help and support." },
          { name: "Settings", icon: Gear, href: "/creator/settings", description: "Profile and account settings." },
        ],
      },
    ],
  }),

};

export function AppSidebarNav() {
  return (
    <SidebarCustomizationProvider>
      <AppSidebarNavInner />
    </SidebarCustomizationProvider>
  );
}

function AppSidebarNavInner() {
  const pathname = usePathname();
  const [newsEmpty, setNewsEmpty] = useState(false);
  const onNewsEmpty = useCallback(() => setNewsEmpty(true), []);
  const { getAreaOverride } = useSidebarCustomization();
  const { editMode } = useSideNav();

  const currentArea = useMemo(() => {
    if (pathname.startsWith("/program")) return "program";
    if (pathname === "/creator" || pathname.startsWith("/creator/")) return "creator";
    return "default";
  }, [pathname]);

  const walletCard = useMemo(() => <SidebarWalletCard />, []);
  const usageCard = useMemo(() => <SidebarUsage />, []);

  // Apply customization to the default area
  const customizedAreas = useMemo((): SidebarNavAreas => {
    const override = getAreaOverride("default");
    if (!override && !editMode) return NAV_AREAS;

    return {
      ...NAV_AREAS,
      default: () => {
        const base = NAV_AREAS.default();
        if (!override) return base;
        const customized = applyCustomization(
          base.content as { name?: string; items: { name: string; [key: string]: unknown }[] }[],
          override,
        );
        return {
          ...base,
          content: customized as typeof base.content,
        };
      },
    };
  }, [getAreaOverride, editMode]);

  return (
    <SidebarNav
      areas={customizedAreas}
      originalAreas={NAV_AREAS}
      currentArea={currentArea}
      newsContent={!newsEmpty ? <News onEmpty={onNewsEmpty} /> : undefined}
      bottom={
        newsEmpty
          ? usageCard
          : undefined
      }
    />
  );
}
