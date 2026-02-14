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
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

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
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{solvedWords.size}</Text>
              <Text style={styles.statLabel}>Words</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{extraWords.size}</Text>
              <Text style={styles.statLabel}>Bonus</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>🪙 {coinsEarned}</Text>
              <Text style={styles.statLabel}>Coins</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  modal: {
    backgroundColor: colors.foreground,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    width: "100%",
    maxHeight: "80%",
    alignItems: "center",
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.mutedDark,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    minWidth: 80,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.foregroundDark,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.foregroundDark,
    marginTop: 2,
  },
  meaningsScroll: {
    maxHeight: 180,
    width: "100%",
    marginBottom: spacing.md,
  },
  meaningRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  meaningWord: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
  },
  meaningText: {
    fontSize: fontSize.sm,
    color: colors.mutedDark,
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
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.muted,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.foreground,
  },
  secondaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.mutedDark,
  },
});
