/**
 * Word Naija - Persistence Layer
 * Handles saving/loading game progress using IndexedDB for web
 */

import type { SavedProgress } from "./types";

const DB_NAME = "WordNaijaGameDB";
const DB_VERSION = 1;
const STORE_NAME = "gameProgress";

let db: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
async function initializeDB(): Promise<IDBDatabase> {
  if (db) {
    return db;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

/**
 * Save game progress
 */
export async function saveProgress(progress: SavedProgress): Promise<void> {
  try {
    const database = await initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Use a fixed key for the single progress record
      const request = store.put({ id: "progress", ...progress });

      request.onerror = () => {
        reject(new Error("Failed to save progress"));
      };

      request.onsuccess = () => {
        console.log("[Word Naija] Progress saved");
        resolve();
      };
    });
  } catch (error) {
    console.error("[Word Naija] Save progress error:", error);
    // Don't throw - gracefully degrade
  }
}

/**
 * Load game progress
 */
export async function loadProgress(): Promise<SavedProgress | null> {
  try {
    const database = await initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get("progress");

      request.onerror = () => {
        reject(new Error("Failed to load progress"));
      };

      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          // Remove the 'id' field before returning
          const { id, ...progress } = data;
          console.log("[Word Naija] Progress loaded");
          resolve(progress as SavedProgress);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error("[Word Naija] Load progress error:", error);
    return null;
  }
}

/**
 * Clear all game progress (reset game)
 */
export async function clearProgress(): Promise<void> {
  try {
    const database = await initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => {
        reject(new Error("Failed to clear progress"));
      };

      request.onsuccess = () => {
        console.log("[Word Naija] Progress cleared");
        resolve();
      };
    });
  } catch (error) {
    console.error("[Word Naija] Clear progress error:", error);
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

/**
 * Check if data exists in IndexedDB
 */
export async function hasProgress(): Promise<boolean> {
  const progress = await loadProgress();
  return progress !== null;
}

/**
 * Update specific progress fields
 */
export async function updateProgress(
  updates: Partial<SavedProgress>
): Promise<void> {
  const current = await loadProgress();
  const merged = { ...getDefaultProgress(), ...current, ...updates };
  await saveProgress(merged);
}

/**
 * Backup progress to localStorage as fallback
 */
export function backupProgressToLocalStorage(progress: SavedProgress): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("wordnaija_backup", JSON.stringify(progress));
    }
  } catch (error) {
    console.warn("[Word Naija] LocalStorage backup failed:", error);
  }
}

/**
 * Restore progress from localStorage backup
 */
export function restoreProgressFromLocalStorage(): SavedProgress | null {
  try {
    if (typeof localStorage !== "undefined") {
      const data = localStorage.getItem("wordnaija_backup");
      if (data) {
        return JSON.parse(data);
      }
    }
  } catch (error) {
    console.warn("[Word Naija] LocalStorage restore failed:", error);
  }
  return null;
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}
