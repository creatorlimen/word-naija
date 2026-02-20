/**
 * Word Naija - Grid Component (v2 - Visual Overhaul)
 * Displays the crossword puzzle grid as a wooden board with cream tiles.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import type { GridState, SelectionPath } from "../lib/game/types";
import { colors, borderRadius, shadows } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 20;
const CELL_GAP = 4;
const MAX_CELL_SIZE = 80;

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
        friction: 6,
        tension: 100,
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
      style={{
        position: "absolute",
        width: cellSize,
        height: cellSize,
        top,
        left,
      }}
    >
      {/* Background for empty slot (recessed wood) */}
      <View style={[StyleSheet.absoluteFill, styles.cellEmpty]} />
      
      {/* Animated Filled Tile (Cream) */}
      {filled && (
        <Animated.View 
            style={[
                StyleSheet.absoluteFill, 
                styles.cellTile,
                animatedStyle,
                isHighlighted && styles.cellHighlighted
            ]}
        >
          <Text
            style={[
              styles.cellText,
              { fontSize: textSize },
              isHighlighted && styles.cellTextHighlighted,
            ]}
          >
            {letter?.toUpperCase()}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

export default function Grid({ gridState, selectedPath }: GridProps) {
  const { rows, cols, cells } = gridState;
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0 && height !== measuredHeight) {
      setMeasuredHeight(height);
    }
  };

  // Width-based cell size
  const availableWidth = SCREEN_WIDTH - 20 - (GRID_PADDING * 2);
  const maxCellWidth = availableWidth / cols;

  // Height-based cell size — uses actual measured space
  const availableHeight = measuredHeight > 0
    ? measuredHeight - (GRID_PADDING * 2) - 24 // subtract board border + wrapper padding
    : 300; // fallback before first measure
  const maxCellHeight = availableHeight / rows;

  // Pick the smallest so tiles are square and fit both dimensions
  const cellSize = Math.min(maxCellWidth, maxCellHeight, MAX_CELL_SIZE) - CELL_GAP;
  const textSize = cellSize * 0.65;

  const gridContentWidth = cols * (cellSize + CELL_GAP) - CELL_GAP;
  const gridContentHeight = rows * (cellSize + CELL_GAP) - CELL_GAP;

  const boardWidth = gridContentWidth + (GRID_PADDING * 2);
  const boardHeight = gridContentHeight + (GRID_PADDING * 2);

  return (
    <View style={styles.wrapper} onLayout={handleLayout}>
        <View
            style={styles.boardContainer}
        >
            <View style={{ width: gridContentWidth, height: gridContentHeight, position: "relative" }}>
                {cells.map((rowCells, r) =>
                    rowCells.map((cell, c) => {
                    if (cell.letter === undefined) return null; // blocked cell

                    const top = r * (cellSize + CELL_GAP);
                    const left = c * (cellSize + CELL_GAP);
                    const isHighlighted = !!(cell.isPartOfTargetWord && selectedPath === null);

                    return (
                        <AnimatedGridCell
                        key={`${r}-${c}`}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    zIndex: 1,
  },
  boardContainer: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: colors.boardBackground,
    borderRadius: 18, 
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    overflow: "hidden",
    ...shadows.soft,
  },
  cellEmpty: {
    backgroundColor: colors.tile.empty,
    borderRadius: 10, 
    borderWidth: 1,
    borderColor: colors.outline,
  },
  cellTile: {
    backgroundColor: colors.tile.background,
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.tile.border,
    borderBottomWidth: 3, 
    borderBottomColor: colors.tile.borderBottom,
    ...shadows.tile,
  },
  cellHighlighted: {
    borderColor: colors.accent,
    borderWidth: 2,
    shadowColor: colors.accent,
    shadowOpacity: 0.45,
    shadowRadius: 6,
  },
  cellText: {
    fontWeight: "900",
    color: colors.tile.text,
    marginTop: -3,
  },
  cellTextHighlighted: {
    color: colors.accent,
  },
});
