/**
 * Word Naija - Game Context Provider
 * Manages global game state and provides actions to components
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { GameStateData } from "./types";

import {
  initializeGameState,
  selectLetter,
  undoSelection,
  clearSelection,
  submitWord,
  shuffleLetters,
  revealHint,
  resetLevel,
  isLevelComplete,
  getLevelProgress,
} from "./gameState";
import { loadDictionary } from "./dictionaryLoader";
import { loadProgress, saveProgress, getDefaultProgress } from "./persistence";
import { TOTAL_LEVELS } from "./levelLoader";
import {
  initializeSounds,
  playTapSound,
  playSuccessSound,
  playExtraWordSound,
  playErrorSound,
} from "./soundManager";

// ============================================================================
// Context Types
// ============================================================================

interface GameContextType {
  state: GameStateData;
  toastMessage: string | null;
  actions: {
    selectLetter: (index: number) => void;
    undoSelection: () => void;
    clearSelection: () => void;
    commitSelection: () => void;
    submitWord: () => void;
    shuffleLetters: () => void;
    revealHint: () => void;
    resetLevel: () => void;
    nextLevel: () => Promise<void>;
    toggleSound: () => void;
  };
  isLoading: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// ============================================================================
// Game Provider Component
// ============================================================================

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameStateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 1800);
  }

  // Use ref to avoid stale closures in nextLevel
  const stateRef = useRef(state);
  stateRef.current = state;

  // Initialize game on mount
  useEffect(() => {
    async function initializeGame() {
      try {
        setIsLoading(true);

        // Load dictionary first
        await loadDictionary();

        // Initialise audio — preloads synthesised WAV tones
        await initializeSounds();

        // Load saved progress
        const savedProgress = await loadProgress();
        const progress = savedProgress || getDefaultProgress();

        // Determine current level
        const currentLevelId = savedProgress
          ? Math.max(...(savedProgress.completedLevels || []), 0) + 1
          : 1;

        const initialState = await initializeGameState(
          Math.min(currentLevelId, TOTAL_LEVELS),
          progress.coins
        );

        initialState.soundEnabled = progress.soundEnabled;
        initialState.completedLevels = new Set(progress.completedLevels || []);
        initialState.extraWordsCollected = progress.extraWordsCollected ?? 0;

        setState(initialState);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize game"
        );
        setIsLoading(false);
      }
    }

    initializeGame();
  }, []);

  // Auto-save progress on meaningful state changes (debounced)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isLoading && state) {
      // Debounce saves — wait 1s after last state change
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        const completedLevels = Array.from(state.completedLevels || []);
        const extraWordsFoundByLevel: Record<number, string[]> = {};

        if (state.currentLevel) {
          extraWordsFoundByLevel[state.currentLevel.levelId] = Array.from(
            state.extraWordsFound || []
          );
        }

        saveProgress({
          coins: state.coins,
          completedLevels,
          soundEnabled: state.soundEnabled,
          lastPlayed: Date.now(),
          extraWordsFoundByLevel,
          extraWordsCollected: state.extraWordsCollected ?? 0,
        });
      }, 1000);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [state, isLoading]);

  // Action handlers — use setState callback to avoid stale closures
  const actions = {
    selectLetter: useCallback((index: number) => {
      const prev = stateRef.current;
      if (!prev) return;
      const next = selectLetter(prev, index);
      const prevLen = prev.selectedPath?.word.length ?? 0;
      const nextLen = next.selectedPath?.word.length ?? 0;
      if (nextLen > prevLen) {
        playTapSound(prev.soundEnabled);
      }
      setState(next);
    }, []),

    undoSelection: useCallback(() => {
      setState((prev) => (prev ? undoSelection(prev) : prev));
    }, []),

    clearSelection: useCallback(() => {
      setState((prev) => (prev ? clearSelection(prev) : prev));
    }, []),

    commitSelection: useCallback(() => {
      const prev = stateRef.current;
      if (!prev) return;

      const word = prev.selectedPath?.word?.toUpperCase() ?? '';
      const hadWord = word.length > 0;
      const isDuplicateExtra  = hadWord && prev.extraWordsFound.has(word);
      const isDuplicateTarget = hadWord && !isDuplicateExtra && prev.solvedWords.has(word);

      const beforeSolvedSize = prev.solvedWords.size;
      const beforeExtraSize  = prev.extraWordsFound.size;

      const next = submitWord(prev);

      const afterSolvedSize = next.solvedWords.size;
      const afterExtraSize  = next.extraWordsFound.size;

      setState(next);

      if (afterSolvedSize > beforeSolvedSize) {
        if (afterExtraSize > beforeExtraSize) {
          playExtraWordSound(prev.soundEnabled);
        } else {
          playSuccessSound(prev.soundEnabled);
        }
      } else if (isDuplicateTarget) {
        showToast('Already found! ✓');
        playErrorSound(prev.soundEnabled);
      } else if (isDuplicateExtra) {
        showToast('Already found this bonus word!');
        playErrorSound(prev.soundEnabled);
      } else if (hadWord) {
        playErrorSound(prev.soundEnabled);
      }
    }, []),

    submitWord: useCallback(() => {
      setState((prev) => (prev ? submitWord(prev) : prev));
    }, []),

    shuffleLetters: useCallback(() => {
      setState((prev) => (prev ? shuffleLetters(prev) : prev));
    }, []),

    revealHint: useCallback(() => {
      setState((prev) => (prev ? revealHint(prev) : prev));
    }, []),

    resetLevel: useCallback(() => {
      setState((prev) => (prev ? resetLevel(prev) : prev));
    }, []),

    nextLevel: useCallback(async () => {
      // Use ref to get current state (avoids stale closure)
      const currentState = stateRef.current;
      if (!currentState) return;

      // Award level-completion coins before transitioning
      const completionBonus = 15 + currentState.currentLevel.levelId * 5;
      const coinsAfterBonus = currentState.coins + completionBonus;

      const nextLevelId = currentState.currentLevel.levelId + 1;
      if (nextLevelId <= TOTAL_LEVELS) {
        try {
          const newCompletedLevels = new Set(currentState.completedLevels);
          newCompletedLevels.add(currentState.currentLevel.levelId);

          const newState = await initializeGameState(
            nextLevelId,
            coinsAfterBonus
          );
          newState.completedLevels = newCompletedLevels;
          newState.soundEnabled = currentState.soundEnabled;
          newState.extraWordsCollected = currentState.extraWordsCollected;

          setState(newState);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : `Failed to load level ${nextLevelId}`
          );
        }
      }
    }, []),

    toggleSound: useCallback(() => {
      setState((prev) =>
        prev ? { ...prev, soundEnabled: !prev.soundEnabled } : prev
      );
    }, []),
  };

  const value: GameContextType = {
    state: state || ({} as GameStateData),
    toastMessage,
    actions,
    isLoading,
    error,
  };

  return (
    <GameContext.Provider value={value}>{children}</GameContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}

export function useGameState() {
  const { state, toastMessage, isLoading, error } = useGame();
  const progress = state?.currentLevel ? getLevelProgress(state) : null;
  const isComplete = state?.currentLevel ? isLevelComplete(state) : false;

  return { state, toastMessage, progress, isComplete, isLoading, error };
}

export function useGameActions() {
  const { actions } = useGame();
  return actions;
}
