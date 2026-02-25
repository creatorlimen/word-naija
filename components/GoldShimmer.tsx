/**
 * Word Naija — GoldShimmer
 * Subtle metallic noise/grain texture overlay using layered SVG rects
 * with varying gold opacities. Creates a brushed-metal effect
 * reminiscent of the mood board's champagne texture panel.
 * Pure visual — no logic, no interactivity.
 */

import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Rect, Defs, LinearGradient as SvgGrad, Stop } from "react-native-svg";

interface GoldShimmerProps {
  width: number;
  height: number;
  /** Intensity 0-1 — how visible the shimmer is (default 0.12) */
  intensity?: number;
}

export default function GoldShimmer({ width, height, intensity = 0.12 }: GoldShimmerProps) {
  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <SvgGrad id="shimmer1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#E8C766" stopOpacity={intensity * 0.6} />
          <Stop offset="30%" stopColor="#D4A843" stopOpacity={intensity * 0.3} />
          <Stop offset="60%" stopColor="#F5DEB3" stopOpacity={intensity * 0.8} />
          <Stop offset="100%" stopColor="#D4A843" stopOpacity={intensity * 0.4} />
        </SvgGrad>
        <SvgGrad id="shimmer2" x1="100%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F5DEB3" stopOpacity={intensity * 0.3} />
          <Stop offset="50%" stopColor="#E8C766" stopOpacity={intensity * 0.15} />
          <Stop offset="100%" stopColor="#D4A843" stopOpacity={intensity * 0.5} />
        </SvgGrad>
      </Defs>

      {/* Base shimmer layer */}
      <Rect x="0" y="0" width={width} height={height} fill="url(#shimmer1)" />

      {/* Cross-hatch shimmer for brushed-metal texture */}
      <Rect x="0" y="0" width={width} height={height} fill="url(#shimmer2)" opacity={0.5} />
    </Svg>
  );
}
