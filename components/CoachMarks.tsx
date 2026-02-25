/**
 * Word Naija — CoachMarks Component
 * "Show, Don't Tell" interactive onboarding overlay.
 * Spotlights real UI elements with a golden glow cutout and speech-bubble tooltips.
 * Pure visual overlay — no game logic.
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import Svg, { Path, Circle as SvgCircle, Defs, RadialGradient, Stop } from "react-native-svg";
import { colors, fontSize, spacing, borderRadius, fontFamily, shadows } from "../constants/theme";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/* ── Target descriptor passed from GameBoard ── */
export interface CoachTarget {
  /** Center-x relative to the overlay (window coords) */
  cx: number;
  /** Center-y relative to the overlay */
  cy: number;
  /** Spotlight circle radius */
  radius: number;
  /** Tooltip headline */
  title: string;
  /** Tooltip body text */
  body: string;
  /** Where to place the speech bubble relative to the spotlight */
  tooltipPosition: "above" | "below";
}

interface CoachMarksProps {
  targets: CoachTarget[];
  onComplete: () => void;
}

export default function CoachMarks({ targets, onComplete }: CoachMarksProps) {
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  // Pulse glow animation — loops while visible
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleTap = useCallback(() => {
    if (step < targets.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Fade out then complete
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => onComplete());
    }
  }, [step, targets.length, onComplete, fadeAnim]);

  if (targets.length === 0) return null;

  const target = targets[step];
  const isLast = step === targets.length - 1;

  /* ── SVG cutout path (evenodd): full-screen rect minus circle ── */
  const r = target.radius;
  const cx = target.cx;
  const cy = target.cy;
  // Outer rect
  const outerPath = `M0 0h${SCREEN_W}v${SCREEN_H}H0V0Z`;
  // Inner circle (drawn clockwise, evenodd makes it a hole)
  const circlePath =
    `M${cx - r} ${cy}` +
    `a${r} ${r} 0 1 0 ${2 * r} 0` +
    `a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const combinedPath = `${outerPath} ${circlePath}`;

  /* ── Tooltip positioning ── */
  const TOOLTIP_WIDTH = Math.min(SCREEN_W - 48, 300);
  const tooltipLeft = Math.max(24, Math.min(cx - TOOLTIP_WIDTH / 2, SCREEN_W - TOOLTIP_WIDTH - 24));
  const ARROW_SIZE = 10;
  const GAP = 16;

  const tooltipAbove = target.tooltipPosition === "above";
  const tooltipTop = tooltipAbove
    ? cy - r - GAP - 100 // approximate height; auto-adjusts via flexbox
    : cy + r + GAP;

  /* Arrow position (centered on spotlight) */
  const arrowLeft = cx - tooltipLeft - ARROW_SIZE;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} pointerEvents="box-none">
      <Pressable style={StyleSheet.absoluteFill} onPress={handleTap}>
        {/* ── Dark overlay with spotlight hole ── */}
        <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="glow" cx={cx} cy={cy} rx={r + 40} ry={r + 40} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#D4A843" stopOpacity="0.5" />
              <Stop offset="0.6" stopColor="#D4A843" stopOpacity="0.15" />
              <Stop offset="1" stopColor="#D4A843" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Dark backdrop with circular cutout */}
          <Path d={combinedPath} fill="rgba(0,0,0,0.72)" fillRule="evenodd" />

          {/* Golden glow ring around spotlight */}
          <SvgCircle cx={cx} cy={cy} r={r + 30} fill="url(#glow)" />
          <SvgCircle cx={cx} cy={cy} r={r + 4} stroke="rgba(212,168,67,0.45)" strokeWidth={2} fill="none" />
        </Svg>

        {/* ── Speech bubble tooltip ── */}
        <View
          style={[
            styles.tooltip,
            {
              left: tooltipLeft,
              top: tooltipTop,
              width: TOOLTIP_WIDTH,
            },
          ]}
        >
          {/* Arrow pointing toward spotlight */}
          {tooltipAbove ? (
            <View
              style={[
                styles.arrowDown,
                { left: Math.max(16, Math.min(arrowLeft, TOOLTIP_WIDTH - 32)) },
              ]}
            />
          ) : (
            <View
              style={[
                styles.arrowUp,
                { left: Math.max(16, Math.min(arrowLeft, TOOLTIP_WIDTH - 32)) },
              ]}
            />
          )}

          <Text style={styles.tooltipTitle}>{target.title}</Text>
          <Text style={styles.tooltipBody}>{target.body}</Text>

          {/* Bottom row: dots + tap hint */}
          <View style={styles.bottomRow}>
            {/* Step dots */}
            <View style={styles.dots}>
              {targets.map((_, i) => (
                <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
              ))}
            </View>

            <Text style={styles.tapHint}>{isLast ? "Tap to start" : "Tap to continue"}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },

  /* ── Tooltip bubble ── */
  tooltip: {
    position: "absolute",
    backgroundColor: "#F5F1EB",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    ...shadows.soft,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.35)",
  },
  tooltipTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: "#2A2420",
    marginBottom: spacing.xs,
  },
  tooltipBody: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodyRegular,
    color: "#5A5248",
    lineHeight: 22,
    marginBottom: spacing.md,
  },

  /* ── Bottom row ── */
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0C9C0",
  },
  dotActive: {
    backgroundColor: "#D4A843",
    width: 18,
  },
  tapHint: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodyMedium,
    color: "#9A938B",
  },

  /* ── Arrow pointers ── */
  arrowUp: {
    position: "absolute",
    top: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#F5F1EB",
  },
  arrowDown: {
    position: "absolute",
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#F5F1EB",
  },
});
