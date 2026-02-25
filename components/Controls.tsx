/**
 * Word Naija - Controls Component
 * Game action buttons: shuffle, hint, sound, reset
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing, fontFamily } from "../constants/theme";

interface ControlsProps {
  levelNumber: number;
  coins: number;
  soundEnabled: boolean;
  onShuffle: () => void;
  onHint: () => void;
  onToggleSound: () => void;
  onReset: () => void;
}

export default function Controls({
  levelNumber,
  coins,
  soundEnabled,
  onShuffle,
  onHint,
  onToggleSound,
  onReset,
}: ControlsProps) {
  return (
    <View style={styles.container}>
      {/* Level & Coins info */}
      <View style={styles.infoRow}>
        <Text style={styles.levelText}>Level {levelNumber}</Text>
        <Text style={styles.coinText}>🪙 {coins}</Text>
      </View>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <ControlButton label="🔀" sublabel="Shuffle" onPress={onShuffle} />
        <ControlButton
          label="💡"
          sublabel="Hint (40)"
          onPress={onHint}
          disabled={coins < 40}
        />
        <ControlButton
          label={soundEnabled ? "🔊" : "🔇"}
          sublabel="Sound"
          onPress={onToggleSound}
        />
        <ControlButton label="🔄" sublabel="Reset" onPress={onReset} />
      </View>
    </View>
  );
}

function ControlButton({
  label,
  sublabel,
  onPress,
  disabled = false,
}: {
  label: string;
  sublabel: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.controlButton,
        pressed && styles.controlButtonPressed,
        disabled && styles.controlButtonDisabled,
      ]}
    >
      <Text style={styles.controlEmoji}>{label}</Text>
      <Text
        style={[styles.controlLabel, disabled && styles.controlLabelDisabled]}
      >
        {sublabel}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  levelText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.semiBold,
    color: colors.foreground,
  },
  coinText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.semiBold,
    color: colors.secondary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  controlButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.1)",
    minWidth: 64,
  },
  controlButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: [{ scale: 0.95 }],
  },
  controlButtonDisabled: {
    opacity: 0.4,
  },
  controlEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  controlLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: colors.foreground,
  },
  controlLabelDisabled: {
    color: colors.muted,
  },
});
