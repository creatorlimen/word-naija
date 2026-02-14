/**
 * Word Naija - HomeScreen Component
 * Welcome screen with stats and start button
 */

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";
import { TOTAL_LEVELS } from "../lib/game/levelLoader";
import Achievements from "./Achievements";

interface HomeScreenProps {
  coins: number;
  levelsCompleted: number;
  achievements?: string[];
  onStart: () => void;
}

export default function HomeScreen({
  coins,
  levelsCompleted,
  achievements = [],
  onStart,
}: HomeScreenProps) {
  const progressPercent = Math.round((levelsCompleted / TOTAL_LEVELS) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

      {/* Logo area */}
      <View style={styles.logoArea}>
        <Text style={styles.logoEmoji}>🇳🇬</Text>
        <Text style={styles.title}>Word Naija</Text>
        <Text style={styles.subtitle}>Nigerian Word Puzzle</Text>
      </View>

      {/* Stats cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{levelsCompleted}</Text>
          <Text style={styles.statLabel}>Levels</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🪙 {coins}</Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{progressPercent}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {levelsCompleted} of {TOTAL_LEVELS} levels completed
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <FeatureItem emoji="📖" text="Learn Nigerian & English words" />
        <FeatureItem emoji="🧩" text="Solve crossword puzzles" />
        <FeatureItem emoji="🪙" text="Earn coins & use hints" />
      </View>

      {/* Achievements */}
      <Achievements achievements={achievements} />

      {/* Start button */}
      <Pressable
        onPress={onStart}
        style={({ pressed }) => [
          styles.startButton,
          pressed && styles.startButtonPressed,
        ]}
      >
        <Text style={styles.startButtonText}>
          {levelsCompleted > 0 ? "Continue Playing" : "Start Playing"}
        </Text>
      </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: "900",
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.secondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    minWidth: 90,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.foreground,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.muted,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: borderRadius.round,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: borderRadius.round,
  },
  progressLabel: {
    color: colors.muted,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: 6,
  },
  features: {
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.foreground,
  },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.foreground,
  },
});
