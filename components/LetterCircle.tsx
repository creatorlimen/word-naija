/**
 * Word Naija � LetterCircle Component (v2 - Visual Overhaul)
 * Swipe-to-select input wheel with wooden tile styling.
 */

import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";
import Svg, { Line } from "react-native-svg";
import type { Letter } from "../lib/game/types";
import { colors, borderRadius, fontSize, shadows } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH - 60, 260); // Larger wheel
const TILE_SIZE = 54; // Larger tiles
const HIT_RADIUS = 40; 

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
        top: cy + radius * Math.sin(angle) - TILE_SIZE / 2,  // Top-Left Y
      };
    });
  }, [letters.length]);

  // Gesture State
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [isGestureActive, setIsGestureActive] = useState(false);
  const currentFingerPos = useRef<{ x: number; y: number } | null>(null);

  // Pan Responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt, gestureState) => {
        setIsGestureActive(true);
        currentFingerPos.current = { x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY };
        
        // Check initial touch
        const idx = hitTest(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
        if (idx !== -1) {
          onSelectLetter(idx);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const x = evt.nativeEvent.locationX;
        const y = evt.nativeEvent.locationY;
        currentFingerPos.current = { x, y };
        
        // Force re-render for line drawing by updating a state or ref that triggers render? 
        // We use setNativeProps or Animated.event usually, but for SVG line to finger we need state.
        // Actually, let/s just rely on the parent re-rendering from onSelect/onUndo.
        // But the "line to finger" needs frequent updates.
        // For MVP v2, let's just draw lines between selected tiles, not to the finger. 
        // (Finger line is nice but complex to optimize in React Native without Reanimated).
        
        const idx = hitTest(x, y);
        if (idx !== -1) {
           // We are over a tile
           const lastIdx = selectedIndices[selectedIndices.length - 1];
           
           if (idx !== lastIdx) {
               // New tile?
               if (!selectedIndices.includes(idx)) {
                   onSelectLetter(idx);
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
               } 
               // Backtracking?
               else if (selectedIndices.length > 1 && idx === selectedIndices[selectedIndices.length - 2]) {
                   onUndoSelection();
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
               }
           }
        }
      },

      onPanResponderRelease: () => {
        setIsGestureActive(false);
        currentFingerPos.current = null;
        onCommit();
      },
      
      onPanResponderTerminate: () => {
        setIsGestureActive(false);
        currentFingerPos.current = null;
        onClear();
      },
    })
  ).current;

  const hitTest = (x: number, y: number) => {
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      const dx = x - p.x;
      const dy = y - p.y;
      if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) return i;
    }
    return -1;
  };

  return (
    <View style={styles.container}>
      {/* Current Word Preview (Floating above wheel) */}
      <View style={[styles.previewContainer, { opacity: currentWord ? 1 : 0 }]}>
        <Text style={styles.previewText}>{currentWord}</Text>
      </View>

      <View 
        style={styles.wheelContainer}
        {...panResponder.panHandlers}
      >
        {/* Connector Lines */}
        <Svg style={StyleSheet.absoluteFill}>
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

        {/* Tiles */}
        {letters.map((l, i) => {
          const selected = selectedIndices.includes(i);
          const pos = positions[i];
          
          return (
            <View
              key={i}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  previewContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: borderRadius.lg,
    marginBottom: 20,
    minHeight: 50,
    minWidth: 100,
    alignItems: "center",
  },
  previewText: {
    color: "#FFF",
    fontSize: fontSize.xl,
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
    borderRadius: 12, // Match Grid squaricle
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
    fontSize: 28, // Bigger text
    fontWeight: "900",
    color: colors.tile.text,
    marginTop: -4, 
  },
  tileTextSelected: {
    color: colors.tile.textSelected,
  },
});

