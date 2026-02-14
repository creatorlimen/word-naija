/**
 * Word Naija - GameBoard Component
 * Main game screen: Grid (top) → LetterCircle (center) → Toolbar (bottom).
 * Words auto-submit when they match a target — no explicit Submit button.
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Grid from "./Grid";
import LetterCircle from "./LetterCircle"; // swipe-to-select circle
import Toolbar from "./Toolbar";
import LevelComplete from "./LevelComplete";
import { useGameState, useGameActions } from "../lib/game/context";
import { getCoinsEarned } from "../lib/game/gameState";
import { colors, fontSize, spacing, borderRadius } from "../constants/theme";

interface GameBoardProps {
  onGoHome: () => void;
}

export default function GameBoard({ onGoHome }: GameBoardProps) {
  const { state, progress, isComplete, isLoading, error } = useGameState();
  const actions = useGameActions();

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
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={onGoHome} style={styles.errorButton}>
          <Text style={styles.errorButtonText}>Go Home</Text>
        </Pressable>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  if (!state?.currentLevel) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={onGoHome} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.titleText}>Level {state.currentLevel.levelId}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* ── Progress bar ── */}
      {progress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress.percentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress.solvedWords}/{progress.totalWords} words
          </Text>
        </View>
      )}

      {/* ── Grid (top section) ── */}
      <Grid gridState={state.gridState} selectedPath={state.selectedPath} />

      {/* ── Letter Circle (fills remaining space) ── */}
      <LetterCircle
        letters={state.letterWheel}
        selectedIndices={state.selectedPath?.letterIndices || []}
        currentWord={state.selectedPath?.word || ""}
        onSelectLetter={actions.selectLetter}
        onUndoSelection={actions.undoSelection}
        onClear={actions.clearSelection}
        onCommit={actions.commitSelection}
      />

      {/* ── Toolbar (fixed bottom) ── */}
      <Toolbar
        coins={state.coins}
        hintCost={15}
        onShuffle={actions.shuffleLetters}
        onHint={actions.revealHint}
      />

      {/* ── Level Complete Modal ── */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.secondary,
    fontSize: fontSize.md,
    marginTop: spacing.md,
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
    color: colors.foregroundDark,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  backText: {
    color: colors.secondary,
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  titleText: {
    color: colors.foreground,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: borderRadius.round,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: borderRadius.round,
  },
  progressText: {
    color: colors.foreground,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: 3,
    opacity: 0.7,
  },
});
