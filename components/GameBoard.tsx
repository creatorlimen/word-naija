/**
 * Word Naija - GameBoard Component (v4 — Afro-Minimal Premium)
 * Main game screen with glass header, refined grid, gold accents.
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
import { colors, fontSize, spacing, borderRadius, shadows, gradients, fontFamily } from "../constants/theme";

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
        <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  // Error
  if (error) {
    return (
      <View style={styles.centered}>
        <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
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
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" />

        {/* ── Header ── */}
        <View style={styles.header}>
          {/* Left: Back & Settings */}
          <View style={styles.headerLeft}>
            <Pressable onPress={onGoHome} style={styles.iconButton}>
              <Text style={styles.iconText}>←</Text>
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => setShowSettings(true)}>
               <Text style={styles.iconText}>⚙</Text>
            </Pressable>
          </View>

          {/* Center: Level Pill */}
          <View style={styles.levelPill}>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <Text style={styles.levelNumber}>{state.currentLevel.levelId}</Text>
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

        {/* ── Grid area ── */}
        <View style={{ flex: 1, zIndex: 1, paddingTop: spacing.xs }}>
            <Grid 
                gridState={state.gridState} 
                selectedPath={state.selectedPath}
                flashCoords={flashCoords}
            />
        </View>

        {/* ── Word Preview / Toast ── */}
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

        {/* ── Wheel & Toolbar ── */}
        <View style={{ flexGrow: 0, paddingBottom: 4 }}>
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
    fontFamily: fontFamily.medium,
    color: colors.textGold,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.medium,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  errorButton: {
    backgroundColor: colors.button.secondary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.button.secondaryBorder,
  },
  errorButtonText: {
    color: colors.foreground,
    fontSize: fontSize.md,
    fontFamily: fontFamily.semiBold,
  },
  
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  
  /* ── HEADER ── */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    height: 54,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 90, 
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outline,
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: fontSize.lg,
    color: colors.textPrimary,
  },
  
  /* ── LEVEL PILL ── */
  levelPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceGlass,
    paddingVertical: 7,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outline,
    gap: spacing.xs,
    ...shadows.subtle,
  },
  levelLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  levelNumber: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bold,
  },

  /* ── COIN PILL ── */
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceGlass,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.outlineGold,
    minWidth: 84,
    gap: spacing.xs,
    ...shadows.subtle,
  },
  coinIconContainer: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(212,168,67,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  coinIcon: {
    fontSize: fontSize.sm,
  },
  coinText: {
    color: colors.textGold,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
  },

  /* ── PREVIEW / TOAST ── */
  previewRow: {
    alignItems: 'center',
    paddingVertical: 1,
  },
  previewPill: {
    paddingHorizontal: 16,
    paddingVertical: 3,
    backgroundColor: 'rgba(17,97,79,0.8)',
    borderRadius: borderRadius.full,
    minHeight: 26,
    minWidth: 60,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  previewPillToast: {
    backgroundColor: 'rgba(160,100,17,0.85)',
    borderColor: 'rgba(212,168,67,0.4)',
  },
  previewPillHidden: {
    opacity: 0,
  },
  previewPillText: {
    color: '#FFF',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bold,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },

  toolbarContainer: {
    marginBottom: 0,
  },
});

