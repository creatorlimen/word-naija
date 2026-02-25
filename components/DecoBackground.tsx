/**
 * Word Naija — DecoBackground
 * Organic flowing gold lines and blob shapes rendered as SVG,
 * matching the mood board's lush decorative style.
 * Pure visual — no logic, no interactivity.
 */

import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Circle, Ellipse, Defs, LinearGradient as SvgGrad, Stop } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

interface DecoBackgroundProps {
  /** "home" renders a fuller scene; "game" is subtler so it doesn't compete with the board */
  variant?: "home" | "game";
}

export default function DecoBackground({ variant = "home" }: DecoBackgroundProps) {
  const isHome = variant === "home";

  return (
    <Svg
      width={W}
      height={H}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        {/* Gold gradient — warm amber to light gold */}
        <SvgGrad id="goldLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#A68632" stopOpacity="0.6" />
          <Stop offset="50%" stopColor="#D4A843" stopOpacity="0.45" />
          <Stop offset="100%" stopColor="#E8C766" stopOpacity="0.3" />
        </SvgGrad>

        {/* Deeper gold for blobs */}
        <SvgGrad id="goldBlob" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#D4A843" stopOpacity="0.12" />
          <Stop offset="100%" stopColor="#E8C766" stopOpacity="0.06" />
        </SvgGrad>

        {/* Subtle green-gold for secondary wave */}
        <SvgGrad id="greenGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#1C7C57" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#D4A843" stopOpacity="0.15" />
        </SvgGrad>
      </Defs>

      {/* ── Flowing Wave 1 — top-right sweep ── */}
      <Path
        d={`M ${W * 0.6} ${-H * 0.02}
            C ${W * 0.85} ${H * 0.05}, ${W * 1.1} ${H * 0.12}, ${W * 1.02} ${H * 0.22}
            C ${W * 0.95} ${H * 0.30}, ${W * 0.6} ${H * 0.25}, ${W * 0.45} ${H * 0.32}
            C ${W * 0.3} ${H * 0.39}, ${W * 0.15} ${H * 0.35}, ${-W * 0.05} ${H * 0.28}`}
        stroke="url(#goldLine)"
        strokeWidth={isHome ? 2.5 : 1.5}
        fill="none"
      />

      {/* ── Flowing Wave 2 — parallel to wave 1, offset ── */}
      <Path
        d={`M ${W * 0.7} ${-H * 0.01}
            C ${W * 0.9} ${H * 0.07}, ${W * 1.15} ${H * 0.15}, ${W * 1.05} ${H * 0.25}
            C ${W * 0.96} ${H * 0.33}, ${W * 0.65} ${H * 0.28}, ${W * 0.5} ${H * 0.35}
            C ${W * 0.32} ${H * 0.42}, ${W * 0.12} ${H * 0.38}, ${-W * 0.08} ${H * 0.31}`}
        stroke="url(#goldLine)"
        strokeWidth={isHome ? 1.5 : 1}
        fill="none"
        opacity={0.5}
      />

      {/* ── Flowing Wave 3 — bottom-left sweep ── */}
      {isHome && (
        <Path
          d={`M ${-W * 0.1} ${H * 0.7}
              C ${W * 0.1} ${H * 0.68}, ${W * 0.35} ${H * 0.75}, ${W * 0.5} ${H * 0.72}
              C ${W * 0.7} ${H * 0.69}, ${W * 0.85} ${H * 0.78}, ${W * 1.05} ${H * 0.82}
              C ${W * 1.15} ${H * 0.86}, ${W * 1.1} ${H * 0.95}, ${W * 0.9} ${H * 1.02}`}
          stroke="url(#greenGold)"
          strokeWidth={2}
          fill="none"
        />
      )}

      {/* ── Flowing Wave 4 — subtle mid-screen connector ── */}
      <Path
        d={`M ${-W * 0.05} ${H * 0.52}
            C ${W * 0.15} ${H * 0.48}, ${W * 0.4} ${H * 0.55}, ${W * 0.6} ${H * 0.50}
            C ${W * 0.8} ${H * 0.45}, ${W * 1.0} ${H * 0.53}, ${W * 1.1} ${H * 0.48}`}
        stroke="url(#goldLine)"
        strokeWidth={1}
        fill="none"
        opacity={isHome ? 0.35 : 0.2}
      />

      {/* ── Organic Blob — top-right corner ── */}
      <Ellipse
        cx={W * 0.88}
        cy={H * 0.08}
        rx={isHome ? 55 : 40}
        ry={isHome ? 50 : 35}
        fill="url(#goldBlob)"
        transform={`rotate(-15 ${W * 0.88} ${H * 0.08})`}
      />

      {/* ── Organic Blob — lower-left ── */}
      {isHome && (
        <Ellipse
          cx={W * 0.08}
          cy={H * 0.78}
          rx={65}
          ry={55}
          fill="url(#goldBlob)"
          transform={`rotate(20 ${W * 0.08} ${H * 0.78})`}
        />
      )}

      {/* ── Small squircle accent — mid-right ── */}
      <Path
        d={`M ${W * 0.92} ${H * 0.42}
            C ${W * 0.92} ${H * 0.40}, ${W * 0.96} ${H * 0.40}, ${W * 0.96} ${H * 0.42}
            C ${W * 0.96} ${H * 0.44}, ${W * 0.96} ${H * 0.47}, ${W * 0.94} ${H * 0.47}
            C ${W * 0.92} ${H * 0.47}, ${W * 0.92} ${H * 0.44}, ${W * 0.92} ${H * 0.42} Z`}
        fill="url(#goldBlob)"
      />

      {/* ── Tiny gold dot cluster — top-left ── */}
      <Circle cx={W * 0.12} cy={H * 0.12} r={isHome ? 5 : 3} fill="#D4A843" opacity={0.15} />
      <Circle cx={W * 0.16} cy={H * 0.10} r={isHome ? 3 : 2} fill="#E8C766" opacity={0.12} />
      <Circle cx={W * 0.10} cy={H * 0.15} r={isHome ? 7 : 4} fill="#D4A843" opacity={0.08} />

      {/* ── Tiny gold dot cluster — bottom-right ── */}
      {isHome && (
        <>
          <Circle cx={W * 0.82} cy={H * 0.88} r={5} fill="#D4A843" opacity={0.12} />
          <Circle cx={W * 0.86} cy={H * 0.91} r={3} fill="#E8C766" opacity={0.10} />
          <Circle cx={W * 0.79} cy={H * 0.92} r={8} fill="#D4A843" opacity={0.06} />
        </>
      )}

      {/* ── Organic squircle blob — game variant: bottom accent ── */}
      {!isHome && (
        <Ellipse
          cx={W * 0.15}
          cy={H * 0.92}
          rx={35}
          ry={30}
          fill="url(#goldBlob)"
          transform={`rotate(10 ${W * 0.15} ${H * 0.92})`}
        />
      )}
    </Svg>
  );
}
