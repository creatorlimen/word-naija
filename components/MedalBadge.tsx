/**
 * Word Naija — MedalBadge SVG Component
 * Tier-aware medal that changes appearance per rank.
 * 10 tiers: different rim, face, ribbon colours and center icon.
 */

import React from "react";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

/* ── Tier visual config ── */
interface TierVisual {
  rimTop: string; rimMid: string; rimBot: string;
  faceHighlight: string; faceMain: string; faceDark: string; faceDeep: string;
  ringStroke: string;
  ribbonTop: string; ribbonBot: string;
  ribbonAccentTop: string; ribbonAccentBot: string;
  iconFill: string; iconHighlight: string;
}

const TIER_VISUALS: TierVisual[] = [
  // 0 — Beginner (Bronze)
  {
    rimTop: "#CD9B6A", rimMid: "#A0724A", rimBot: "#6B4226",
    faceHighlight: "#E8C8A0", faceMain: "#CD7F32", faceDark: "#A0623A", faceDeep: "#7A4A28",
    ringStroke: "#A0623A", ribbonTop: "#1C7C57", ribbonBot: "#0F3C34",
    ribbonAccentTop: "#CD9B6A", ribbonAccentBot: "#A0724A",
    iconFill: "#7A4A28", iconHighlight: "#E8C8A0",
  },
  // 1 — Explorer (Silver)
  {
    rimTop: "#D8D8D8", rimMid: "#A8A8A8", rimBot: "#707070",
    faceHighlight: "#F0F0F0", faceMain: "#C8C8C8", faceDark: "#A0A0A0", faceDeep: "#808080",
    ringStroke: "#909090", ribbonTop: "#1C7C57", ribbonBot: "#0F3C34",
    ribbonAccentTop: "#D0D0D0", ribbonAccentBot: "#A0A0A0",
    iconFill: "#707070", iconHighlight: "#F0F0F0",
  },
  // 2 — Word Hunter (Gold)
  {
    rimTop: "#E8C766", rimMid: "#C9952E", rimBot: "#8A6F1E",
    faceHighlight: "#F5DEB3", faceMain: "#E8C766", faceDark: "#D4A843", faceDeep: "#A68632",
    ringStroke: "#C9952E", ribbonTop: "#1C7C57", ribbonBot: "#0F3C34",
    ribbonAccentTop: "#E8C766", ribbonAccentBot: "#C9952E",
    iconFill: "#A68632", iconHighlight: "#F5DEB3",
  },
  // 3 — Naija Scholar (Royal Gold)
  {
    rimTop: "#F0D060", rimMid: "#D4A843", rimBot: "#9A7B20",
    faceHighlight: "#FFF0C0", faceMain: "#F0D060", faceDark: "#D4A843", faceDeep: "#B08A30",
    ringStroke: "#D4A843", ribbonTop: "#0E3028", ribbonBot: "#061A14",
    ribbonAccentTop: "#F0D060", ribbonAccentBot: "#D4A843",
    iconFill: "#9A7B20", iconHighlight: "#FFF0C0",
  },
  // 4 — Word Chief (Gold + Crown)
  {
    rimTop: "#FFD700", rimMid: "#DAA520", rimBot: "#B8860B",
    faceHighlight: "#FFF8DC", faceMain: "#FFD700", faceDark: "#DAA520", faceDeep: "#B8860B",
    ringStroke: "#DAA520", ribbonTop: "#8B0000", ribbonBot: "#5A0000",
    ribbonAccentTop: "#FFD700", ribbonAccentBot: "#DAA520",
    iconFill: "#B8860B", iconHighlight: "#FFF8DC",
  },
  // 5 — Oga of Words (Platinum)
  {
    rimTop: "#E8E8E0", rimMid: "#C8C8C0", rimBot: "#98988A",
    faceHighlight: "#F8F8F0", faceMain: "#E0E0D6", faceDark: "#C0C0B4", faceDeep: "#A0A094",
    ringStroke: "#B0B0A4", ribbonTop: "#D4A843", ribbonBot: "#A68632",
    ribbonAccentTop: "#E8E8E0", ribbonAccentBot: "#C0C0B4",
    iconFill: "#A0A094", iconHighlight: "#F8F8F0",
  },
  // 6 — Grand Master (Diamond)
  {
    rimTop: "#B9F2FF", rimMid: "#7DF9FF", rimBot: "#40C4D4",
    faceHighlight: "#E0FBFF", faceMain: "#B9F2FF", faceDark: "#7DF9FF", faceDeep: "#50D0E0",
    ringStroke: "#60D8E8", ribbonTop: "#1C7C57", ribbonBot: "#0F3C34",
    ribbonAccentTop: "#B9F2FF", ribbonAccentBot: "#7DF9FF",
    iconFill: "#40C4D4", iconHighlight: "#E0FBFF",
  },
  // 7 — Wordsmith (Emerald)
  {
    rimTop: "#70E8A0", rimMid: "#50C878", rimBot: "#2E8B57",
    faceHighlight: "#C0FFD8", faceMain: "#70E8A0", faceDark: "#50C878", faceDeep: "#2E8B57",
    ringStroke: "#40B468", ribbonTop: "#D4A843", ribbonBot: "#A68632",
    ribbonAccentTop: "#70E8A0", ribbonAccentBot: "#50C878",
    iconFill: "#2E8B57", iconHighlight: "#C0FFD8",
  },
  // 8 — Naija Legend (Ruby-Gold)
  {
    rimTop: "#FF6080", rimMid: "#E0115F", rimBot: "#9B111E",
    faceHighlight: "#FFB0C0", faceMain: "#FF6080", faceDark: "#E0115F", faceDeep: "#B01040",
    ringStroke: "#D01050", ribbonTop: "#D4A843", ribbonBot: "#A68632",
    ribbonAccentTop: "#FF6080", ribbonAccentBot: "#E0115F",
    iconFill: "#9B111E", iconHighlight: "#FFB0C0",
  },
  // 9 — Word Naija (Rainbow-Gold)
  {
    rimTop: "#FFD700", rimMid: "#FF6347", rimBot: "#8A2BE2",
    faceHighlight: "#FFF8DC", faceMain: "#FFD700", faceDark: "#FFA500", faceDeep: "#FF6347",
    ringStroke: "#FF8C00", ribbonTop: "#1C7C57", ribbonBot: "#8A2BE2",
    ribbonAccentTop: "#FFD700", ribbonAccentBot: "#FF6347",
    iconFill: "#8A2BE2", iconHighlight: "#FFF8DC",
  },
];

