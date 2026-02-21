/**
 * Word Naija — Sparkle Component
 * Reusable particle burst. Increment `trigger` to fire a new burst.
 * Renders as absoluteFill so it must sit inside a `position: relative` parent.
 * Uses `pointerEvents="none"` so it never blocks touches.
 */

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

const P = 7; // particle size (px)

// Eight particles, alternating gold-orange-teal-mint, alternating distances
const PARTICLES = [
  { angle: 0,   dist: 42, color: "#FFD700" },
  { angle: 45,  dist: 30, color: "#FF8C42" },
  { angle: 90,  dist: 42, color: "#4FC3F7" },
  { angle: 135, dist: 30, color: "#A5D6A7" },
  { angle: 180, dist: 42, color: "#FFD700" },
  { angle: 225, dist: 30, color: "#FF8C42" },
  { angle: 270, dist: 42, color: "#4FC3F7" },
  { angle: 315, dist: 30, color: "#A5D6A7" },
];

interface SparkleProps {
  /** Increment this value to fire a burst. 0 = no burst on mount. */
  trigger: number;
}

export default function Sparkle({ trigger }: SparkleProps) {
  const anims = useRef(
    PARTICLES.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (trigger === 0) return;

    // Snap all particles back to origin
    anims.forEach((a) => {
      a.x.setValue(0);
      a.y.setValue(0);
      a.opacity.setValue(0);
    });

    const burst = PARTICLES.map((p, i) => {
      const rad = (p.angle * Math.PI) / 180;
      return Animated.parallel([
        Animated.timing(anims[i].x, {
          toValue: Math.cos(rad) * p.dist,
          duration: 580,
          useNativeDriver: true,
        }),
        Animated.timing(anims[i].y, {
          toValue: Math.sin(rad) * p.dist,
          duration: 580,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(anims[i].opacity, { toValue: 1, duration: 60,  useNativeDriver: true }),
          Animated.timing(anims[i].opacity, { toValue: 0, duration: 520, useNativeDriver: true }),
        ]),
      ]);
    });

    Animated.parallel(burst).start();
  }, [trigger]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PARTICLES.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: P,
            height: P,
            borderRadius: P / 2,
            backgroundColor: p.color,
            // Centre in parent; translateX/Y move outward from there
            top: "50%",
            left: "50%",
            marginTop: -(P / 2),
            marginLeft: -(P / 2),
            transform: [
              { translateX: anims[i].x },
              { translateY: anims[i].y },
            ],
            opacity: anims[i].opacity,
          }}
        />
      ))}
    </View>
  );
}
