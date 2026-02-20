/**
 * Word Naija - Level Validation Script
 * Run with:  npx tsx tools/validate_levels.ts
 *
 * Generates every level through the real generator and asserts that every
 * configured word ends up placed on the grid.  Prints a detailed report
 * and exits with code 1 if any level fails.
 */

import { LEVEL_CONFIGS } from "../lib/game/levelDefinitions";
import { generateLevelFromWords } from "../lib/game/levelGenerator";

const GREEN = "\x1b[32m";
const RED   = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BOLD  = "\x1b[1m";
const RESET = "\x1b[0m";

let totalLevels = 0;
let passedLevels = 0;
let failedLevels = 0;

const failures: { levelId: number; title: string; dropped: string[]; error?: string }[] = [];

for (const [key, config] of Object.entries(LEVEL_CONFIGS)) {
  const levelId = Number(key);
  totalLevels++;

  let level;
  try {
    level = generateLevelFromWords(levelId, config.words, config.difficulty, config.title);
  } catch (err: any) {
    failedLevels++;
    const errorMsg: string = err?.message ?? String(err);

    // Extract which words are mentioned in the error
    const dropped = config.words
      .filter(w => errorMsg.includes(w.word))
      .map(w => w.word);

    failures.push({ levelId, title: config.title, dropped, error: errorMsg });
    console.log(`${RED}✗${RESET} Level ${String(levelId).padStart(2, '0')} — ${BOLD}${config.title}${RESET} ${RED}[ERROR]${RESET}`);
    console.log(`  ${RED}${errorMsg}${RESET}`);
    continue;
  }

  const configWords  = config.words.map(w => w.word);
  const placedWords  = level.targetWords.map(tw => tw.word);
  const droppedWords = configWords.filter(w => !placedWords.includes(w));

  if (droppedWords.length > 0) {
    // Shouldn't happen now that the generator throws — but kept as a safety net
    failedLevels++;
    failures.push({ levelId, title: config.title, dropped: droppedWords });
    console.log(`${RED}✗${RESET} Level ${String(levelId).padStart(2, '0')} — ${BOLD}${config.title}${RESET}  ${RED}DROPPED: ${droppedWords.join(', ')}${RESET}`);
  } else {
    passedLevels++;
    const wordList = config.words.map(w => w.word).join(', ');
    console.log(`${GREEN}✓${RESET} Level ${String(levelId).padStart(2, '0')} — ${BOLD}${config.title}${RESET}  [${level.rows}×${level.cols}]  ${wordList}`);
  }
}

console.log("\n" + "─".repeat(60));
console.log(`${BOLD}Results:${RESET} ${GREEN}${passedLevels} passed${RESET}, ${failedLevels > 0 ? RED : GREEN}${failedLevels} failed${RESET} / ${totalLevels} total`);

if (failures.length > 0) {
  console.log(`\n${BOLD}${RED}Failed levels:${RESET}`);
  for (const f of failures) {
    console.log(`  Level ${f.levelId} (${f.title}): ${f.dropped.length > 0 ? `dropped [${f.dropped.join(', ')}]` : ''}`);
    if (f.error) console.log(`    ${f.error}`);
  }
  process.exit(1);
} else {
  console.log(`\n${GREEN}${BOLD}All levels validated successfully.${RESET}`);
  process.exit(0);
}
