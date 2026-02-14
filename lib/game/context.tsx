/**
 * Word Naija - Game Context Provider
 * Manages global game state and provides actions to components
 */

"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { GameStateData, GameAction } from "./types";
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

        // Initialize first level or next incomplete level
        const currentLevelId = savedProgress
          ? Math.max(...(savedProgress.completedLevels || []), 0) + 1
          : 1;

        const initialState = await initializeGameState(
          Math.min(currentLevelId, 120),
          progress.coins
        );

        initialState.soundEnabled = progress.soundEnabled;
        initialState.completedLevels = new Set(progress.completedLevels || []);

        setState(initialState);
        setIsLoading(false);
      } catch (err) {
        console.error("[Word Naija] Initialization error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize game");
        setIsLoading(false);
      }
    }

    initializeGame();
  }, []);

  // Save progress whenever state changes
  useEffect(() => {
    if (!isLoading && state) {
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
    }
  }, [state, isLoading]);

  // Action handlers
  const actions = {
    selectLetter: useCallback((index: number) => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return selectLetter(prevState, index);
      });
    }, []),

    undoSelection: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return undoSelection(prevState);
      });
    }, []),

    clearSelection: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return clearSelection(prevState);
      });
    }, []),

    submitWord: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return submitWord(prevState);
      });
    }, []),

    shuffleLetters: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return shuffleLetters(prevState);
      });
    }, []),

    revealHint: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return revealHint(prevState);
      });
    }, []),

    resetLevel: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return resetLevel(prevState);
      });
    }, []),

    nextLevel: useCallback(async () => {
      if (!state) return;
      
      const nextLevelId = state.currentLevel.levelId + 1;
      if (nextLevelId <= 120) {
        try {
          // Mark current level as complete
          const newCompletedLevels = new Set(state.completedLevels);
          newCompletedLevels.add(state.currentLevel.levelId);

          const newState = await initializeGameState(nextLevelId, state.coins);
          newState.completedLevels = newCompletedLevels;
          newState.soundEnabled = state.soundEnabled;
          
          setState(newState);
        } catch (err) {
          console.error("[Word Naija] Error loading next level:", err);
        }
      }
    }, [state]),

    toggleSound: useCallback(() => {
      setState((prevState) => {
        if (!prevState) return prevState;
        return { ...prevState, soundEnabled: !prevState.soundEnabled };
      });
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
// Hook to use game context
// ============================================================================

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within GameProvider");
  }
  return context;
}

/**
 * Hook to access game state and progress info
 */
export function useGameState() {
  const { state, isLoading, error } = useGame();
  const progress = state?.currentLevel ? getLevelProgress(state) : null;
  const isComplete = state?.currentLevel ? isLevelComplete(state) : false;

  return {
    state,
    progress,
    isComplete,
    isLoading,
    error,
  };
}

/**
 * Hook to access game actions
 */
export function useGameActions() {
  const { actions } = useGame();
  return actions;
}
