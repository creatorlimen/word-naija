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
  tryAutoSubmit,
} from "./gameState";
import { loadDictionary } from "./dictionaryLoader";
import { loadProgress, saveProgress, getDefaultProgress } from "./persistence";
import { TOTAL_LEVELS } from "./levelLoader";

// ============================================================================
// Context Types
// ============================================================================

interface GameContextType {
  state: GameStateData;
  actions: {
    selectLetter: (index: number) => void;
    undoSelection: () => void;
    clearSelection: () => void;
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
      setState((prev) => {
        if (!prev) return prev;
        const afterSelect = selectLetter(prev, index);
        // Auto-submit: check if current word matches a target or dictionary word
        return tryAutoSubmit(afterSelect);
      });
    }, []),

    undoSelection: useCallback(() => {
      setState((prev) => (prev ? undoSelection(prev) : prev));
    }, []),

    clearSelection: useCallback(() => {
      setState((prev) => (prev ? clearSelection(prev) : prev));
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

      const nextLevelId = currentState.currentLevel.levelId + 1;
      if (nextLevelId <= TOTAL_LEVELS) {
        try {
          const newCompletedLevels = new Set(currentState.completedLevels);
          newCompletedLevels.add(currentState.currentLevel.levelId);

          const newState = await initializeGameState(
            nextLevelId,
            currentState.coins
          );
          newState.completedLevels = newCompletedLevels;
          newState.soundEnabled = currentState.soundEnabled;

          setState(newState);
        } catch (err) {
          // Silently handle — user stays on current level
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
  const { state, isLoading, error } = useGame();
  const progress = state?.currentLevel ? getLevelProgress(state) : null;
  const isComplete = state?.currentLevel ? isLevelComplete(state) : false;

  return { state, progress, isComplete, isLoading, error };
}

export function useGameActions() {
  const { actions } = useGame();
  return actions;
}
