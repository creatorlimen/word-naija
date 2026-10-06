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
import { AppState } from "react-native";
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
import { completeLevel, createSavedProgress, restoreProgress } from "./progress";
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

        const initialState = completeLevel(restoreProgress(
          await initializeGameState(progress.currentLevelId, progress.coins),
          progress
        ));
        stateRef.current = initialState;
        setState(initialState);
        void saveProgress(createSavedProgress(initialState));
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

  // Save as soon as a meaningful action changes state. Keep a lifecycle flush
  // for a platform that suspends the app immediately after a background event.
  const commitState = useCallback((next: GameStateData, persist = true) => {
    if (next === stateRef.current) return;
    stateRef.current = next;
    setState(next);
    if (persist) void saveProgress(createSavedProgress(next));
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (status) => {
      if (status !== "active" && stateRef.current) {
        void saveProgress(createSavedProgress(stateRef.current));
      }
    });
    return () => subscription.remove();
  }, []);

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
      commitState(next, false);
    }, []),

    undoSelection: useCallback(() => {
      const prev = stateRef.current;
      if (prev) commitState(undoSelection(prev), false);
    }, []),

    clearSelection: useCallback(() => {
      const prev = stateRef.current;
      if (prev) commitState(clearSelection(prev), false);
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

      const next = completeLevel(submitWord(prev));

      const afterSolvedSize = next.solvedWords.size;
      const afterExtraSize  = next.extraWordsFound.size;

      commitState(next);

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
      const prev = stateRef.current;
      if (prev) commitState(completeLevel(submitWord(prev)));
    }, []),

    shuffleLetters: useCallback(() => {
      const prev = stateRef.current;
      if (prev) commitState(shuffleLetters(prev));
    }, []),

    revealHint: useCallback(() => {
      const prev = stateRef.current;
      if (prev) commitState(completeLevel(revealHint(prev)));
    }, []),

    resetLevel: useCallback(() => {
      const prev = stateRef.current;
      if (prev) commitState(resetLevel(prev));
    }, []),

    nextLevel: useCallback(async () => {
      const currentState = stateRef.current;
      if (!currentState) return;
      if (!isLevelComplete(currentState)
        || !currentState.completedLevels.has(currentState.currentLevel.levelId)) return;
      const nextLevelId = currentState.currentLevel.levelId + 1;
      if (nextLevelId <= TOTAL_LEVELS) {
        try {
          const newState = await initializeGameState(
            nextLevelId,
            currentState.coins
          );
          const latest = stateRef.current;
          if (!latest || latest.currentLevel.levelId !== currentState.currentLevel.levelId
            || !isLevelComplete(latest)
            || !latest.completedLevels.has(latest.currentLevel.levelId)) return;
          commitState({
            ...newState,
            coins: latest.coins,
            completedLevels: new Set(latest.completedLevels),
            soundEnabled: latest.soundEnabled,
            extraWordsCollected: latest.extraWordsCollected,
            wordsFoundByLevel: latest.wordsFoundByLevel,
            extraWordsFoundByLevel: latest.extraWordsFoundByLevel,
            totalCoinsEarned: latest.totalCoinsEarned,
          });
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
      const prev = stateRef.current;
      if (prev) commitState({ ...prev, soundEnabled: !prev.soundEnabled });
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
