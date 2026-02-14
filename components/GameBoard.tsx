/**
 * Word Naija - GameBoard Component
 * Main game screen orchestrating Grid, LetterWheel, Controls, and LevelComplete
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import Grid from "./Grid";
import LetterWheel from "./LetterWheel";
import Controls from "./Controls";
import LevelComplete from "./LevelComplete";
import { useGameState, useGameActions } from "../lib/game/context";
import { getCoinsEarned, isLevelComplete } from "../lib/game/gameState";
import { colors, fontSize, spacing, borderRadius } from "../constants/theme";

interface GameBoardProps {
  onGoHome: () => void;
}

export default function GameBoard({ onGoHome }: GameBoardProps) {
  const { state, progress, isComplete, isLoading, error } = useGameState();
  const actions = useGameActions();

  const handleSubmit = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    actions.submitWord();
  }, [actions]);

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

  const canSubmit =
    state?.selectedPath && state.selectedPath.word.length >= 2;

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading...</Text>
        <StatusBar style="light" />
      </SafeAreaView>
    );
  }

  // Error state
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onGoHome} style={styles.backButton}>
          <Text style={styles.backText}>← Home</Text>
        </Pressable>
        <Text style={styles.titleText}>{state.currentLevel.title}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress bar */}
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

      {/* Grid */}
      <Grid
        gridState={state.gridState}
        selectedPath={state.selectedPath}
      />

      {/* Letter Wheel */}
      <LetterWheel
        letters={state.letterWheel}
        selectedIndices={state.selectedPath?.letterIndices || []}
        currentWord={state.selectedPath?.word || ""}
        onSelectLetter={actions.selectLetter}
        onClear={actions.clearSelection}
      />

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            !canSubmit && styles.submitButtonDisabled,
            pressed && canSubmit && styles.submitButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.submitText,
              !canSubmit && styles.submitTextDisabled,
            ]}
          >
            Submit
          </Text>
        </Pressable>
      </View>

      {/* Controls */}
      <Controls
        levelNumber={state.currentLevel.levelId}
        coins={state.coins}
        soundEnabled={state.soundEnabled}
        onShuffle={actions.shuffleLetters}
        onHint={actions.revealHint}
        onToggleSound={actions.toggleSound}
        onReset={actions.resetLevel}
      />

      {/* Flavor text */}
      {state.currentLevel.flavorText && (
        <Text style={styles.flavorText}>{state.currentLevel.flavorText}</Text>
      )}

      {/* Level Complete Modal */}
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
    paddingVertical: spacing.sm,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  backText: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  titleText: {
    color: colors.foreground,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  headerRight: {
    width: 60,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
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
    marginTop: 4,
    opacity: 0.8,
  },
  submitContainer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  submitButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    minWidth: 160,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  submitButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  submitText: {
    color: colors.foreground,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  submitTextDisabled: {
    opacity: 0.4,
  },
  flavorText: {
    color: colors.foreground,
    fontSize: fontSize.xs,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.6,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
});
