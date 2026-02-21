import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { colors, borderRadius, fontSize, spacing, shadows } from "../constants/theme";

interface ToolbarProps {
  coins: number;
  hintCost: number;
  extraWordsCollected: number;
  extraWordsTarget: number;
  onShuffle: () => void;
  onHint: () => void;
  onExtra: () => void;
}

function CircleButton({ 
  label, 
  sublabel,
  onPress, 
  color = colors.button.function,
  badge,
  topBadge,
  pulseAnim,
}: { 
  label: string; 
  sublabel: string;
  onPress: () => void; 
  color?: string;
  badge?: string | number;
  topBadge?: string | number;
  pulseAnim?: Animated.Value;
}) {
  const inner = (
    <View style={styles.btnWrapper}>
      {topBadge !== undefined && (
        <View style={[styles.badge, styles.badgeTop]}>
          <Text style={styles.badgeText}>{topBadge}</Text>
        </View>
      )}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.circleBtn,
          { backgroundColor: color },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.btnIcon}>{label}</Text>
        <Text style={styles.btnSublabel}>{sublabel}</Text>
      </Pressable>
      {badge !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );

  if (pulseAnim) {
    return (
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        {inner}
      </Animated.View>
    );
  }
  return inner;
}

export default function Toolbar({ coins, hintCost, extraWordsCollected, extraWordsTarget, onShuffle, onHint, onExtra }: ToolbarProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const prevExtraRef = useRef(extraWordsCollected);

  useEffect(() => {
    if (extraWordsCollected > prevExtraRef.current) {
      // Bounce the EXTRA button to signal the new word landed there
      Animated.sequence([
        Animated.spring(pulseAnim, { toValue: 1.35, useNativeDriver: true, speed: 40, bounciness: 14 }),
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }),
      ]).start();
    }
    prevExtraRef.current = extraWordsCollected;
  }, [extraWordsCollected]);

  return (
    <View style={styles.container}>
      {/* 1. Extra */}
      <CircleButton
        label="📦"
        sublabel="EXTRA"
        onPress={onExtra}
        badge={`${extraWordsCollected}/${extraWordsTarget}`}
        pulseAnim={pulseAnim}
      />

      {/* 2. Shuffle */}
      <CircleButton label="🔀" sublabel="SHUFFLE" onPress={onShuffle} />

      {/* 3. Hint — cost shown as top badge, label centered */}
      <CircleButton
        label="💡"
        sublabel="HINT"
        onPress={onHint}
        topBadge={hintCost}
        color={colors.button.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: colors.outline,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    ...shadows.subtle,
  },
  btnWrapper: {
    position: "relative",
    alignItems: "center",
  },
  circleBtn: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    borderBottomWidth: 3,
    borderBottomColor: colors.button.functionShadow,
    ...shadows.subtle,
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  btnIcon: {
    fontSize: 20,
    color: "#FFF",
    marginTop: -2,
  },
  btnSublabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  badge: {
    position: "absolute",
    bottom: -8,
    right: -4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  badgeTop: {
    bottom: undefined,
    top: -8,
    right: -4,
    backgroundColor: colors.accent,
    borderColor: colors.outlineStrong,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: "bold",
  }
});
