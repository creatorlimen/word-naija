import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { colors, borderRadius, fontSize, spacing, shadows, fontFamily } from "../constants/theme";
import Sparkle from "./Sparkle";
import Icon from "./Icon";
import type { IconName } from "./Icon";

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
  iconName, 
  sublabel,
  onPress, 
  color = colors.button.function,
  badge,
  topBadge,
  pulseAnim,
  glowColor,
  sparkleTrigger,
  topBadgeOffset = -4,
  topBadgeTop = -8,
}: { 
  iconName: IconName; 
  sublabel: string;
  onPress: () => void; 
  color?: string;
  badge?: string | number;
  topBadge?: string | number;
  pulseAnim?: Animated.Value;
  glowColor?: string;
  sparkleTrigger?: number;
  topBadgeOffset?: number;
  topBadgeTop?: number;
}) {
  const inner = (
    <View style={styles.btnWrapper}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.circleBtn,
          { backgroundColor: glowColor ?? color },
          pressed && styles.pressed,
        ]}
      >
        <Icon name={iconName} size={16} color="#FFF" />
        <Text style={styles.btnSublabel}>{sublabel}</Text>
      </Pressable>
      {topBadge !== undefined && (
        <View pointerEvents="none" style={[styles.badge, styles.badgeTop, { right: topBadgeOffset, top: topBadgeTop }]}>
          <Text style={styles.badgeText}>{topBadge}</Text>
        </View>
      )}
      {badge !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Sparkle trigger={sparkleTrigger ?? 0} />
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
  const [isGlowing, setIsGlowing] = useState(false);
  const [extraBurstKey, setExtraBurstKey] = useState(0);

  useEffect(() => {
    const prev = prevExtraRef.current;

    if (extraWordsCollected > prev) {
      // New extra word added — gentle bounce
      Animated.sequence([
        Animated.spring(pulseAnim, { toValue: 1.35, useNativeDriver: true, speed: 40, bounciness: 14 }),
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }),
      ]).start();
    } else if (extraWordsCollected === 0 && prev > 0) {
      // Box just filled — coins awarded — big burst + gold glow + sparkle
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 900);
      setExtraBurstKey(k => k + 1);
      Animated.sequence([
        Animated.spring(pulseAnim, { toValue: 1.6, useNativeDriver: true, speed: 60, bounciness: 22 }),
        Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }),
      ]).start();
    }

    prevExtraRef.current = extraWordsCollected;
  }, [extraWordsCollected]);

  return (
    <View style={styles.container}>
      {/* 1. Hint — cost shown as top badge, label centered */}
      <CircleButton
        iconName="hint"
        sublabel="HINT"
        onPress={onHint}
        topBadge={hintCost}
        color={colors.button.primary}
        topBadgeOffset={-8}
        topBadgeTop={-4}
      />

      {/* 2. Shuffle */}
      <CircleButton iconName="shuffle" sublabel="SHUFFLE" onPress={onShuffle} />

      {/* 3. Extra */}
      <CircleButton
        iconName="package"
        sublabel="EXTRA"
        onPress={onExtra}
        topBadge={`${extraWordsCollected}/${extraWordsTarget}`}
        pulseAnim={pulseAnim}
        glowColor={isGlowing ? "#C9A227" : undefined}
        sparkleTrigger={extraBurstKey}
        topBadgeOffset={-20}
        topBadgeTop={-4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.outline,
    borderWidth: 1,
    borderRadius: borderRadius.full,
  },
  btnWrapper: {
    position: "relative",
    alignItems: "center",
  },
  circleBtn: {
    width: 50,
    height: 50,
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
    fontSize: 14,
    color: "#FFF",
    marginTop: -2,
  },
  btnSublabel: {
    fontSize: 7,
    fontFamily: fontFamily.bold,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.4,
    marginTop: 2,
    textAlign: "center",
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
    zIndex: 10,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 10,
    fontFamily: fontFamily.bold,
  }
});
