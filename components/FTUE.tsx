/**
 * Word Naija - FTUE Onboarding Component
 * First-Time User Experience modal
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

const FTUE_KEY = "@word_naija_ftue_complete";

const slides = [
  {
    emoji: "🇳🇬",
    title: "Welcome to Word Naija!",
    body: "The Nigerian word puzzle game where you discover English and Pidgin words.",
  },
  {
    emoji: "🧩",
    title: "How to Play",
    body: "Tap letters from the wheel to form words. Each word fits into the crossword grid at specific positions.",
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
}

export default function FTUE({ onComplete }: FTUEProps) {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    checkFTUE();
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
          <Text style={styles.emoji}>{slide.emoji}</Text>
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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: colors.foreground,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: Math.min(width - 48, 360),
    alignItems: "center",
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: fontSize.md,
    color: colors.mutedDark,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  dots: {
    flexDirection: "row",
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    backgroundColor: colors.muted,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 16,
  },
  nextButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    minWidth: 180,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  nextButtonText: {
    color: colors.foreground,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  skipButton: {
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.mutedDark,
    fontSize: fontSize.sm,
  },
});
