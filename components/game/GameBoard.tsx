/**
 * Word Naija - GameBoard Container
 * Orchestrates all game components and interactions
 */

"use client";

import React, { useEffect, useState } from "react";
import { useGame, useGameState, useGameActions } from "@/lib/game/context";
import { getLevelProgress, isLevelComplete } from "@/lib/game/gameState";
import {
  playTapSound,
  playSuccessSound,
  playErrorSound,
  playCompleteSound,
} from "@/lib/game/soundManager";
import { Grid } from "./Grid";
import { LetterWheel } from "./LetterWheel";
import { Controls } from "./Controls";
import { LevelComplete } from "./LevelComplete";

export function GameBoard() {
  const { state, isLoading, error } = useGame();
  const actions = useGameActions();
  const [showComplete, setShowComplete] = useState(false);

  // Check if level is complete
  useEffect(() => {
    if (state.currentLevel && isLevelComplete(state)) {
      setShowComplete(true);
    } else {
      setShowComplete(false);
    }
  }, [state]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-amber-900 to-amber-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-amber-300 border-t-amber-50"></div>
          <p className="text-lg font-semibold text-amber-100">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-amber-900 to-amber-950">
        <div className="text-center text-red-300">
          <p className="text-lg font-bold">Error Loading Game</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!state.currentLevel) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-amber-900 to-amber-950">
        <p className="text-lg font-semibold text-amber-100">Initializing...</p>
      </div>
    );
  }

  const progress = getLevelProgress(state);
  const coinsEarned = 10 * state.solvedWords.size + 5 * state.extraWordsFound.size;

  const handleSelectLetter = (index: number) => {
    playTapSound(state.soundEnabled);
    actions.selectLetter(index);
  };

  const handleSubmitWord = () => {
    if (state.selectedPath && state.selectedPath.word.length > 0) {
      const prevSolvedCount = state.solvedWords.size;
      actions.submitWord();
      
      // Play sound after submit (next render will show if word was valid)
      setTimeout(() => {
        if (state.solvedWords.size > prevSolvedCount) {
          playSuccessSound(state.soundEnabled);
        } else {
          playErrorSound(state.soundEnabled);
        }
      }, 100);
    }
  };

  const handleNextLevel = async () => {
    playCompleteSound(state.soundEnabled);
    setShowComplete(false);
    state.completedLevels.add(state.currentLevel.levelId);
    await actions.nextLevel();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-900 to-amber-950 px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Game Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-amber-50">Word Naija</h1>
          <p className="text-sm text-amber-200">
            Level {state.currentLevel.levelId} • {progress.solvedWords}/{progress.totalWords} words
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-amber-100">
            <span>Progress</span>
            <span className="font-semibold text-amber-300">{progress.percentage}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-amber-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Main Game Grid */}
        {state.currentLevel && <Grid gridState={state.gridState} selectedPath={state.selectedPath?.letterIndices || []} />}

        {/* Letter Selection Area */}
        {state.letterWheel && (
          <>
            <LetterWheel
              letters={state.letterWheel}
              onLetterSelect={handleSelectLetter}
              onClearSelection={actions.clearSelection}
              selectedIndices={state.selectedPath?.letterIndices || []}
              disabled={showComplete}
            />

            {/* Submit Button */}
            {(state.selectedPath?.letterIndices || []).length > 0 && (
              <button
                onClick={handleSubmitWord}
                className="w-full rounded-lg border-2 border-blue-600 bg-gradient-to-r from-blue-500 to-blue-600 py-4 text-lg font-bold text-white transition-all hover:shadow-lg active:scale-95 disabled:opacity-50"
                disabled={showComplete || !state.selectedPath?.word.length}
              >
                Submit Word: {state.selectedPath?.word}
              </button>
            )}
          </>
        )}

        {/* Controls */}
        <Controls
          coins={state.coins}
          soundEnabled={state.soundEnabled}
          levelNumber={state.currentLevel.levelId}
          onShuffle={actions.shuffleLetters}
          onHint={actions.revealHint}
          onToggleSound={actions.toggleSound}
          onReset={actions.resetLevel}
          disabled={showComplete}
        />

        {/* Level Flavor Text */}
        {state.currentLevel.flavorText && (
          <div className="rounded-lg bg-amber-800/50 p-4 text-center text-sm italic text-amber-100">
            {state.currentLevel.flavorText}
          </div>
        )}
      </div>

      {/* Level Complete Modal */}
      {showComplete && (
        <LevelComplete
          level={state.currentLevel}
          solvedWords={Array.from(state.solvedWords)}
          extraWords={Array.from(state.extraWordsFound)}
          coinsEarned={coinsEarned}
          onNextLevel={handleNextLevel}
          onPlayAgain={() => {
            actions.resetLevel();
            setShowComplete(false);
          }}
        />
      )}
    </div>
  );
}
