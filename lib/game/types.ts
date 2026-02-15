/**
 * Word Naija - Core TypeScript Types
 * Defines all interfaces for game logic, state, and persistence
 */

// ============================================================================
// Game Board & Cell Types
// ============================================================================

export interface Cell {
  row: number;
  col: number;
  letter?: string; // Empty if not part of playable grid
  filled: boolean; // True if user has filled this cell
  selected: boolean; // True if currently in selection path
  isPartOfTargetWord?: boolean; // For hint highlighting
}

export interface GridState {
  rows: number;
  cols: number;
  cells: Cell[][];
  mask: boolean[][]; // True = playable cell, False = blocked
}

// ============================================================================
// Letter & Selection Types
// ============================================================================

export interface Letter {
  char: string;
  index: number; // Position in wheel
  used: boolean; // True if already placed in a word
}

export interface SelectionPath {
  letterIndices: number[]; // Indices into letterWheel
  word: string; // The word formed by selection
  cellCoords?: [number, number][]; // Associated grid coordinates (if valid)
}

// ============================================================================
// Word & Dictionary Types
// ============================================================================

export interface DictionaryEntry {
  canonical: string;
  variants: string[]; // Including canonical
  meaning: string;
  languageTag: string; // "ng_en" | "pidgin" etc
  difficulty: "easy" | "medium" | "hard";
}

export type DictionaryIndex = Map<string, DictionaryEntry>;

// ============================================================================
// Level Types
// ============================================================================

export interface TargetWord {
  word: string;
  coords: [number, number][]; // Grid coordinates for word placement
  meaning?: string;
}

export interface Level {
  levelId: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  rows: number;
  cols: number;
  mask: boolean[][]; // True = playable, False = blocked
  letters: string[]; // Available letter pool
  targetWords: TargetWord[];
  extraWordsAllowed?: boolean;
  flavorText?: string;
}

// ============================================================================
// Game State Types
// ============================================================================

export interface GameStateData {
  currentLevel: Level;
  gridState: GridState;
  letterWheel: Letter[];
  selectedPath: SelectionPath | null;
  coins: number;
  completedLevels: Set<number>;
  solvedWords: Set<string>; // Canonical words solved THIS level
  extraWordsFound: Set<string>; // Extra words solved THIS level
  extraWordsCollected: number; // Running count toward next 10-word reward box
  soundEnabled: boolean;
}

// ============================================================================
// Persistence Types
// ============================================================================

export interface SavedProgress {
  coins: number;
  completedLevels: number[];
  soundEnabled: boolean;
  lastPlayed: number; // Timestamp
  extraWordsFoundByLevel: Record<number, string[]>; // levelId -> words
  extraWordsCollected: number; // Running count toward next 10-word reward box
}

// ============================================================================
// Utility Types
// ============================================================================

export interface GameStatistics {
  totalLevelsSolved: number;
  totalCoinsEarned: number;
  averageWordsPerLevel: number;
  totalExtraWordsFound: number;
}
