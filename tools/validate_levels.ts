/**
 * Validate the shipped crossword content through the same generator used by the game.
 * Run with: npm run validate:levels
 */

import fs from "fs";
import path from "path";
import { LEVEL_CONFIGS, LEGACY_LEVEL_WORDS, TOTAL_LEVELS } from "../lib/game/levelDefinitions";
import { generateLevelFromWords } from "../lib/game/levelGenerator";
import type { Level } from "../lib/game/types";

const MAX_WHEEL_LETTERS = 8;
const EXPECTED_LEVELS = 300;
const errors: string[] = [];
const seenSets = new Map<string, number>();
let targetCount = 0;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      fields.push(value);
      value = "";
    } else {
      value += char;
    }
  }
  fields.push(value);
  return fields;
}

const dictionary = new Map<string, string>();
const dictionaryPath = path.join(__dirname, "..", "assets", "data", "dictionary.csv");
const csvLines = fs.readFileSync(dictionaryPath, "utf8").split(/\r?\n/);
for (const line of csvLines.slice(1)) {
  if (!line.trim()) continue;
  const [word, , meaning] = parseCsvLine(line);
  if (dictionary.has(word)) errors.push(`Dictionary contains duplicate word ${word}.`);
  dictionary.set(word, meaning);
}

function isPlaceholder(word: string, meaning: string): boolean {
  const text = meaning.trim();
  return text.length < 4 ||
    text.toUpperCase() === word ||
    /(?:\.{3}|\uFFFD|\b(?:TODO|TBD|PLACEHOLDER|UNKNOWN|N\/A)\b)/i.test(text);
}

function wheelLetters(words: string[]): string[] {
  const maximum = new Map<string, number>();
  for (const word of words) {
    const counts = new Map<string, number>();
    for (const char of word) counts.set(char, (counts.get(char) ?? 0) + 1);
    for (const [char, count] of counts) {
      maximum.set(char, Math.max(maximum.get(char) ?? 0, count));
    }
  }
  return [...maximum].flatMap(([char, count]) => Array(count).fill(char));
}

function validateGrid(level: Level, configuredWords: string[]): string[] {
  const problems: string[] = [];
  if (!Number.isInteger(level.rows) || !Number.isInteger(level.cols) || level.rows <= 0 || level.cols <= 0) {
    return ["invalid grid dimensions"];
  }
  if (level.mask.length !== level.rows || level.mask.some(row => row.length !== level.cols)) {
    return ["mask dimensions do not match grid dimensions"];
  }

  const actualWords = level.targetWords.map(target => target.word);
  if (actualWords.length !== configuredWords.length ||
      actualWords.slice().sort().join(",") !== configuredWords.slice().sort().join(",")) {
    problems.push("generated target words differ from configured words");
  }

  const expectedWheel = wheelLetters(configuredWords).sort().join("");
  if (level.letters.length > MAX_WHEEL_LETTERS) {
    problems.push(`wheel has ${level.letters.length} letters (maximum ${MAX_WHEEL_LETTERS})`);
  }
  if (level.letters.slice().sort().join("") !== expectedWheel) {
    problems.push("wheel letters cannot spell every target word");
  }

  const cells = new Map<string, string>();
  const wordsByCell = new Map<string, number[]>();
  for (const [wordIndex, target] of level.targetWords.entries()) {
    if (target.coords.length !== target.word.length) {
      problems.push(`${target.word}: coordinate count differs from word length`);
      continue;
    }
    const [startRow, startCol] = target.coords[0] ?? [];
    const horizontal = target.coords.every(([row, col], index) => row === startRow && col === startCol + index);
    const vertical = target.coords.every(([row, col], index) => row === startRow + index && col === startCol);
    if (!horizontal && !vertical) problems.push(`${target.word}: coordinates are not contiguous in one direction`);

    for (const [index, [row, col]] of target.coords.entries()) {
      if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= level.rows || col < 0 || col >= level.cols) {
        problems.push(`${target.word}: coordinate ${row},${col} is outside the grid`);
        continue;
      }
      const key = `${row},${col}`;
      if (!level.mask[row][col]) problems.push(`${target.word}: coordinate ${key} is blocked by the mask`);
      const letter = target.word[index];
      if (cells.has(key) && cells.get(key) !== letter) {
        problems.push(`${target.word}: intersection at ${key} conflicts with another letter`);
      }
      cells.set(key, letter);
      const indices = wordsByCell.get(key) ?? [];
      indices.push(wordIndex);
      wordsByCell.set(key, indices);
    }
  }

  for (let row = 0; row < level.rows; row++) {
    for (let col = 0; col < level.cols; col++) {
      if (level.mask[row][col] !== cells.has(`${row},${col}`)) {
        problems.push(`mask at ${row},${col} disagrees with target coordinates`);
      }
    }
  }

  // A crossword must connect words at matching intersections, not merely nearby cells.
  if (level.targetWords.length > 0) {
    const connected = new Set<number>([0]);
    let previousSize = -1;
    while (previousSize !== connected.size) {
      previousSize = connected.size;
      for (const indices of wordsByCell.values()) {
        if (indices.some(index => connected.has(index))) indices.forEach(index => connected.add(index));
      }
    }
    if (connected.size !== level.targetWords.length) problems.push("target words do not form one intersecting crossword");
  }

  return problems;
}

