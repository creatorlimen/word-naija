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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  borderRadius,
  fontSize,
  spacing,
  gradients,
  shadows,
} from "../constants/theme";
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
  const streakDays = Math.max(1, Math.min(7, Math.floor(levelsCompleted / 2)));
  const dailyBonusCoins = 30;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={gradients.background}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero / wordmark */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.wordmarkRow}>
              <View style={styles.flagBadge}>
                <Text style={styles.flagText}>🇳🇬</Text>
              </View>
              <View>
                <Text style={styles.title}>Word Naija</Text>
                <Text style={styles.subtitle}>Afro-minimal word puzzle</Text>
              </View>
            </View>
            <View style={styles.streakChip}>
              <Text style={styles.chipEmoji}>🔥</Text>
              <Text style={styles.chipText}>{streakDays} day streak</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatCard label="Levels" value={levelsCompleted} />
            <StatCard label="Coins" value={`🪙 ${coins}`} />
            <StatCard label="Progress" value={`${progressPercent}%`} />
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressLabel}>
              {levelsCompleted} of {TOTAL_LEVELS} levels completed
            </Text>
          </View>
        </View>

        {/* Feature grid */}
        <View style={styles.featureGrid}>
          <FeatureCard emoji="📖" title="Bilingual" text="Learn Nigerian & English words" />
          <FeatureCard emoji="🧩" title="Crosswords" text="Intersecting puzzles that feel handcrafted" />
          <FeatureCard emoji="🪙" title="Earn coins" text="Collect extras, spend on smarter hints" />
          <FeatureCard emoji="🎯" title="Daily run" text="Short sessions with bonus rewards" />
        </View>

        {/* Daily challenge */}
        <View style={styles.dailyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dailyTitle}>Daily Challenge</Text>
            <Text style={styles.dailyText}>Finish one level today to claim +{dailyBonusCoins} coins.</Text>
          </View>
          <View style={styles.dailyBadge}>
            <Text style={styles.dailyBadgeText}>+{dailyBonusCoins}</Text>
          </View>
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
          <LinearGradient
            colors={gradients.cta}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.startButtonText}>
            {levelsCompleted > 0 ? "Continue Playing" : "Start Playing"}
          </Text>
          <Text style={styles.startButtonSub}>3x coins on your next level</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.outline,
    gap: spacing.md,
    ...shadows.subtle,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  flagBadge: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  flagText: {
    fontSize: 26,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  streakChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  chipEmoji: { fontSize: 16, marginRight: 6 },
  chipText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    ...shadows.subtle,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.4,
  },
  progressSection: {
    gap: spacing.xs,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "left",
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  featureCard: {
    width: "47%",
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.outline,
    gap: spacing.xs,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  dailyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.outline,
    ...shadows.subtle,
  },
  dailyTitle: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  dailyText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
  dailyBadge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
  },
  dailyBadgeText: {
    color: colors.foreground,
    fontSize: fontSize.md,
    fontWeight: "800",
  },
  startButton: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    ...shadows.soft,
  },
  startButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  startButtonText: {
    fontSize: fontSize.xl,
    fontWeight: "900",
    color: colors.foreground,
    letterSpacing: 0.4,
  },
  startButtonSub: {
    fontSize: fontSize.sm,
    color: colors.foreground,
    marginTop: 4,
    opacity: 0.85,
  },
});