/* ── Center icon paths (drawn at center 60,90 in 120×150 viewBox) ── */
function CenterIcon({ tier, fill, highlight }: { tier: number; fill: string; highlight: string }) {
  switch (tier) {
    case 0: // Star (Beginner)
      return (
        <G>
          <Path d="M 60 74 L 63.5 83 L 73 84 L 66 90 L 67.5 99 L 60 95 L 52.5 99 L 54 90 L 47 84 L 56.5 83 Z" fill={fill} opacity={0.8} />
          <Path d="M 60 76 L 63 83.5 L 71 84.5 L 65 89.5 L 66.5 97 L 60 93.5 L 53.5 97 L 55 89.5 L 49 84.5 L 57 83.5 Z" fill={highlight} opacity={0.45} />
        </G>
      );
    case 1: // Compass (Explorer)
      return (
        <G>
          <Circle cx={60} cy={90} r={14} fill="none" stroke={fill} strokeWidth={1.8} opacity={0.6} />
          <Line x1={60} y1={76} x2={60} y2={104} stroke={fill} strokeWidth={1.5} opacity={0.5} />
          <Line x1={46} y1={90} x2={74} y2={90} stroke={fill} strokeWidth={1.5} opacity={0.5} />
          <Polygon points="60,76 57,84 63,84" fill={highlight} opacity={0.7} />
          <Polygon points="60,104 57,96 63,96" fill={fill} opacity={0.6} />
          <Circle cx={60} cy={90} r={3} fill={highlight} opacity={0.5} />
        </G>
      );
    case 2: // Crosshair (Word Hunter)
      return (
        <G>
          <Circle cx={60} cy={90} r={16} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.5} />
          <Circle cx={60} cy={90} r={10} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.5} />
          <Circle cx={60} cy={90} r={4} fill={highlight} opacity={0.6} />
          <Line x1={60} y1={72} x2={60} y2={108} stroke={fill} strokeWidth={1.2} opacity={0.4} />
          <Line x1={42} y1={90} x2={78} y2={90} stroke={fill} strokeWidth={1.2} opacity={0.4} />
        </G>
      );
    case 3: // Book (Naija Scholar)
      return (
        <G>
          <Path d="M 48 80 L 48 100 Q 54 97 60 100 L 60 80 Q 54 77 48 80 Z" fill={highlight} opacity={0.5} />
          <Path d="M 72 80 L 72 100 Q 66 97 60 100 L 60 80 Q 66 77 72 80 Z" fill={fill} opacity={0.6} />
          <Line x1={60} y1={79} x2={60} y2={101} stroke={fill} strokeWidth={1.2} opacity={0.4} />
        </G>
      );
    case 4: // Crown (Word Chief)
      return (
        <G>
          <Path d="M 47 97 L 49 82 L 54 90 L 60 78 L 66 90 L 71 82 L 73 97 Z" fill={fill} opacity={0.7} />
          <Path d="M 48 96 L 50 84 L 55 91 L 60 80 L 65 91 L 70 84 L 72 96 Z" fill={highlight} opacity={0.45} />
          <Rect x={47} y={97} width={26} height={4} rx={2} fill={fill} opacity={0.6} />
          <Circle cx={54} cy={84} r={2} fill={highlight} opacity={0.5} />
          <Circle cx={60} cy={79} r={2} fill={highlight} opacity={0.5} />
          <Circle cx={66} cy={84} r={2} fill={highlight} opacity={0.5} />
        </G>
      );
    case 5: // Flame (Oga of Words)
      return (
        <G>
          <Path d="M 60 74 Q 55 82 52 88 Q 50 94 54 98 Q 57 101 60 100 Q 63 101 66 98 Q 70 94 68 88 Q 65 82 60 74 Z" fill={fill} opacity={0.6} />
          <Path d="M 60 80 Q 57 86 56 90 Q 55 94 58 97 Q 59 98 60 97 Q 61 98 62 97 Q 65 94 64 90 Q 63 86 60 80 Z" fill={highlight} opacity={0.5} />
        </G>
      );
    case 6: // Diamond (Grand Master)
      return (
        <G>
          <Polygon points="60,74 73,88 60,106 47,88" fill={fill} opacity={0.6} />
          <Polygon points="60,77 70,88 60,103 50,88" fill={highlight} opacity={0.4} />
          <Line x1={47} y1={88} x2={73} y2={88} stroke={fill} strokeWidth={1} opacity={0.6} />
          <Line x1={60} y1={74} x2={55} y2={88} stroke={highlight} strokeWidth={0.8} opacity={0.3} />
          <Line x1={60} y1={74} x2={65} y2={88} stroke={highlight} strokeWidth={0.8} opacity={0.3} />
        </G>
      );
    case 7: // Quill Pen (Wordsmith)
      return (
        <G>
          <Path d="M 55 100 L 58 82 Q 62 74 68 76 Q 64 80 62 86 L 59 100 Z" fill={fill} opacity={0.6} />
          <Path d="M 56 99 L 58 84 Q 61 76 66 78 Q 63 81 61 87 L 58 99 Z" fill={highlight} opacity={0.4} />
          <Line x1={57} y1={100} x2={52} y2={103} stroke={fill} strokeWidth={1.5} opacity={0.5} strokeLinecap="round" />
        </G>
      );
    case 8: // Lightning Bolt (Naija Legend)
      return (
        <G>
          <Path d="M 63 74 L 54 90 L 60 90 L 57 106 L 68 87 L 62 87 L 67 74 Z" fill={fill} opacity={0.7} />
          <Path d="M 63 76 L 55 90 L 61 90 L 58 104 L 67 88 L 62 88 L 66 76 Z" fill={highlight} opacity={0.4} />
        </G>
      );
    case 9: // Laurel Wreath (Word Naija)
      return (
        <G>
          <Path d="M 56 100 Q 46 95 44 86 Q 43 80 48 76" fill="none" stroke={fill} strokeWidth={2} opacity={0.6} strokeLinecap="round" />
          <Path d="M 48 78 Q 44 80 46 84" fill={highlight} opacity={0.4} />
          <Path d="M 46 84 Q 43 87 46 90" fill={highlight} opacity={0.4} />
          <Path d="M 48 90 Q 45 94 50 96" fill={highlight} opacity={0.4} />
          <Path d="M 64 100 Q 74 95 76 86 Q 77 80 72 76" fill="none" stroke={fill} strokeWidth={2} opacity={0.6} strokeLinecap="round" />
          <Path d="M 72 78 Q 76 80 74 84" fill={highlight} opacity={0.4} />
          <Path d="M 74 84 Q 77 87 74 90" fill={highlight} opacity={0.4} />
          <Path d="M 72 90 Q 75 94 70 96" fill={highlight} opacity={0.4} />
          <Path d="M 60 76 L 61.5 80 L 66 80.5 L 63 83 L 63.5 87 L 60 85 L 56.5 87 L 57 83 L 54 80.5 L 58.5 80 Z" fill={highlight} opacity={0.6} />
        </G>
      );
    default:
      return null;
  }
}

