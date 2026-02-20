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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, fontSize, borderRadius, shadows } from "../constants/theme";

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
    Alert.alert("Quit Game", "Return to the home screen?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: onQuit },
    ]);
  }, [onQuit]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Prevent tap-through from closing when tapping the panel */}
        <Pressable style={styles.panel} onPress={() => {}}>

          {/* Close button */}
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* --- Sound --- */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Sound</Text>
            <Switch
              value={soundEnabled}
              onValueChange={onToggleSound}
              trackColor={{ false: "#555", true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* --- Notifications --- */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Switch
              value={notificationsOn}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#555", true: colors.success }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.rowDivider} />

          {/* --- How to Play --- */}
          <Pressable style={styles.row} onPress={onHowToPlay}>
            <Text style={styles.rowLabel}>How to Play</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* --- Bottom Actions --- */}
          <View style={styles.bottomRow}>
            {/* Power / Quit */}
            <Pressable style={styles.powerButton} onPress={handleQuit}>
              {/* Power icon: circle arc + vertical line, built from Views */}
              <View style={styles.powerIconWrap}>
                <View style={styles.powerIconLine} />
                <View style={styles.powerIconArc} />
              </View>
            </Pressable>

            {/* Contact Us */}
            <Pressable style={styles.contactButton} onPress={handleContactUs}>
              <Text style={styles.contactText}>Contact Us</Text>
            </Pressable>

            {/* Share */}
            <Pressable style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareText}>Share</Text>
            </Pressable>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const PANEL_BG = "rgba(10, 24, 22, 0.9)";
const PANEL_BORDER = "rgba(255,255,255,0.2)";
const ROW_DIVIDER = "rgba(255,255,255,0.12)";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    width: "82%",
    backgroundColor: PANEL_BG,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: PANEL_BORDER,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    ...shadows.soft,
  },
  closeButton: {
    position: "absolute",
    top: -14,
    right: -14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PANEL_BORDER,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    zIndex: 10,
  },
  closeText: {
    color: colors.foreground,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 18,
  },
  title: {
    color: colors.foreground,
    fontSize: fontSize.xl,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1.5,
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
    color: colors.foreground,
    fontSize: fontSize.md,
    letterSpacing: 0.5,
  },
  rowDivider: {
    height: 1,
    backgroundColor: ROW_DIVIDER,
  },
  chevron: {
    color: colors.foreground,
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "300",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  powerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.outline,
  },
  powerIconWrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  // Vertical line at top of the power icon
  powerIconLine: {
    position: "absolute",
    top: 0,
    width: 2.5,
    height: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    zIndex: 2,
  },
  // Arc (open circle) forming the rest of the power icon
  powerIconArc: {
    position: "absolute",
    bottom: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    // Clip the top gap where the line sits
    borderTopColor: "transparent",
  },
  contactButton: {
    flex: 1,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
    paddingHorizontal: spacing.xs,
  },
  contactText: {
    color: colors.foreground,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
  } as any,
  shareButton: {
    flex: 1,
    height: 44,
    backgroundColor: colors.success,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.outline,
  },
  shareText: {
    color: "#FFFFFF",
    fontSize: fontSize.sm,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
