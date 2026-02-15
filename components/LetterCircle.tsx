/**
 * Word Naija — LetterCircle Component (v3 - Fixed gestures)
 * Swipe-to-select input wheel with wooden tile styling.
 *
 * Key fixes in v3:
 *  - Use refs for all props/state accessed inside PanResponder to avoid stale closures
 *  - Use pageX/pageY instead of locationX/locationY to avoid Android coordinate-origin shifts
 *  - Slightly increased circle size for more forgiving hit areas
 */

import React, { useRef, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import * as Haptics from "expo-haptics";
import Svg, { Line, Circle } from "react-native-svg";
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
  currentWord: string; // The word being formed (preview)
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
        x: cx + radius * Math.cos(angle), // Center X
        y: cy + radius * Math.sin(angle), // Center Y
        left: cx + radius * Math.cos(angle) - TILE_SIZE / 2, // Top-Left X
        top: cy + radius * Math.sin(angle) - TILE_SIZE / 2, // Top-Left Y
      };
    });
  }, [letters.length]);

  // -----------------------------------------------------------------------
  // FIX 1: Keep refs that always point to the latest props/values so the
  //         PanResponder closure (created once) never reads stale data.
  // -----------------------------------------------------------------------
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

  // -----------------------------------------------------------------------
  // FIX 2: Track the wheel container's page-level position so we can convert
  //         pageX/pageY → local coords. This avoids the Android bug where
  //         locationX/locationY shift when the finger crosses child Views.
  // -----------------------------------------------------------------------
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
      // measureInWindow gives absolute screen coordinates
      measureWheel();
    },
    [measureWheel]
  );

  // Gesture State
  const [isGestureActive, setIsGestureActive] = useState(false);
  const currentFingerPos = useRef<{ x: number; y: number } | null>(null);

  // Hit-test helper (uses latest positions via ref)
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

  /** Convert a page-level touch into wheel-local coords */
  const toLocal = useCallback(
    (pageX: number, pageY: number) => ({
      x: pageX - wheelLayoutRef.current.pageX,
      y: pageY - wheelLayoutRef.current.pageY,
    }),
    []
  );

  // Pan Responder — created once, reads ONLY from refs (never stale)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        setIsGestureActive(true);

        // Capture touch coords immediately
        const { pageX, pageY } = evt.nativeEvent;

        // Re-measure synchronously-ish then do hit-test inside callback
        // so we always use fresh layout coords for the CURRENT gesture.
        wheelViewRef.current?.measureInWindow((wx, wy) => {
          if (wx != null && wy != null) {
            wheelLayoutRef.current = { pageX: wx, pageY: wy };
          }

          const local = {
            x: pageX - wheelLayoutRef.current.pageX,
            y: pageY - wheelLayoutRef.current.pageY,
          };
          currentFingerPos.current = local;

          const idx = hitTest(local.x, local.y);
          if (idx !== -1) {
            onSelectLetterRef.current(idx);
            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        });
      },

      onPanResponderMove: (evt) => {
        // Use pageX/pageY → local (FIX 2)
        const { pageX, pageY } = evt.nativeEvent;
        const local = {
          x: pageX - wheelLayoutRef.current.pageX,
          y: pageY - wheelLayoutRef.current.pageY,
        };
        currentFingerPos.current = local;

        const idx = hitTest(local.x, local.y);
        if (idx !== -1) {
          // Read latest selectedIndices via ref (FIX 1)
          const sel = selectedIndicesRef.current;
          const lastIdx = sel[sel.length - 1];

          if (idx !== lastIdx) {
            // New tile?
            if (!sel.includes(idx)) {
              onSelectLetterRef.current(idx);
            }
            // Backtracking?
            else if (sel.length > 1 && idx === sel[sel.length - 2]) {
              onUndoSelectionRef.current();
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          }
        }
      },

      onPanResponderRelease: () => {
        setIsGestureActive(false);
        currentFingerPos.current = null;
        onCommitRef.current();
      },

      onPanResponderTerminate: () => {
        setIsGestureActive(false);
        currentFingerPos.current = null;
        onClearRef.current();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Current Word Preview (Floating above wheel) */}
      <View style={[styles.previewContainer, { opacity: currentWord ? 1 : 0 }]}>
        <Text style={styles.previewText}>{currentWord}</Text>
      </View>

      <View
        ref={wheelViewRef}
        onLayout={onWheelLayout}
        style={styles.wheelContainer}
        {...panResponder.panHandlers}
      >
        {/* Connector Lines */}
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Debug: Show hit test circles */}
            {DEBUG_MODE && positions.map((pos, i) => (
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
            
            {/* Selection lines */}
            {selectedIndices.map((idx, i) => {
                if (i === 0) return null;
                const prev = positions[selectedIndices[i-1]];
                const curr = positions[idx];
                return (
                    <Line
                        key={i}
                        x1={prev.x}
                        y1={prev.y}
                        x2={curr.x}
                        y2={curr.y}
                        stroke={colors.warning} 
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                );
            })}
        </Svg>

        {/* Tiles — pointerEvents="none" so they never steal touches from the wheel */}
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
                selected && styles.tileSelected
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
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: borderRadius.lg,
    marginBottom: 12,
    minHeight: 40,
    minWidth: 80,
    alignItems: "center",
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
    // borderRadius: CIRCLE_SIZE / 2,
    // backgroundColor: "rgba(0,0,0,0.1)", // Debug circle
    position: "relative",
  },
  tile: {
    position: "absolute",
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 10, // Match Grid squaricle
    backgroundColor: colors.tile.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.tile.border,
    borderBottomWidth: 4,
    borderBottomColor: colors.tile.borderBottom, // Use theme logic
    ...shadows.tile3D,
  },
  tileSelected: {
    backgroundColor: colors.tile.backgroundSelected,
    borderColor: "#FF8F00",
    borderBottomColor: colors.tile.borderBottomSelected,
    transform: [{ scale: 1.15 }], 
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

