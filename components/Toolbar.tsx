/**
 * Word Naija - Toolbar Component (v2.1)
 * Bottom footer actions: Extra, Friends, Themes, Shuffle, Hint.
 * 5 Green Circular Buttons.
 */

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { colors, borderRadius, fontSize, spacing, shadows } from "../constants/theme";

interface ToolbarProps {
  coins: number;
  hintCost: number;
  onShuffle: () => void;
  onHint: () => void;
}

function CircleButton({ 
  label, 
  sublabel,
  onPress, 
  color = colors.button.function,
  badge 
}: { 
  label: string; 
  sublabel: string;
  onPress: () => void; 
  color?: string;
  badge?: string | number;
}) {
  return (
    <View style={styles.btnWrapper}>
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                styles.circleBtn,
                { backgroundColor: color },
                pressed && styles.pressed
            ]}
        >
            <Text style={styles.btnIcon}>{label}</Text>
            <Text style={styles.btnSublabel}>{sublabel}</Text>
        </Pressable>
        {badge && (
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
            </View>
        )}
    </View>
  );
}

export default function Toolbar({ coins, hintCost, onShuffle, onHint }: ToolbarProps) {
  return (
    <View style={styles.container}>
      {/* 3 Icons Row - Friends and Themes removed */}
      
      {/* 1. Extra */}
      <CircleButton label="📦" sublabel="EXTRA" onPress={() => {}} />

      {/* 2. Shuffle */}
      <CircleButton label="🔀" sublabel="SHUFFLE" onPress={onShuffle} />

      {/* 3. Hint */}
      <CircleButton 
        label="💡" 
        sublabel="HINT"
        onPress={onHint} 
        badge={hintCost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  btnWrapper: {
    position: "relative",
    alignItems: "center",
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderBottomWidth: 4,
    borderBottomColor: colors.button.functionShadow,
    ...shadows.small,
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  btnIcon: {
    fontSize: 18,
    color: "#FFF",
    marginTop: -2,
  },
  btnSublabel: {
    fontSize: 8,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  badge: {
    position: "absolute",
    bottom: -8,
    right: -4,
    backgroundColor: colors.pill.background, // Green pill style
    borderRadius: borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.pill.border,
  },
  badgeText: {
    color: colors.pill.text,
    fontSize: 10,
    fontWeight: "bold",
  }
});
