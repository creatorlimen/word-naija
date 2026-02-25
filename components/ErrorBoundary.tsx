/**
 * Word Naija - Error Boundary (v4 — Afro-Minimal Premium)
 * Catches render errors and displays a fallback UI with glass styling.
 */

import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing, fontFamily } from "../constants/theme";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>😵</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <Pressable
            onPress={this.handleReset}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.extraBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
  },
});
