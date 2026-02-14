/**
 * Word Naija — LetterCircle Component (swipe-to-select)
 *
 * Letters arranged in a circle. The player drags a finger through
 * letters to build a word, then lifts to submit. Supports undo by
 * retracing back to the previous letter.
 */

import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import type { Letter } from "../lib/game/types";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH - 64, 300);
const TILE_SIZE = 54;
const HIT_RADIUS = TILE_SIZE / 2 + 8; // generous hit area

interface LetterCircleProps {
  letters: Letter[];
  selectedIndices: number[];
  currentWord: string;
  onSelectLetter: (index: number) => void;
  onUndoSelection: () => void;
  onClear: () => void;
  onCommit: () => void;
}

export default function LetterCircle({
  letters,
  selectedIndices,
  currentWord,
  onSelectLetter,
  onUndoSelection,
  onClear,
  onCommit,
}: LetterCircleProps) {
  // ── Tile positions (relative to circle container) ──
  const positions = useMemo(() => {
    const count = letters.length;
    const radius = (CIRCLE_SIZE - TILE_SIZE) / 2 - 4;
    const cx = CIRCLE_SIZE / 2;
    const cy = CIRCLE_SIZE / 2;
    const angleOffset = -Math.PI / 2; // start from top

    return letters.map((_, i) => {
      const angle = angleOffset + (2 * Math.PI * i) / count;
      return {
        // center of each tile (for hit-testing)
        centerX: cx + radius * Math.cos(angle),
        centerY: cy + radius * Math.sin(angle),
        // top-left for absolute layout
        left: cx + radius * Math.cos(angle) - TILE_SIZE / 2,
        top: cy + radius * Math.sin(angle) - TILE_SIZE / 2,
      };
    });
  }, [letters.length]);

  // ── Local tracking ref (avoids stale closure issues in gesture) ──
  const localSelected = useRef<number[]>([]);

  // Eagerly sync every render
  localSelected.current = [...selectedIndices];

  // ── Hit-test: which tile index is the finger over? ──
  const hitTest = useCallback(
    (x: number, y: number): number => {
      for (let i = 0; i < positions.length; i++) {
        const dx = x - positions[i].centerX;
        const dy = y - positions[i].centerY;
        if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) {
          return i;
        }
      }
      return -1;
    },
    [positions]
  );

  // ── Handle a touch/move point ──
  const processTouch = useCallback(
    (x: number, y: number) => {
      const idx = hitTest(x, y);
      if (idx === -1) return;

      const sel = localSelected.current;

      // Already the last selected tile → ignore
      if (sel.length > 0 && sel[sel.length - 1] === idx) return;

      // Backtrack: finger returned to second-to-last → undo last
      if (sel.length >= 2 && sel[sel.length - 2] === idx) {
        localSelected.current = sel.slice(0, -1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onUndoSelection();
        return;
      }

      // Already selected elsewhere → ignore
      if (sel.includes(idx)) return;

      // New tile → select
      localSelected.current = [...sel, idx];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelectLetter(idx);
    },
    [hitTest, onSelectLetter, onUndoSelection]
  );

  // ── PanResponder ──
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          processTouch(locationX, locationY);
        },
        onPanResponderMove: (evt) => {
          const { locationX, locationY } = evt.nativeEvent;
          processTouch(locationX, locationY);
        },
        onPanResponderRelease: () => {
          if (localSelected.current.length >= 2) {
            onCommit();
          } else {
            onClear();
          }
        },
        onPanResponderTerminate: () => {
          onClear();
        },
      }),
    [processTouch, onCommit, onClear]
  );

  return (
    <View style={styles.container}>
      {/* ── Word preview bar ── */}
      <View style={styles.wordPreviewBar}>
        {currentWord.length > 0 ? (
          <View style={styles.wordPreview}>
            <Text style={styles.wordPreviewText}>{currentWord}</Text>
          </View>
        ) : (
          <Text style={styles.wordPlaceholder}>
            Swipe letters to form a word
          </Text>
        )}
      </View>

      {/* ── Circular letter arrangement ── */}
      <View
        style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }]}
        {...panResponder.panHandlers}
      >
        {letters.map((letter, index) => {
          const isSelected = selectedIndices.includes(index);
          const pos = positions[index];

          return (
            <View
              key={index}
              style={[
                styles.tile,
                { left: pos.left, top: pos.top },
                isSelected && styles.tileSelected,
              ]}
              pointerEvents="none"
            >
              <Text
                style={[
                  styles.tileText,
                  isSelected && styles.tileTextSelected,
                ]}
              >
                {letter.char}
              </Text>
            </View>
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
  tileText: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.letterText,
  },
  tileTextSelected: {
    color: colors.letterTextSelected,
  },
});
