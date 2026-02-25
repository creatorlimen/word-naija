/**
 * Word Naija - Achievements Component (v4 — Afro-Minimal Premium)
 * Glass badge grid with gold accents.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing, fontFamily } from "../constants/theme";

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
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    minWidth: 76,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  badgeLabel: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
    marginTop: 2,
  },
});
