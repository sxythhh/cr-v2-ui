"use client";

import { cn } from "@/lib/utils";
import { useProximityHover } from "@/hooks/use-proximity-hover";
import { springs } from "@/lib/springs";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CSSProperties,
  PropsWithChildren,
  RefObject,
  SVGProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ChevronDown, Menu, X } from "lucide-react";
// useTheme removed — bottom bar toggles directly via DOM
import { Hyperlink } from "@/components/sidebar/icons/hyperlink";
import { PieChart } from "@/components/sidebar/icons/pie-chart";
import { Creators } from "@/components/sidebar/icons/creators";
import { Compass } from "@/components/sidebar/icons/compass";
import { Megaphone } from "@/components/sidebar/icons/megaphone";
import { ChatBubble } from "@/components/sidebar/icons/chat-bubble";
import { Paperclip } from "@/components/sidebar/icons/paperclip";
import { User } from "@/components/sidebar/icons/user";
import { Brands } from "@/components/sidebar/icons/brands";
import { Sparkle } from "@/components/sidebar/icons/sparkle";
import { Submissions } from "@/components/sidebar/icons/submissions";
import { Gear } from "@/components/sidebar/icons/gear";

// ── useScroll hook (from @dub/ui) ───────────────────────────────────────────

function useScroll(
  threshold: number,
  { container }: { container?: RefObject<HTMLElement | null> } = {}
) {
  const [scrolled, setScrolled] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(
      (container?.current ? container.current.scrollTop : window.scrollY) >
        threshold
    );
  }, [threshold, container]);

  useEffect(() => {
    const element = container?.current ?? window;
    element.addEventListener("scroll", onScroll);
    return () => element.removeEventListener("scroll", onScroll);
  }, [onScroll, container]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
}

// ── Grid pattern (from @dub/ui) ─────────────────────────────────────────────

function GridPattern({
  cellSize = 12,
  strokeWidth = 1,
  patternOffset = [0, 0],
  className,
}: {
  cellSize?: number;
  strokeWidth?: number;
  patternOffset?: [number, number];
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 text-black/10",
        className
      )}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          x={patternOffset[0] - 1}
          y={patternOffset[1] - 1}
          width={cellSize}
          height={cellSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect fill={`url(#grid-${id})`} width="100%" height="100%" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────────────────────

export type NavTheme = "light" | "dark";

export const NavContext = createContext<{ theme: NavTheme }>({
  theme: "light",
});

// ── Logo + Wordmark ─────────────────────────────────────────────────────────

function DubWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col", className)} style={{ gap: "0.5px" }}>
      <span className="font-inter text-[14px] font-semibold leading-[14px] tracking-[-0.02em]">Content</span>
      <span className="font-inter text-[14px] font-semibold leading-[14px] tracking-[-0.02em]">Rewards</span>
    </div>
  );
}

function DubLogo({ className }: { className?: string }) {
  return (
    <svg width="24" height="27" viewBox="0 0 30 34" fill="none" className={className}>
      <g clipPath="url(#cr_nav_clip)">
        <path d="M3.168 10.936l2.074-3.205.734 3.875 3.352 1.226-3.051 1.983-.002 3.962-2.621-2.65-3.353 1.223 1.433-3.621L.663 10.523l3.505.413z" fill="currentColor"/>
        <path d="M1.733 25.324L.301 22.61l3.353.917 2.62-1.988.001 2.971 3.052 1.487-3.352.92-.734 2.906-2.074-2.403-3.505.31 2.07-2.405z" fill="currentColor"/>
        <path d="M13.157 32.073l-2.449-.217 1.829-1.387-.511-2.026 2.133 1.035 2.134-1.035-.511 2.026 1.83 1.387-2.45.217-.999 1.892-1.006-1.892z" fill="currentColor"/>
        <path d="M25.652 27.42l-1.777 2.403-.63-2.907-2.873-.919 2.616-1.487.001-2.971 2.246 1.988 2.874-.918-1.228 2.715 1.775 2.405-3.005-.31z" fill="currentColor"/>
        <path d="M27.967 13.73l1.432 3.62-3.353-1.223-2.62 2.65-.002-3.962-3.051-1.983 3.352-1.226.734-3.875 2.073 3.205 3.506-.413-2.071 3.207z" fill="currentColor"/>
        <path d="M16.855 3.704l4.898.49-3.659 3.12 1.023 4.559-4.267-2.329-4.266 2.329 1.021-4.56-3.659-3.12 4.899-.489L14.85-.553l2.005 4.257z" fill="currentColor"/>
      </g>
      <defs><clipPath id="cr_nav_clip"><rect width="29.7" height="33.41" fill="white"/></clipPath></defs>
    </svg>
  );
}

// ── Nav items ───────────────────────────────────────────────────────────────

type NavItem = {
  name: string;
  href?: string;
  content?: React.ComponentType<{ domain: string }>;
  childItems?: NavItemChild[];
  segments: string[];
};

type NavItemChild = {
  title: string;
  description?: string;
  href: string;
};

// ── Dropdown content components ─────────────────────────────────────────────