const levelIds = Object.keys(LEVEL_CONFIGS).map(Number).sort((a, b) => a - b);
if (TOTAL_LEVELS !== EXPECTED_LEVELS || levelIds.length !== EXPECTED_LEVELS) {
  errors.push(`Expected ${EXPECTED_LEVELS} levels, found ${levelIds.length}.`);
}
for (let id = 1; id <= EXPECTED_LEVELS; id++) {
  if (!LEVEL_CONFIGS[id]) errors.push(`Missing level ${id}.`);
}

for (const levelId of levelIds) {
  const config = LEVEL_CONFIGS[levelId];
  const words = config.words.map(entry => entry.word);
  targetCount += words.length;
  if (new Set(words).size !== words.length) errors.push(`Level ${levelId}: repeated target word.`);
  if (words.length < 3) errors.push(`Level ${levelId}: fewer than three target words.`);
  const setKey = words.slice().sort().join(",");
  if (seenSets.has(setKey)) errors.push(`Level ${levelId}: duplicate word set from level ${seenSets.get(setKey)}.`);
  else seenSets.set(setKey, levelId);

  for (const { word, meaning } of config.words) {
    if (!/^[A-Z]+$/.test(word)) errors.push(`Level ${levelId}: invalid target word ${word}.`);
    if (isPlaceholder(word, meaning)) errors.push(`Level ${levelId}: ${word} has a placeholder or truncated meaning.`);
    const dictionaryMeaning = dictionary.get(word);
    if (dictionaryMeaning === undefined) errors.push(`Level ${levelId}: ${word} is absent from the bonus dictionary.`);
    else if (dictionaryMeaning !== meaning) errors.push(`Level ${levelId}: ${word} meaning differs from the bonus dictionary.`);
  }

  try {
    const level = generateLevelFromWords(levelId, config.words, config.difficulty, config.title);
    for (const problem of validateGrid(level, words)) errors.push(`Level ${levelId}: ${problem}.`);
  } catch (error) {
    errors.push(`Level ${levelId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const [key, oldWords] of Object.entries(LEGACY_LEVEL_WORDS)) {
  const id = Number(key);
  if (!LEVEL_CONFIGS[id]) errors.push(`Legacy word map references missing level ${id}.`);
  if (oldWords.length === 0 || oldWords.some(word => !/^[A-Z]+$/.test(word))) {
    errors.push(`Legacy word map for level ${id} is empty or invalid.`);
  }
  if (oldWords.slice().sort().join(",") === LEVEL_CONFIGS[id]?.words.map(entry => entry.word).sort().join(",")) {
    errors.push(`Legacy word map for level ${id} matches current words.`);
  }
}

if (errors.length) {
  console.error(`${errors.length} content validation error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${levelIds.length} playable levels, ${seenSets.size} unique word sets, ${targetCount} target entries, ${dictionary.size} dictionary entries, and ${Object.keys(LEGACY_LEVEL_WORDS).length} legacy word maps.`);
