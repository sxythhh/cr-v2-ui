"use client";

import type { CSSProperties } from "react";
import { CentralIcon } from "@central-icons-react/all";
import { Copy as LucideCopy, Download as LucideDownload, LayoutGrid as LucideGrid, Command as LucideCommand } from "lucide-react";

export type IconName =
  | "home" | "users" | "feed" | "search" | "radar" | "heart" | "bell" | "settings"
  | "chevron-down" | "chevron-right" | "chevron-up" | "plus" | "x"
  | "arrow-up-right" | "arrow-right" | "bookmark" | "bookmark-fill" | "download"
  | "copy" | "play" | "sparkles" | "eye" | "message" | "share" | "trending"
  | "flame" | "filter" | "grid" | "list" | "table" | "calendar" | "clock"
  | "star" | "sort" | "link" | "check" | "dots" | "at" | "slack" | "discord" | "telegram" | "zap"
  | "image" | "video" | "help" | "command" | "compass";

type Props = {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
};

const CI_BASE = { join: "round", fill: "filled", stroke: "2", radius: "2" } as const;

const CI_MAP: Partial<Record<IconName, string>> = {
  home: "IconHome",
  users: "IconPeople",
  feed: "IconNewspaper1",
  search: "IconMagnifyingGlass",
  radar: "IconRadar",
  heart: "IconHeart",
  bell: "IconBell",
  settings: "IconSettingsGear1",
  "chevron-down": "IconChevronBottom",
  "chevron-right": "IconChevronRight",
  "chevron-up": "IconChevronTop",
  plus: "IconPlusMedium",
  x: "IconCrossSmall",
  "arrow-up-right": "IconSquareArrowTopRight",
  "arrow-right": "IconArrowRight",
  bookmark: "IconBookmark",
  "bookmark-fill": "IconBookmark",
  play: "IconPlay",
  sparkles: "IconSparkle2",
  eye: "IconEyeOpen",
  message: "IconBubble2",
  share: "IconShareOs",
  trending: "IconTrending1",
  flame: "IconFire1",
  filter: "IconFilter1",
  list: "IconListBullets",
  table: "IconTable",
  calendar: "IconCalendar1",
  clock: "IconClock",
  star: "IconStar",
  sort: "IconSortArrowUpDown",
  link: "IconChainLink1",
  check: "IconCheckmark1",
  dots: "IconCircleDotsCenter1",
  at: "IconAt",
  slack: "IconSlack",
  discord: "IconDiscord",
  telegram: "IconTelegram",
  zap: "IconLightning",
  image: "IconImages1",
  video: "IconVideo",
  help: "IconCircleQuestionmark",
  compass: "IconCompassRound",
};

export function Icon({ name, size = 14, className, style }: Props) {
  const ci = CI_MAP[name];
  if (ci) {
    return (
      <CentralIcon
        {...CI_BASE}
        name={ci as never}
        size={size}
        color="currentColor"
        className={className}
      />
    );
  }
  // Fallbacks for icons not in CentralIcon set
  const sizeProps = { width: size, height: size, className, style };
  if (name === "download") return <LucideDownload {...sizeProps} strokeWidth={1.8} />;
  if (name === "copy") return <LucideCopy {...sizeProps} strokeWidth={1.8} />;
  if (name === "grid") return <LucideGrid {...sizeProps} strokeWidth={1.8} />;
  if (name === "command") return <LucideCommand {...sizeProps} strokeWidth={1.8} />;
  return null;
}
