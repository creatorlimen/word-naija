/** Pure conversion between live game state and the versioned save format. */

import type {
  GameStateData,
  Level,
  SavedHintCell,
  SavedLevelSnapshot,
  SavedProgress,
} from "./types";
import { LEGACY_LEVEL_WORDS, LEVEL_CONFIGS, TOTAL_LEVELS } from "./levelDefinitions";

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function levelId(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= TOTAL_LEVELS
    ? value
    : null;
}

function words(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim().toUpperCase())
    .filter(Boolean))];
}

function wordHistory(value: unknown): Record<number, string[]> {
  const input = object(value);
  const result: Record<number, string[]> = {};
  if (!input) return result;
  for (const [key, entries] of Object.entries(input)) {
    const id = levelId(Number(key));
    if (id !== null) result[id] = words(entries);
  }
  return result;
}

function mergeWords(history: Record<number, string[]>, id: number, additions: string[]): void {
  history[id] = [...new Set([...(history[id] ?? []), ...additions])];
}

function normalizeSnapshot(value: unknown): SavedLevelSnapshot | null {
  const raw = object(value);
  const id = levelId(raw?.levelId);
  if (!raw || id === null || typeof raw.layoutSignature !== "string") return null;
  const hintedCells: SavedHintCell[] = [];
  if (Array.isArray(raw.hintedCells)) {
    for (const item of raw.hintedCells) {
      const cell = object(item);
      if (cell && Number.isInteger(cell.row) && Number.isInteger(cell.col)
        && typeof cell.letter === "string" && cell.letter.length === 1) {
        hintedCells.push({ row: cell.row as number, col: cell.col as number, letter: cell.letter.toUpperCase() });
      }
    }
  }
  return {
    levelId: id,
    layoutSignature: raw.layoutSignature,
    solvedWords: words(raw.solvedWords),
    extraWordsFound: words(raw.extraWordsFound),
    hintedCells,
    letterOrder: Array.isArray(raw.letterOrder)
      ? raw.letterOrder.filter((entry): entry is string => typeof entry === "string")
      : [],
    completionReward: Math.max(0, finiteNumber(raw.completionReward, 0)),
  };
}

export function getDefaultProgress(): SavedProgress {
  return {
    version: 2,
    coins: 0,
    completedLevels: [],
    soundEnabled: true,
    lastPlayed: Date.now(),
    currentLevelId: 1,
    currentLevelSnapshot: null,
    wordsFoundByLevel: {},
    extraWordsFoundByLevel: {},
    extraWordsCollected: 0,
    totalCoinsEarned: 0,
  };
}

