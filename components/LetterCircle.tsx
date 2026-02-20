/**
 * Word Naija — LetterCircle Component (v3 - Fixed gestures)
 * Swipe-to-select input wheel with wooden tile styling.
 */

import React, { useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import Svg, { Line, Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import type { Letter } from "../lib/game/types";
import { colors, borderRadius, fontSize, shadows } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH - 60, 280); // Spacious wheel for up to 8 tiles
const TILE_SIZE = 56;
const HIT_RADIUS = 40; // Covers 56dp tile corners (~40px diagonal)
const DEBUG_MODE = __DEV__ && false; // Set to true to see hit areas

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
  // Tile positions
  const radius = (CIRCLE_SIZE - TILE_SIZE) / 2;
  const cx = CIRCLE_SIZE / 2;
  const cy = CIRCLE_SIZE / 2;

  const positions = useMemo(() => {
    return letters.map((_, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / letters.length;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        left: cx + radius * Math.cos(angle) - TILE_SIZE / 2,
        top: cy + radius * Math.sin(angle) - TILE_SIZE / 2,
      };
    });
  }, [letters.length]);

  // Live refs to avoid stale closures inside PanResponder
  const selectedIndicesRef = useRef(selectedIndices);
  selectedIndicesRef.current = selectedIndices;

  const onSelectLetterRef = useRef(onSelectLetter);
  onSelectLetterRef.current = onSelectLetter;

  const onUndoSelectionRef = useRef(onUndoSelection);
  onUndoSelectionRef.current = onUndoSelection;

  const onClearRef = useRef(onClear);
  onClearRef.current = onClear;

  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  const positionsRef = useRef(positions);
  positionsRef.current = positions;

  const wheelLayoutRef = useRef({ pageX: 0, pageY: 0 });
  const wheelViewRef = useRef<View>(null);

  const measureWheel = useCallback(() => {
    wheelViewRef.current?.measureInWindow((x, y) => {
      if (x != null && y != null) {
        wheelLayoutRef.current = { pageX: x, pageY: y };
      }
    });
  }, []);

  const onWheelLayout = useCallback(
    (_e: LayoutChangeEvent) => {
      measureWheel();
    },
    [measureWheel]
  );


  const hitTest = useCallback((x: number, y: number) => {
    const pos = positionsRef.current;
    for (let i = 0; i < pos.length; i++) {
      const p = pos[i];
      const dx = x - p.x;
      const dy = y - p.y;
      if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) return i;
    }
    return -1;
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;

        wheelViewRef.current?.measureInWindow((wx, wy) => {
          if (wx != null && wy != null) {
            wheelLayoutRef.current = { pageX: wx, pageY: wy };
          }

          const local = {
            x: pageX - wheelLayoutRef.current.pageX,
            y: pageY - wheelLayoutRef.current.pageY,
          };
          const idx = hitTest(local.x, local.y);
          if (idx !== -1) {
            onSelectLetterRef.current(idx);
          }
        });
      },

      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const local = {
          x: pageX - wheelLayoutRef.current.pageX,
          y: pageY - wheelLayoutRef.current.pageY,
        };
        const idx = hitTest(local.x, local.y);
        if (idx !== -1) {
          const sel = selectedIndicesRef.current;
          const lastIdx = sel[sel.length - 1];

          if (idx !== lastIdx) {
            if (!sel.includes(idx)) {
              onSelectLetterRef.current(idx);
            } else if (sel.length > 1 && idx === sel[sel.length - 2]) {
              onUndoSelectionRef.current();
            }
          }
        }
      },

      onPanResponderRelease: () => {
        onCommitRef.current();
      },

      onPanResponderTerminate: () => {
        onClearRef.current();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={[styles.previewContainer, { opacity: currentWord ? 1 : 0 }]}>
        <Text style={styles.previewText}>{currentWord}</Text>
      </View>

      <View style={styles.wheelBackplate}>
        <LinearGradient
          colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        />

        <View
          ref={wheelViewRef}
          onLayout={onWheelLayout}
          style={styles.wheelContainer}
          {...panResponder.panHandlers}
        >
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            {DEBUG_MODE &&
              positions.map((pos, i) => (
                <Circle
                  key={`debug-${i}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={HIT_RADIUS}
                  stroke="rgba(255,0,0,0.3)"
                  strokeWidth="2"
                  fill="rgba(255,0,0,0.1)"
                />
              ))}

            {selectedIndices.map((idx, i) => {
              if (i === 0) return null;
              const prev = positions[selectedIndices[i - 1]];
              const curr = positions[idx];
              return (
                <Line
                  key={i}
                  x1={prev.x}
                  y1={prev.y}
                  x2={curr.x}
                  y2={curr.y}
                  stroke={colors.accent}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeOpacity={0.9}
                />
              );
            })}
          </Svg>

          {letters.map((l, i) => {
            const selected = selectedIndices.includes(i);
            const pos = positions[i];

            return (
              <View
                key={i}
                pointerEvents="none"
                style={[
                  styles.tile,
                  { left: pos.left, top: pos.top },
                  selected && styles.tileSelected,
                ]}
              >
                <Text style={[styles.tileText, selected && styles.tileTextSelected]}>
                  {l.char}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(17, 97, 79, 0.8)",
    borderRadius: borderRadius.full,
    marginBottom: 12,
    minHeight: 40,
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  previewText: {
    color: "#FFF",
    fontSize: fontSize.lg,
    fontWeight: "bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  wheelContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    position: "relative",
  },
  wheelBackplate: {
    width: CIRCLE_SIZE + 36,
    height: CIRCLE_SIZE + 36,
    borderRadius: (CIRCLE_SIZE + 36) / 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  tile: {
    position: "absolute",
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 10,
    backgroundColor: colors.tile.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.tile.border,
    borderBottomWidth: 4,
    borderBottomColor: colors.tile.borderBottom,
    ...shadows.tile3D,
  },
  tileSelected: {
    backgroundColor: colors.tile.backgroundSelected,
    borderColor: colors.accent,
    borderBottomColor: colors.tile.borderBottomSelected,
    transform: [{ scale: 1.12 }],
    zIndex: 10,
  },
  tileText: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.tile.text,
    marginTop: -4,
  },
  tileTextSelected: {
    color: colors.tile.textSelected,
  },
});

