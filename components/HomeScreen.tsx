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
import { useGameState, useGameActions } from "../lib/game/context";
import DecoBackground from "./DecoBackground";
import Icon from "./Icon";
import type { IconName } from "./Icon";
import MedalBadge from "./MedalBadge";
import SettingsModal from "./SettingsModal";

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
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useGameState();
  const actions = useGameActions();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View style={styles.logoBadge}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Title ── */}
        <Text style={styles.title}>Dashboard</Text>

        {/* ── Stats Card — two-column layout ── */}
        <View style={styles.statsCard}>
          <BlurView intensity={60} tint="dark" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={gradients.glass}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.statsInner}>
            {/* Left column — text stats */}
            <View style={styles.statsLeft}>
              <Text style={styles.statsCardTitle}>Game Stats</Text>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Daily Progress:</Text>
                <Text style={styles.statRowValue}>{progressPercent}%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statRowLabel}>Coins:</Text>
                <Text style={styles.statRowValueGold}>{coins}</Text>
              </View>
            </View>
            {/* Right column — medal hero */}
            <View style={styles.statsRight}>
              <MedalBadge size={100} />
            </View>
          </View>
        </View>

        {/* ── Achievement section ── */}
        <Text style={styles.achievementHeading}>Achievement</Text>

        <View style={styles.achievementList}>
          <AchievementRow
            iconName="star"
            iconBg="#1C7C57"
            title="Earns"
            subtitle={`Daily Progress: ${progressPercent}%`}
          />
          <AchievementRow
            iconName="trophy"
            iconBg="#A68632"
            title="Achievement"
            subtitle={`Achievement: ${Math.min(progressPercent + 10, 100)}%`}
          />
        </View>

        {/* ── Feature grid (first-time only) ── */}
        {levelsCompleted === 0 && (
          <View style={styles.featureGrid}>
            <FeatureCard iconName="book" title="Bilingual" text="Learn Nigerian & English words" />
            <FeatureCard iconName="puzzle" title="Crosswords" text="Intersecting handcrafted puzzles" />
            <FeatureCard iconName="coin" title="Earn Coins" text="Collect extras, spend on hints" />
            <FeatureCard iconName="target" title="Daily Run" text="Short sessions, bonus rewards" />
          </View>
        )}
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
      <BottomTabBar onPlay={onStart} onSettings={() => setShowSettings(true)} />

      {/* ── Settings Modal ── */}
      <SettingsModal
        visible={showSettings}
        soundEnabled={state?.soundEnabled ?? true}
        onToggleSound={() => actions.toggleSound()}
        onClose={() => setShowSettings(false)}
        onHowToPlay={() => setShowSettings(false)}
        onQuit={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
}

/* ── Sub-components ── */

function AchievementRow({
  iconName,
  iconBg,
  title,
  subtitle,
}: {
  iconName: IconName;
  iconBg: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.achievementRow}>
      <View style={[styles.achievementIcon, { backgroundColor: iconBg }]}>
        <Icon name={iconName} size={18} color="#FFFFFF" />
      </View>
      <View style={styles.achievementTextCol}>
        <Text style={styles.achievementTitle}>{title}</Text>
        <Text style={styles.achievementSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

function FeatureCard({ iconName, title, text }: { iconName: IconName; title: string; text: string }) {
  return (
    <View style={styles.featureCard}>
      <BlurView intensity={50} tint="dark" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
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

function BottomTabBar({
  onPlay,
  onSettings,
}: {
  onPlay: () => void;
  onSettings?: () => void;
}) {
  return (
    <View style={styles.tabBar}>
      <BlurView intensity={40} tint="dark" experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(8,20,16,0.6)" }]} />

      {/* Home tab (active) */}
      <Pressable style={styles.tabItem}>
        <View style={styles.tabIconActive}>
          <Icon name="grid" size={20} color="#FFFFFF" />
        </View>
      </Pressable>

      {/* Play tab (center CTA) */}
      <Pressable
        onPress={onPlay}
        style={({ pressed }) => [
          styles.tabPlayButton,
          pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
        ]}
      >
        <LinearGradient
          colors={gradients.ctaGold}
          style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.full }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
        />
        <Icon name="play" size={24} color="#3A2F2A" />
      </Pressable>

      {/* Settings tab */}
      <Pressable style={styles.tabItem} onPress={onSettings}>
        <Icon name="settings" size={22} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

/* ── Styles ── */

const TAB_BAR_HEIGHT = 72;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: TAB_BAR_HEIGHT + spacing.xl,
    gap: spacing.xxl,
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

  /* Title */
  title: {
    fontSize: fontSize.xxxl,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  /* ── Stats card (two-column) ── */
  statsCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.outlineGoldStrong,
    overflow: "hidden",
    ...shadows.soft,
  },
  statsInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsLeft: {
    flex: 1,
    gap: spacing.sm,
  },
  statsCardTitle: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statRow: {
    gap: 2,
  },
  statRowLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    color: colors.textMuted,
  },
  statRowValue: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    lineHeight: fontSize.xxl + 4,
  },
  statRowValueGold: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.extraBold,
    color: colors.textGold,
    lineHeight: fontSize.xxl + 4,
  },
  statsRight: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },

  /* ── Achievement section ── */
  achievementHeading: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  achievementList: {
    gap: spacing.md,
    marginTop: -spacing.sm,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAF6F0",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.subtle,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementTextCol: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: "#3A2F2A",
  },
  achievementSubtitle: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyRegular,
    color: "#7A7068",
  },

  /* ── Feature grid ── */
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

  /* ── Bottom Tab Bar ── */
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    overflow: "hidden",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
  },
  tabIconActive: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceGlass,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outlineGold,
  },
  tabPlayButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    ...shadows.glow,
  },
});