/** Read old saves without pretending that their missing puzzle or bonus history is known. */
export function normalizeProgress(value: unknown): SavedProgress | null {
  const raw = object(value);
  if (!raw) return null;
  const isV2 = raw.version === 2;
  const completedLevels = [...new Set(Array.isArray(raw.completedLevels)
    ? raw.completedLevels.map(levelId).filter((id): id is number => id !== null)
    : [])];
  const extraWordsFoundByLevel = wordHistory(raw.extraWordsFoundByLevel);
  const wordsFoundByLevel = isV2 ? wordHistory(raw.wordsFoundByLevel) : {};

  // A legacy completed level was awarded when Next was tapped. Its configured
  // target words are known, but unrecorded bonus words and hint spending are not.
  for (const id of completedLevels) {
    if (!isV2) {
      const oldWords = LEGACY_LEVEL_WORDS[id]
        ?? LEVEL_CONFIGS[id]?.words.map((word) => word.word.toUpperCase()) ?? [];
      mergeWords(wordsFoundByLevel, id, oldWords);
    }
  }
  for (const [key, extras] of Object.entries(extraWordsFoundByLevel)) {
    mergeWords(wordsFoundByLevel, Number(key), extras);
  }

  // Older versions allowed unaffordable hints to create an invalid debt.
  const coins = Math.max(0, finiteNumber(raw.coins, 0));
  const knownLevelRewards = completedLevels.reduce((sum, id) => sum + 15 + id * 5, 0);
  const fallbackLevelId = Math.min(Math.max(...completedLevels, 0) + 1, TOTAL_LEVELS);
  return {
    version: 2,
    coins,
    completedLevels,
    soundEnabled: typeof raw.soundEnabled === "boolean" ? raw.soundEnabled : true,
    lastPlayed: finiteNumber(raw.lastPlayed, Date.now()),
    currentLevelId: isV2 ? levelId(raw.currentLevelId) ?? fallbackLevelId : fallbackLevelId,
    currentLevelSnapshot: isV2 ? normalizeSnapshot(raw.currentLevelSnapshot) : null,
    wordsFoundByLevel,
    extraWordsFoundByLevel,
    extraWordsCollected: Math.max(0, Math.floor(finiteNumber(raw.extraWordsCollected, 0))),
    // The old save did not track lifetime awards. Balance and completed-level
    // rewards give a defensible lower bound without inventing bonus payouts.
    totalCoinsEarned: isV2
      ? Math.max(0, finiteNumber(raw.totalCoinsEarned, Math.max(coins, knownLevelRewards)))
      : Math.max(0, coins, knownLevelRewards),
  };
}

/** Includes every layout detail needed to reject stale hint coordinates. */
export function levelLayoutSignature(level: Level): string {
  return JSON.stringify({
    levelId: level.levelId,
    rows: level.rows,
    cols: level.cols,
    mask: level.mask,
    letters: level.letters,
    targetWords: level.targetWords.map(({ word, coords }) => ({ word, coords })),
  });
}

export function createSavedProgress(state: GameStateData): SavedProgress {
  const id = state.currentLevel.levelId;
  const solvedCoords = new Set<string>();
  for (const target of state.currentLevel.targetWords) {
    if (state.solvedWords.has(target.word.toUpperCase())) {
      for (const [row, col] of target.coords) solvedCoords.add(`${row},${col}`);
    }
  }
  const hintedCells: SavedHintCell[] = [];
  for (const row of state.gridState.cells) {
    for (const cell of row) {
      if (cell.filled && cell.letter && !solvedCoords.has(`${cell.row},${cell.col}`)) {
        hintedCells.push({ row: cell.row, col: cell.col, letter: cell.letter });
      }
    }
  }
  const wordsFoundByLevel = wordHistory(state.wordsFoundByLevel);
  const extraWordsFoundByLevel = wordHistory(state.extraWordsFoundByLevel);
  mergeWords(wordsFoundByLevel, id, [...state.solvedWords]);
  mergeWords(extraWordsFoundByLevel, id, [...state.extraWordsFound]);

  return {
    version: 2,
    coins: state.coins,
    completedLevels: [...state.completedLevels],
    soundEnabled: state.soundEnabled,
    lastPlayed: Date.now(),
    currentLevelId: id,
    currentLevelSnapshot: {
      levelId: id,
      layoutSignature: levelLayoutSignature(state.currentLevel),
      solvedWords: [...state.solvedWords],
      extraWordsFound: [...state.extraWordsFound],
      hintedCells,
      letterOrder: state.letterWheel.map((letter) => letter.id),
      completionReward: state.completionReward,
    },
    wordsFoundByLevel,
    extraWordsFoundByLevel,
    extraWordsCollected: state.extraWordsCollected,
    totalCoinsEarned: state.totalCoinsEarned,
  };
}

