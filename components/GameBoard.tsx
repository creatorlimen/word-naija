/**
 * Word Naija - GameBoard Component (v2 - Visual Overhaul)
 * Main game screen: Wood theme, pill headers, nature background.
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Grid from "./Grid";
import LetterCircle from "./LetterCircle"; 
import Toolbar from "./Toolbar";
import LevelComplete from "./LevelComplete";
import { useGameState, useGameActions } from "../lib/game/context";
import { getCoinsEarned, HINT_COST } from "../lib/game/gameState";
import { colors, fontSize, spacing, borderRadius, shadows } from "../constants/theme";

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
        <Text style={styles.errorEmoji}>??</Text>
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
    <ImageBackground 
      source={require("../assets/adaptive-icon.png")} // Placeholder BG
      style={styles.background}
      imageStyle={{ opacity: 0.05 }} // Subtle texture
    >
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
            <Pressable style={styles.iconButton}>
               <Text style={styles.iconText}>⚙️</Text>
            </Pressable>
          </View>

          {/* Center: Level Pill */}
          <View style={styles.levelPill}>
            <Text style={styles.levelText}>Level {state.currentLevel.levelId}</Text>
          </View>

          {/* Right: Coin Pill */}
          <View style={styles.coinPill}>
            <View style={styles.coinIconContainer}>
               <Text style={styles.coinIcon}>$</Text>
            </View>
            <Text style={styles.coinText}>{state.coins}</Text>
            <View style={styles.plusButton}>
               <Text style={styles.plusText}>+</Text>
            </View>
          </View>
        </View>

        {/* -- Game Area -- */}
        {/* Grid takes available upper space */}
        <View style={{ flex: 1, zIndex: 1, paddingTop: spacing.md }}>
            <Grid 
                gridState={state.gridState} 
                selectedPath={state.selectedPath} 
            />
        </View>

        {/* Tools & Wheel at bottom */}
        {/* We want the wheel centered, and footer below it */}
        <View style={{ flexGrow: 0, paddingBottom: 20 }}>
            {/* Letter Wheel Input */}
            <View style={{ height: 280, alignItems: "center", justifyContent: "center" }}>
                <LetterCircle
                    letters={state.letterWheel}
                    selectedIndices={state.selectedPath?.letterIndices || []}
                    currentWord={state.selectedPath?.word || ""}
                    onSelectLetter={(idx) => actions.selectLetter(idx)}
                    onUndoSelection={() => actions.undoSelection()}
                    onClear={() => actions.clearSelection()} // Should be unused by pan logic now
                    onCommit={() => actions.commitSelection()}
                />
            </View>

            {/* Separator */}
            <View style={styles.separator} />

            {/* Bottom Toolbar */}
            <View style={styles.toolbarContainer}>
                <Toolbar
                    coins={state.coins}
                    hintCost={HINT_COST}
                    onShuffle={() => actions.shuffleLetters()}
                    onHint={() => actions.revealHint()}
                />
            </View>
        </View>

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
    </ImageBackground>
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 60,
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
    backgroundColor: colors.pill.background,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.pill.border,
    marginRight: spacing.sm,
    ...shadows.small,
  },
  iconText: {
    fontSize: fontSize.lg,
    color: colors.pill.icon,
  },
  
  /* CENTER PILL (LEVEL) */
  levelPill: {
    backgroundColor: colors.pill.background,
    paddingVertical: 6,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.pill.border,
    minWidth: 100,
    alignItems: "center",
    ...shadows.small,
  },
  levelText: {
    color: colors.pill.text,
    fontSize: fontSize.md,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  /* RIGHT PILL (COINS) */
  coinPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.pill.background,
    paddingVertical: 4,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.pill.border,
    minWidth: 80,
    ...shadows.small,
  },
  coinIconContainer: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.pill.icon,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  coinIcon: {
    color: colors.pill.background,
    fontSize: fontSize.sm,
    fontWeight: "bold",
  },
  coinText: {
    color: colors.pill.text,
    fontSize: fontSize.sm,
    fontWeight: "700",
    marginRight: 8,
  },
  plusButton: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.full,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: -2,
  },

  progressContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  progressText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2
  },
  
  separator: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: spacing.xl,
    marginVertical: spacing.lg,
  },
  
  toolbarContainer: {
    marginBottom: spacing.xs,
  },
});

