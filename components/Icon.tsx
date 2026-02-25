/**
 * Word Naija — Icon Component
 * Thin-line outlined icons using Feather icon set from @expo/vector-icons.
 * Maps semantic names to Feather icon names for easy swapping.
 * Pure visual — no logic.
 */

import React from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "../constants/theme";

/** Semantic icon names used across the app → Feather icon mapping */
const ICON_MAP = {
  // Navigation
  back: "arrow-left",
  settings: "settings",
  close: "x",

  // Game
  trophy: "award",
  coin: "dollar-sign",
  chart: "trending-up",
  hint: "zap",
  shuffle: "refresh-cw",
  package: "box",
  search: "search",
  star: "star",
  target: "target",
  book: "book-open",
  grid: "grid",
  edit: "edit-3",

  // Status
  check: "check",
  info: "info",
  alert: "alert-circle",
  frown: "frown",
  smile: "smile",

  // Actions
  share: "share-2",
  mail: "mail",
  power: "power",
  play: "play",
  chevron: "chevron-right",
  send: "send",

  // Misc
  medal: "award",
  gift: "gift",
  celebrate: "sun",
  help: "help-circle",
  volume: "volume-2",
  volumeOff: "volume-x",
  puzzle: "layers",
} as const;

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 20, color = colors.textPrimary }: IconProps) {
  const featherName = ICON_MAP[name];
  return <Feather name={featherName} size={size} color={color} />;
}
