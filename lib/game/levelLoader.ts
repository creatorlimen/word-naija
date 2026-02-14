/**
 * Word Naija - Level Loader
 * Loads level definitions from bundled JSON assets
 */

import type { Level, TargetWord } from "./types";

/**
 * Registry of all bundled level files.
 * require() calls must be static for Metro bundler.
 * Add new levels here as they're created.
 */
const LEVEL_REGISTRY: Record<number, any> = {
  1: require("../../assets/data/levels/level-001.json"),
  2: require("../../assets/data/levels/level-002.json"),
  3: require("../../assets/data/levels/level-003.json"),
  4: require("../../assets/data/levels/level-004.json"),
  5: require("../../assets/data/levels/level-005.json"),
  6: require("../../assets/data/levels/level-006.json"),
  7: require("../../assets/data/levels/level-007.json"),
  8: require("../../assets/data/levels/level-008.json"),
  9: require("../../assets/data/levels/level-009.json"),
  10: require("../../assets/data/levels/level-010.json"),
};

export const TOTAL_LEVELS = Object.keys(LEVEL_REGISTRY).length;

/**
 * Load a single level by ID
 */
export async function loadLevel(levelId: number): Promise<Level> {
  const levelData = LEVEL_REGISTRY[levelId];

  if (!levelData) {
    throw new Error(`Level ${levelId} not found`);
  }

  validateLevel(levelData);
  return levelData as Level;
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

  // Validate letter pool has all needed letters (fixed: use array spread, not object spread)
  const letterPool = [...level.letters.map((l) => l.toUpperCase())];
  const wordLetters = targetWord.word.toUpperCase().split("");

  for (const letter of wordLetters) {
    const index = letterPool.indexOf(letter);
    if (index === -1) {
      throw new Error(
        `Letter '${letter}' from word '${targetWord.word}' not in letter pool`
      );
    }
    letterPool.splice(index, 1);
  }
}

/**
 * Get the next level ID after the current one
 */
export function getNextLevelId(currentLevelId: number): number | null {
  return currentLevelId < TOTAL_LEVELS ? currentLevelId + 1 : null;
}
