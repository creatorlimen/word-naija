/**
 * Word Naija — LetterCircle Component (v3 - Fixed gestures)
 * Swipe-to-select input wheel with wooden tile styling.
 */

import React, { useRef, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
  Animated,
} from "react-native";
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
  onSelectLetter: (index: number) => void;
  onUndoSelection: () => void;
  onClear: () => void;
  onCommit: () => void;
}

export default function LetterCircle({
  letters,
  selectedIndices,
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

  // --- Animated shuffle -------------------------------------------------------
  // Map: letter.id -> Animated.ValueXY (persists across renders)
  const tileAnims = useRef<Map<string, Animated.ValueXY>>(new Map()).current;
  // Map: letter.id -> last told-to position {left, top}
  const prevPosById = useRef<Map<string, { left: number; top: number }>>(new Map());

  // Eagerly initialise any letter that doesn’t yet have an anim value.
  // (Safe ref-mutation during render — no setState, no side-effects that React cares about.)
  letters.forEach((l, i) => {
    if (!tileAnims.has(l.id)) {
      tileAnims.set(l.id, new Animated.ValueXY({ x: positions[i].left, y: positions[i].top }));
      prevPosById.current.set(l.id, { left: positions[i].left, top: positions[i].top });
    }
  });

  // When the letters array reference changes (only happens on shuffle / level reset),
  // spring every tile from where it was to its new slot.
  useEffect(() => {
    const springs: Animated.CompositeAnimation[] = [];

    letters.forEach((l, i) => {
      const newPos = positions[i];
      const oldPos = prevPosById.current.get(l.id);

      // Update stored target before starting animation
      prevPosById.current.set(l.id, { left: newPos.left, top: newPos.top });

      if (!oldPos) return; // Freshly added letter — already placed by init above

      const moved =
        Math.abs(oldPos.left - newPos.left) > 0.5 ||
        Math.abs(oldPos.top  - newPos.top)  > 0.5;
      if (!moved) return;

      const anim = tileAnims.get(l.id)!;
      anim.stopAnimation();
      // Snap to last-known position, then spring to new slot
      anim.setValue({ x: oldPos.left, y: oldPos.top });
      springs.push(
        Animated.spring(anim, {
          toValue: { x: newPos.left, y: newPos.top },
          useNativeDriver: true,
          speed: 16,
          bounciness: 9,
        })
      );
    });

    if (springs.length > 0) Animated.parallel(springs).start();

    // Remove anim values for letters no longer in the wheel (level reset)
    const liveIds = new Set(letters.map((l) => l.id));
    for (const id of tileAnims.keys()) {
      if (!liveIds.has(id)) {
        tileAnims.delete(id);
        prevPosById.current.delete(id);
      }
    }
  }, [letters]); // fires only when the array reference changes
  // ---------------------------------------------------------------------------

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
      <View style={styles.wheelBackplate}>
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
            const anim = tileAnims.get(l.id);
            if (!anim) return null;

            return (
              <Animated.View
                key={l.id}
                pointerEvents="none"
                style={[
                  styles.tile,
                  selected && styles.tileSelected,
                  {
                    left: 0,
                    top: 0,
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                      { scale: selected ? 1.12 : 1 },
                    ],
                  },
                ]}
              >
                <Text style={[styles.tileText, selected && styles.tileTextSelected]}>
                  {l.char}
                </Text>
              </Animated.View>
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
  wheelContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    position: "relative",
  },
  wheelBackplate: {
    width: CIRCLE_SIZE + 36,
    height: CIRCLE_SIZE + 36,
    borderRadius: (CIRCLE_SIZE + 36) / 2,
    alignItems: "center",
    justifyContent: "center",
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

