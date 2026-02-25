/**
 * Word Naija - Theme Constants (v4 — Afro-Minimal Premium)
 * Deep green + gold palette, glassmorphism surfaces, Poppins typography.
 */

const palette = {
  /* Greens — background depth */
  deepGreen: "#061A14",
  forest: "#0C2820",
  teal: "#0F3C34",
  emerald: "#1C7C57",
  jade: "#22A06B",

  /* Gold spectrum */
  gold: "#D4A843",
  goldLight: "#E8C766",
  goldMid: "#C9952E",
  goldDark: "#A68632",
  goldDeep: "#8A6F1E",
  amber: "#FFB648",
  champagne: "#F5DEB3",
  bronze: "#CD7F32",

  /* Neutrals */
  ivory: "#FAF6F0",
  sand: "#F5E9D7",
  linen: "#F9F3EA",
  espresso: "#3A2F2A",
  cocoa: "#4A3A33",
  ash: "#C6C0B8",
  cloud: "#E2DDD6",

  /* Accents */
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
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
  display: 42,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  squircle: 22,   // organic super-ellipse feel
  full: 9999,
  round: 9999,
};

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  tile: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  glow: {
    shadowColor: palette.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  // Legacy aliases
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  tile3D: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 3,
  },
};

export const gradients = {
  background: ["#051510", "#0A241C", "#0E3028"] as const,
  card: ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.03)"] as const,
  glass: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.04)"] as const,
  goldShimmer: [palette.goldDark, palette.gold, palette.goldLight] as const,
  goldSurface: ["#C9952E", "#D4A843", "#E8C766"] as const,
  goldButton: ["#D4A843", "#B8922A", "#A68632"] as const,
  goldTile: ["#F5DEB3", "#E8C766", "#D4A843"] as const,
  cta: ["#1A8F5C", "#0F6B45"] as const,
  ctaGold: [palette.gold, palette.goldDark] as const,
  pill: ["rgba(34,160,107,0.85)", "rgba(15,80,58,0.85)"] as const,
  tile: ["#FAF6F0", "#F0E6D4"] as const,
  tileGold: ["#E8D5A0", "#D4A843"] as const,
  wheelBg: ["rgba(212,168,67,0.18)", "rgba(212,168,67,0.06)"] as const,
};

/**
 * Semantic colors — Afro-Minimal Midnight palette
 */
export const colors = {
  background: palette.deepGreen,
  backgroundDark: "#040F0B",
  backgroundAlt: "#081E16",

  /* Glass surfaces */
  surface: "rgba(255,255,255,0.05)",
  surfaceAlt: "rgba(255,255,255,0.08)",
  surfaceCard: "rgba(255,255,255,0.06)",
  surfaceGlass: "rgba(255,255,255,0.10)",
  outline: "rgba(255,255,255,0.12)",
  outlineStrong: "rgba(255,255,255,0.22)",
  outlineGold: "rgba(212,168,67,0.35)",
  outlineGoldStrong: "rgba(212,168,67,0.55)",

  /* Text hierarchy */
  textPrimary: "#F5F1EB",
  textSecondary: "#D0C9C0",
  textMuted: "#9A938B",
  textGold: palette.gold,

  /* Semantic */
  accent: palette.jade,
  accentStrong: "#0F7D5C",
  gold: palette.gold,
  goldLight: palette.goldLight,
  warning: palette.amber,
  success: palette.jade,
  error: palette.red,
  info: palette.sky,

  /* Game board */
  boardBackground: "rgba(255,255,255,0.04)",
  boardBorder: "rgba(255,255,255,0.10)",
  boardShadow: "#040F0B",

  /* Tiles — warm gold/ivory with depth */
  tile: {
    background: "#F5E3B8",            // warm champagne gold
    backgroundAlt: "#E8D5A0",         // slightly deeper gold for wheel tiles
    backgroundSelected: palette.jade,
    border: "rgba(166,134,50,0.25)",
    borderBottom: "rgba(140,110,30,0.35)",
    borderBottomSelected: "#0F6B45",
    text: "#4A3520",                   // warm dark brown for legibility
    textSelected: "#FFFFFF",
    empty: "rgba(255,255,255,0.04)",
    emptyShadow: "rgba(0,0,0,0.2)",
  },

  /* Pill / badges */
  pill: {
    background: "rgba(17,97,79,0.8)",
    border: "rgba(212,168,67,0.5)",
    text: "#F5F1EB",
    icon: palette.gold,
    shadow: "#0A1F18",
  },

  /* Buttons — 3-tier hierarchy */
  button: {
    primary: palette.jade,
    primaryShadow: "#0F6B45",
    secondary: "rgba(255,255,255,0.08)",
    secondaryBorder: "rgba(255,255,255,0.18)",
    function: "rgba(255,255,255,0.08)",
    functionBorder: "rgba(255,255,255,0.15)",
    functionShadow: "rgba(0,0,0,0.3)",
    gold: palette.gold,
    text: "#FFFFFF",
  },

  /* Legacy mappings */
  foreground: "#FFFFFF",
  foregroundDark: palette.espresso,
  muted: palette.ash,
  mutedDark: palette.cocoa,
  overlay: "rgba(0,0,0,0.65)",
  border: "rgba(255,255,255,0.12)",
  primary: palette.forest,
  secondary: palette.gold,
  card: palette.linen,
};

/** Font family names — loaded via expo-font / @expo-google-fonts/poppins */
export const fontFamily = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
  extraBold: "Poppins_800ExtraBold",
  black: "Poppins_900Black",
};

export const typography = {
  display: { fontSize: fontSize.display, fontFamily: fontFamily.black, letterSpacing: 0.5 },
  title: { fontSize: fontSize.xxxl, fontFamily: fontFamily.extraBold, letterSpacing: 0.3 },
  heading: { fontSize: fontSize.xl, fontFamily: fontFamily.bold },
  subheading: { fontSize: fontSize.lg, fontFamily: fontFamily.semiBold },
  body: { fontSize: fontSize.md, fontFamily: fontFamily.medium },
  label: { fontSize: fontSize.sm, fontFamily: fontFamily.semiBold, letterSpacing: 0.5 },
  caption: { fontSize: fontSize.xs, fontFamily: fontFamily.medium, letterSpacing: 0.3 },
};

export const surfaces = {
  card: {
    backgroundColor: colors.surfaceCard,
    borderColor: colors.outline,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
  },
  glass: {
    backgroundColor: colors.surfaceGlass,
    borderColor: colors.outlineStrong,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    overflow: "hidden" as const,
  },
  glassSubtle: {
    backgroundColor: colors.surface,
    borderColor: colors.outline,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
  },
};

export const theme = {
  palette,
  colors,
  gradients,
  spacing,
  fontSize,
  fontFamily,
  borderRadius,
  shadows,
  typography,
  surfaces,
};
