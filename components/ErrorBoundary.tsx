/**
 * Word Naija - Error Boundary
 * Catches render errors and displays a fallback UI
 */

import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing } from "../constants/theme";

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
    fontWeight: "800",
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: colors.foreground,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
});
