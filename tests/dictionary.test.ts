import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import Module from "node:module";
import path from "node:path";
import test from "node:test";
import { getDictionaryEntry, loadDictionary, resetDictionary, validateWord } from "../lib/game/dictionaryLoader";
import { initializeGameState, isLevelComplete, selectLetter, submitWord } from "../lib/game/gameState";
import { TOTAL_LEVELS } from "../lib/game/levelDefinitions";
import { completeLevel } from "../lib/game/progress";

test.before(async () => {
  const csv = readFileSync(path.join(__dirname, "..", "assets", "data", "dictionary.csv"), "utf8");
  const modules = Module as unknown as { _load: (...args: any[]) => any };
  const original = modules._load;
  try {
    modules._load = (name, ...args) => {
      if (name === "expo-asset") return { Asset: { loadAsync: async () => [{ localUri: "dictionary.csv" }] } };
      if (name === "expo-file-system/legacy") return { readAsStringAsync: async () => csv };
      if (name.endsWith("assets/data/dictionary.csv")) return "dictionary.csv";
      return original.call(Module, name, ...args);
    };
    resetDictionary();
    assert.ok((await loadDictionary()).size > 0, "The actual bundled CSV must load successfully");
  } finally {
    modules._load = original;
  }
});

test("cleaned dictionary rejects retired content while retaining harmless words", () => {
  for (const word of ["FUCKONSO", "FAP", "YASH", "TEWE", "AKATA", "SQUAW", "TEAGUE", "KGB", "SHITTOR", "KOLOMBI"]) {
    assert.equal(validateWord(word.toLowerCase()), null, word);
    assert.equal(getDictionaryEntry(word), null, word);
  }
  for (const word of ["CANAL", "SPARSE", "GRAPE", "BOOBY", "PUSS", "GAY", "CHASTITY", "COWBELL", "ROOSTER", "AGBERO"]) {
    assert.equal(validateWord(` ${word.toLowerCase()} `), word, word);
    assert.ok(getDictionaryEntry(word)?.meaning, word);
  }
});

test("runtime CSV lookup exposes corrected meanings and language tags", () => {
  assert.equal(getDictionaryEntry("COWBELL")?.languageTag, "english");
  assert.equal(getDictionaryEntry("ROOSTER")?.meaning, "An adult male chicken.");
  assert.equal(getDictionaryEntry("GWANJ")?.meaning, "Food or a meal.");
  assert.equal(getDictionaryEntry("AGBERO")?.meaning, "A street tout or motor-park worker.");
  assert.equal(getDictionaryEntry("DRUG")?.meaning, "A substance used as medicine or one that affects the body or mind.");
  assert.equal(getDictionaryEntry("PUSS")?.meaning, "An affectionate word for a cat.");
});

test("every shipped level can be solved using the cleaned dictionary and game rules", async () => {
  for (let id = 1; id <= TOTAL_LEVELS; id++) {
    let state = await initializeGameState(id);
    for (const target of state.currentLevel.targetWords) {
      assert.equal(getDictionaryEntry(target.word)?.meaning, target.meaning, `Level ${id}: ${target.word}`);
      for (const char of target.word) {
        const selected = state.selectedPath?.letterIndices ?? [];
        const index = state.letterWheel.findIndex((letter, i) => letter.char === char && !selected.includes(i));
        assert.ok(index >= 0, `Level ${id} must be able to spell ${target.word}`);
        state = selectLetter(state, index);
      }
      state = completeLevel(submitWord(state));
      assert.ok(state.solvedWords.has(target.word), `Level ${id} must accept ${target.word}`);
    }
    assert.ok(isLevelComplete(state), `Level ${id} must be complete`);
    assert.equal(state.coins, 15 + id * 5);
    assert.equal(state.extraWordsCollected, 0);
    assert.strictEqual(completeLevel(state), state, `Level ${id} must not pay twice`);
  }
});
