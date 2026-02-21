/**
 * Word Naija - GameBoard Component (v2 - Visual Overhaul)
 * Main game screen: Wood theme, pill headers, nature background.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Grid from "./Grid";
import LetterCircle from "./LetterCircle"; 
import Toolbar from "./Toolbar";
import LevelComplete from "./LevelComplete";
import ExtraWordsModal from "./ExtraWordsModal";
import SettingsModal from "./SettingsModal";
import FTUE from "./FTUE";
import { useGameState, useGameActions } from "../lib/game/context";
import { getCoinsEarned, HINT_COST, EXTRA_WORDS_TARGET } from "../lib/game/gameState";
import { playCompleteSound } from "../lib/game/soundManager";
import Sparkle from "./Sparkle";
import { colors, fontSize, spacing, borderRadius, shadows, gradients } from "../constants/theme";

interface GameBoardProps {
  onGoHome: () => void;
}

export default function GameBoard({ onGoHome }: GameBoardProps) {
  const { state, toastMessage, isComplete, isLoading, error } = useGameState();
  const actions = useGameActions();
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Flash animation: track which cells belong to a newly solved word
  const [flashCoords, setFlashCoords] = useState<Set<string>>(new Set());
  const prevSolvedRef = useRef<Set<string>>(new Set());
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!state?.solvedWords || !state?.currentLevel) return;
    const prev = prevSolvedRef.current;
    const curr = state.solvedWords;

    if (curr.size > prev.size) {
      const coords = new Set<string>();
      for (const word of curr) {
        if (!prev.has(word)) {
          const target = state.currentLevel.targetWords.find(
            (tw) => tw.word.toUpperCase() === word
          );
          if (target) {
            for (const [r, c] of target.coords) {
              coords.add(`${r},${c}`);
            }
          }
        }
      }
      if (coords.size > 0) {
        if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
        setFlashCoords(coords);
        flashTimeoutRef.current = setTimeout(() => setFlashCoords(new Set()), 1200);
      }
    }

    prevSolvedRef.current = new Set(curr);
  }, [state?.solvedWords]);

  // Coin pill pulse + sparkle — fires whenever coins increase
  const coinPulseAnim = useRef(new Animated.Value(1)).current;
  const prevCoinsRef = useRef<number | null>(null);
  const [coinSparkleTrigger, setCoinSparkleTrigger] = useState(0);

  useEffect(() => {
    if (!state?.coins) return;
    if (prevCoinsRef.current !== null && state.coins > prevCoinsRef.current) {
      setCoinSparkleTrigger(k => k + 1);
      Animated.sequence([
        Animated.spring(coinPulseAnim, { toValue: 1.4, useNativeDriver: true, speed: 60, bounciness: 20 }),
        Animated.spring(coinPulseAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }),
      ]).start();
    }
    prevCoinsRef.current = state.coins;
  }, [state?.coins]);

  // Play congrats sound exactly once when the level is completed
  useEffect(() => {
    if (isComplete && state?.soundEnabled) {
      playCompleteSound(state.soundEnabled);
    }
  }, [isComplete]);

  const handleNextLevel = useCallback(async () => {
    await actions.nextLevel();
  }, [actions]);

  const handlePlayAgain = useCallback(() => {
    actions.resetLevel();
  }, [actions]);

  const coinsEarned = useMemo(() => {
    if (!state?.currentLevel) return 0;
    return getCoinsEarned(state);
  }, [state]);

  // Loading
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={onGoHome} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Home</Text>
        </Pressable>
        <StatusBar style="light" />
      </View>
    );
  }

  if (!state?.currentLevel) return null;

  return (
    <View style={styles.background}>
      <LinearGradient
        colors={gradients.background}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />

        {/* -- Header -- */}
        <View style={styles.header}>
          {/* Left: Back & Settings */}
          <View style={styles.headerLeft}>
            <Pressable onPress={onGoHome} style={styles.iconButton}>
              <Text style={styles.iconText}>←</Text>
            </Pressable>
            {/* Settings */}
            <Pressable style={styles.iconButton} onPress={() => setShowSettings(true)}>
               <Text style={styles.iconText}>⚙️</Text>
            </Pressable>
          </View>

          {/* Center: Level Pill */}
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>Level {state.currentLevel.levelId}</Text>
          </View>

          {/* Right: Coin Pill */}
          <View style={{ position: "relative" }}>
            <Animated.View style={[styles.coinPill, { transform: [{ scale: coinPulseAnim }] }]}>
              <View style={styles.coinIconContainer}>
                 <Text style={styles.coinIcon}>🪙</Text>
              </View>
              <Text style={styles.coinText}>{state.coins}</Text>
            </Animated.View>
            <Sparkle trigger={coinSparkleTrigger} />
          </View>
        </View>

        {/* -- Game Area -- */}
        {/* Grid takes available upper space */}
        <View style={{ flex: 1, zIndex: 1, paddingTop: spacing.xs }}>
            <Grid 
                gridState={state.gridState} 
                selectedPath={state.selectedPath}
                flashCoords={flashCoords}
            />
        </View>

        {/* -- Word Preview / Duplicate Toast -- */}
        {(() => {
          const word = state.selectedPath?.word || '';
          const msg   = toastMessage || word;
          const isToast = !!toastMessage;
          return (
            <View style={styles.previewRow}>
              <View style={[
                styles.previewPill,
                isToast && styles.previewPillToast,
                !msg && styles.previewPillHidden,
              ]}>
                <Text style={styles.previewPillText}>{msg}</Text>
              </View>
            </View>
          );
        })()}

        {/* Tools & Wheel at bottom */}
        {/* We want the wheel centered, and footer below it */}
        <View style={{ flexGrow: 0, paddingBottom: 4 }}>
            {/* Letter Wheel Input */}
            <View style={{ height: 340, alignItems: "center", justifyContent: "center" }}>
                <LetterCircle
                    letters={state.letterWheel}
                    selectedIndices={state.selectedPath?.letterIndices || []}
                    onSelectLetter={(idx) => actions.selectLetter(idx)}
                    onUndoSelection={() => actions.undoSelection()}
                    onClear={() => actions.clearSelection()}
                    onCommit={() => actions.commitSelection()}
                />
            </View>

            {/* Bottom Toolbar */}
            <View style={styles.toolbarContainer}>
                <Toolbar
                    coins={state.coins}
                    hintCost={HINT_COST}
                    extraWordsCollected={state.extraWordsCollected ?? 0}
                    extraWordsTarget={EXTRA_WORDS_TARGET}
                    onShuffle={() => actions.shuffleLetters()}
                    onHint={() => actions.revealHint()}
                    onExtra={() => setShowExtraModal(true)}
                />
            </View>
        </View>

        {/* -- Settings Modal -- */}
        <SettingsModal
          visible={showSettings}
          soundEnabled={state.soundEnabled ?? true}
          onToggleSound={() => actions.toggleSound()}
          onClose={() => setShowSettings(false)}
          onHowToPlay={() => { setShowSettings(false); setShowHowToPlay(true); }}
          onQuit={() => { setShowSettings(false); onGoHome(); }}
        />

        {/* -- How to Play (relaunched FTUE) -- */}
        <FTUE forceShow={showHowToPlay} onComplete={() => setShowHowToPlay(false)} />

        {/* -- Extra Words Modal -- */}
        <ExtraWordsModal
          visible={showExtraModal}
          extraWordsCollected={state.extraWordsCollected ?? 0}
          extraWordsThisLevel={state.extraWordsFound?.size ?? 0}
          onClose={() => setShowExtraModal(false)}
        />

        {/* -- Level Complete Modal -- */}
        <LevelComplete
          visible={isComplete}
          level={state.currentLevel}
          solvedWords={state.solvedWords}
          extraWords={state.extraWordsFound}
          coinsEarned={coinsEarned}
          onNextLevel={handleNextLevel}
          onPlayAgain={handlePlayAgain}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.foreground,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.foreground,
    fontSize: fontSize.md,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  errorButton: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  errorButtonText: {
    color: colors.foreground,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  
  /* HEADER STYLES */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    height: 52,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 90, 
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outline,
    marginRight: spacing.sm,
    ...shadows.small,
  },
  iconText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  
  /* CENTER PILL (LEVEL) */
  levelPill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outline,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.subtle,
  },
  levelText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    textAlign: "center",
  },

  /* RIGHT PILL (COINS) */
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outline,
    minWidth: 88,
    gap: spacing.xs,
    ...shadows.subtle,
  },
  coinIconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(34,160,107,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  coinIcon: {
    color: colors.gold,
    fontSize: fontSize.md,
    fontWeight: "bold",
  },
  coinText: {
    color: colors.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: "800",
  },

  /* PREVIEW / TOAST PILL */
  previewRow: {
    alignItems: 'center',
    paddingVertical: 1,
  },
  previewPill: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    backgroundColor: 'rgba(17,97,79,0.85)',
    borderRadius: borderRadius.full,
    minHeight: 24,
    minWidth: 60,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  previewPillToast: {
    backgroundColor: 'rgba(160,100,17,0.90)',
    borderColor: 'rgba(255,180,50,0.5)',
  },
  previewPillHidden: {
    opacity: 0,
  },
  previewPillText: {
    color: '#FFF',
    fontSize: fontSize.sm,
    fontWeight: 'bold' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },

  toolbarContainer: {
    marginBottom: 0,
  },
});

