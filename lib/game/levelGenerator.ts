import type { Level, TargetWord } from "./types";

type Direction = "horizontal" | "vertical";

interface WordDef {
  word: string;
  meaning: string;
}

interface PlacedWord {
  word: string;
  meaning: string;
  row: number;
  col: number;
  direction: Direction;
}

/**
 * Procedurally generates a Level object from a list of words.
 * Implements a "Skeleton" crossword generation algorithm to prevent invalid adjacencies.
 */
export function generateLevelFromWords(
  levelId: number,
  wordDefs: WordDef[],
  difficulty: "easy" | "medium" | "hard" = "medium",
  title?: string
): Level {
  // Build a meaning lookup
  const meaningMap = new Map<string, string>();
  for (const wd of wordDefs) {
    meaningMap.set(wd.word, wd.meaning);
  }

  // Sort words by length (longest first usually creates better spines)
  const sortedWords = [...wordDefs].sort((a, b) => b.word.length - a.word.length);

  // Grid state tracks letter at each coordinate: "row,col" -> "char"
  const grid = new Map<string, string>();
  const placements: PlacedWord[] = [];

  // 1. Place the first word (the seed) horizontally at (0,0)
  const seed = sortedWords[0];
  placeWordOnGrid(seed.word, seed.meaning, 0, 0, "horizontal", placements, grid);

  const placedWordsSet = new Set<string>([seed.word]);
  const unplacedWords = sortedWords.slice(1);
  let retryCount = 0;

  // 2. Iteratively place remaining words
  while (unplacedWords.length > 0 && retryCount < unplacedWords.length * 2) {
    let placedSomething = false;

    // Try to fit each unplaced word
    for (let i = 0; i < unplacedWords.length; i++) {
      const candidate = unplacedWords[i];
      const bestMove = findBestPlacement(candidate.word, placements, grid);

      if (bestMove) {
        placeWordOnGrid(
          candidate.word,
          candidate.meaning,
          bestMove.row,
          bestMove.col,
          bestMove.direction,
          placements,
          grid
        );
        placedWordsSet.add(candidate.word);
        unplacedWords.splice(i, 1);
        placedSomething = true;
        break;
      }
    }

    if (!placedSomething) {
      const skipped = unplacedWords.shift();
      if (skipped) unplacedWords.push(skipped);
      retryCount++;
    }
  }

  // 3. Determine bounding box and normalize
  const bounds = getBounds(placements);
  const rows = bounds.maxRow - bounds.minRow + 1;
  const cols = bounds.maxCol - bounds.minCol + 1;

  if (rows <= 0 || cols <= 0 || !isFinite(rows) || !isFinite(cols)) {
    throw new Error(`Level ${levelId}: failed to generate valid grid (rows=${rows}, cols=${cols})`);
  }

  // 4. Construct final Level object
  const mask: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const targetWords: TargetWord[] = [];

  for (const p of placements) {
    const wordCoords: [number, number][] = [];

    for (let i = 0; i < p.word.length; i++) {
        const r = p.direction === "horizontal" ? p.row : p.row + i;
        const c = p.direction === "horizontal" ? p.col + i : p.col;

        // Shift by min bounds to make 0-indexed
        const normR = r - bounds.minRow;
        const normC = c - bounds.minCol;

        mask[normR][normC] = true;
        wordCoords.push([normR, normC]);
    }

    targetWords.push({
        word: p.word,
        coords: wordCoords,
        meaning: p.meaning
    });
  }

  // 5. Generate the letters pool
  // Collect all unique letters needed across all target words.
  const letterSet = new Set<string>();
  for (const wd of wordDefs) {
    for (const ch of wd.word) {
      letterSet.add(ch);
    }
  }
  const letters = Array.from(letterSet);

  return {
    levelId,
    title: title || `Level ${levelId}`,
    difficulty,
    rows,
    cols,
    mask,
    letters,
    targetWords,
    extraWordsAllowed: true,
  };
}

// --- Helper Functions ---

function placeWordOnGrid(
  word: string, 
  meaning: string,
  row: number, 
  col: number, 
  direction: Direction, 
  placements: PlacedWord[],
  grid: Map<string, string>
) {
    placements.push({ word, meaning, row, col, direction });
    for (let i = 0; i < word.length; i++) {
        const r = direction === "horizontal" ? row : row + i;
        const c = direction === "horizontal" ? col + i : col;
        grid.set(`${r},${c}`, word[i]);
    }
}

function findBestPlacement(
    word: string, 
    existingPlacements: PlacedWord[],
    grid: Map<string, string>
): { row: number, col: number, direction: Direction } | null {
    
    // Attempt to intersect with every existing placed word
    for (const place of existingPlacements) {
        
        // Find common letters
        for (let i = 0; i < word.length; i++) {
            const charToMatch = word[i];
            
            for (let j = 0; j < place.word.length; j++) {
                if (place.word[j] === charToMatch) {
                    const existR = place.direction === "horizontal" ? place.row : place.row + j;
                    const existC = place.direction === "horizontal" ? place.col + j : place.col;
                    
                    const newDir: Direction = place.direction === "horizontal" ? "vertical" : "horizontal";
                    
                    const startR = newDir === "vertical" ? existR - i : existR;
                    const startC = newDir === "horizontal" ? existC - i : existC;
                    
                    if (isValidPlacement(word, startR, startC, newDir, grid)) {
                        return { row: startR, col: startC, direction: newDir };
                    }
                }
            }
        }
    }
    
    return null;
}

function isValidPlacement(
    word: string, 
    startRow: number, 
    startCol: number, 
    direction: Direction,
    grid: Map<string, string>
): boolean {
    
    for (let i = 0; i < word.length; i++) {
        const r = direction === "horizontal" ? startRow : startRow + i;
        const c = direction === "horizontal" ? startCol + i : startCol;
        const key = `${r},${c}`;

        // 1. Check Collision
        if (grid.has(key)) {
             if (grid.get(key) !== word[i]) return false; // Clash
        } else {
             // 2. Check Adjacency (Sparse Rule)
             // Must ensure no neighbors exist perpendicular to placement
             if (direction === "horizontal") {
                 // Check Top/Bottom neighbors
                 if (grid.has(`${r-1},${c}`) || grid.has(`${r+1},${c}`)) return false;
             } else {
                 // Check Left/Right neighbors
                 if (grid.has(`${r},${c-1}`) || grid.has(`${r},${c+1}`)) return false;
             }
        }
    }
    
    // 3. Check Ends (Prevent extending existing words)
    // The cell immediately before start and immediately after end must be empty
    if (direction === "horizontal") {
        if (grid.has(`${startRow},${startCol-1}`)) return false;
        if (grid.has(`${startRow},${startCol+word.length}`)) return false;
    } else {
        if (grid.has(`${startRow-1},${startCol}`)) return false;
        if (grid.has(`${startRow+word.length},${startCol}`)) return false;
    }
    
    return true;
}

function getBounds(placements: PlacedWord[]) {
    let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
    
    for (const p of placements) {
        const len = p.word.length;
        const endRow = p.direction === "vertical" ? p.row + len - 1 : p.row;
        const endCol = p.direction === "horizontal" ? p.col + len - 1 : p.col;
        
        minRow = Math.min(minRow, p.row);
        maxRow = Math.max(maxRow, endRow);
        minCol = Math.min(minCol, p.col);
        maxCol = Math.max(maxCol, endCol);
    }
    return { minRow, maxRow, minCol, maxCol };
}

