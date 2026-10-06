import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import {
  initializeGameState, selectLetter, submitWord, revealHint, resetLevel,
  shuffleLetters, isLevelComplete,
} from "../lib/game/gameState";
import { loadDictionary, resetDictionary } from "../lib/game/dictionaryLoader";
import {
  completeLevel, createSavedProgress, normalizeProgress, restoreProgress,
} from "../lib/game/progress";
import { LEGACY_LEVEL_WORDS, TOTAL_LEVELS } from "../lib/game/levelDefinitions";
import type { GameStateData } from "../lib/game/types";

test.before(async () => {
  const modules = Module as unknown as { _load: (...args: any[]) => any };
  const original = modules._load;
  try {
    modules._load = (name, ...args) => {
      if (name === "expo-asset") return { Asset: { loadAsync: async () => [{ localUri: "test.csv" }] } };
      if (name === "expo-file-system/legacy") return {
        readAsStringAsync: async () => "word,variants,meaning,language_tag,difficulty,notes\nNOR,,A conjunction,english,easy,",
      };
      if (name.endsWith("assets/data/dictionary.csv")) return "test.csv";
      return original.call(Module, name, ...args);
    };
    resetDictionary();
    assert.equal((await loadDictionary()).size, 1);
  } finally {
    modules._load = original;
  }
});

function enter(state: GameStateData, word: string): GameStateData {
  for (const char of word) {
    const selected = state.selectedPath?.letterIndices ?? [];
    const index = state.letterWheel.findIndex((letter, i) => letter.char === char && !selected.includes(i));
    assert.ok(index >= 0, `Cannot spell ${word} on level ${state.currentLevel.levelId}`);
    state = selectLetter(state, index);
  }
  return completeLevel(submitWord(state));
}

async function roundTrip(state: GameStateData): Promise<GameStateData> {
  const saved = normalizeProgress(JSON.parse(JSON.stringify(createSavedProgress(state))));
  assert.ok(saved);
  return restoreProgress(await initializeGameState(saved.currentLevelId, saved.coins), saved);
}

test("restart preserves solved words, paid hints, bonuses, coins, and wheel order", async () => {
  let state = await initializeGameState(1, 50);
  state = enter(state, "MOON");
  state = enter(state, "NOR");
  state = shuffleLetters(revealHint(state));
  state.soundEnabled = false;
  const restored = await roundTrip(state);
  assert.equal(restored.coins, 45);
  assert.deepEqual(restored.gridState, state.gridState);
  assert.deepEqual(restored.solvedWords, state.solvedWords);
  assert.deepEqual(restored.extraWordsFound, state.extraWordsFound);
  assert.deepEqual(restored.letterWheel, state.letterWheel);
  assert.deepEqual(restored.wordsFoundByLevel, state.wordsFoundByLevel);
  assert.equal(restored.soundEnabled, false);
  const duplicate = enter(restored, "NOR");
  assert.equal(duplicate.extraWordsCollected, 1);
  assert.equal(duplicate.coins, 45);
  assert.deepEqual(duplicate.solvedWords, restored.solvedWords);
});

test("completion pays before advancing, survives restart, and never pays twice", async () => {
  let state = await initializeGameState(1);
  for (const target of state.currentLevel.targetWords) state = enter(state, target.word);
  assert.equal(state.coins, 20);
  assert.equal(state.totalCoinsEarned, 20);
  assert.equal(state.completionReward, 20);
  assert.ok(state.completedLevels.has(1));
  const restored = await roundTrip(state);
  assert.ok(isLevelComplete(restored));
  assert.equal(restored.completionReward, 20);
  assert.strictEqual(completeLevel(restored), restored);
  let replay = resetLevel(restored);
  for (const target of replay.currentLevel.targetWords) replay = enter(replay, target.word);
  assert.equal(replay.coins, 20);
  assert.equal(replay.totalCoinsEarned, 20);
  assert.equal(replay.completionReward, 0);
  assert.equal((await roundTrip(replay)).completionReward, 0);
});

