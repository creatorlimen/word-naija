/**
 * Word Naija - Grid Component
 * Renders the crossword-style game grid with animation
 */

import React, { useState, useEffect } from "react";
import type { Cell, GridState } from "@/lib/game/types";
import { cn } from "@/lib/utils";

interface GridProps {
  gridState: GridState;
  selectedPath: number[]; // Letter indices for visual feedback
}

export function Grid({ gridState, selectedPath }: GridProps) {
  const [filledCells, setFilledCells] = useState<Set<string>>(new Set());

  // Animate newly filled cells
  useEffect(() => {
    const newFilled = new Set<string>();
    for (let r = 0; r < gridState.cells.length; r++) {
      for (let c = 0; c < gridState.cells[r].length; c++) {
        if (gridState.cells[r][c].filled) {
          const key = `${r}-${c}`;
          newFilled.add(key);
        }
      }
    }
    setFilledCells(newFilled);
  }, [gridState.cells]);

  return (
    <div className="flex justify-center py-6">
      <div
        className="gap-1 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 p-6 shadow-2xl"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridState.cols}, minmax(0, 1fr))`,
          width: "fit-content",
          aspectRatio: `${gridState.cols} / ${gridState.rows}`,
        }}
      >
        {gridState.cells.map((row, r) =>
          row.map((cell, c) => (
            <GridCell key={`${r}-${c}`} cell={cell} />
          ))
        )}
      </div>
    </div>
  );
}

interface GridCellProps {
  cell: Cell;
}

function GridCell({ cell }: GridCellProps) {
  const isPlayable = cell.letter !== " ";
  const isFilled = cell.filled;

  if (!isPlayable) {
    // Blocked cell - hidden
    return <div className="invisible h-12 w-12 rounded-lg" />;
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg text-xl font-bold transition-all duration-300",
        isFilled
          ? "bg-gradient-to-br from-amber-300 via-amber-200 to-amber-100 text-amber-950 shadow-md"
          : "border-2 border-amber-600 bg-amber-50",
        "h-12 w-12 select-none"
      )}
    >
      {isFilled && cell.letter ? (
        <span className="text-lg font-bold text-amber-950">{cell.letter}</span>
      ) : (
        <span className="text-xs text-amber-300">_</span>
      )}
    </div>
  );
}
