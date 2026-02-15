/**
 * Word Naija - Level Loader
 * Dynamically generates levels from configuration templates.
 */

import type { Level, TargetWord } from "./types";
import { generateLevelFromWords } from "./levelGenerator";
import { LEVEL_CONFIGS, TOTAL_LEVELS } from "./levelDefinitions";

// Re-export total levels to be used by other modules
export { TOTAL_LEVELS };

/**
 * Load a single level by ID
 */
export async function loadLevel(levelId: number): Promise<Level> {
  const config = LEVEL_CONFIGS[levelId];

  if (!config) {
    throw new Error(`Level ${levelId} not found in configuration`);
  }

  // Generate the level structure procedurally
  const level = generateLevelFromWords(
    levelId,
    config.words,
    config.difficulty,
    config.title
  );

  validateLevel(level);
  return level;
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

  if (targetWord.word.length !== targetWord.coords.length) {
    throw new Error(
      `Word length mismatch for ${targetWord.word}: ${targetWord.word.length} vs ${targetWord.coords.length}`
    );
  }

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

  // Validate letter pool contains all needed letters (allow reuse across words)
  const letterSet = new Set(level.letters.map((l) => l.toUpperCase()));
  const wordLetters = targetWord.word.toUpperCase().split("");

  for (const letter of wordLetters) {
    if (!letterSet.has(letter)) {
      throw new Error(
        `Letter '${letter}' from word '${targetWord.word}' not in letter pool`
      );
    }
  }
}

/**
 * Get the next level ID after the current one
 */
export function getNextLevelId(currentLevelId: number): number | null {
  return currentLevelId < TOTAL_LEVELS ? currentLevelId + 1 : null;
}
