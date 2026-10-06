/**
 * Word Naija - Persistence Layer
 * Handles saving/loading game progress using AsyncStorage (React Native)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedProgress } from "./types";
import { normalizeProgress } from "./progress";

export { getDefaultProgress } from "./progress";

const STORAGE_KEY = "wordnaija_progress";
let pendingWrite: Promise<void> = Promise.resolve();

/**
 * Save game progress
 */
export async function saveProgress(progress: SavedProgress): Promise<void> {
  const json = JSON.stringify(progress);
  // Keep writes in action order. A slower old write must never overwrite a
  // newly completed level or a freshly purchased hint.
  pendingWrite = pendingWrite.then(() => AsyncStorage.setItem(STORAGE_KEY, json))
    .catch((error) => { console.warn("⚠️ Progress save failed", error); });
  await pendingWrite;
}

/**
 * Load game progress
 */
export async function loadProgress(): Promise<SavedProgress | null> {
  try {
    await pendingWrite;
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return normalizeProgress(JSON.parse(json));
    }
    return null;
  } catch (error) {
    console.warn("⚠️ Progress load failed", error);
    // Do not replace an unreadable save with fresh progress on startup.
    throw new Error("Could not load saved progress. Please reopen the game to try again.");
  }
}

/**
 * Clear all game progress (reset game)
 */
export async function clearProgress(): Promise<void> {
  pendingWrite = pendingWrite.then(() => AsyncStorage.removeItem(STORAGE_KEY))
    .catch((error) => { console.warn("⚠️ Progress clear failed", error); });
  await pendingWrite;
}
