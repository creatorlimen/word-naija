/**
 * Word Naija - Grid Component
 * Displays the crossword puzzle grid with animated cell fills
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import type { GridState, SelectionPath } from "../lib/game/types";
import { colors, borderRadius, fontSize } from "../constants/theme";

interface GridProps {
  gridState: GridState;
  selectedPath: SelectionPath | null;
}

function AnimatedGridCell({
  letter,
  filled,
  isPlayable,
  isHighlighted,
}: {
  letter?: string;
  filled: boolean;
  isPlayable: boolean;
  isHighlighted: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const prevFilled = useRef(filled);

  useEffect(() => {
    // Only animate when transitioning from unfilled to filled
    if (filled && !prevFilled.current) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }).start();
    } else if (filled) {
      scaleAnim.setValue(1);
    } else {
      scaleAnim.setValue(0);
    }
    prevFilled.current = filled;
  }, [filled]);

  if (!isPlayable) {
    return <View style={styles.cellBlocked} />;
  }

  const animatedStyle = filled
    ? { transform: [{ scale: scaleAnim }] }
    : undefined;

  return (
    <View
      style={[
        styles.cell,
        filled && styles.cellFilled,
        isHighlighted && styles.cellHighlighted,
      ]}
    >
      {filled ? (
        <Animated.Text
          style={[
            styles.cellText,
            styles.cellTextFilled,
            isHighlighted && styles.cellTextHighlighted,
            animatedStyle,
          ]}
        >
          {letter?.toUpperCase()}
        </Animated.Text>
      ) : (
        <Text style={styles.cellText}>{""}</Text>
      )}
    </View>
  );
}

const MemoGridCell = React.memo(AnimatedGridCell);

export default function Grid({ gridState, selectedPath }: GridProps) {
  return (
    <View style={styles.container}>
      {gridState.cells.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const isPlayable = gridState.mask[rowIndex][colIndex];
            const isHighlighted =
              selectedPath?.cellCoords?.some(
                ([r, c]) => r === rowIndex && c === colIndex
              ) ?? false;

            return (
              <MemoGridCell
                key={`${rowIndex}-${colIndex}`}
                letter={cell.letter}
                filled={cell.filled}
                isPlayable={isPlayable}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const CELL_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cellEmpty,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cellBlocked: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 2,
    backgroundColor: "transparent",
  },
  cellFilled: {
    backgroundColor: colors.cellFilled,
    borderColor: colors.cardDark,
  },
  cellHighlighted: {
    backgroundColor: colors.cellHint,
    borderColor: colors.accent,
  },
  cellText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.foregroundDark,
  },
  cellTextFilled: {
    color: colors.foreground,
  },
  cellTextHighlighted: {
    color: colors.foreground,
  },
});
