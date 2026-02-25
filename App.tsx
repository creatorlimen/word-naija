/**
 * Word Naija - App Entry Point
 * Wraps GameProvider, loads Poppins fonts, switches between HomeScreen and GameBoard
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Animated,
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
import { colors, fontSize, spacing, fontFamily, gradients, shadows, borderRadius } from "./constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import DecoBackground from "./components/DecoBackground";

type Screen = "home" | "game";

/* ── Pulsing grid-tile letters for the loading screen ── */
const LOADING_LETTERS = ["L", "O", "A", "D", "I", "N", "G"];

function LoadingTiles() {
  // One animated value per letter, staggered
  const anims = useRef(LOADING_LETTERS.map(() => new Animated.Value(0.35))).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 120),
          Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.35, duration: 500, useNativeDriver: true }),
        ])
      )
    );
    Animated.parallel(animations).start();
    return () => animations.forEach((a) => a.stop());
  }, []);

  return (
    <View style={styles.loadingTilesRow}>
      {LOADING_LETTERS.map((letter, i) => (
        <Animated.View
          key={i}
          style={[
            styles.loadingTile,
            {
              opacity: anims[i],
              transform: [{
                scale: anims[i].interpolate({
                  inputRange: [0.35, 1],
                  outputRange: [0.92, 1],
                }),
              }],
            },
          ]}
        >
          <Text style={styles.loadingTileText}>{letter}</Text>
        </Animated.View>
      ))}
    </View>
  );
}

function AppNavigator() {
  const [screen, setScreen] = useState<Screen>("home");
  const [ftueComplete, setFtueComplete] = useState(false);
  const [startWithTutorial, setStartWithTutorial] = useState(false);
  const { state, isLoading, error } = useGameState();

  const handleStart = useCallback(() => {
    setStartWithTutorial(false);
    setScreen("game");
  }, []);

  const handleGoHome = useCallback(() => {
    setStartWithTutorial(false);
    setScreen("home");
  }, []);

  const handleHowToPlay = useCallback(() => {
    setStartWithTutorial(true);
    setScreen("game");
  }, []);

  const handleFTUEComplete = useCallback(() => {
    setFtueComplete(true);
    // First-time user: jump straight into the game with coach marks
    setStartWithTutorial(true);
    setScreen("game");
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
        <DecoBackground variant="home" />
        <Image source={require("./assets/logo.png")} style={styles.splashLogo} resizeMode="contain" />
        <Text style={styles.splashTitle}>Word Naija</Text>
        <Text style={styles.splashTagline}>The Nigerian Word Puzzle</Text>
        <View style={{ marginTop: spacing.xxl }}>
          <LoadingTiles />
        </View>
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
          onHowToPlay={handleHowToPlay}
        />
      ) : (
        <GameBoard onGoHome={handleGoHome} startWithTutorial={startWithTutorial} />
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
  splashLogo: {
    width: 160,
    height: 160,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    ...shadows.glow,
  },
  splashTitle: {
    color: colors.gold,
    fontSize: fontSize.xxxl,
    fontFamily: fontFamily.bold,
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  splashTagline: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodyMedium,
    letterSpacing: 0.5,
  },
  loadingTilesRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingTile: {
    width: 36,
    height: 42,
    backgroundColor: "#F5E3B8",
    borderRadius: borderRadius.sm + 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(166,134,50,0.25)",
    borderBottomWidth: 3,
    borderBottomColor: "rgba(140,110,30,0.35)",
    ...shadows.tile,
  },
  loadingTileText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: "#4A3520",
    marginTop: -1,
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
