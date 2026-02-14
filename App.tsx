/**
 * Word Naija - App Entry Point
 * Wraps GameProvider and switches between HomeScreen and GameBoard
 */

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { GameProvider, useGameState, useGameActions } from "./lib/game/context";
import { getAchievements } from "./lib/game/stats";
import HomeScreen from "./components/HomeScreen";
import GameBoard from "./components/GameBoard";
import FTUE from "./components/FTUE";
import ErrorBoundary from "./components/ErrorBoundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors, fontSize, spacing } from "./constants/theme";

type Screen = "home" | "game";

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>("home");
  const [ftueComplete, setFtueComplete] = useState(false);
  const { state, isLoading, error } = useGameState();

  const handleStart = useCallback(() => {
    setScreen("game");
  }, []);

  const handleGoHome = useCallback(() => {
    setScreen("home");
  }, []);

  const handleFTUEComplete = useCallback(() => {
    setFtueComplete(true);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading Word Naija...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  const completedLevels = state?.completedLevels
    ? state.completedLevels.size
    : 0;

  const achievements = state ? getAchievements(state) : [];

  return (
    <>
      {/* FTUE onboarding — shows only on first launch */}
      <FTUE onComplete={handleFTUEComplete} />

      {screen === "home" ? (
        <HomeScreen
          coins={state?.coins ?? 0}
          levelsCompleted={completedLevels}
          achievements={achievements}
          onStart={handleStart}
        />
      ) : (
        <GameBoard onGoHome={handleGoHome} />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <GameProvider>
          <AppNavigator />
        </GameProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
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
  },
});
