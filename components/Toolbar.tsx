/**
 * Word Naija - Toolbar Component
 * Fixed bottom bar: Shuffle, Hint, coin display
 * Matches reference game design
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

interface ToolbarProps {
  coins: number;
  hintCost: number;
  onShuffle: () => void;
  onHint: () => void;
}

export default function Toolbar({
  coins,
  hintCost,
  onShuffle,
  onHint,
}: ToolbarProps) {
  const canHint = coins >= hintCost;

  return (
    <View style={styles.container}>
      {/* Shuffle */}
      <Pressable
        onPress={onShuffle}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonIcon}>🔀</Text>
        <Text style={styles.buttonLabel}>SHUFFLE</Text>
      </Pressable>

      {/* Coins display */}
      <View style={styles.coinDisplay}>
        <Text style={styles.coinText}>🪙 {coins}</Text>
      </View>

      {/* Hint */}
      <Pressable
        onPress={onHint}
        disabled={!canHint}
        style={({ pressed }) => [
          styles.button,
          !canHint && styles.buttonDisabled,
          pressed && canHint && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonIcon}>💡</Text>
        <Text style={[styles.buttonLabel, !canHint && styles.labelDisabled]}>
          HINT
        </Text>
        <Text style={[styles.costText, !canHint && styles.labelDisabled]}>
          {hintCost}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  button: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    minWidth: 80,
  },
  buttonPressed: {
    backgroundColor: "rgba(255,255,255,0.12)",
    transform: [{ scale: 0.95 }],
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  buttonLabel: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: 1,
  },
  labelDisabled: {
    color: colors.muted,
  },
  costText: {
    fontSize: 10,
    color: colors.secondary,
    marginTop: 1,
  },
  coinDisplay: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.round,
  },
  coinText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.secondary,
  },
});