function ProductContent({ domain }: { domain: string }) {
  const products = [
    {
      title: "Dub Links",
      description: "Short links with superpowers for modern marketing teams.",
      href: "/links",
      color: "#f4950c",
      icon: <Hyperlink className="size-5 text-page-text-muted" />,
    },
    {
      title: "Dub Analytics",
      description: "Powerful analytics delivered instantly.",
      href: "/analytics",
      color: "#36D78F",
      icon: <PieChart className="size-5 text-page-text-muted" />,
    },
    {
      title: "Dub Partners",
      description: "Grow your revenue on auto-pilot with partnerships.",
      href: "/partners",
      color: "#818cf8",
      icon: <Creators className="size-5 text-page-text-muted" />,
    },
  ];

  const largeLinks = [
    {
      title: "Dub Integrations",
      description: "Enhance your short links",
      href: "/integrations",
    },
    {
      title: "Dub API",
      description: "Unlock further capabilities",
      href: "/docs/api-reference/introduction",
    },
  ];

  return (
    <div className="grid w-[1020px] grid-cols-1 gap-4 p-4">
      <div className="grid grid-cols-3 gap-4">
        {products.map(({ title, description, href, icon }) => (
          <NavigationMenuPrimitive.Link asChild key={title}>
            <Link
              href={`https://dub.co${href}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] transition-colors duration-150 hover:bg-foreground/[0.06] dark:border-white/[0.04] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <div className="relative p-5">
                {icon}
                <span className="mt-3 block text-sm font-medium tracking-[-0.02em] text-page-text">
                  {title}
                </span>
                <p className="mt-2 max-w-56 text-sm tracking-[-0.02em] text-page-text-muted">
                  {description}
                </p>
              </div>
            </Link>
          </NavigationMenuPrimitive.Link>
        ))}
      </div>
      <div className="grid grow grid-cols-2 gap-4">
        {largeLinks.map(({ title, description, href }) => (
          <NavigationMenuPrimitive.Link asChild key={title}>
            <Link
              href={`https://dub.co${href}`}
              className="group relative flex flex-col justify-center rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] transition-colors duration-150 hover:bg-foreground/[0.06] dark:border-white/[0.04] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <div className="relative flex items-center justify-between px-5 py-4">
                <div>
                  <span className="text-sm font-medium leading-none tracking-[-0.02em] text-page-text">
                    {title}
                  </span>
                  <p className="mt-1 text-sm tracking-[-0.02em] text-page-text-muted">
                    {description}
                  </p>
                </div>
              </div>
            </Link>
          </NavigationMenuPrimitive.Link>
        ))}
      </div>
    </div>
  );
}

function SolutionsContent({ domain }: { domain: string }) {
  const mainLinks = [
    {
      title: "Marketing Attribution",
      description: "Easily track and measure marketing impact",
      href: "/analytics",
      icon: <Compass className="relative size-5 text-page-text-muted" />,
    },
    {
      title: "Content Creators",
      description: "Intelligent audience insights and link tracking",
      href: "/solutions/creators",
      icon: <Megaphone className="relative size-5 text-page-text-muted" />,
    },
    {
      title: "Affiliate Management",
      description: "Manage affiliates and automate payouts",
      href: "/partners",
      icon: <Creators className="relative size-5 text-page-text-muted" />,
    },
  ];

  const sdks = [
    { title: "TypeScript", href: "/sdks/typescript" },
    { title: "Python", href: "/sdks/python" },
    { title: "Go", href: "/sdks/go" },
    { title: "Ruby", href: "/sdks/ruby" },
    { title: "PHP", href: "/sdks/php" },
  ];

  return (
    <div className="grid w-[1020px] grid-cols-[minmax(0,1fr),0.4fr] divide-x divide-foreground/[0.06]">
      <div className="flex h-full flex-col p-4">
        <p className="mb-4 ml-2 text-xs uppercase text-page-text-muted">
          Use case
        </p>
        <div className="grid grow grid-cols-3 gap-4">
          {mainLinks.map(({ title, description, href, icon }) => (
            <NavigationMenuPrimitive.Link asChild key={title}>
              <Link
                href={`https://dub.co${href}`}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-5 py-4 transition-colors duration-150 hover:bg-foreground/[0.06] dark:border-white/[0.04] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                )}
              >
                {icon}
                <div className="relative mt-auto">
                  <span className="text-sm font-medium text-page-text">
                    {title}
                  </span>
                  <p className="mt-2 text-xs text-page-text-muted">
                    {description}
                  </p>
                </div>
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}
        </div>
      </div>
      <div className="px-6 py-4">
        <p className="mb-2 text-xs uppercase text-page-text-muted">
          SDKs
        </p>
        <DropdownLinkList
          items={sdks.map((s) => ({
            title: s.title,
            href: s.href,
            icon: (
              <div className="shrink-0 rounded-[10px] border border-foreground/[0.06] bg-foreground/[0.06] p-1">
                <div className="flex size-5 items-center justify-center text-xs font-bold text-page-text-muted">
                  {s.title.slice(0, 2)}
                </div>
              </div>
            ),
            showArrow: true,
          }))}
        />
      </div>
    </div>
  );
}

function ResourcesContent({ domain }: { domain: string }) {
  const mainLinks = [
    {
      title: "Help Center",
      description: "Answers to your questions",
      href: "/help",
      icon: (
        <svg className="relative size-10" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="5" width="47" height="49" rx="5" className="fill-[#E4E5E7] dark:fill-white/[0.04]"/>
          <rect x="3" y="3" width="47" height="49" rx="5" className="fill-[#F5F5F5] stroke-[#E0E0E0] dark:fill-white/[0.06] dark:stroke-white/[0.08]" strokeWidth="0.75"/>
          <path d="M3.4 8C3.4 5.46 5.46 3.4 8 3.4H45C47.54 3.4 49.6 5.46 49.6 8V12.5H3.4V8Z" className="fill-[#F5F5F5] dark:fill-white/[0.04]"/>
          <rect x="7" y="16" width="39" height="23" rx="3" fill="#E87C0A"/>
          <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z'/%3E%3C/svg%3E" x="17.5" y="18.5" width="18" height="18"/>
          <rect x="7" y="42.5" width="39" height="6" rx="3" className="fill-[#F5F5F5] dark:fill-white/[0.06]"/>
          <rect x="10.5" y="44.5" width="16" height="2" rx="1" className="fill-[#D4D4D4] dark:fill-white/[0.1]"/>
        </svg>
      ),
    },
    {
      title: "Discover Campaigns",
      description: "Browse opportunities posted by brands",
      href: "/creator/discover",
      icon: (
        <svg className="relative size-10 text-page-text-muted" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_dc)">
            <mask id="mask0_dc" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="56" height="56">
              <path d="M0 0H56V56H0V0Z" fill="white"/>
            </mask>
            <g mask="url(#mask0_dc)">
              <path d="M50.1667 46.9583H45.5V9.625H50.1667C50.7855 9.625 51.379 9.87083 51.8166 10.3084C52.2542 10.746 52.5 11.3395 52.5 11.9583V44.625C52.5 45.2438 52.2542 45.8373 51.8166 46.2749C51.379 46.7125 50.7855 46.9583 50.1667 46.9583Z" fill="currentColor" fillOpacity="0.15"/>
              <path d="M6.125 46.9583H10.7917V9.625H6.125C5.50616 9.625 4.91267 9.87083 4.47509 10.3084C4.0375 10.746 3.79167 11.3395 3.79167 11.9583V44.625C3.79167 45.2438 4.0375 45.8373 4.47509 46.2749C4.91267 46.7125 5.50616 46.9583 6.125 46.9583Z" fill="currentColor" fillOpacity="0.15"/>
              <path d="M43.4583 4.95834C44.0772 4.95834 44.6707 5.20418 45.1082 5.64176C45.5458 6.07935 45.7917 6.67284 45.7917 7.29168V49.2917C45.7917 49.9105 45.5458 50.504 45.1082 50.9416C44.6707 51.3792 44.0772 51.625 43.4583 51.625H13.125C12.5062 51.625 11.9127 51.3792 11.4751 50.9416C11.0375 50.504 10.7917 49.9105 10.7917 49.2917V7.29168C10.7917 6.67284 11.0375 6.07935 11.4751 5.64176C11.9127 5.20418 12.5062 4.95834 13.125 4.95834H43.4583Z" className="fill-[#F5F5F5] dark:fill-white/[0.06]"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M43.4583 4.66667C44.1545 4.66667 44.8222 4.94323 45.3145 5.43552C45.8068 5.9278 46.0833 6.59548 46.0833 7.29167V49.2917C46.0833 49.9879 45.8068 50.6555 45.3145 51.1478C44.8222 51.6401 44.1545 51.9167 43.4583 51.9167H13.125C12.4288 51.9167 11.7611 51.6401 11.2688 51.1478C10.7766 50.6555 10.5 49.9879 10.5 49.2917V7.29167C10.5 6.59548 10.7766 5.9278 11.2688 5.43552C11.7611 4.94323 12.4288 4.66667 13.125 4.66667H43.4583ZM45.5 7.29167C45.5 6.75019 45.2849 6.23088 44.902 5.848C44.5191 5.46511 43.9998 5.25001 43.4583 5.25001H13.125C12.5835 5.25001 12.0642 5.46511 11.6813 5.848C11.2984 6.23088 11.0833 6.75019 11.0833 7.29167V49.2917C11.0833 50.4198 11.998 51.3333 13.125 51.3333H43.4583C43.9998 51.3333 44.5191 51.1182 44.902 50.7353C45.2849 50.3525 45.5 49.8332 45.5 49.2917V7.29167Z" className="fill-[#E0E0E0] dark:fill-white/[0.08]"/>
              <path d="M14.2917 11.4583C14.2917 9.80149 15.6348 8.45834 17.2917 8.45834H39.2917C40.9485 8.45834 42.2917 9.80149 42.2917 11.4583V35.7917C42.2917 37.4485 40.9485 38.7917 39.2917 38.7917H17.2917C15.6348 38.7917 14.2917 37.4485 14.2917 35.7917V11.4583Z" fill="#D0AA00"/>
              <image href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' fill='white'%3E%3Cpath d='M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z'/%3E%3C/svg%3E" x="19.3" y="14.6" width="18" height="18"/>
              <path d="M14.5 42.9034C14.5 42.4084 14.9012 42.0071 15.3962 42.007L40.6038 42.0002C41.0985 42.0001 41.5 42.4015 41.5 42.8966C41.5 43.3916 41.0988 43.7929 40.6038 43.793L15.3966 43.7998C14.9015 43.7999 14.5 43.3985 14.5 42.9034ZM14.5 47.1C14.5 46.6029 14.9029 46.2 15.4 46.2H37.9C38.3971 46.2 38.8 46.6029 38.8 47.1C38.8 47.5971 38.3971 48 37.9 48H15.4C14.9029 48 14.5 47.5971 14.5 47.1Z" fill="currentColor" fillOpacity="0.3"/>
            </g>
          </g>
          <defs>
            <clipPath id="clip0_dc">
              <rect width="56" height="56" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
    },
  ];

  const company: DropdownLinkItem[] = [
    {
      title: "About",
      description: "Company, values, and team",
      href: "/about",
      icon: (
        <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
          <User className="size-4 text-page-text-muted" />
        </div>
      ),
    },
    {
      title: "Careers",
      description: "Join our global, remote team",
      href: "/careers",
      icon: (
        <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
          <Brands className="size-4 text-page-text-muted" />
        </div>
      ),
    },
    {
      title: "Brand Guidelines",
      description: "Logos, wordmark, etc.",
      href: "/brand",
      icon: (
        <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
          <Sparkle className="size-4 text-page-text-muted" />
        </div>
      ),
    },
    {
      title: "Contact",
      description: "Reach out to support or sales",
      href: "/contact",
      icon: (
        <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
          <ChatBubble className="size-4 text-page-text-muted" />
        </div>
      ),
    },
  ];

  const updates: DropdownLinkItem[] = [
    {
      title: "Blog",
      description: "Insights and stories",
      href: "/blog",
      icon: (
        <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
          <Megaphone className="size-4 text-page-text-muted" />
        </div>
      ),
    },
    {
      title: "Changelog",
      description: "Releases and updates",
      href: "/changelog",
      icon: (
        <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
          <Submissions className="size-4 text-page-text-muted" />
        </div>
      ),
    },
  ];

  return (
    <div className="w-[1020px]">
    <div className="grid grid-cols-[0.9fr,0.55fr,0.55fr] divide-x divide-foreground/[0.06]">
      {/* Explore column */}
      <div className="flex h-full flex-col p-4">
        <p className="mb-4 ml-2 text-xs uppercase text-page-text-muted">
          Explore
        </p>
        <div className="grid grid-cols-2 gap-4">
          {mainLinks.map(({ title, description, href, icon }) => (
            <NavigationMenuPrimitive.Link asChild key={title}>
              <Link
                href={title === "Discover Campaigns" || title === "Help Center" ? href : `https://dub.co${href}`}
                className={cn(
                  "group relative flex items-center gap-4 overflow-hidden rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-5 py-5 transition-colors duration-150 hover:bg-foreground/[0.06] dark:border-white/[0.04] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                )}
              >
                <div className="shrink-0">{icon}</div>
                <div>
                  <span className="text-sm font-medium text-page-text">
                    {title}
                  </span>
                  <p className="mt-1 text-xs text-page-text-muted">
                    {description}
                  </p>
                </div>
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}
        </div>
      </div>

      {/* Company column */}
      <div className="px-6 py-4">
        <p className="mb-2 text-xs uppercase text-page-text-muted">
          Company
        </p>
        <DropdownLinkList items={company} />
      </div>

      {/* Updates column */}
      <div className="px-6 py-4">
        <p className="mb-2 text-xs uppercase text-page-text-muted">
          Updates
        </p>
        <DropdownLinkList items={updates} />
      </div>
    </div>

    {/* Bottom bar — role selector + appearance */}
    <ResourcesBottomBar />
  </div>
  );
}

// ── Resources Bottom Bar ────────────────────────────────────────────────────

const ROLES = ["Creator", "Brand", "Agency"] as const;
type Role = (typeof ROLES)[number];

function ResourcesBottomBar() {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === "undefined") return "Creator";
    return (localStorage.getItem("user-role") as Role) || "Creator";
  });
  const [roleOpen, setRoleOpen] = useState(false);

  const handleRoleSelect = (r: Role) => {
    setRole(r);
    setRoleOpen(false);
    localStorage.setItem("user-role", r);
    // Navigate to role-specific page
    const routes: Record<Role, string> = {
      Creator: "/creator/discover",
      Brand: "/",
      Agency: "/",
    };
    window.location.href = routes[r];
  };

  const [mode, setModeLocal] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as "light" | "dark" | "system") || "light";
  });

  const setMode = (m: "light" | "dark" | "system") => {
    setModeLocal(m);
    localStorage.setItem("theme", m);
    const isDark = m === "dark" || (m === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    // Directly toggle class — no dependency on context
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Notify ThemeProvider to sync state
    window.dispatchEvent(new Event("theme-changed"));
  };

  const modes: { key: "light" | "dark" | "system"; title: string; icon: React.ReactNode }[] = [
    {
      key: "light",
      title: "Light",
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v1M8 14v1M3.05 3.05l.707.707M12.243 12.243l.707.707M1 8h1M14 8h1M3.05 12.95l.707-.707M12.243 3.757l.707-.707" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/></svg>,
    },
    {
      key: "dark",
      title: "Dark",
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8.5A6 6 0 1 1 7.5 2a4.5 4.5 0 0 0 6.5 6.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      key: "system",
      title: "System",
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 14h5M8 11v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
    },
  ];

  return (
    <div className="flex items-center justify-between border-t border-foreground/[0.06] bg-neutral-50 px-5 py-2.5 dark:border-white/[0.06] dark:bg-white/[0.03]" style={{ borderRadius: "0 0 20px 20px" }} onPointerDown={(e) => e.stopPropagation()}>
      <div className="relative flex items-center gap-2">
        <span className="text-[13px] font-medium text-page-text-muted">I&apos;m a</span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRoleOpen(!roleOpen); }}
          className="flex items-center gap-1.5 rounded-lg border border-foreground/[0.06] bg-white px-3 py-1.5 text-[13px] font-medium tracking-[-0.02em] text-page-text transition-colors hover:bg-foreground/[0.04] dark:border-white/[0.06] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
        >
          {role}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn("transition-transform", roleOpen && "rotate-180")}><path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {roleOpen && (
          <div className="absolute bottom-full left-8 mb-1.5 overflow-hidden rounded-lg border border-foreground/[0.06] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:border-white/[0.06] dark:bg-[#1a1a1a] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRoleSelect(r); }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-[13px] font-medium transition-colors",
                  r === role
                    ? "bg-foreground/[0.06] text-page-text"
                    : "text-page-text-muted hover:bg-foreground/[0.04]",
                )}
              >
                {r === role && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {r !== role && <div className="w-3" />}
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[13px] font-medium text-page-text-muted">Appearance</span>
        <div className="flex items-center gap-0.5 rounded-lg border border-foreground/[0.06] bg-white p-0.5 dark:border-white/[0.06] dark:bg-white/[0.04]">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMode(m.key); }}
              title={m.title}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-all",
                mode === m.key
                  ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                  : "text-page-text-muted hover:text-page-text",
              )}
            >
              {m.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Nav items config ────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  {
    name: "Product",
    content: ProductContent,
    segments: ["/links", "/analytics", "/partners", "/integrations", "/compare", "/features"],
  },
  {
    name: "Solutions",
    content: SolutionsContent,
    segments: ["/solutions", "/sdks"],
  },
  {
    name: "Resources",
    content: ResourcesContent,
    segments: ["/help", "/docs", "/about", "/careers", "/brand", "/blog", "/changelog", "/contact"],
  },
];

