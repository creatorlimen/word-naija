/**
 * Word Naija - LevelComplete Component (v4 — Afro-Minimal Premium)
 * Slide-up glass modal for level completion.
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
import { LinearGradient } from "expo-linear-gradient";
import type { Level } from "../lib/game/types";
import { colors, borderRadius, fontSize, spacing, shadows, fontFamily, gradients } from "../constants/theme";

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
              <Text style={styles.statIcon}>📝</Text>
              <Text style={styles.statValue}>{solvedWords.size}</Text>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statLabel}>Bonus</Text>
              <Text style={styles.statIconBonus}>⭐</Text>
              <Text style={styles.statValue}>{extraWords.size}</Text>
            </View>
            <View style={styles.statChipAccent}>
              <Text style={styles.statLabelAccent}>Coins</Text>
              <Text style={styles.statIcon}>🪙</Text>
              <Text style={styles.statValueAccent}>{coinsEarned}</Text>
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
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "rgba(8,20,16,0.96)",
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    width: "100%",
    maxHeight: "85%",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.outlineStrong,
    ...shadows.soft,
  },
  emoji: {
    fontSize: 36,
    marginBottom: 0,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.sm,
    gap: spacing.sm,
    width: "100%",
  },
  statChip: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: "center",
    gap: 1,
  },
  statChipAccent: {
    flex: 1,
    backgroundColor: "rgba(212,168,67,0.08)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.outlineGold,
    alignItems: "center",
    gap: 1,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  statIcon: {
    fontSize: fontSize.md,
  },
  statIconBonus: {
    fontSize: fontSize.md,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  statValueAccent: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.extraBold,
    color: colors.textGold,
    textAlign: "center",
  },
  statLabelAccent: {
    fontSize: 10,
    fontFamily: fontFamily.medium,
    color: colors.textGold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  meaningsScroll: {
    maxHeight: 240,
    width: "100%",
    marginBottom: spacing.sm,
  },
  meaningRow: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  meaningWord: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  meaningText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.sm,
    ...shadows.subtle,
  },
  secondaryButton: {
    backgroundColor: colors.button.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.button.secondaryBorder,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.foreground,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.semiBold,
    color: colors.textMuted,
  },
});
