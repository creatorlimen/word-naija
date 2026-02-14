/**
 * Word Naija - Level Loader
 * Loads and validates level definitions from JSON
 */

import type { Level, TargetWord } from "./types";
import { getDictionaryIndex } from "./dictionaryLoader";

const LEVELS_BASE_PATH = "/data/levels";

/**
 * Load a single level by ID
 */
export async function loadLevel(levelId: number): Promise<Level> {
  try {
    const fileName = `level-${String(levelId).padStart(3, "0")}.json`;
    const response = await fetch(`${LEVELS_BASE_PATH}/${fileName}`);

    if (!response.ok) {
      throw new Error(`Level ${levelId} not found`);
    }

    const levelData: Level = await response.json();

    // Validate the level structure
    validateLevel(levelData);

    return levelData;
  } catch (error) {
    console.error(`[Word Naija] Failed to load level ${levelId}:`, error);
    throw error;
  }
}

/**
 * Get list of all available level IDs
 */
export async function getLevelList(): Promise<number[]> {
  try {
    // This is a simplified version - in production, you'd have a manifest file
    // For now, we'll assume levels 1-120 are available
    const levelIds: number[] = [];
    for (let i = 1; i <= 120; i++) {
      levelIds.push(i);
    }
    return levelIds;
  } catch (error) {
    console.error("[Word Naija] Failed to get level list:", error);
    return [];
  }
}

/**
 * Validate a level structure
 */
function validateLevel(level: Level): void {
  if (!level.levelId || typeof level.levelId !== "number") {
    throw new Error("Invalid levelId");
  }

  if (!level.title || typeof level.title !== "string") {
    throw new Error("Invalid title");
  }

  if (!level.rows || !level.cols || level.rows <= 0 || level.cols <= 0) {
    throw new Error("Invalid grid dimensions");
  }

  if (!Array.isArray(level.mask) || level.mask.length !== level.rows) {
    throw new Error("Invalid mask dimensions");
  }

  for (const row of level.mask) {
    if (!Array.isArray(row) || row.length !== level.cols) {
      throw new Error("Mask row has incorrect length");
    }
  }

  if (!Array.isArray(level.letters) || level.letters.length === 0) {
    throw new Error("Invalid letters pool");
  }

  if (!Array.isArray(level.targetWords) || level.targetWords.length === 0) {
    throw new Error("No target words defined");
  }

  // Validate each target word
  for (const targetWord of level.targetWords) {
    validateTargetWord(targetWord, level);
  }
}

/**
 * Validate a target word definition
 */
function validateTargetWord(targetWord: TargetWord, level: Level): void {
  if (!targetWord.word || typeof targetWord.word !== "string") {
    throw new Error("Invalid target word");
  }

  if (!Array.isArray(targetWord.coords) || targetWord.coords.length === 0) {
    throw new Error(`Invalid coordinates for word ${targetWord.word}`);
  }

  // Check that word length matches coords length
  if (targetWord.word.length !== targetWord.coords.length) {
    throw new Error(
      `Word length mismatch for ${targetWord.word}: ${targetWord.word.length} vs ${targetWord.coords.length}`
    );
  }

  // Check that all coords are within grid bounds and are playable
  for (const [row, col] of targetWord.coords) {
    if (row < 0 || row >= level.rows || col < 0 || col >= level.cols) {
      throw new Error(
        `Coordinate [${row}, ${col}] out of bounds for word ${targetWord.word}`
      );
    }

    if (!level.mask[row][col]) {
      throw new Error(
        `Coordinate [${row}, ${col}] is not playable for word ${targetWord.word}`
      );
    }
  }

  // Check that all letters of the word are in the letter pool
  const letterPool = level.letters.map((l) => l.toUpperCase());
  const wordLetters = targetWord.word.toUpperCase().split("");
  const usedLetters = { ...letterPool };

  for (const letter of wordLetters) {
    const index = usedLetters.indexOf(letter);
    if (index === -1) {
      throw new Error(
        `Letter '${letter}' from word '${targetWord.word}' not in letter pool`
      );
    }
    usedLetters.splice(index, 1);
  }
}

/**
 * Check if a level is solvable with the current dictionary
 */
export async function validateLevelSolvability(
  level: Level
): Promise<{ solvable: boolean; missingWords: string[] }> {
  try {
    const dictionary = getDictionaryIndex();
    const missingWords: string[] = [];

    for (const targetWord of level.targetWords) {
      const normalized = targetWord.word.toUpperCase().trim();
      if (!dictionary.has(normalized)) {
        missingWords.push(targetWord.word);
      }
    }

    return {
      solvable: missingWords.length === 0,
      missingWords,
    };
  } catch (error) {
    console.error("[Word Naija] Solvability check failed:", error);
    return { solvable: false, missingWords: [] };
  }
}

/**
 * Get the next level ID after the current one
 */
export function getNextLevelId(currentLevelId: number): number | null {
  // Assuming 120 levels max
  return currentLevelId < 120 ? currentLevelId + 1 : null;
}

/**
 * Get level metadata without loading full level
 */
export async function getLevelMetadata(
  levelId: number
): Promise<{ title: string; difficulty: string } | null> {
  try {
    const level = await loadLevel(levelId);
    return {
      title: level.title,
      difficulty: level.difficulty,
    };
  } catch {
    return null;
  }
}
