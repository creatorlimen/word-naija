/**
 * Word Naija - Theme Constants (v3 — Afro-minimal)
 * Dual palettes (Savanna Light / Midnight Market) + semantic tokens.
 */

const palette = {
  deepGreen: "#0F1C1A",
  forest: "#0F2E28",
  teal: "#0F3C34",
  emerald: "#1C7C57",
  jade: "#22A06B",
  gold: "#F2C14F",
  amber: "#FFB648",
  sand: "#F5E9D7",
  linen: "#F9F3EA",
  espresso: "#3A2F2A",
  cocoa: "#4A3A33",
  ash: "#C6C0B8",
  cloud: "#E2DDD6",
  plum: "#67416D",
  coral: "#FF7B5F",
  mint: "#5FE1C4",
  sky: "#5EB0FF",
  red: "#E45757",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  display: 44,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
  round: 9999,
};

export const shadows = {
  soft: {
    shadowColor: "rgba(0,0,0,0.45)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  subtle: {
    shadowColor: "rgba(0,0,0,0.35)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3,
  },
  tile: {
    shadowColor: "rgba(0,0,0,0.35)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  // Legacy aliases for existing components
  small: {
    shadowColor: "rgba(0,0,0,0.35)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  tile3D: {
    shadowColor: "rgba(0,0,0,0.35)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
};

export const gradients = {
  background: ["#0C1614", "#0F2A24", "#123830"] as const,
  card: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.05)"] as const,
  pill: ["rgba(34,160,107,0.9)", "rgba(17,97,79,0.9)"] as const,
  cta: ["#22A06B", "#0F7D5C"] as const,
  tile: ["#F6EDDF", "#ECDCC6"] as const,
};

/**
 * Semantic colors for the current theme (default: Midnight Market).
 * Keep legacy keys for existing components while mapping to new palette.
 */
export const colors = {
  background: palette.deepGreen,
  backgroundDark: palette.forest,
  backgroundAlt: "#0B2420",

  surface: "rgba(255,255,255,0.06)",
  surfaceAlt: "rgba(255,255,255,0.12)",
  surfaceCard: "rgba(255,255,255,0.08)",
  outline: "rgba(255,255,255,0.14)",
  outlineStrong: "rgba(255,255,255,0.28)",

  textPrimary: "#F7F3EE",
  textSecondary: "#D7D0C8",
  textMuted: "#AFA8A0",

  accent: palette.jade,
  accentStrong: "#0F7D5C",
  gold: palette.gold,
  warning: palette.amber,
  success: palette.jade,
  error: palette.red,
  info: palette.sky,

  boardBackground: "#132722",
  boardBorder: "#1D3A33",
  boardShadow: "#0A1613",

  tile: {
    background: palette.linen,
    backgroundSelected: "#22A06B",
    border: "#E5D8C5",
    borderBottom: "#D4C3AE",
    borderBottomSelected: "#0F7D5C",
    text: palette.espresso,
    textSelected: "#F9F3EA",
    empty: "#1A302A",
    emptyShadow: "#0F1F1A",
  },

  pill: {
    background: "rgba(17, 97, 79, 0.9)",
    border: "rgba(242, 193, 79, 0.8)",
    text: "#F9F3EA",
    icon: palette.gold,
    shadow: "#0A241D",
  },

  button: {
    primary: palette.jade,
    secondary: "#0F7D5C",
    function: "#1C7C57",
    functionShadow: "#0F4E3A",
    gold: palette.gold,
    text: "#FFFFFF",
  },

  foreground: "#FFFFFF",
  foregroundDark: palette.espresso,
  muted: palette.ash,
  mutedDark: palette.cocoa,

  overlay: "rgba(0,0,0,0.6)",
  border: "rgba(255,255,255,0.14)",

  // Legacy mappings
  primary: palette.forest,
  secondary: palette.gold,
  card: "#F4ECDE",
};

export const typography = {
  display: { fontSize: fontSize.display, fontWeight: "900", letterSpacing: 0.5 },
  title: { fontSize: fontSize.xxxl, fontWeight: "800", letterSpacing: 0.25 },
  heading: { fontSize: fontSize.xl, fontWeight: "800" },
  body: { fontSize: fontSize.md, fontWeight: "500" },
  label: { fontSize: fontSize.sm, fontWeight: "700", letterSpacing: 0.4 },
  helper: { fontSize: fontSize.xs, fontWeight: "600", letterSpacing: 0.3 },
};

export const surfaces = {
  card: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.outline,
  },
  glass: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.2)",
    blur: 12,
  },
};

export const theme = {
  palette,
  colors,
  gradients,
  spacing,
  fontSize,
  borderRadius,
  shadows,
  typography,
  surfaces,
};
