import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import {
  getLevelProgress,
  initializeGameState,
  resetLevel,
  revealHint,
  submitWord,
} from "../lib/game/gameState";
import {
  calculateGameStats,
  getAchievements,
  getNextAchievementTarget,
  getTotalWordsFound,
} from "../lib/game/stats";
import { loadDictionary, resetDictionary } from "../lib/game/dictionaryLoader";
import type { GameStateData, Level } from "../lib/game/types";

const level: Level = {
  levelId: 1,
  title: "Test level",
  difficulty: "easy",
  rows: 1,
  cols: 6,
  mask: [[true, true, true, true, true, true]],
  letters: ["C", "A", "T", "D", "O", "G"],
  targetWords: [
    { word: "CAT", coords: [[0, 0], [0, 1], [0, 2]] },
    { word: "DOG", coords: [[0, 3], [0, 4], [0, 5]] },
  ],
  extraWordsAllowed: true,
};

function makeState(coins = 0): GameStateData {
  return {
    currentLevel: level,
    gridState: {
      rows: 1,
      cols: 6,
      mask: level.mask,
      cells: [Array.from({ length: 6 }, (_, col) => ({
        row: 0,
        col,
        filled: false,
        selected: false,
      }))],
    },
    letterWheel: level.letters.map((char, index) => ({
      id: `letter-${index}`,
      char,
      index,
      used: false,
    })),
    selectedPath: null,
    coins,
    completedLevels: new Set(),
    solvedWords: new Set(),
    extraWordsFound: new Set(),
    extraWordsCollected: 0,
    wordsFoundByLevel: {},
    extraWordsFoundByLevel: {},
    totalCoinsEarned: 0,
    completionReward: 0,
    soundEnabled: true,
  };
}

function selectWord(state: GameStateData, word: string): GameStateData {
  return {
    ...state,
    selectedPath: { letterIndices: [], word },
  };
}

async function loadTestDictionary(): Promise<void> {
  const bonusWords = ["CAR", "ART", "RAT", "TAR", "BAR", "BAT", "TAB", "AT", "TO", "GO"];
  const csv = [
    "word,variants,meaning,language_tag,difficulty,notes",
    ...bonusWords.map((word) => `${word},,Test word,ng_en,easy,`),
  ].join("\n");
  const loader = Module as unknown as {
    _load: (request: string, parent?: unknown, isMain?: boolean) => unknown;
  };
  const originalLoad = loader._load;
  loader._load = (request, parent, isMain) => {
    if (request === "expo-asset") {
      return { Asset: { loadAsync: async () => [{ localUri: "test-dictionary" }] } };
    }
    if (request === "expo-file-system/legacy") {
      return { readAsStringAsync: async () => csv };
    }
    if (request.endsWith("assets/data/dictionary.csv")) {
      return "test-dictionary";
    }
    return originalLoad.call(Module, request, parent, isMain);
  };

  try {
    resetDictionary();
    const dictionary = await loadDictionary();
    assert.equal(dictionary.size, bonusWords.length);
  } finally {
    loader._load = originalLoad;
  }
}

test("new state starts with empty lifetime records", async () => {
  const state = await initializeGameState(1, 12);
  assert.equal(state.coins, 12);
  assert.equal(state.totalCoinsEarned, 0);
  assert.equal(state.completionReward, 0);
  assert.deepEqual(state.wordsFoundByLevel, {});
  assert.deepEqual(state.extraWordsFoundByLevel, {});
});

test("hints require five coins and record words only when fully solved", () => {
  for (const coins of [0, 4]) {
    const state = makeState(coins);
    assert.strictEqual(revealHint(state), state);
  }

  const state = makeState(5);
  const hinted = revealHint(state);
  assert.equal(hinted.coins, 0);
  assert.equal(hinted.gridState.cells[0][0].letter, "C");
  assert.equal(state.gridState.cells[0][0].filled, false);
  assert.deepEqual(hinted.wordsFoundByLevel, {});

  const nearlySolved = makeState(5);
  nearlySolved.gridState.cells[0][0] = {
    ...nearlySolved.gridState.cells[0][0], letter: "C", filled: true,
  };
  nearlySolved.gridState.cells[0][1] = {
    ...nearlySolved.gridState.cells[0][1], letter: "A", filled: true,
  };
  const solved = revealHint(nearlySolved);
  assert.equal(solved.solvedWords.has("CAT"), true);
  assert.deepEqual(solved.wordsFoundByLevel[1], ["CAT"]);
  assert.deepEqual(nearlySolved.wordsFoundByLevel, {});
});

