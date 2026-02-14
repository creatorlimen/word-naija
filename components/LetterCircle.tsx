/**
 * Word Naija - LetterCircle Component
 * Displays available letters arranged in a circle for tapping.
 * Matches the reference game: letters scattered in a circular layout,
 * with a word preview bar above that shows the current selection.
 */

import React, { useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import * as Haptics from "expo-haptics";
import type { Letter } from "../lib/game/types";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH - 64, 300);
const TILE_SIZE = 54;

interface LetterCircleProps {
  letters: Letter[];
  selectedIndices: number[];
  currentWord: string;
  onSelectLetter: (index: number) => void;
  onClear: () => void;
}

export default function LetterCircle({
  letters,
  selectedIndices,
  currentWord,
  onSelectLetter,
  onClear,
}: LetterCircleProps) {
  const handlePress = useCallback(
    (index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectLetter(index);
    },
    [onSelectLetter]
  );

  // Calculate position for each letter in a circle
  const positions = useMemo(() => {
    const count = letters.length;
    const radius = (CIRCLE_SIZE - TILE_SIZE) / 2 - 4;
    const centerX = CIRCLE_SIZE / 2 - TILE_SIZE / 2;
    const centerY = CIRCLE_SIZE / 2 - TILE_SIZE / 2;
    const angleOffset = -Math.PI / 2; // Start from top

    return letters.map((_, i) => {
      const angle = angleOffset + (2 * Math.PI * i) / count;
      return {
        left: centerX + radius * Math.cos(angle),
        top: centerY + radius * Math.sin(angle),
      };
    });
  }, [letters.length]);

  return (
    <View style={styles.container}>
      {/* Word preview bar */}
      <View style={styles.wordPreviewBar}>
        {currentWord.length > 0 ? (
          <View style={styles.wordPreview}>
            <Text style={styles.wordPreviewText}>{currentWord}</Text>
            <Pressable onPress={onClear} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.wordPlaceholder}>Tap letters to form a word</Text>
        )}
      </View>

      {/* Circular letter arrangement */}
      <View style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}>
        {letters.map((letter, index) => {
          const isSelected = selectedIndices.includes(index);
          const pos = positions[index];

          return (
            <Pressable
              key={index}
              onPress={() => handlePress(index)}
              disabled={isSelected}
              style={({ pressed }) => [
                styles.tile,
                { left: pos.left, top: pos.top },
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

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  wordPreviewBar: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  wordPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    minWidth: 120,
    justifyContent: "center",
  },
  wordPreviewText: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: 4,
  },
  wordPlaceholder: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontStyle: "italic",
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
  circle: {
    position: "relative",
  },
  tile: {
    position: "absolute",
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.letterTile,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tileSelected: {
    backgroundColor: colors.letterTileSelected,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  tilePressed: {
    backgroundColor: colors.secondary,
    transform: [{ scale: 0.92 }],
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