// ── Button variants (from @dub/ui) ──────────────────────────────────────────

const buttonVariantStyles = {
  primary:
    "border-black bg-black text-white hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200",
  secondary:
    "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 focus-visible:border-neutral-400 outline-none",
};

// ── Nav item class ──────────────────────────────────────────────────────────

const navItemClassName = cn(
  "relative z-[1] group/item flex items-center rounded-md px-4 py-2 text-sm rounded-lg font-medium font-inter tracking-[-0.02em] text-neutral-700 hover:text-neutral-900 transition-colors",
  "dark:text-white/90 dark:hover:text-white",
);

// ── Nav search data ──────────────────────────────────────────────────────────

const SEARCH_NAV_ITEMS = [
  { icon: "🔌", label: "Integrations" }, { icon: "📊", label: "Reports" },
  { icon: "⚙️", label: "Settings" }, { icon: "👥", label: "People" },
  { icon: "🏢", label: "Companies" }, { icon: "💼", label: "Deals" },
  { icon: "📋", label: "Lists" }, { icon: "🔄", label: "Workflows" },
  { icon: "📧", label: "Email & Calendar" }, { icon: "📱", label: "Apps" },
  { icon: "🎓", label: "Academy" }, { icon: "📖", label: "Documentation" },
  { icon: "🔑", label: "API Reference" }, { icon: "💬", label: "Community" },
  { icon: "🎧", label: "Support" }, { icon: "📝", label: "Changelog" },
  { icon: "🏠", label: "Home" }, { icon: "🔔", label: "Notifications" },
];

