/**
 * Word Naija - Settings Modal
 * Matches reference screenshot style: teal panel, gold border, toggles.
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Switch,
  StyleSheet,
  Share,
  Linking,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { colors, spacing, fontSize, borderRadius, shadows, fontFamily } from "../constants/theme";
import Icon from "./Icon";

const NOTIF_KEY = "@word_naija_notifications";

interface SettingsModalProps {
  visible: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onClose: () => void;
  onHowToPlay: () => void;
  onQuit: () => void;
}

export default function SettingsModal({
  visible,
  soundEnabled,
  onToggleSound,
  onClose,
  onHowToPlay,
  onQuit,
}: SettingsModalProps) {
  const [notificationsOn, setNotificationsOn] = useState(false);

  // Load saved notifications preference
  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEY).then((val) => {
      if (val !== null) setNotificationsOn(val === "true");
    });
  }, []);

  const toggleNotifications = useCallback(async () => {
    const newVal = !notificationsOn;
    setNotificationsOn(newVal);
    await AsyncStorage.setItem(NOTIF_KEY, String(newVal));
  }, [notificationsOn]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message:
          "I'm playing Word Naija 🇳🇬 — the Nigerian word puzzle game! Can you beat my score?",
        title: "Word Naija",
      });
    } catch {
      // Share dismissed — no-op
    }
  }, []);

  const handleContactUs = useCallback(() => {
    Linking.openURL("mailto:support@wordnaija.com").catch(() => {
      Alert.alert("Email", "Contact us at: support@wordnaija.com");
    });
  }, []);

  const handleQuit = useCallback(() => {
    Alert.alert("Exit App", "Are you sure you want to exit Word Naija?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: () => BackHandler.exitApp() },
    ]);
  }, []);

  const handleResetAll = useCallback(() => {
    Alert.alert(
      "Reset All Data",
      "This will wipe all progress, coins, and settings — like a fresh install. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            onClose();
            onQuit();
          },
        },
      ]
    );
  }, [onClose, onQuit]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Wrapper allows close button to sit outside the clipped panel */}
        <View style={styles.panelWrapper}>
          {/* Close button — outside overflow:hidden panel */}
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <Icon name="close" size={14} color={colors.textPrimary} />
          </Pressable>

          {/* Prevent tap-through from closing when tapping the panel */}
          <Pressable style={styles.panel} onPress={() => {}}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* --- Learn the Game --- */}
          <Pressable style={styles.row} onPress={onHowToPlay}>
            <Text style={styles.rowLabel}>Learn the Game</Text>
            <Icon name="chevron" size={18} color={colors.textMuted} />
          </Pressable>

          <View style={styles.rowDivider} />

          {/* --- Sound Effects --- */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={onToggleSound}
              trackColor={{ false: "#555", true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* --- Exit Game --- */}
          <Pressable style={styles.row} onPress={handleQuit}>
            <Text style={styles.rowLabel}>Exit Game</Text>
            <Icon name="power" size={18} color={colors.textMuted} />
          </Pressable>

          <View style={styles.rowDivider} />

          {/* --- Reset All Data --- */}
          <Pressable style={styles.row} onPress={handleResetAll}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="alert" size={14} color="#E05A5A" />
              <Text style={styles.resetLabel}>Reset All Data</Text>
            </View>
            <Icon name="chevron" size={18} color={colors.textMuted} />
          </Pressable>

          <View style={styles.divider} />

          {/* --- Bottom Actions --- */}
          <View style={styles.bottomRow}>
            {/* Get in Touch */}
            <Pressable style={styles.contactButton} onPress={handleContactUs}>
              <Text style={styles.contactText}>Get in Touch</Text>
            </Pressable>

            {/* Spread the Word */}
            <Pressable style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareText}>Spread the Word</Text>
            </Pressable>
          </View>

        </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const PANEL_BG = "rgba(8, 20, 16, 0.75)";
const PANEL_BORDER = "rgba(255,255,255,0.18)";
const ROW_DIVIDER = "rgba(255,255,255,0.08)";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  panelWrapper: {
    width: "84%",
    alignItems: "center",
    position: "relative",
  },
  panel: {
    width: "100%",
    backgroundColor: PANEL_BG,
    borderRadius: borderRadius.xl,
    overflow: "hidden" as const,
    borderWidth: 1,
    borderColor: "rgba(212,168,67,0.45)",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    ...shadows.soft,
  },
  closeButton: {
    position: "absolute",
    top: -12,
    right: -12,
    width: 34,
    height: 34,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    zIndex: 20,
    elevation: 10,
  },
  closeText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fontFamily.bold,
    lineHeight: 18,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.bold,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: PANEL_BORDER,
    marginVertical: spacing.sm,
    opacity: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  rowLabel: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodyMedium,
    letterSpacing: 0.3,
  },
  resetLabel: {
    color: "#E05A5A",
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodyMedium,
    letterSpacing: 0.3,
  },
  rowDivider: {
    height: 1,
    backgroundColor: ROW_DIVIDER,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 24,
    lineHeight: 26,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  powerButton: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  powerIconWrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  powerIconLine: {
    position: "absolute",
    top: 0,
    width: 2.5,
    height: 10,
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
    zIndex: 2,
  },
  powerIconArc: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: colors.textPrimary,
    borderTopColor: "transparent",
  },
  contactButton: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.xs,
  },
  contactText: {
    color: colors.textPrimary,
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semiBold,
    textAlign: "center",
  } as any,
  shareButton: {
    flex: 1,
    height: 44,
    backgroundColor: colors.accent,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.accentStrong,
    paddingHorizontal: spacing.xs,
  },
  shareText: {
    color: "#FFFFFF",
    fontSize: fontSize.xs,
    fontFamily: fontFamily.semiBold,
    textAlign: "center",
  } as any,
});
