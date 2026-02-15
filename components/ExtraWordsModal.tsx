/**
 * Word Naija - ExtraWordsModal Component
 * Shows extra words collection progress with a treasure chest theme.
 * Awards coins when the box is full (10 words = 15 coins).
 */

import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
} from "react-native";
import { colors, borderRadius, fontSize, spacing, shadows } from "../constants/theme";
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  modal: {
    backgroundColor: "#00838F", // Teal like the reference
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD54F",
    ...shadows.small,
  },

  /* Close X button */
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* Title */
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: spacing.sm,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  /* Description */
  description: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.md,
  },

  /* Reward callout */
  rewardCallout: {
    backgroundColor: "#FFF",
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: spacing.md,
    ...shadows.small,
  },
  rewardLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: "#333",
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
    backgroundColor: "#FFC107",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  coinIconText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#5D4037",
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: "900",
    color: "#333",
  },

  /* Chest */
  chestContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  chestEmoji: {
    fontSize: 72,
    marginBottom: spacing.xs,
  },
  tilesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 200,
  },
  miniTile: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: colors.tile.background,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    borderWidth: 1,
    borderColor: colors.tile.border,
  },
  miniTileText: {
    fontSize: 10,
    color: colors.tile.text,
    fontWeight: "bold",
  },

  /* Progress bar */
  progressBarOuter: {
    width: "100%",
    height: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#66BB6A",
    borderRadius: 10,
    // Glossy effect via border
    borderTopWidth: 2,
    borderTopColor: "rgba(255,255,255,0.4)",
  },

  /* Progress text */
  progressText: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacing.xs,
  },
  progressCount: {
    fontWeight: "900",
    color: "#FFD54F",
    fontSize: fontSize.md,
  },

  /* Level stat */
  levelStat: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.6)",
    marginBottom: spacing.md,
  },

  /* Close button (bottom) */
  closeBtn: {
    backgroundColor: "#43A047",
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderBottomWidth: 4,
    borderBottomColor: "#2E7D32",
    minWidth: 160,
    alignItems: "center",
    ...shadows.small,
  },
  closeBtnPressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  closeBtnText: {
    color: "#FFF",
    fontSize: fontSize.lg,
    fontWeight: "800",
  },
});
