/**
 * Word Naija - Achievements Component
 * Displays earned badges on HomeScreen
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

interface AchievementsProps {
  achievements: string[];
}

const BADGE_MAP: Record<string, { emoji: string; label: string }> = {
  "level-5": { emoji: "⭐", label: "5 Levels" },
  "level-10": { emoji: "🌟", label: "10 Levels" },
  "level-25": { emoji: "💫", label: "25 Levels" },
  "level-50": { emoji: "👑", label: "50 Levels" },
  "coins-100": { emoji: "🥉", label: "100 Coins" },
  "coins-500": { emoji: "🥈", label: "500 Coins" },
  "coins-1000": { emoji: "🥇", label: "1K Coins" },
  "extra-10": { emoji: "🔎", label: "10 Bonus" },
  "extra-50": { emoji: "🏅", label: "50 Bonus" },
  "extra-100": { emoji: "🏆", label: "100 Bonus" },
};

export default function Achievements({ achievements }: AchievementsProps) {
  if (achievements.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Achievements</Text>
        <Text style={styles.emptyText}>
          Complete levels to earn badges!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Achievements</Text>
      <View style={styles.badgeGrid}>
        {achievements.map((id) => {
          const badge = BADGE_MAP[id];
          if (!badge) return null;
          return (
            <View key={id} style={styles.badge}>
              <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              <Text style={styles.badgeLabel}>{badge.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.muted,
    textAlign: "center",
    fontStyle: "italic",
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    minWidth: 72,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeLabel: {
    fontSize: fontSize.xs,
    color: colors.foreground,
    marginTop: 2,
  },
});
