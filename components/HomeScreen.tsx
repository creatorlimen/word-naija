/**
 * Word Naija - HomeScreen Component (v4 — Afro-Minimal Premium)
 * Dashboard with glass cards, gold accents, Poppins typography.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  colors,
  borderRadius,
  fontSize,
  spacing,
  gradients,
  shadows,
  fontFamily,
} from "../constants/theme";
import { TOTAL_LEVELS } from "../lib/game/levelLoader";
import Achievements from "./Achievements";
import DecoBackground from "./DecoBackground";
import Icon from "./Icon";
import type { IconName } from "./Icon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const [showAchievements, setShowAchievements] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={gradients.background}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <DecoBackground variant="home" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header with logo ── */}
        <View style={styles.headerRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          {achievements.length > 0 && (
            <Pressable
              style={styles.achievementChip}
              onPress={() => setShowAchievements((v) => !v)}
            >
              <Icon name="medal" size={14} color={colors.gold} />
              <Text style={styles.achievementChipCount}>{achievements.length}</Text>
            </Pressable>
          )}
        </View>

        {/* ── Wordmark ── */}
        <View style={styles.wordmarkSection}>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        {/* ── Stats Card — glass panel ── */}
        <View style={styles.statsCard}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={gradients.glass}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Text style={styles.statsCardTitle}>Game Stats</Text>
          <Text style={styles.statsCardSub}>Daily Progress {progressPercent}%</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatCard value={levelsCompleted} label="Levels" iconName="trophy" />
            <StatCard value={coins} label="Coins" iconName="coin" highlight />
            <StatCard value={`${progressPercent}%`} label="Progress" iconName="chart" />
          </View>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradients.cta}
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressLabel}>
            {levelsCompleted} of {TOTAL_LEVELS} levels completed
          </Text>
        </View>

        {/* ── Achievement section ── */}
        {showAchievements && achievements.length > 0 && (
          <View style={styles.achievementCard}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={gradients.glass}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <Achievements achievements={achievements} />
          </View>
        )}

        {/* ── Feature grid (first-time only) ── */}
        {levelsCompleted === 0 && (
          <View style={styles.featureGrid}>
            <FeatureCard iconName="book" title="Bilingual" text="Learn Nigerian & English words" />
            <FeatureCard iconName="puzzle" title="Crosswords" text="Intersecting handcrafted puzzles" />
            <FeatureCard iconName="coin" title="Earn Coins" text="Collect extras, spend on hints" />
            <FeatureCard iconName="target" title="Daily Run" text="Short sessions, bonus rewards" />
          </View>
        )}

        {/* ── CTA Button ── */}
        <Pressable
          onPress={onStart}
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
        >
          <LinearGradient
            colors={gradients.ctaGold}
            style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.full }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.5 }}
          />
          <Text style={styles.startButtonText}>
            {levelsCompleted > 0 ? "Continue Playing" : "Start Playing"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ── Sub-components ── */

function FeatureCard({ iconName, title, text }: { iconName: IconName; title: string; text: string }) {
  return (
    <View style={styles.featureCard}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={gradients.glass}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <Icon name={iconName} size={22} color={colors.gold} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function StatCard({
  label,
  value,
  iconName,
  highlight,
}: {
  label: string;
  value: string | number;
  iconName?: IconName;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.statCard, highlight && styles.statCardHighlight]}>
      {iconName && <Icon name={iconName} size={18} color={highlight ? colors.gold : colors.textMuted} />}
      <Text style={[styles.statValue, highlight && styles.statValueGold]}>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1}>{label}</Text>
    </View>
  );
}

/* ── Styles ── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },

  /* Header */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceGlass,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: "hidden",
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  achievementChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.outlineGold,
  },
  achievementChipIcon: {
    fontSize: 14,
  },
  achievementChipCount: {
    color: colors.textGold,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
  },

  /* Wordmark */
  wordmarkSection: {
    marginTop: -spacing.sm,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  /* Stats card */
  statsCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.outlineGoldStrong,
    overflow: "hidden",
    gap: spacing.md,
    ...shadows.soft,
  },
  statsCardTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  statsCardSub: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    color: colors.textMuted,
    marginTop: -spacing.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: "center",
    gap: 2,
  },
  statCardHighlight: {
    borderColor: colors.outlineGold,
    backgroundColor: "rgba(212,168,67,0.08)",
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
  },
  statValueGold: {
    color: colors.textGold,
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
  progressLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodyMedium,
    marginTop: -spacing.xs,
  },

  /* Achievement card */
  achievementCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineStrong,
    overflow: "hidden",
  },

  /* Feature grid */
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  featureCard: {
    width: (SCREEN_WIDTH - spacing.xl * 2 - spacing.md) / 2,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    gap: spacing.xs,
    overflow: "hidden",
  },
  featureIcon: {
    fontSize: 22,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  featureText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyRegular,
    color: colors.textMuted,
    lineHeight: 18,
  },

  /* CTA Button */
  startButton: {
    overflow: "hidden",
    paddingVertical: spacing.lg + 2,
    borderRadius: borderRadius.full,
    alignItems: "center",
    ...shadows.soft,
  },
  startButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  startButtonText: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: "#3A2F2A",
    letterSpacing: 0.5,
  },
});
