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
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { colors, borderRadius, fontSize, spacing, shadows, fontFamily } from "../constants/theme";
import { EXTRA_WORDS_TARGET, EXTRA_WORDS_REWARD } from "../lib/game/gameState";
import { getDictionaryEntry } from "../lib/game/dictionaryLoader";
import Icon from "./Icon";

interface ExtraWordsModalProps {
  visible: boolean;
  extraWordsCollected: number;
  extraWordsThisLevel: number;
  extraWordsFound: Set<string>;
  onClose: () => void;
}

export default function ExtraWordsModal({
  visible,
  extraWordsCollected,
  extraWordsThisLevel,
  extraWordsFound,
  onClose,
}: ExtraWordsModalProps) {
  const progress = extraWordsCollected / EXTRA_WORDS_TARGET;
  const progressPercent = Math.min(progress * 100, 100);
  const wordList = Array.from(extraWordsFound);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          {/* Close button */}
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={14} color={colors.textPrimary} />
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Extra Words</Text>

          {/* Reward callout */}
          <View style={styles.rewardCallout}>
            <Text style={styles.rewardLabel}>Fill the box to earn</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon name="coin" size={14} color={colors.gold} />
              <Text style={styles.rewardAmount}>{EXTRA_WORDS_REWARD} coins</Text>
            </View>
          </View>

          {/* Word list */}
          {wordList.length > 0 ? (
            <ScrollView
              style={styles.wordList}
              showsVerticalScrollIndicator={false}
            >
              {wordList.map((word) => {
                const entry = getDictionaryEntry(word);
                return (
                  <View key={word} style={styles.wordRow}>
                    <Text style={styles.wordText}>{word}</Text>
                    <Text style={styles.wordMeaning}>
                      {entry?.meaning || "No definition available"}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search" size={36} color={colors.textMuted} />
              <Text style={styles.emptyText}>
                Discover words beyond the target list to collect them here!
              </Text>
            </View>
          )}

          {/* Progress bar */}
          <View style={styles.progressBarOuter}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Progress text */}
          <Text style={styles.progressText}>
            Box:{" "}
            <Text style={styles.progressCount}>
              {extraWordsCollected}/{EXTRA_WORDS_TARGET}
            </Text>
          </Text>

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
    backgroundColor: "rgba(10,24,20,0.75)",
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    overflow: "hidden" as const,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    width: "100%",
    maxHeight: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.outlineGoldStrong,
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
    marginBottom: spacing.sm,
  },

  /* Reward callout */
  rewardCallout: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(212,168,67,0.08)",
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineGold,
    marginBottom: spacing.md,
    alignSelf: "center",
  },
  rewardLabel: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    color: colors.textMuted,
  },
  rewardAmount: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.extraBold,
    color: colors.textGold,
  },

  /* Word list */
  wordList: {
    width: "100%",
    maxHeight: 220,
    marginBottom: spacing.md,
  },
  wordRow: {
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  wordText: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
  },
  wordMeaning: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyRegular,
    color: colors.textMuted,
    marginTop: 2,
  },

  /* Empty state */
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
    width: "100%",
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyRegular,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },

  /* Progress bar */
  progressBarOuter: {
    width: "100%",
    height: 10,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.gold,
    borderRadius: borderRadius.full,
  },

  /* Progress text */
  progressText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  progressCount: {
    fontFamily: fontFamily.extraBold,
    color: colors.textGold,
    fontSize: fontSize.md,
  },

  /* Close button */
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
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  closeBtnText: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontFamily: fontFamily.semiBold,
  },
});
