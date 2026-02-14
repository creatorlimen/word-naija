/**
 * Word Naija - LetterWheel Component
 * Displays available letters for selection
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import type { Letter } from "../lib/game/types";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

interface LetterWheelProps {
  letters: Letter[];
  selectedIndices: number[];
  currentWord: string;
  onSelectLetter: (index: number) => void;
  onClear: () => void;
}

export default function LetterWheel({
  letters,
  selectedIndices,
  currentWord,
  onSelectLetter,
  onClear,
}: LetterWheelProps) {
  const handlePress = useCallback(
    (index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectLetter(index);
    },
    [onSelectLetter]
  );

  return (
    <View style={styles.container}>
      {/* Current word preview */}
      {currentWord.length > 0 && (
        <View style={styles.wordPreview}>
          <Text style={styles.wordPreviewText}>{currentWord}</Text>
          <Pressable onPress={onClear} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        </View>
      )}

      {/* Letter tiles */}
      <View style={styles.tilesContainer}>
        {letters.map((letter, index) => {
          const isSelected = selectedIndices.includes(index);

          return (
            <Pressable
              key={index}
              onPress={() => handlePress(index)}
              disabled={isSelected}
              style={({ pressed }) => [
                styles.tile,
                isSelected && styles.tileSelected,
                pressed && !isSelected && styles.tilePressed,
              ]}
            >
              <Text
                style={[
                  styles.tileText,
                  isSelected && styles.tileTextSelected,
                ]}
              >
                {letter.char}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const TILE_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  wordPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    minWidth: 120,
    justifyContent: "center",
  },
  wordPreviewText: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: 4,
  },
  clearButton: {
    marginLeft: spacing.md,
    width: 28,
    height: 28,
    borderRadius: borderRadius.round,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 280,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 6,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.letterTile,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tileSelected: {
    backgroundColor: colors.letterTileSelected,
    elevation: 1,
  },
  tilePressed: {
    backgroundColor: colors.secondary,
    transform: [{ scale: 0.95 }],
  },
  tileText: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.letterText,
  },
  tileTextSelected: {
    color: colors.letterTextSelected,
  },
});
