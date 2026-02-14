/**
 * Word Naija - Letter Wheel Component
 * Displays available letters for selection with swipe/tap support
 */

import React, { useState } from "react";
import type { Letter } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface LetterWheelProps {
  letters: Letter[];
  onLetterSelect: (index: number) => void;
  onClearSelection: () => void;
  selectedIndices: number[];
  disabled?: boolean;
}

export function LetterWheel({
  letters,
  onLetterSelect,
  onClearSelection,
  selectedIndices,
  disabled = false,
}: LetterWheelProps) {
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const handleMouseDown = (index: number) => {
    if (!disabled && !letters[index].used) {
      setPressedIndex(index);
    }
  };

  const handleMouseUp = () => {
    setPressedIndex(null);
  };

  const handleClick = (index: number) => {
    if (!disabled && !letters[index].used) {
      onLetterSelect(index);
    }
  };

  const handleClear = () => {
    if (!disabled && selectedIndices.length > 0) {
      onClearSelection();
    }
  };

  return (
    <div className="space-y-4">
      {/* Selection Display */}
      {selectedIndices.length > 0 && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {selectedIndices.map((index) => (
              <div
                key={index}
                className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-green-500 bg-gradient-to-br from-green-200 to-green-100 text-center text-lg font-bold text-green-900 shadow-md"
              >
                {letters[index].char}
              </div>
            ))}
          </div>
          <button
            onClick={handleClear}
            className="rounded-lg bg-red-500 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
            disabled={disabled}
          >
            Clear
          </button>
        </div>
      )}

      {/* Letter Grid */}
      <div className="flex justify-center rounded-xl bg-amber-900 p-4 shadow-xl">
        <div
          className="gap-2"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(0, 50px))`,
            maxWidth: "100%",
          }}
        >
          {letters.map((letter, index) => {
            const isSelected = selectedIndices.includes(index);
            const isUsed = letter.used;

            return (
              <button
                key={index}
                onMouseDown={() => handleMouseDown(index)}
                onMouseUp={handleMouseUp}
                onClick={() => handleClick(index)}
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-lg text-lg font-bold transition-all duration-200",
                  isUsed
                    ? "cursor-not-allowed bg-gray-400 text-gray-600 opacity-50"
                    : isSelected
                      ? "scale-110 border-2 border-green-400 bg-gradient-to-br from-green-300 to-green-200 text-green-950 shadow-lg"
                      : pressedIndex === index
                        ? "scale-95 border-2 border-amber-300 bg-amber-200 text-amber-950 shadow-md"
                        : "border-2 border-amber-400 bg-gradient-to-br from-amber-300 via-amber-200 to-amber-100 text-amber-950 shadow-md hover:shadow-lg",
                  "cursor-pointer"
                )}
                disabled={disabled || isUsed}
              >
                {letter.char}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
