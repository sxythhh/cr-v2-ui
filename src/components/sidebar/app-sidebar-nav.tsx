"use client";

import {
  IconWorld,
  IconFolder,
  IconTag,
  IconRouteAltRight,
  IconReceipt,
  IconUsers,
  IconPlugConnected,
  IconShieldCheck,
  IconKey,
  IconWebhook,
  IconBell,
  IconApps,
  IconGift,
} from "@tabler/icons-react";
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

// Wrap Tabler icons to match AnimatedIcon type
function wrapTabler(TablerIcon: typeof IconWorld): AnimatedIcon {
  const Wrapped: AnimatedIcon = ({ "data-hovered": _, ...props }) => (
    <TablerIcon {...(props as Record<string, unknown>)} />
  );
  Wrapped.displayName = TablerIcon.displayName;
  return Wrapped;
}

const Globe = wrapTabler(IconWorld);
const FolderIcon = wrapTabler(IconFolder);
const TagIcon = wrapTabler(IconTag);
const DiamondTurnRight = wrapTabler(IconRouteAltRight);
const Receipt = wrapTabler(IconReceipt);
const UsersIcon = wrapTabler(IconUsers);
const ShieldCheck = wrapTabler(IconShieldCheck);
const KeyIcon = wrapTabler(IconKey);
const WebhookIcon = wrapTabler(IconWebhook);
const BellIcon = wrapTabler(IconBell);
const AppsIcon = wrapTabler(IconApps);
const GiftIcon = wrapTabler(IconGift);
const IntegrationsIcon = wrapTabler(IconPlugConnected);

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
          { name: "Home", icon: Home, href: "/creator", exact: true, description: "Your creator dashboard." },
          { name: "For you", icon: Sparkle, href: "/creator/for-you", description: "Personalized campaign recommendations." },
          { name: "Discover", icon: Compass, href: "/creator/discover", description: "Browse available campaigns." },
          { name: "Campaigns", icon: Megaphone, href: "/creator/campaigns", description: "Campaigns you've joined." },
          { name: "Applications", icon: Paperclip, href: "/creator/applications", description: "Your campaign applications." },
          { name: "Submissions", icon: Submissions, href: "/creator/submissions", description: "Your content submissions." },
          { name: "Insights", icon: PieChart, href: "/creator/analytics", description: "Your performance metrics." },
          { name: "Payouts", icon: Payouts, href: "/creator/payouts", description: "Your earnings and payouts." },
          { name: "Notifications", icon: NotificationBell, href: "/creator/notifications", description: "Activity alerts and updates." },
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
        currentArea === "creator"
          ? walletCard
          : newsEmpty
            ? usageCard
            : undefined
      }
    />
  );
}
