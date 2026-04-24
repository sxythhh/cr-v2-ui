"use client";

import { CentralIcon } from "@central-icons-react/all";
import type { ComponentProps } from "react";

type CIProps = {
  name: ComponentProps<typeof CentralIcon>["name"];
  size?: number;
  color?: string;
  className?: string;
};

const BASE = {
  join: "round",
  fill: "filled",
  stroke: "2",
  radius: "2",
} as const;

export function CI({ name, size = 14, color = "currentColor", className }: CIProps) {
  return (
    <CentralIcon
      {...BASE}
      name={name}
      size={size}
      color={color}
      className={className}
    />
  );
}
