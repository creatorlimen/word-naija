/**
 * Word Naija - Game State Manager
 * Core game logic: validation, selection, submission, level progression
 */

import type {
  Level,
  GameStateData,
  Letter,
  SelectionPath,
  Cell,
  GridState,
} from "./types";
import { loadLevel } from "./levelLoader";
import { validateWord } from "./dictionaryLoader";

/**
 * Create initial game state for a level
 */
export async function initializeGameState(
  levelId: number,
  existingCoins?: number
): Promise<GameStateData> {
  const level = await loadLevel(levelId);

  // Initialize grid
  const gridState = createGridState(level);

  // Initialize letter wheel
  const letterWheel = createLetterWheel(level.letters);

  // Initialize empty selection
  const selectedPath: SelectionPath | null = null;

  return {
    currentLevel: level,
    gridState,
    letterWheel,
    selectedPath,
    coins: existingCoins ?? 0,
    completedLevels: new Set(),
    solvedWords: new Set(),
    extraWordsFound: new Set(),
    soundEnabled: true,
  };
}

/**
 * Create grid state from level definition
 */
function createGridState(level: Level): GridState {
  const cells: Cell[][] = [];

  for (let row = 0; row < level.rows; row++) {
    cells[row] = [];
    for (let col = 0; col < level.cols; col++) {
      const isPlayable = level.mask[row][col];

      cells[row][col] = {
        row,
        col,
        letter: isPlayable ? undefined : " ", // Space for blocked cells (hidden)
        filled: false,
        selected: false,
        isPartOfTargetWord: false,
      };
    }
  }

  // Mark cells that are part of target words
  for (const targetWord of level.targetWords) {
    for (const [row, col] of targetWord.coords) {
      cells[row][col].isPartOfTargetWord = true;
    }
  }

  return {
    rows: level.rows,
    cols: level.cols,
    cells,
    mask: level.mask,
  };
}

/**
 * Create letter wheel from available letters
 */
function createLetterWheel(letters: string[]): Letter[] {
  return letters.map((char, index) => ({
    char: char.toUpperCase(),
    index,
    used: false,
  }));
}

/**
 * Select a letter from the wheel, adding it to the selection path
 */
export function selectLetter(
  state: GameStateData,
  letterIndex: number
): GameStateData {
  const letter = state.letterWheel[letterIndex];
  if (!letter || letter.used) {
    return state; // Can't select used letter
  }

  // Start new selection or add to existing
  const currentWord = state.selectedPath?.word || "";
  const currentIndices = state.selectedPath?.letterIndices || [];

  // Prevent selecting any already-selected index
  if (currentIndices.includes(letterIndex)) {
    return state;
  }

  const newWord = currentWord + letter.char;
  const newIndices = [...currentIndices, letterIndex];

  return {
    ...state,
    selectedPath: {
      letterIndices: newIndices,
      word: newWord,
    },
  };
}

/**
 * Undo last letter selection
 */
export function undoSelection(state: GameStateData): GameStateData {
  if (!state.selectedPath || state.selectedPath.letterIndices.length === 0) {
    return state;
  }

  const indices = state.selectedPath.letterIndices.slice(0, -1);
  const word = indices.map((i) => state.letterWheel[i].char).join("");

  if (indices.length === 0) {
    return {
      ...state,
      selectedPath: null,
    };
  }

  return {
    ...state,
    selectedPath: {
      letterIndices: indices,
      word,
    },
  };
}

/**
 * Clear current selection
 */
export function clearSelection(state: GameStateData): GameStateData {
  return {
    ...state,
    selectedPath: null,
  };
}

/**
 * Auto-submit: called after each letter selection.
 * If the current word matches a target word, submit it automatically.
 * If it's a valid extra dictionary word, submit as extra.
 * Otherwise, leave the selection in place for more tapping.
 */
export function tryAutoSubmit(state: GameStateData): GameStateData {
  if (!state.selectedPath || state.selectedPath.word.length < 2) {
    return state;
  }

  const word = state.selectedPath.word;

  // Check if it matches a target word (case-insensitive)
  const matchesTarget = state.currentLevel.targetWords.find(
    (tw) =>
      tw.word.toUpperCase() === word.toUpperCase() &&
      !state.solvedWords.has(tw.word.toUpperCase())
  );

  if (matchesTarget) {
    // Auto-submit as target word
    return submitWord(state);
  }

  // Check if it's a valid dictionary word we haven't found yet
  const canonical = validateWord(word);
  if (
    canonical &&
    !state.solvedWords.has(canonical) &&
    !state.extraWordsFound.has(canonical) &&
    state.currentLevel.extraWordsAllowed
  ) {
    // Only auto-submit extra words when they can't extend into a target
    // (i.e., if we also have a target that starts with this prefix, keep going)
    const couldExtendToTarget = state.currentLevel.targetWords.some(
      (tw) =>
        tw.word.toUpperCase().startsWith(word.toUpperCase()) &&
        tw.word.length > word.length &&
        !state.solvedWords.has(tw.word.toUpperCase())
    );

    if (!couldExtendToTarget) {
      return submitWord(state);
    }
  }

  return state;
}

/**
 * Submit current selection as a word
 */