/** Rebuild cells from targets and validated hints; never trust stored grid cells. */
export function restoreProgress(base: GameStateData, saved: SavedProgress): GameStateData {
  const id = base.currentLevel.levelId;
  const state: GameStateData = {
    ...base,
    coins: saved.coins,
    completedLevels: new Set(saved.completedLevels),
    wordsFoundByLevel: wordHistory(saved.wordsFoundByLevel),
    extraWordsFoundByLevel: wordHistory(saved.extraWordsFoundByLevel),
    extraWordsCollected: saved.extraWordsCollected,
    totalCoinsEarned: saved.totalCoinsEarned,
    soundEnabled: saved.soundEnabled,
    completionReward: 0,
  };
  const snapshot = saved.currentLevelSnapshot;
  const targets = new Map(base.currentLevel.targetWords.map((target) => [target.word.toUpperCase(), target]));
  if (!snapshot || snapshot.levelId !== id) {
    const extras = new Set((state.extraWordsFoundByLevel[id] ?? []).filter(
      (word) => word.length >= 2 && !targets.has(word)
    ));
    return { ...state, solvedWords: new Set(extras), extraWordsFound: extras };
  }

  const solvedWords = new Set(snapshot.solvedWords.filter((word) => targets.has(word)));
  const historicalExtras = new Set(state.extraWordsFoundByLevel[id] ?? []);
  const extraWordsFound = new Set(snapshot.extraWordsFound.filter(
    (word) => word.length >= 2 && !targets.has(word) && historicalExtras.has(word)
  ));
  const cells = base.gridState.cells.map((row) => row.map((cell) => ({ ...cell })));
  for (const word of solvedWords) {
    const target = targets.get(word)!;
    target.coords.forEach(([row, col], index) => {
      cells[row][col] = { ...cells[row][col], letter: word[index], filled: true };
    });
  }

  if (snapshot.layoutSignature === levelLayoutSignature(base.currentLevel)) {
    const expectedLetters = new Map<string, string>();
    for (const target of base.currentLevel.targetWords) {
      target.coords.forEach(([row, col], index) => {
        expectedLetters.set(`${row},${col}`, target.word[index].toUpperCase());
      });
    }
    for (const { row, col, letter } of snapshot.hintedCells) {
      if (expectedLetters.get(`${row},${col}`) !== letter || !cells[row]?.[col]) continue;
      cells[row][col] = { ...cells[row][col], letter, filled: true };
    }
  }

  const letterById = new Map(base.letterWheel.map((letter) => [letter.id, letter]));
  const validLetterOrder = snapshot.letterOrder.length === base.letterWheel.length
    && new Set(snapshot.letterOrder).size === base.letterWheel.length
    && snapshot.letterOrder.every((letterId) => letterById.has(letterId));
  const letterWheel = validLetterOrder
    ? snapshot.letterOrder.map((letterId, index) => ({ ...letterById.get(letterId)!, index }))
    : base.letterWheel;

  const complete = base.currentLevel.targetWords.every((target) => solvedWords.has(target.word.toUpperCase()));
  return {
    ...state,
    gridState: { ...base.gridState, cells },
    letterWheel,
    solvedWords: new Set([...solvedWords, ...extraWordsFound]),
    extraWordsFound,
    completionReward: complete && state.completedLevels.has(id)
      && snapshot.completionReward === 15 + id * 5 ? snapshot.completionReward : 0,
  };
}

/** Pay once when the final target is solved, including by a hint. */
export function completeLevel(state: GameStateData): GameStateData {
  const id = state.currentLevel.levelId;
  if (state.completedLevels.has(id) || !state.currentLevel.targetWords.every(
    (target) => state.solvedWords.has(target.word.toUpperCase())
  )) return state;
  const reward = 15 + id * 5;
  const completedLevels = new Set(state.completedLevels);
  completedLevels.add(id);
  const wordsFoundByLevel = wordHistory(state.wordsFoundByLevel);
  mergeWords(wordsFoundByLevel, id, state.currentLevel.targetWords.map((target) => target.word.toUpperCase()));
  return {
    ...state,
    completedLevels,
    wordsFoundByLevel,
    coins: state.coins + reward,
    totalCoinsEarned: state.totalCoinsEarned + reward,
    completionReward: reward,
  };
}
