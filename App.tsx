/**
 * Word Naija - App Entry Point
 * Wraps GameProvider, loads Poppins fonts, switches between HomeScreen and GameBoard
 */

import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { GameProvider, useGameState, useGameActions } from "./lib/game/context";
import { getAchievements } from "./lib/game/stats";
import HomeScreen from "./components/HomeScreen";
import GameBoard from "./components/GameBoard";
import FTUE from "./components/FTUE";
import ErrorBoundary from "./components/ErrorBoundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fontSize, spacing, fontFamily, gradients } from "./constants/theme";
import { LinearGradient } from "expo-linear-gradient";

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
        <LinearGradient
          colors={gradients.background}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Loading Word Naija...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <LinearGradient
          colors={gradients.background}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Feather name="frown" size={48} color={colors.textMuted} style={{ marginBottom: spacing.md }} />
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
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.centered}>
        <LinearGradient
          colors={gradients.background}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={styles.loadingText}>Word Naija</Text>
        <StatusBar style="light" />
      </View>
    );
  }

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
    color: colors.gold,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.semiBold,
    marginTop: spacing.lg,
    letterSpacing: 1,
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
  },
});