const SEARCH_HELP_ARTICLES = [
  { title: "Getting started with Content Rewards", desc: "A step-by-step guide to setting up your workspace and inviting your team." },
  { title: "Understanding objects and records", desc: "Learn what objects and records are and how they organize your data." },
  { title: "Creating and managing campaigns", desc: "How to create, configure, and manage campaigns from start to finish." },
  { title: "Setting up creator payouts", desc: "Configure payout methods, schedules, and automate creator payments." },
  { title: "Workflow automations guide", desc: "Build powerful automations to streamline your team's processes." },
  { title: "Email sync and calendar integration", desc: "Connect your email and calendar to automatically log communications." },
  { title: "Building reports and dashboards", desc: "Create visual reports to track metrics and share insights." },
  { title: "Using AI features", desc: "Leverage AI-powered attributes, enrichment, and smart suggestions." },
  { title: "Privacy, permissions, and roles", desc: "Manage access controls, user roles, and data visibility settings." },
  { title: "Keyboard shortcuts reference", desc: "Speed up your workflow with the full list of keyboard shortcuts." },
];

function BookIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 1.5h3a1 1 0 0 1 1 1v8a.75.75 0 0 0-.75-.75H2A.5.5 0 0 1 1.5 9.25V2A.5.5 0 0 1 2 1.5Z" stroke="currentColor" strokeWidth="1" />
      <path d="M10 1.5H7a1 1 0 0 0-1 1v8a.75.75 0 0 1 .75-.75H10a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