test("bonus words pay once per level, including after reset and replay", async () => {
  await loadTestDictionary();
  const bonusWords = ["CAR", "ART", "RAT", "TAR", "BAR", "BAT", "TAB", "AT", "TO", "GO"];
  let state = makeState();
  for (const word of bonusWords) {
    const selected = selectWord(state, word);
    const next = submitWord(selected);
    assert.equal(selected.extraWordsFound.has(word), false);
    assert.equal(selected.extraWordsFoundByLevel[1]?.includes(word) ?? false, false);
    if (word === "CAR") {
      const duplicate = submitWord(selectWord(next, word));
      assert.equal(duplicate.extraWordsCollected, next.extraWordsCollected);
      assert.equal(duplicate.extraWordsFoundByLevel[1].length, 1);
    }
    state = next;
  }

  assert.equal(state.coins, 15);
  assert.equal(state.totalCoinsEarned, 15);
  assert.equal(state.extraWordsCollected, 0);
  assert.equal(state.extraWordsFoundByLevel[1].length, 10);
  assert.equal(getTotalWordsFound(state), 10);

  const reset = resetLevel(state);
  assert.equal(reset.extraWordsFound.size, 0);
  assert.deepEqual(reset.extraWordsFoundByLevel[1], bonusWords);
  assert.equal(reset.totalCoinsEarned, 15);

  const replayed = submitWord(selectWord(reset, "CAR"));
  assert.equal(replayed.extraWordsFound.has("CAR"), true);
  assert.equal(replayed.extraWordsCollected, 0);
  assert.equal(replayed.coins, 15);
  assert.equal(replayed.totalCoinsEarned, 15);
  assert.equal(replayed.extraWordsFoundByLevel[1].length, 10);
  assert.equal(getTotalWordsFound(replayed), 10);

  const nextLevel = {
    ...reset,
    currentLevel: { ...level, levelId: 2 },
    solvedWords: new Set<string>(),
    extraWordsFound: new Set<string>(),
  };
  const sameWordOnNewLevel = submitWord(selectWord(nextLevel, "CAR"));
  assert.equal(sameWordOnNewLevel.extraWordsCollected, 1);
  assert.deepEqual(sameWordOnNewLevel.extraWordsFoundByLevel[2], ["CAR"]);
  assert.equal(getTotalWordsFound(sameWordOnNewLevel), 11);
});

test("stats use lasting discovery and earnings records; progress counts targets", () => {
  const state = makeState(2);
  state.completedLevels = new Set([1, 2, 3, 4, 5]);
  state.wordsFoundByLevel = {
    1: ["CAT", "DOG", "CAR"],
    2: ["CAT", "BAT"],
    3: ["DOG"],
    4: ["ART"],
    5: ["RAT"],
  };
  state.extraWordsFoundByLevel = { 1: ["CAR"], 2: ["BAT"] };
  state.totalCoinsEarned = 120;
  state.solvedWords = new Set(["CAR", "CAT"]);
  state.extraWordsFound = new Set(["CAR"]);

  assert.equal(getTotalWordsFound(state), 8);
  assert.deepEqual(getLevelProgress(state), {
    totalWords: 2,
    solvedWords: 1,
    percentage: 50,
  });
  assert.deepEqual(calculateGameStats(state), {
    totalLevelsSolved: 5,
    totalCoinsEarned: 120,
    averageWordsPerLevel: 8 / 5,
    totalExtraWordsFound: 2,
  });
  assert.deepEqual(getAchievements(state), ["level-5", "coins-100"]);
  assert.deepEqual(getNextAchievementTarget(state), {
    type: "levels",
    target: 10,
    current: 5,
    progress: 50,
  });

  state.completedLevels = new Set(Array.from({ length: 50 }, (_, i) => i + 1));
  state.totalCoinsEarned = 1000;
  state.extraWordsFoundByLevel = { 1: Array.from({ length: 100 }, (_, i) => `EXTRA-${i}`) };
  assert.equal(getNextAchievementTarget(state), null);
  assert.equal(getAchievements(state).length, 10);
});
