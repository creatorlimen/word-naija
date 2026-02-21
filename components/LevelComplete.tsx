/**
 * Word Naija - LevelComplete Component
 * Modal shown when all target words are found
 */

import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import type { Level } from "../lib/game/types";
import { colors, borderRadius, fontSize, spacing, shadows } from "../constants/theme";

interface LevelCompleteProps {
  visible: boolean;
  level: Level;
  solvedWords: Set<string>;
  extraWords: Set<string>;
  coinsEarned: number;
  onNextLevel: () => void;
  onPlayAgain: () => void;
}

export default function LevelComplete({
  visible,
  level,
  solvedWords,
  extraWords,
  coinsEarned,
  onNextLevel,
  onPlayAgain,
}: LevelCompleteProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={styles.title}>Level Complete!</Text>
          <Text style={styles.subtitle}>{level.title}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={styles.statLabel}>Words</Text>
              <Text style={styles.statValue}>{solvedWords.size}</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statLabel}>Bonus</Text>
              <Text style={styles.statValue}>{extraWords.size}</Text>
            </View>
            <View style={styles.statChipAccent}>
              <Text style={styles.statLabelAccent}>Coins</Text>
              <Text style={styles.statValueAccent}>🪙 {coinsEarned}</Text>
            </View>
          </View>

          {/* Word meanings */}
          <ScrollView
            style={styles.meaningsScroll}
            showsVerticalScrollIndicator={false}
          >
            {level.targetWords.map((tw) => (
              <View key={tw.word} style={styles.meaningRow}>
                <Text style={styles.meaningWord}>{tw.word}</Text>
                <Text style={styles.meaningText}>
                  {tw.meaning || "No definition available"}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Action buttons */}
          <Pressable
            onPress={onNextLevel}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Next Level →</Text>
          </Pressable>

          <Pressable
            onPress={onPlayAgain}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>Play Again</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  modal: {
    backgroundColor: "#0e2318",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: "100%",
    maxHeight: "80%",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.soft,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.sm,
    width: "100%",
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: "flex-start",
    gap: 2,
  },
  statChipAccent: {
    flex: 1,
    backgroundColor: "rgba(34,160,107,0.12)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: "flex-start",
    gap: 2,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statValueAccent: {
    fontSize: fontSize.lg,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  statLabelAccent: {
    fontSize: fontSize.xs,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  meaningsScroll: {
    maxHeight: 180,
    width: "100%",
    marginBottom: spacing.md,
  },
  meaningRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  meaningWord: {
    fontSize: fontSize.md,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  meaningText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    ...shadows.subtle,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.foreground,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textMuted,
  },
});