export function submitWord(state: GameStateData): GameStateData {
  if (!state.selectedPath || state.selectedPath.word.length === 0) {
    return state;
  }

  const word = state.selectedPath.word;

  // Check if word exists in dictionary
  const canonical = validateWord(word);
  if (!canonical) {
    // Invalid word - clear selection and return
    return clearSelection(state);
  }

  // Check if already solved this level
  if (state.solvedWords.has(canonical)) {
    return clearSelection(state);
  }

  // Find matching target word
  const targetWord = state.currentLevel.targetWords.find(
    (tw) => tw.word.toUpperCase() === canonical
  );

  let isTargetWord = false;
  let coinsEarned = 0;

  if (targetWord) {
    // This is a target word
    isTargetWord = true;
    coinsEarned = 10; // Base reward for target word
  } else if (state.currentLevel.extraWordsAllowed) {
    // This is an extra word
    coinsEarned = 5; // Smaller reward for extra word
  } else {
    // Extra words not allowed - treat as invalid
    return clearSelection(state);
  }

  // Update state
  const newSolvedWords = new Set(state.solvedWords);
  newSolvedWords.add(canonical);

  const newExtraWords = new Set(state.extraWordsFound);
  if (!isTargetWord) {
    newExtraWords.add(canonical);
  }

  // Letters remain available for other words (crossword reuse)
  const newLetterWheel = state.letterWheel;

  // Update grid - place letters in found target word
  let newGridState = { ...state.gridState };
  if (isTargetWord && targetWord) {
    newGridState = fillGridWithWord(
      newGridState,
      canonical,
      targetWord.coords
    );
  }

  const newCoins = state.coins + coinsEarned;

  return {
    ...state,
    selectedPath: null,
    solvedWords: newSolvedWords,
    extraWordsFound: newExtraWords,
    letterWheel: newLetterWheel,
    gridState: newGridState,
    coins: newCoins,
  };
}

/**
 * Fill grid cells with placed word
 */
function fillGridWithWord(
  gridState: GridState,
  word: string,
  coords: [number, number][]
): GridState {
  const newCells = gridState.cells.map((row) => [...row]);

  for (let i = 0; i < word.length; i++) {
    const [row, col] = coords[i];
    newCells[row][col] = {
      ...newCells[row][col],
      letter: word[i],
      filled: true,
    };
  }

  return {
    ...gridState,
    cells: newCells,
  };
}

/**
 * Shuffle letter wheel
 */
export function shuffleLetters(state: GameStateData): GameStateData {
  const available = state.letterWheel.filter((l) => !l.used);
  const used = state.letterWheel.filter((l) => l.used);

  // Fisher-Yates shuffle
  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Reassign indices
  let newIndex = 0;
  const newWheel: Letter[] = [];

  for (const letter of [...shuffled, ...used]) {
    newWheel.push({
      ...letter,
      index: newIndex++,
    });
  }

  return {
    ...state,
    letterWheel: newWheel,
    selectedPath: null, // Clear selection when shuffling
  };
}

/**
 * Reveal a hint - show one empty cell from unsolved target words
 */
export function revealHint(state: GameStateData): GameStateData {
  // Cost: 15 coins
  if (state.coins < 15) {
    return state;
  }

  // Find first unsolved target word
  const unsolvedWords = state.currentLevel.targetWords.filter(
    (tw) => !state.solvedWords.has(tw.word.toUpperCase())
  );

  if (unsolvedWords.length === 0) {
    return state;
  }

  // Find first empty cell in unsolved word
  const targetWord = unsolvedWords[0];
  const emptyCell = targetWord.coords.find(([row, col]) => {
    return !state.gridState.cells[row][col].filled;
  });

  if (!emptyCell) {
    return state;
  }

  // Reveal the cell
  const newCells = state.gridState.cells.map((row) => [...row]);
  const [row, col] = emptyCell;
  // Deep compare coordinate tuples (indexOf uses reference equality)
  const coordIndex = targetWord.coords.findIndex(
    (c) => c[0] === emptyCell[0] && c[1] === emptyCell[1]
  );
  const letterFromWord = targetWord.word[coordIndex];

  newCells[row][col] = {
    ...newCells[row][col],
    letter: letterFromWord,
    filled: true,
  };

  return {
    ...state,
    gridState: {
      ...state.gridState,
      cells: newCells,
    },
    coins: state.coins - 15,
  };
}

/**
 * Reset level (clear progress but keep coins)
 */
export function resetLevel(state: GameStateData): GameStateData {
  return {
    ...state,
    gridState: createGridState(state.currentLevel),
    letterWheel: createLetterWheel(state.currentLevel.letters),
    selectedPath: null,
    solvedWords: new Set(),
    extraWordsFound: new Set(),
  };
}

/**
 * Check if level is complete (all target words solved)
 */
export function isLevelComplete(state: GameStateData): boolean {
  const allTargetsSolved = state.currentLevel.targetWords.every((tw) =>
    state.solvedWords.has(tw.word.toUpperCase())
  );
  return allTargetsSolved;
}

/**
 * Get coins earned for current level
 */
export function getCoinsEarned(state: GameStateData): number {
  let coins = 0;

  // 10 coins per target word
  coins += state.solvedWords.size * 10;

  // 5 coins per extra word
  coins += state.extraWordsFound.size * 5;

  // Bonus for solving without hints
  // (This would need additional tracking)

  return coins;
}

/**
 * Calculate progress for current level
 */
export function getLevelProgress(state: GameStateData): {
  totalWords: number;
  solvedWords: number;
  percentage: number;
} {
  const totalWords = state.currentLevel.targetWords.length;
  const solvedWords = state.solvedWords.size;
  const percentage = Math.round((solvedWords / totalWords) * 100);

  return { totalWords, solvedWords, percentage };
}
