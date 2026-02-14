/**
 * Word Naija - Game Statistics Utility
 * Calculates and manages game statistics
 */

import type { GameStateData, GameStatistics } from "./types";
import { TOTAL_LEVELS } from "./levelLoader";

/**
 * Calculate game statistics from state
 */
export function calculateGameStats(state: GameStateData): GameStatistics {
  const totalLevelsSolved = state.completedLevels.size;
  const totalCoinsEarned = state.coins;
  const totalExtraWordsFound = state.extraWordsFound.size;
  const averageWordsPerLevel =
    totalLevelsSolved > 0
      ? (state.solvedWords.size + totalExtraWordsFound) / totalLevelsSolved
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
  if (stats.totalLevelsSolved >= 5) achievements.push("level-5");
  if (stats.totalLevelsSolved >= 10) achievements.push("level-10");
  if (stats.totalLevelsSolved >= 25) achievements.push("level-25");
  if (stats.totalLevelsSolved >= 50) achievements.push("level-50");

  // Coin-based achievements
  if (stats.totalCoinsEarned >= 100) achievements.push("coins-100");
  if (stats.totalCoinsEarned >= 500) achievements.push("coins-500");
  if (stats.totalCoinsEarned >= 1000) achievements.push("coins-1000");

  // Extra word achievements
  if (stats.totalExtraWordsFound >= 10) achievements.push("extra-10");
  if (stats.totalExtraWordsFound >= 50) achievements.push("extra-50");
  if (stats.totalExtraWordsFound >= 100) achievements.push("extra-100");

  return achievements;
}

/**
 * Get next achievement target
 */
export function getNextAchievementTarget(state: GameStateData): {
  type: string;
  target: number;
  current: number;
  progress: number;
} | null {
  const stats = calculateGameStats(state);

  // Check levels
  const levelTargets = [5, 10, 25, 50, 120];
  for (const target of levelTargets) {
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
  const coinTargets = [100, 500, 1000, 5000];
  for (const target of coinTargets) {
    if (stats.totalCoinsEarned < target) {
      return {
        type: "coins",
        target,
        current: stats.totalCoinsEarned,
        progress: Math.round((stats.totalCoinsEarned / target) * 100),
      };
    }
  }

  return null;
}
