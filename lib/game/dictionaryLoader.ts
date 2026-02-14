/**
 * Word Naija - Dictionary Loader
 * Parses CSV dictionary and provides word validation/lookup
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

    // Simple CSV parsing (handles quoted fields)
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

    // Always include canonical in variants
    if (!variants.includes(canonical)) {
      variants.unshift(canonical);
    }

    const entry: DictionaryEntry = {
      canonical,
      variants,
      meaning: meaning.trim(),
      languageTag: languageTag.trim(),
      difficulty: (difficulty.trim() as any) || "medium",
    };

    // Index by canonical and all variants
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
 */
export async function loadDictionary(): Promise<DictionaryIndex> {
  if (dictionaryIndex) {
    return dictionaryIndex;
  }

  try {
    // Fetch the dictionary CSV from public/data/dictionary.csv
    const response = await fetch("/data/dictionary.csv");
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.statusText}`);
    }

    const csvContent = await response.text();
    dictionaryIndex = parseDictionaryCSV(csvContent);

    console.log(`[Word Naija] Loaded ${dictionaryIndex.size} dictionary entries`);
    return dictionaryIndex;
  } catch (error) {
    console.error("[Word Naija] Dictionary load failed:", error);
    // Return empty dictionary on failure
    dictionaryIndex = new Map();
    return dictionaryIndex;
  }
}

/**
 * Get the dictionary index (must call loadDictionary first)
 */
export function getDictionaryIndex(): DictionaryIndex {
  if (!dictionaryIndex) {
    throw new Error(
      "Dictionary not loaded. Call loadDictionary() first."
    );
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

  if (entry) {
    return entry.canonical;
  }

  return null;
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
 * Get all variants of a word (including canonical)
 */
export function getVariants(word: string): string[] {
  const entry = getDictionaryEntry(word);
  return entry?.variants || [];
}

/**
 * Check if dictionary is loaded
 */
export function isDictionaryLoaded(): boolean {
  return dictionaryIndex !== null;
}

/**
 * Get dictionary statistics
 */
export function getDictionaryStats(): {
  totalEntries: number;
  totalVariants: number;
} {
  if (!dictionaryIndex) {
    return { totalEntries: 0, totalVariants: 0 };
  }

  const uniqueCanonicals = new Set<string>();
  let totalVariants = 0;

  dictionaryIndex.forEach((entry) => {
    uniqueCanonicals.add(entry.canonical);
    totalVariants += entry.variants.length;
  });

  return {
    totalEntries: uniqueCanonicals.size,
    totalVariants,
  };
}

/**
 * Reset dictionary (for testing)
 */
export function resetDictionary(): void {
  dictionaryIndex = null;
}
