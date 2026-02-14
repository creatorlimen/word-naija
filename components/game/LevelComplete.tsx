/**
 * Word Naija - Level Complete Modal
 * Shows after all target words are solved
 */

import React from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import type { Level } from "@/lib/game/types";

interface LevelCompleteProps {
  level: Level;
  solvedWords: string[];
  extraWords: string[];
  coinsEarned: number;
  onNextLevel: () => void;
  onPlayAgain: () => void;
}

export function LevelComplete({
  level,
  solvedWords,
  extraWords,
  coinsEarned,
  onNextLevel,
  onPlayAgain,
}: LevelCompleteProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-bold text-amber-950">
            🎉 Level {level.levelId} Complete!
          </h2>
          <p className="text-lg text-amber-800">{level.title}</p>
        </div>

        {/* Coins Earned */}
        <div className="mb-6 rounded-lg bg-gradient-to-r from-amber-300 to-amber-200 p-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-900">
            Coins Earned
          </p>
          <p className="text-4xl font-bold text-amber-950">{coinsEarned}</p>
        </div>

        {/* Target Words */}
        {solvedWords.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-bold uppercase text-amber-900">
              Target Words ({solvedWords.length})
            </h3>
            <div className="space-y-2">
              {solvedWords.map((word) => {
                const targetWord = level.targetWords.find(
                  (tw) => tw.word === word
                );
                return (
                  <div
                    key={word}
                    className="rounded-lg border-l-4 border-green-500 bg-green-50 p-3"
                  >
                    <p className="font-bold text-green-900">{word}</p>
                    {targetWord?.meaning && (
                      <p className="text-xs text-green-700">
                        {targetWord.meaning}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Extra Words */}
        {extraWords.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase text-amber-900">
              Extra Words Found ({extraWords.length})
            </h3>
            <div className="space-y-2">
              {extraWords.map((word) => (
                <div
                  key={word}
                  className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-2"
                >
                  <p className="text-sm font-semibold text-blue-900">{word}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onPlayAgain}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-amber-600 bg-amber-500 py-3 font-bold text-white transition-all hover:bg-amber-600 active:scale-95"
          >
            <RotateCcw size={18} />
            Play Again
          </button>
          <button
            onClick={onNextLevel}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-600 bg-green-500 py-3 font-bold text-white transition-all hover:bg-green-600 active:scale-95"
          >
            Next Level
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
