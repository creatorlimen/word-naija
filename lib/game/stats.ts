/**
 * Word Naija - Game Statistics Utility
 * Calculates and manages game statistics
 */

import type { GameStateData, GameStatistics } from "./types";
import { TOTAL_LEVELS } from "./levelLoader";

const LEVEL_BADGE_TARGETS = [5, 10, 25, 50];
const COIN_BADGE_TARGETS = [100, 500, 1000];
const EXTRA_BADGE_TARGETS = [10, 50, 100];

function uniqueWordCount(words: string[] | undefined): number {
  return new Set(words ?? []).size;
}

export function getTotalWordsFound(state: GameStateData): number {
  return Object.values(state.wordsFoundByLevel).reduce(
    (total, words) => total + uniqueWordCount(words),
    0
  );
}

/**
 * Calculate game statistics from state
 */
export function calculateGameStats(state: GameStateData): GameStatistics {
  const totalLevelsSolved = state.completedLevels.size;
  const totalCoinsEarned = state.totalCoinsEarned;
  const totalExtraWordsFound = Object.values(state.extraWordsFoundByLevel).reduce(
    (total, words) => total + uniqueWordCount(words),
    0
  );
  const averageWordsPerLevel =
    totalLevelsSolved > 0
      ? [...state.completedLevels].reduce(
          (total, levelId) =>
            total + uniqueWordCount(state.wordsFoundByLevel[levelId]),
          0
        ) / totalLevelsSolved
      : 0;

  return {
    totalLevelsSolved,
    totalCoinsEarned,
    averageWordsPerLevel,
    totalExtraWordsFound,
  };
}

/**
 * Get formatted stats for display
 */
export function getFormattedStats(state: GameStateData): {
  levelsSolved: string;
  coinsEarned: string;
  extraWords: string;
  progressPercent: string;
} {
  const stats = calculateGameStats(state);
  const progressPercent = Math.round((stats.totalLevelsSolved / TOTAL_LEVELS) * 100);

  return {
    levelsSolved: stats.totalLevelsSolved.toString(),
    coinsEarned: stats.totalCoinsEarned.toString(),
    extraWords: stats.totalExtraWordsFound.toString(),
    progressPercent: progressPercent.toString(),
  };
}

/**
 * Get achievement badges based on progress
 */
export function getAchievements(state: GameStateData): string[] {
  const achievements: string[] = [];
  const stats = calculateGameStats(state);

  // Level-based achievements
  for (const target of LEVEL_BADGE_TARGETS) {
    if (stats.totalLevelsSolved >= target) achievements.push(`level-${target}`);
  }

  // Coin-based achievements
  for (const target of COIN_BADGE_TARGETS) {
    if (stats.totalCoinsEarned >= target) achievements.push(`coins-${target}`);
  }

  // Extra word achievements
  for (const target of EXTRA_BADGE_TARGETS) {
    if (stats.totalExtraWordsFound >= target) achievements.push(`extra-${target}`);
  }

  return achievements;
}

/**
 * Get next achievement target
 */
export function getNextAchievementTarget(state: GameStateData): {
  type: "levels" | "coins" | "extras";
  target: number;
  current: number;
  progress: number;
} | null {
  const stats = calculateGameStats(state);

  // Check levels
  for (const target of LEVEL_BADGE_TARGETS) {
    if (stats.totalLevelsSolved < target) {
      return {
        type: "levels",
        target,
        current: stats.totalLevelsSolved,
        progress: Math.round((stats.totalLevelsSolved / target) * 100),
      };
    }
  }

  // Check coins
  for (const target of COIN_BADGE_TARGETS) {
    if (stats.totalCoinsEarned < target) {
      return {
        type: "coins",
        target,
        current: stats.totalCoinsEarned,
        progress: Math.round((stats.totalCoinsEarned / target) * 100),
      };
    }
  }

  for (const target of EXTRA_BADGE_TARGETS) {
    if (stats.totalExtraWordsFound < target) {
      return {
        type: "extras",
        target,
        current: stats.totalExtraWordsFound,
        progress: Math.round((stats.totalExtraWordsFound / target) * 100),
      };
    }
  }

  return null;
}