// ── Search results with proximity hover ──────────────────────────────────────

function SearchResults({ navToShow, helpToShow, totalItems, activeTab, filteredNavCount, filteredHelpCount, onSetTab, onClose }: {
  navToShow: typeof SEARCH_NAV_ITEMS;
  helpToShow: typeof SEARCH_HELP_ARTICLES;
  totalItems: number;
  activeTab: "all" | "navigation" | "help";
  filteredNavCount: number;
  filteredHelpCount: number;
  onSetTab: (t: "all" | "navigation" | "help") => void;
  onClose: () => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem } =
    useProximityHover(listRef);

  let itemIdx = 0;

  return (
    <div ref={listRef} className="relative max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: "none" }} {...handlers}>
      {/* Proximity hover highlight */}
      <AnimatePresence>
        {activeIndex !== null && itemRects[activeIndex] && (
          <motion.div
            key={sessionRef.current}
            layoutId={`search-hover-${sessionRef.current}`}
            className="pointer-events-none absolute rounded-xl bg-foreground/[0.06]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: itemRects[activeIndex].left,
              y: itemRects[activeIndex].top,
              width: itemRects[activeIndex].width,
              height: itemRects[activeIndex].height,
            }}
            exit={{ opacity: 0 }}
            transition={springs.fast}
          />
        )}
      </AnimatePresence>

      {totalItems === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-page-text-muted">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="text-sm font-medium">No results found</span>
        </div>
      )}

      {/* Navigation */}
      {navToShow.length > 0 && (
        <div className="px-2 pt-2">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[12px] font-semibold tracking-[-0.02em] text-page-text-muted">Navigation</span>
            {activeTab === "all" && filteredNavCount > 5 && (
              <button type="button" onClick={() => onSetTab("navigation")} className="cursor-pointer text-[12px] font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
                See more ({filteredNavCount}) →
              </button>
            )}
          </div>
          {navToShow.map((item) => {
            const thisIdx = itemIdx++;
            return (
              <div
                key={item.label}
                ref={(el) => registerItem(thisIdx, el)}
                className="relative z-[1] flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2"
                onClick={onClose}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-[13px]">{item.icon}</span>
                <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Help center */}
      {helpToShow.length > 0 && (
        <div className="px-2 pb-2 pt-1">
          {navToShow.length > 0 && <div className="mx-2 my-1 border-t border-border" />}
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-[12px] font-semibold tracking-[-0.02em] text-page-text-muted">Browse help center</span>
            {activeTab === "all" && filteredHelpCount > 4 && (
              <button type="button" onClick={() => onSetTab("help")} className="cursor-pointer text-[12px] font-medium tracking-[-0.02em] text-page-text-muted transition-colors hover:text-page-text">
                See more ({filteredHelpCount}) →
              </button>
            )}
          </div>
          {helpToShow.map((article) => {
            const thisIdx = itemIdx++;
            return (
              <div
                key={article.title}
                ref={(el) => registerItem(thisIdx, el)}
                className="relative z-[1] flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5"
                onClick={onClose}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-page-text-muted">
                  <BookIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="text-[14px] font-medium tracking-[-0.02em] text-page-text">{article.title}</span>
                  <p className="mt-0.5 truncate text-[12px] font-medium tracking-[-0.02em] text-page-text-muted">{article.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── NavSearch — morphing command palette ─────────────────────────────────────

function NavSearch() {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "navigation" | "help">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.toLowerCase();
  const filteredNav = SEARCH_NAV_ITEMS.filter((n) => n.label.toLowerCase().includes(q));
  const filteredHelp = SEARCH_HELP_ARTICLES.filter((a) => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));

  const navToShow = activeTab === "help" ? [] : activeTab === "navigation" ? filteredNav : filteredNav.slice(0, 5);
  const helpToShow = activeTab === "navigation" ? [] : activeTab === "help" ? filteredHelp : filteredHelp.slice(0, 4);
  const totalItems = navToShow.length + helpToShow.length;

  const showDropdown = focused && query.trim().length > 0;


  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ⌘K + Escape + arrow keys
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (focused) { setFocused(false); inputRef.current?.blur(); }
        else inputRef.current?.focus();
      }
      if (e.key === "Escape" && focused) {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [focused]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setFocused(false); inputRef.current?.blur(); }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div
        className={cn(
          "flex h-9 w-[380px] items-center gap-2 border bg-card-bg/60 px-2 rounded-[10px] backdrop-blur-sm",
          focused
            ? "border-[#FF8003]"
            : "border-border",
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-page-text-muted">
          <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search help"
          className="flex-1 bg-transparent text-sm font-medium tracking-[-0.02em] text-page-text outline-none placeholder:text-page-text-muted"
        />
        <div className="flex shrink-0 items-center gap-1">
          <kbd className="flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-xs font-semibold text-page-text-muted shadow-[0_1px_0_1px] shadow-border" style={{ borderWidth: "1px 1px 2px 1px", borderStyle: "solid" }}>⌘</kbd>
          <kbd className="flex h-[22px] min-w-[22px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-xs font-medium text-page-text-muted shadow-[0_1px_0_1px] shadow-border" style={{ borderWidth: "1px 1px 2px 1px", borderStyle: "solid" }}>K</kbd>
        </div>
      </div>

      {/* Dropdown command palette */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-2xl border border-foreground/[0.06] bg-white shadow-[0_16px_70px_rgba(0,0,0,0.15)] dark:border-white/[0.06] dark:bg-[#111111]"
          >
            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-border px-4 py-2">
              {(["all", "navigation", "help"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium tracking-[-0.02em] transition-colors",
                    activeTab === tab
                      ? "bg-foreground text-background"
                      : "text-page-text-muted hover:bg-foreground/[0.06] hover:text-page-text",
                  )}
                >
                  {tab === "all" ? "All" : tab === "navigation" ? "Navigation" : "Help Center"}
                </button>
              ))}
            </div>

            {/* Results with proximity hover */}
            <SearchResults
              navToShow={navToShow}
              helpToShow={helpToShow}
              totalItems={totalItems}
              activeTab={activeTab}
              filteredNavCount={filteredNav.length}
              filteredHelpCount={filteredHelp.length}
              onSetTab={setActiveTab}
              onClose={() => setFocused(false)}
            />

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-4 py-2">
              <span className="text-[11px] font-medium text-page-text-muted">↑↓ Navigate</span>
              <span className="text-[11px] font-medium text-page-text-muted">↵ Open</span>
              <span className="text-[11px] font-medium text-page-text-muted">esc Close</span>
              <div className="ml-1 flex items-center gap-1">
                <kbd className="flex h-[20px] min-w-[20px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-[10px] font-semibold text-page-text-muted" style={{ borderWidth: "1px 1px 2px 1px" }}>⌘</kbd>
                <kbd className="flex h-[20px] min-w-[20px] items-center justify-center rounded-md border border-border bg-card-bg px-1 text-[10px] font-medium text-page-text-muted" style={{ borderWidth: "1px 1px 2px 1px" }}>K</kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Nav Component ──────────────────────────────────────────────────────

export function DubNav({
  theme = "light",
  transparent = false,
}: {
  theme?: NavTheme;
  transparent?: boolean;
}) {
  const layoutGroupId = useId();
  const scrolled = useScroll(40);
  const pathname = usePathname();

  return (
    <NavContext.Provider value={{ theme }}>
      <LayoutGroup id={layoutGroupId}>
        <div
          className={cn(
            "sticky inset-x-0 top-0 z-30 w-full transition-all",
            theme === "dark" && "dark"
          )}
        >
          {/* Scrolled background */}
          <div
            className={cn(
              "absolute inset-0 block border-b border-foreground/[0.06] transition-all duration-500 ease-out",
              !transparent && !scrolled && "bg-white dark:bg-[#111111]",
              scrolled &&
                "bg-white/75 backdrop-blur-lg dark:bg-[rgba(17,17,17,0.85)]"
            )}
          />
          <div className={cn("relative mx-auto w-full max-w-screen-xl px-3 lg:px-10")}>
            <div className="flex h-14 items-center gap-6">
              {/* Logo */}
              <div className="shrink-0">
                <Link className="block w-fit py-2 pr-2" href="https://dub.co/home">
                  <div className="flex items-center gap-2">
                    <DubLogo className="text-page-text" />
                    <DubWordmark className="text-page-text" />
                  </div>
                </Link>
              </div>

              {/* Desktop navigation */}
              <NavItemsList pathname={pathname} />

              {/* Spacer */}
              <div className="hidden flex-1 lg:block" />

              {/* Auth buttons */}
              <div className="hidden items-center gap-2 lg:flex">
                {/* Search help — morphing input */}
                <NavSearch />
                <Link
                  href="https://app.dub.co/login"
                  className={cn(
                    "flex h-9 items-center rounded-lg border px-4 text-sm transition-all",
                    buttonVariantStyles.secondary,
                    "dark:border-white/[0.06] dark:bg-[#111111] dark:text-white dark:hover:bg-neutral-900"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="https://app.dub.co/register"
                  className="flex h-9 items-center rounded-lg px-4 text-sm font-semibold tracking-[-0.02em] text-[#FCFCFB] transition-opacity hover:opacity-90"
                  style={{
                    fontFamily: "var(--font-abc-oracle), sans-serif",
                    background: "#FF8003",
                    borderTop: "1px solid rgba(255,160,50,0.5)",
                    boxShadow: "inset 0px 1.3px 2px 1px rgba(255,255,255,0.25), inset 0px -1px 1px 0px rgba(0,0,0,0.1)",
                  }}
                >
                  Sign up
                </Link>
              </div>

              {/* Mobile nav */}
              <MobileNav theme={theme} />
            </div>
          </div>
        </div>
      </LayoutGroup>
    </NavContext.Provider>
  );
}

// ── Dropdown link list (with proximity hover) ──────────────────────────

type DropdownLinkItem = {
  title: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
  showArrow?: boolean;
};

function DropdownLinkList({ items }: { items: DropdownLinkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem } =
    useProximityHover(containerRef);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-0.5"
      {...handlers}
    >
      <AnimatePresence>
        {activeIndex !== null && itemRects[activeIndex] && (
          <motion.div
            key={sessionRef.current}
            layoutId={`dropdown-hover-${sessionRef.current}`}
            className="pointer-events-none absolute rounded-[8px] bg-foreground/[0.06]"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x: itemRects[activeIndex].left,
              y: itemRects[activeIndex].top,
              width: itemRects[activeIndex].width,
              height: itemRects[activeIndex].height,
            }}
            exit={{ opacity: 0 }}
            transition={springs.fast}
          />
        )}
      </AnimatePresence>
      {items.map(({ title, description, href, icon, showArrow }, index) => (
        <NavigationMenuPrimitive.Link asChild key={href}>
          <Link
            ref={(el) => registerItem(index, el)}
            href={`https://dub.co${href}`}
            className="group relative z-[1] -mx-2 rounded-[8px] p-2"
          >
            <div className="flex items-center gap-3">
              {icon ? (
                icon
              ) : (
                <div className="shrink-0 rounded-xl border border-foreground/[0.06] bg-foreground/[0.06] p-2.5">
                  <div className="size-4" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium tracking-[-0.02em] text-page-text">
                  {title}
                </p>
                {description && (
                  <p className="text-xs tracking-[-0.02em] text-page-text-muted line-clamp-1">
                    {description}
                  </p>
                )}
              </div>
              {showArrow && (
                <svg
                  className="invisible -ml-6 h-4 w-4 text-page-text-muted group-hover:visible"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </Link>
        </NavigationMenuPrimitive.Link>
      ))}
    </div>
  );
}

// ── Nav Items List (with proximity hover) ───────────────────────────────

function NavItemsList({ pathname }: { pathname: string | null }) {
  const containerRef = useRef<HTMLUListElement>(null);
  const { activeIndex, itemRects, sessionRef, handlers, registerItem } =
    useProximityHover(containerRef, { axis: "x" });

  return (
    <NavigationMenuPrimitive.Root
      delayDuration={0}
      className="relative hidden lg:block"
    >
      <NavigationMenuPrimitive.List
        ref={containerRef}
        className="group relative z-0 flex"
        {...handlers}
      >
        {/* Proximity hover highlight */}
        <AnimatePresence>
          {activeIndex !== null && itemRects[activeIndex] && (
            <motion.div
              key={sessionRef.current}
              layoutId={`nav-hover-${sessionRef.current}`}
              className="pointer-events-none absolute rounded-lg bg-foreground/[0.04]"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                x: itemRects[activeIndex].left,
                y: itemRects[activeIndex].top,
                width: itemRects[activeIndex].width,
                height: itemRects[activeIndex].height,
              }}
              exit={{ opacity: 0 }}
              transition={springs.fast}
            />
          )}
        </AnimatePresence>

        {navItems.map(({ name, href, segments, content: Content }, index) => {
          const isActive = segments.some((segment) =>
            pathname?.startsWith(segment)
          );
          return (
            <NavigationMenuPrimitive.Item
              key={name}
              ref={(el) => registerItem(index, el)}
            >
              <WithTrigger trigger={!!Content}>
                {href !== undefined ? (
                  <Link
                    id={`nav-${name.toLowerCase()}`}
                    href={href}
                    className={navItemClassName}
                    data-active={isActive}
                  >
                    {name}
                  </Link>
                ) : (
                  <button
                    className={navItemClassName}
                    data-active={isActive}
                  >
                    {name}
                    <AnimatedChevron className="ml-1.5 size-2.5 text-neutral-700 dark:text-white/90" />
                  </button>
                )}
              </WithTrigger>

              {Content && (
                <NavigationMenuPrimitive.Content className="data-[motion=from-start]:animate-enter-from-left data-[motion=from-end]:animate-enter-from-right data-[motion=to-start]:animate-exit-to-left data-[motion=to-end]:animate-exit-to-right absolute left-0 top-0">
                  <Content domain="dub.co" />
                </NavigationMenuPrimitive.Content>
              )}
            </NavigationMenuPrimitive.Item>
          );
        })}
      </NavigationMenuPrimitive.List>

      <div className="absolute left-0 top-full mt-3">
        <NavigationMenuPrimitive.Viewport
          className={cn(
            "relative flex origin-[top_center] justify-start overflow-hidden rounded-[20px] border border-foreground/[0.06] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] font-inter dark:border-white/[0.06] dark:bg-[#111111] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]",
            "data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content",
            "h-[var(--radix-navigation-menu-viewport-height)] w-[var(--radix-navigation-menu-viewport-width)] transition-[width,height]"
          )}
        />
      </div>
    </NavigationMenuPrimitive.Root>
  );
}

// ── Mobile Nav ──────────────────────────────────────────────────────────────

const MOBILE_MENU_LINKS = [
  { label: "Product", href: "#", expandable: true },
  { label: "Solutions", href: "#", expandable: true },
  { label: "Resources", href: "#", expandable: true },
  { label: "Blog", href: "/blog" },
  { label: "Academy", href: "/academy" },
  { label: "Help", href: "/help" },
  { label: "About", href: "/about" },
  { label: "Changelog", href: "/changelog" },
];

function MobileNav({ theme }: { theme: NavTheme }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  return (
    <div className={cn("flex items-center lg:hidden", theme === "dark" && "dark")}>
      <button
        onClick={() => setOpen(!open)}
        className="z-30 rounded-full p-2 transition-colors duration-200 hover:bg-foreground/[0.06] active:bg-foreground/[0.1]"
      >
        {open ? (
          <X className="h-5 w-5 text-page-text" />
        ) : (
          <Menu className="h-5 w-5 text-page-text" />
        )}
      </button>

      {/* Fullscreen dark menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-20 flex flex-col bg-[#101014] lg:hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-end gap-2 px-4 py-2">
              {/* Search */}
              <button className="flex h-8 w-8 items-center justify-center rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                  <path d="M16 16L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Sign in */}
              <Link
                href="https://app.dub.co/login"
                onClick={() => setOpen(false)}
                className="flex h-8 items-center rounded-md bg-white/15 px-3 text-sm tracking-[0.28px] text-white"
              >
                Sign in
              </Link>

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Scrollable menu */}
            <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
              {/* Heading */}
              <h2 className="pb-8 pl-2 text-[32px] font-normal leading-8 tracking-[-1.12px] text-white">
                Menu
              </h2>

              {/* Links */}
              <nav className="flex flex-col">
                {MOBILE_MENU_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-2 py-3 text-base tracking-[0.32px] text-white transition-colors active:bg-white/[0.06]"
                  >
                    <span>{item.label}</span>
                    {item.expandable && (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="-rotate-90">
                        <path d="M7 8L10 11L13 8" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Animated chevron ────────────────────────────────────────────────────────

function AnimatedChevron(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      fill="none"
      viewBox="0 0 9 9"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.278 3.389 4.5 6.167 1.722 3.389"
        className="transition-transform duration-150 [transform-box:view-box] [transform-origin:center] [vector-effect:non-scaling-stroke] group-data-[state=open]/item:-scale-y-100"
      />
    </svg>
  );
}

// ── WithTrigger wrapper ─────────────────────────────────────────────────────

function WithTrigger({
  trigger,
  children,
}: PropsWithChildren<{ trigger: boolean }>) {
  return trigger ? (
    <NavigationMenuPrimitive.Trigger asChild>
      {children}
    </NavigationMenuPrimitive.Trigger>
  ) : (
    children
  );
}
