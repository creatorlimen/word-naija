/**
 * Word Naija - Grid Component
 * Displays the crossword puzzle grid with animated cell fills.
 * Uses absolute positioning so only playable cells render (floating crossword).
 * Cell size scales dynamically to fit the screen width.
 */

import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import type { GridState, SelectionPath } from "../lib/game/types";
import { colors, borderRadius, fontSize } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 24; // horizontal padding on each side
const CELL_GAP = 3; // gap between cells
const MAX_CELL_SIZE = 60;

interface GridProps {
  gridState: GridState;
  selectedPath: SelectionPath | null;
}

function AnimatedGridCell({
  letter,
  filled,
  isHighlighted,
  cellSize,
  textSize,
  top,
  left,
}: {
  letter?: string;
  filled: boolean;
  isHighlighted: boolean;
  cellSize: number;
  textSize: number;
  top: number;
  left: number;
}) {
  const scaleAnim = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const prevFilled = useRef(filled);

  useEffect(() => {
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

  const animatedStyle = filled
    ? { transform: [{ scale: scaleAnim }] }
    : undefined;

  return (
    <View
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          top,
          left,
        },
        filled && styles.cellFilled,
        isHighlighted && styles.cellHighlighted,
      ]}
    >
      {filled ? (
        <Animated.Text
          style={[
            styles.cellText,
            styles.cellTextFilled,
            { fontSize: textSize },
            isHighlighted && styles.cellTextHighlighted,
            animatedStyle,
          ]}
        >
          {letter?.toUpperCase()}
        </Animated.Text>
      ) : (
        <Text style={[styles.cellText, { fontSize: textSize }]}>{""}</Text>
      )}
    </View>
  );
}

const MemoGridCell = React.memo(AnimatedGridCell);

export default function Grid({ gridState, selectedPath }: GridProps) {
  const { cellSize, textSize, containerWidth, containerHeight } =
    useMemo(() => {
      const cols = gridState.cols;
      const rows = gridState.rows;
      const availableWidth = SCREEN_WIDTH - 2 * GRID_PADDING;
      const size = Math.min(
        Math.floor((availableWidth - (cols - 1) * CELL_GAP) / cols),
        MAX_CELL_SIZE
      );
      return {
        cellSize: size,
        textSize: Math.max(14, Math.floor(size * 0.42)),
        containerWidth: cols * size + (cols - 1) * CELL_GAP,
        containerHeight: rows * size + (rows - 1) * CELL_GAP,
      };
    }, [gridState.cols, gridState.rows]);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          { width: containerWidth, height: containerHeight },
        ]}
      >
        {gridState.cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPlayable = gridState.mask[rowIndex][colIndex];
            if (!isPlayable) return null; // skip blocked cells entirely

            const isHighlighted =
              selectedPath?.cellCoords?.some(
                ([r, c]) => r === rowIndex && c === colIndex
              ) ?? false;

            const top = rowIndex * (cellSize + CELL_GAP);
            const left = colIndex * (cellSize + CELL_GAP);

            return (
              <MemoGridCell
                key={`${rowIndex}-${colIndex}`}
                letter={cell.letter}
                filled={cell.filled}
                isHighlighted={isHighlighted}
                cellSize={cellSize}
                textSize={textSize}
                top={top}
                left={left}
              />
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingVertical: 12,
  },
  container: {
    position: "relative",
  },
  cell: {
    position: "absolute",
    borderRadius: borderRadius.md,
    backgroundColor: colors.cellEmpty,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cellFilled: {
    backgroundColor: colors.cellFilled,
    borderColor: colors.cardDark,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cellHighlighted: {
    backgroundColor: colors.cellHint,
    borderColor: colors.accent,
  },
  cellText: {
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
