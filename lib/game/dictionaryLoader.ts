/**
 * Word Naija - Dictionary Loader
 * Parses bundled CSV dictionary and provides word validation/lookup
 */

import type { DictionaryIndex, DictionaryEntry } from "./types";

let dictionaryIndex: DictionaryIndex | null = null;

/**
 * Parse CSV dictionary data into an indexed map
 * Expected format: word,variants,meaning,language_tag,difficulty,notes
 */
function parseDictionaryCSV(csvContent: string): DictionaryIndex {
  const index: DictionaryIndex = new Map();
  const lines = csvContent.trim().split("\n");

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    if (parts.length < 5) continue;

    const [word, variantsStr, meaning, languageTag, difficulty] = parts;
    const canonical = word.toUpperCase().trim();
    const variants = variantsStr
      ? variantsStr
          .split("|")
          .map((v) => v.toUpperCase().trim())
          .filter(Boolean)
      : [];

    if (!variants.includes(canonical)) {
      variants.unshift(canonical);
    }

    const entry: DictionaryEntry = {
      canonical,
      variants,
      meaning: meaning.trim(),
      languageTag: languageTag.trim(),
      difficulty: (difficulty.trim() as "easy" | "medium" | "hard") || "medium",
    };

    index.set(canonical, entry);
    variants.forEach((v) => {
      if (!index.has(v)) {
        index.set(v, entry);
      }
    });
  }

  return index;
}

/**
 * Simple CSV line parser that handles quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Load dictionary from bundled CSV asset
 * Uses require() to bundle the CSV with Metro
 */
export async function loadDictionary(): Promise<DictionaryIndex> {
  if (dictionaryIndex) {
    return dictionaryIndex;
  }

  try {
    // Import the raw CSV content bundled as an asset
    // expo-file-system v19+ deprecated readAsStringAsync — use legacy import
    const Asset = require("expo-asset").Asset;
    const FileSystem = require("expo-file-system/legacy");

    const [asset] = await Asset.loadAsync(
      require("../../assets/data/dictionary.csv")
    );

    const csvContent = await FileSystem.readAsStringAsync(asset.localUri);
    dictionaryIndex = parseDictionaryCSV(csvContent);

    return dictionaryIndex;
  } catch (error) {
    dictionaryIndex = new Map();
    return dictionaryIndex;
  }
}

/**
 * Get the dictionary index (must call loadDictionary first)
 */
export function getDictionaryIndex(): DictionaryIndex {
  if (!dictionaryIndex) {
    throw new Error("Dictionary not loaded. Call loadDictionary() first.");
  }
  return dictionaryIndex;
}

/**
 * Validate if a word exists in dictionary
 * Returns the canonical form if valid, null otherwise
 */
export function validateWord(word: string): string | null {
  const normalized = word.toUpperCase().trim();
  const entry = dictionaryIndex?.get(normalized);
  return entry ? entry.canonical : null;
}

/**
 * Get the dictionary entry for a word
 */
export function getDictionaryEntry(word: string): DictionaryEntry | null {
  const normalized = word.toUpperCase().trim();
  return dictionaryIndex?.get(normalized) || null;
}

/**
 * Get meaning of a word
 */
export function getMeaning(word: string): string | null {
  const entry = getDictionaryEntry(word);
  return entry?.meaning || null;
}

/**
 * Check if dictionary is loaded
 */
export function isDictionaryLoaded(): boolean {
  return dictionaryIndex !== null;
}

/**
 * Reset dictionary (for testing)
 */
export function resetDictionary(): void {
  dictionaryIndex = null;
}
