/**
 * Word Naija - ExtraWordsModal Component (v4 — Afro-Minimal Premium)
 * Glass slide-up panel for extra words collection.
 */

import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borderRadius, fontSize, spacing, shadows, fontFamily, gradients } from "../constants/theme";
import { EXTRA_WORDS_TARGET, EXTRA_WORDS_REWARD } from "../lib/game/gameState";

interface ExtraWordsModalProps {
  visible: boolean;
  extraWordsCollected: number;
  extraWordsThisLevel: number;
  onClose: () => void;
}

export default function ExtraWordsModal({
  visible,
  extraWordsCollected,
  extraWordsThisLevel,
  onClose,
}: ExtraWordsModalProps) {
  const progress = extraWordsCollected / EXTRA_WORDS_TARGET;
  const progressPercent = Math.min(progress * 100, 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close button */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Extra Words</Text>

          {/* Description */}
          <Text style={styles.description}>
            Try to collect more extra words!{"\n"}
            You can get coins when the Box is full!
          </Text>

          {/* Reward callout */}
          <View style={styles.rewardCallout}>
            <Text style={styles.rewardLabel}>You will get:</Text>
            <View style={styles.rewardRow}>
              <View style={styles.coinIcon}>
                <Text style={styles.coinIconText}>$</Text>
              </View>
              <Text style={styles.rewardAmount}>{EXTRA_WORDS_REWARD}</Text>
            </View>
          </View>

          {/* Chest illustration */}
          <View style={styles.chestContainer}>
            <Text style={styles.chestEmoji}>
              {extraWordsCollected >= EXTRA_WORDS_TARGET ? "🎁" : "📦"}
            </Text>
            {/* Word tiles spilling out */}
            <View style={styles.tilesRow}>
              {Array.from({ length: Math.min(extraWordsCollected, EXTRA_WORDS_TARGET) }).map((_, i) => (
                <View key={i} style={styles.miniTile}>
                  <Text style={styles.miniTileText}>✓</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Progress text */}
          <Text style={styles.progressText}>
            Extra words collected:{" "}
            <Text style={styles.progressCount}>
              {extraWordsCollected}/{EXTRA_WORDS_TARGET}
            </Text>
          </Text>

          {/* This level stat */}
          {extraWordsThisLevel > 0 && (
            <Text style={styles.levelStat}>
              Found {extraWordsThisLevel} extra word{extraWordsThisLevel !== 1 ? "s" : ""} this level
            </Text>
          )}

          {/* Close button */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.closeBtnPressed,
            ]}
          >
            <Text style={styles.closeBtnText}>Close</Text>
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
    backgroundColor: "rgba(10,24,20,0.95)",
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    borderRadius: 0,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.outlineStrong,
    ...shadows.soft,
  },

  /* Close X */
  closeButton: {
    position: "absolute",
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    zIndex: 10,
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },

  /* Title */
  title: {
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  /* Description */
  description: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  /* Reward callout */
  rewardCallout: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outlineGold,
  },
  rewardLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(212,168,67,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  coinIconText: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.textGold,
  },
  rewardAmount: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.extraBold,
    color: colors.textGold,
  },

  /* Chest */
  chestContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  chestEmoji: {
    fontSize: 56,
    marginBottom: spacing.xs,
  },
  tilesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 200,
  },
  miniTile: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.tile.background,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderWidth: 1,
    borderColor: colors.tile.border,
  },
  miniTileText: {
    fontSize: 9,
    color: colors.accent,
    fontFamily: fontFamily.bold,
  },

  /* Progress bar */
  progressBarOuter: {
    width: "100%",
    height: 10,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
  },

  /* Progress text */
  progressText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  progressCount: {
    fontFamily: fontFamily.extraBold,
    color: colors.textGold,
    fontSize: fontSize.md,
  },

  /* Level stat */
  levelStat: {
    fontSize: fontSize.xs,
    fontFamily: fontFamily.medium,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },

  /* Close button (bottom) */
  closeBtn: {
    backgroundColor: colors.button.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.button.secondaryBorder,
    minWidth: 160,
    alignItems: "center",
  },
  closeBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  closeBtnText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.semiBold,
  },
});