test("hints can complete and credit the final level exactly once", async () => {
  let state = await initializeGameState(TOTAL_LEVELS, 1000);
  state.completedLevels = new Set(Array.from({ length: TOTAL_LEVELS - 1 }, (_, i) => i + 1));
  let spent = 0;
  while (!isLevelComplete(state)) {
    const next = revealHint(state);
    assert.notStrictEqual(next, state, "Hints must make progress");
    spent += 5;
    state = completeLevel(next);
  }
  const reward = 15 + TOTAL_LEVELS * 5;
  assert.equal(state.completedLevels.size, TOTAL_LEVELS);
  assert.equal(state.coins, 1000 - spent + reward);
  assert.equal(state.totalCoinsEarned, reward);
  const restored = await roundTrip(state);
  assert.strictEqual(completeLevel(restored), restored);
  assert.equal(restored.completedLevels.size, TOTAL_LEVELS);
  assert.equal(restored.completionReward, reward);
});

test("legacy migration preserves known history using the old target sets", async () => {
  const saved = normalizeProgress({
    coins: 100, completedLevels: [1, 12, 12, 20], soundEnabled: false,
    extraWordsFoundByLevel: { 1: ["NOR"] }, extraWordsCollected: 7,
  });
  assert.ok(saved);
  assert.equal(saved.currentLevelId, 21);
  assert.equal(saved.coins, 100);
  assert.equal(saved.soundEnabled, false);
  assert.deepEqual(saved.completedLevels, [1, 12, 20]);
  assert.deepEqual(saved.wordsFoundByLevel[12], LEGACY_LEVEL_WORDS[12]);
  assert.deepEqual(saved.wordsFoundByLevel[20], LEGACY_LEVEL_WORDS[20]);
  assert.equal(saved.totalCoinsEarned, 20 + 75 + 115);
  assert.equal(saved.extraWordsCollected, 7);
  assert.deepEqual(saved.extraWordsFoundByLevel, { 1: ["NOR"] });
  assert.equal(saved.currentLevelSnapshot, null);
});

test("legacy active extras are restored and cannot be credited again", async () => {
  const saved = normalizeProgress({ coins: 100, completedLevels: [], extraWordsFoundByLevel: { 1: ["nor"] }, extraWordsCollected: 1 });
  assert.ok(saved);
  assert.equal(saved.totalCoinsEarned, 100);
  const state = restoreProgress(await initializeGameState(1), saved);
  assert.ok(state.extraWordsFound.has("NOR"));
  assert.ok(state.solvedWords.has("NOR"));
  assert.equal(enter(state, "NOR").extraWordsCollected, 1);
});

test("migration repairs negative balances left by the old hint bug", () => {
  const saved = normalizeProgress({ coins: -5, completedLevels: [] });
  assert.ok(saved);
  assert.equal(saved.coins, 0);
  assert.equal(saved.totalCoinsEarned, 0);
});

test("changed layouts retain solved words but reject stale hint coordinates", async () => {
  let state = enter(await initializeGameState(1, 50), "MOON");
  state = revealHint(state);
  const saved = createSavedProgress(state);
  assert.ok(saved.currentLevelSnapshot!.hintedCells.length > 0);
  saved.currentLevelSnapshot!.layoutSignature = "old layout";
  const restored = restoreProgress(await initializeGameState(1), saved);
  const moon = state.currentLevel.targetWords.find((target) => target.word === "MOON")!;
  assert.equal(restored.gridState.cells.flat().filter((cell) => cell.filled).length, moon.word.length);
  assert.ok(restored.solvedWords.has("MOON"));
  assert.equal(restored.coins, 45);
});

test("invalid stored hint letters and coordinates are ignored", async () => {
  const state = await initializeGameState(1, 50);
  const saved = createSavedProgress(state);
  saved.currentLevelSnapshot!.hintedCells = [
    { row: -1, col: 0, letter: "O" },
    { row: 100, col: 100, letter: "O" },
    { row: 0, col: 0, letter: "Z" },
  ];
  saved.currentLevelSnapshot!.letterOrder = ["letter-0", "letter-0"];
  const restored = restoreProgress(await initializeGameState(1), saved);
  assert.ok(restored.gridState.cells.flat().every((cell) => !cell.filled));
  assert.deepEqual(restored.letterWheel, state.letterWheel);
});