/* ── Main component ── */
interface MedalBadgeProps {
  size?: number;
  /** Rank tier index: 0 = Beginner … 9 = Word Naija */
  tier?: number;
}

export default function MedalBadge({ size = 120, tier = 0 }: MedalBadgeProps) {
  const t = TIER_VISUALS[Math.min(Math.max(tier, 0), TIER_VISUALS.length - 1)];

  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 120 150">
      <Defs>
        <RadialGradient id="face" cx="60" cy="88" r="38" fx="52" fy="82" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={t.faceHighlight} />
          <Stop offset="40%" stopColor={t.faceMain} />
          <Stop offset="70%" stopColor={t.faceDark} />
          <Stop offset="100%" stopColor={t.faceDeep} />
        </RadialGradient>
        <LinearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={t.rimTop} />
          <Stop offset="50%" stopColor={t.rimMid} />
          <Stop offset="100%" stopColor={t.rimBot} />
        </LinearGradient>
        <RadialGradient id="glow" cx="60" cy="88" r="20" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor={t.faceHighlight} stopOpacity="0.55" />
          <Stop offset="100%" stopColor={t.faceMain} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="ribbon" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={t.ribbonTop} />
          <Stop offset="100%" stopColor={t.ribbonBot} />
        </LinearGradient>
        <LinearGradient id="ribbonAcc" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={t.ribbonAccentTop} />
          <Stop offset="100%" stopColor={t.ribbonAccentBot} />
        </LinearGradient>
      </Defs>

      {/* ── V-Ribbon ── */}
      <Path d="M 32 0 L 42 0 L 60 50 L 50 50 Z" fill="url(#ribbon)" />
      <Path d="M 42 0 L 50 0 L 60 50 L 55 40 Z" fill="url(#ribbonAcc)" opacity={0.9} />
      <Path d="M 88 0 L 78 0 L 60 50 L 70 50 Z" fill="url(#ribbon)" />
      <Path d="M 78 0 L 70 0 L 60 50 L 65 40 Z" fill="url(#ribbonAcc)" opacity={0.9} />
      <Path d="M 50 50 L 60 62 L 70 50 Z" fill="#0C2820" opacity={0.5} />

      {/* ── Medal disc ── */}
      <Circle cx={60} cy={90} r={40} fill="url(#rim)" />
      <Circle cx={60} cy={90} r={35} fill="url(#face)" />
      <Circle cx={60} cy={90} r={28} fill="none" stroke={t.ringStroke} strokeWidth={1.5} opacity={0.55} />
      <Circle cx={60} cy={90} r={20} fill="url(#glow)" />

      {/* ── Center icon ── */}
      <CenterIcon tier={tier} fill={t.iconFill} highlight={t.iconHighlight} />

      {/* ── Rim highlight (top-left shine) ── */}
      <Path
        d="M 30 75 A 40 40 0 0 1 60 50"
        fill="none" stroke={t.faceHighlight} strokeWidth={2} opacity={0.25} strokeLinecap="round"
      />
    </Svg>
  );
}
