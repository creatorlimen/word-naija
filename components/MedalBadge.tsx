/**
 * Word Naija — MedalBadge SVG Component
 * Gold medal with green-and-gold striped V-ribbon.
 * Used as hero visual in the stats card on the HomeScreen.
 */

import React from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";

interface MedalBadgeProps {
  size?: number;
}

export default function MedalBadge({ size = 120 }: MedalBadgeProps) {
  const s = size / 120; // scale factor

  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 120 150">
      <Defs>
        {/* Gold face gradient */}
        <RadialGradient id="medalGold" cx="60" cy="68" r="38" fx="50" fy="58" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#F5DEB3" />
          <Stop offset="40%" stopColor="#E8C766" />
          <Stop offset="70%" stopColor="#D4A843" />
          <Stop offset="100%" stopColor="#A68632" />
        </RadialGradient>

        {/* Medal rim gradient */}
        <LinearGradient id="medalRim" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E8C766" />
          <Stop offset="50%" stopColor="#C9952E" />
          <Stop offset="100%" stopColor="#8A6F1E" />
        </LinearGradient>

        {/* Star highlight */}
        <RadialGradient id="starGlow" cx="60" cy="68" r="20" gradientUnits="userSpaceOnUse">
          <Stop offset="0%" stopColor="#FFF8E1" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
        </RadialGradient>

        {/* Ribbon green */}
        <LinearGradient id="ribbonGreen" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#1C7C57" />
          <Stop offset="100%" stopColor="#0F3C34" />
        </LinearGradient>

        {/* Ribbon gold */}
        <LinearGradient id="ribbonGold" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#E8C766" />
          <Stop offset="100%" stopColor="#C9952E" />
        </LinearGradient>
      </Defs>

      {/* ── V-Ribbon ── */}
      {/* Left ribbon arm (green-gold-green stripes) */}
      <Path
        d="M 32 0 L 42 0 L 60 50 L 50 50 Z"
        fill="url(#ribbonGreen)"
      />
      <Path
        d="M 42 0 L 50 0 L 60 50 L 55 40 Z"
        fill="url(#ribbonGold)"
        opacity={0.9}
      />

      {/* Right ribbon arm */}
      <Path
        d="M 88 0 L 78 0 L 60 50 L 70 50 Z"
        fill="url(#ribbonGreen)"
      />
      <Path
        d="M 78 0 L 70 0 L 60 50 L 65 40 Z"
        fill="url(#ribbonGold)"
        opacity={0.9}
      />

      {/* Ribbon V-bottom fold */}
      <Path
        d="M 50 50 L 60 62 L 70 50 Z"
        fill="#0C2820"
        opacity={0.5}
      />

      {/* ── Medal disc ── */}
      {/* Outer rim */}
      <Circle cx={60} cy={90} r={40} fill="url(#medalRim)" />

      {/* Inner face */}
      <Circle cx={60} cy={90} r={35} fill="url(#medalGold)" />

      {/* Inner decorative ring */}
      <Circle
        cx={60}
        cy={90}
        r={28}
        fill="none"
        stroke="#C9952E"
        strokeWidth={1.5}
        opacity={0.6}
      />

      {/* Star highlight glow */}
      <Circle cx={60} cy={90} r={20} fill="url(#starGlow)" />

      {/* Center star */}
      <Path
        d="M 60 74 L 63.5 83 L 73 84 L 66 90 L 67.5 99 L 60 95 L 52.5 99 L 54 90 L 47 84 L 56.5 83 Z"
        fill="#A68632"
        opacity={0.7}
      />
      <Path
        d="M 60 76 L 63 83.5 L 71 84.5 L 65 89.5 L 66.5 97 L 60 93.5 L 53.5 97 L 55 89.5 L 49 84.5 L 57 83.5 Z"
        fill="#F5DEB3"
        opacity={0.5}
      />

      {/* Rim highlight arc (top-left shine) */}
      <Path
        d="M 30 75 A 40 40 0 0 1 60 50"
        fill="none"
        stroke="#FFF8E1"
        strokeWidth={2}
        opacity={0.25}
        strokeLinecap="round"
      />
    </Svg>
  );
}
