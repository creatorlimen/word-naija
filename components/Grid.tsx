/**
 * Word Naija - Grid Component (v2 - Visual Overhaul)
 * Displays the crossword puzzle grid as a wooden board with cream tiles.
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import type { GridState, SelectionPath } from "../lib/game/types";
import { colors, borderRadius, shadows } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = 20; // Internal padding of the board
const CELL_GAP = 4; // gap between cells
const MAX_CELL_SIZE = 50; // Smaller max size to fit board frame

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
  
  // Calculate optimal cell size
  const availableWidth = SCREEN_WIDTH - 32 - (GRID_PADDING * 2);
  const maxCellWidth = availableWidth / cols;
  
  const cellSize = Math.min(maxCellWidth, MAX_CELL_SIZE) - CELL_GAP;
  const textSize = cellSize * 0.65;
  
  const gridContentWidth = cols * (cellSize + CELL_GAP) - CELL_GAP;
  const gridContentHeight = rows * (cellSize + CELL_GAP) - CELL_GAP;

  const boardWidth = gridContentWidth + (GRID_PADDING * 2);
  const boardHeight = gridContentHeight + (GRID_PADDING * 2);

  return (
    <View style={styles.wrapper}>
        <View 
            style={[
                styles.boardContainer, 
                { 
                    width: mathMax(boardWidth, SCREEN_WIDTH - 40), // ensure minimal width
                    height: boardHeight
                }
            ]}
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

function mathMax(a: number, b: number) {
    return a > b ? a : b;
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
    zIndex: 1,
  },
  boardContainer: {
    backgroundColor: colors.boardBackground,
    borderRadius: 16, 
    borderWidth: 6,
    borderColor: colors.boardBorder,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderBottomWidth: 10, // Thicker bottom for board perspective
    borderBottomColor: colors.boardShadow,
  },
  cellEmpty: {
    backgroundColor: colors.tile.empty,
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
  },
  cellTile: {
    backgroundColor: colors.tile.background,
    borderRadius: 10, 
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.tile.border,
    borderBottomWidth: 4, 
    borderBottomColor: colors.tile.borderBottom,
    ...shadows.tile3D,
  },
  cellHighlighted: {
    borderColor: colors.warning,
    borderWidth: 2,
  },
  cellText: {
    fontWeight: "900",
    color: colors.tile.text,
    marginTop: -3,
  },
  cellTextHighlighted: {
    color: colors.warning,
  },
});
