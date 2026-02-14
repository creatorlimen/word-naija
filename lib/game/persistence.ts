/**
 * Word Naija - Persistence Layer
 * Handles saving/loading game progress using AsyncStorage (React Native)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedProgress } from "./types";

const STORAGE_KEY = "wordnaija_progress";

/**
 * Save game progress
 */
export async function saveProgress(progress: SavedProgress): Promise<void> {
  try {
    const json = JSON.stringify(progress);
    await AsyncStorage.setItem(STORAGE_KEY, json);
    console.log("📦 Progress saved");
  } catch (error) {
    console.error("❌ Save progress error:", error);
  }
}

/**
 * Load game progress
 */
export async function loadProgress(): Promise<SavedProgress | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      console.log("📦 Progress loaded");
      return JSON.parse(json) as SavedProgress;
    }
    return null;
  } catch (error) {
    console.error("❌ Load progress error:", error);
    return null;
  }
}

/**
 * Clear all game progress (reset game)
 */
export async function clearProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("🧹 Progress cleared");
  } catch (error) {
    console.error("❌ Clear progress error:", error);
  }
}

/**
 * Get default progress object
 */
export function getDefaultProgress(): SavedProgress {
  return {
    coins: 0,
    completedLevels: [],
    soundEnabled: true,
    lastPlayed: Date.now(),
    extraWordsFoundByLevel: {},
  };
}
