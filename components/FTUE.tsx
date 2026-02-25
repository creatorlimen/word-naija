/**
 * Word Naija - FTUE Onboarding Component (v4 — Afro-Minimal Premium)
 * Interactive "Show, Don't Tell" onboarding with glass cards.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borderRadius, fontSize, spacing, shadows, fontFamily, gradients } from "../constants/theme";

const FTUE_KEY = "@word_naija_ftue_complete";

const slides = [
  {
    emoji: null,
    logo: true,
    title: "Welcome to Word Naija!",
    body: "The Nigerian word puzzle game where you discover English and Pidgin words.",
  },
  {
    emoji: "👆",
    title: "Swipe to Connect",
    body: "Swipe letters on the wheel to form words. Each word fits into the crossword grid.",
  },
  {
    emoji: "💡",
    title: "Need a Hint?",
    body: "Spend 15 coins to reveal a letter on the grid. You earn coins by completing levels and finding bonus words.",
  },
  {
    emoji: "🎯",
    title: "Ready?",
    body: "Find all the target words to complete each level. Discover extra words for bonus coins!",
  },
];

interface FTUEProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export default function FTUE({ onComplete, forceShow }: FTUEProps) {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (forceShow) {
      setCurrentSlide(0);
      setVisible(true);
    }
  }, [forceShow]);

  useEffect(() => {
    if (!forceShow) checkFTUE();
  }, []);

  async function checkFTUE() {
    try {
      const done = await AsyncStorage.getItem(FTUE_KEY);
      if (!done) {
        setVisible(true);
      }
    } catch {
      // If we can't read, skip FTUE
    }
  }

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      completeFTUE();
    }
  }, [currentSlide]);

  const handleSkip = useCallback(() => {
    completeFTUE();
  }, []);

  async function completeFTUE() {
    try {
      await AsyncStorage.setItem(FTUE_KEY, "1");
    } catch {
      // Best effort
    }
    setVisible(false);
    onComplete();
  }

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {slide.logo ? (
            <Image
              source={require("../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.emoji}>{slide.emoji}</Text>
          )}
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>

          {/* Dots */}
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === currentSlide && styles.dotActive]}
              />
            ))}
          </View>

          {/* Buttons */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.nextButtonText}>
              {isLast ? "Let's Go!" : "Next"}
            </Text>
          </Pressable>

          {!isLast && (
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: "rgba(8,20,16,0.96)",
    borderWidth: 1,
    borderColor: colors.outlineGoldStrong,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    width: Math.min(width - 48, 360),
    alignItems: "center",
    ...shadows.soft,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  dots: {
    flexDirection: "row",
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  dotActive: {
    backgroundColor: colors.gold,
    width: 20,
  },
  nextButton: {
    backgroundColor: colors.gold,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
    minWidth: 200,
    alignItems: "center",
    ...shadows.glow,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  nextButtonText: {
    color: "#3A2F2A",
    fontSize: fontSize.lg,
    fontFamily: fontFamily.semiBold,
  },
  skipButton: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
  },
});
