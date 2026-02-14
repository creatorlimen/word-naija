/**
 * Word Naija - Controls Component
 * Shuffle, Hint, Settings, and coin display
 */

import React, { useState } from "react";
import { Volume2, Volume2Off, Lightbulb, Shuffle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlsProps {
  coins: number;
  soundEnabled: boolean;
  levelNumber: number;
  onShuffle: () => void;
  onHint: () => void;
  onToggleSound: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function Controls({
  coins,
  soundEnabled,
  levelNumber,
  onShuffle,
  onHint,
  onToggleSound,
  onReset,
  disabled = false,
}: ControlsProps) {
  const canHint = coins >= 15;

  return (
    <div className="space-y-4">
      {/* Header with Level and Coins */}
      <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-900 to-amber-800 px-4 py-3 text-white shadow-lg">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
            Level
          </p>
          <p className="text-2xl font-bold">{levelNumber}</p>
        </div>

        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
            Coins
          </p>
          <p className="text-2xl font-bold text-amber-300">{coins}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ControlButton
          icon={<Shuffle size={20} />}
          label="Shuffle"
          onClick={onShuffle}
          disabled={disabled}
          variant="secondary"
        />

        <ControlButton
          icon={<Lightbulb size={20} />}
          label={`Hint (${coins}/15)`}
          onClick={onHint}
          disabled={disabled || !canHint}
          variant={canHint ? "primary" : "muted"}
          tooltip={!canHint ? "Need 15 coins" : "Reveal one letter"}
        />

        <ControlButton
          icon={soundEnabled ? <Volume2 size={20} /> : <Volume2Off size={20} />}
          label="Sound"
          onClick={onToggleSound}
          disabled={disabled}
          variant={soundEnabled ? "primary" : "secondary"}
        />

        <ControlButton
          icon={<RotateCcw size={20} />}
          label="Reset"
          onClick={onReset}
          disabled={disabled}
          variant="secondary"
        />
      </div>
    </div>
  );
}

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "muted";
  tooltip?: string;
}

function ControlButton({
  icon,
  label,
  onClick,
  disabled = false,
  variant = "primary",
  tooltip,
}: ControlButtonProps) {
  const variants = {
    primary: "border-green-500 bg-green-500 text-white hover:bg-green-600",
    secondary:
      "border-amber-600 bg-amber-500 text-white hover:bg-amber-600",
    muted: "border-gray-400 bg-gray-300 text-gray-600 cursor-not-allowed",
  };

  return (
    <div className="relative">
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-lg border-2 py-3 px-2 text-xs font-bold uppercase transition-all active:scale-95",
          disabled ? variants.muted : variants[variant],
          !disabled && "cursor-pointer hover:shadow-md"
        )}
        title={tooltip}
      >
        {icon}
        <span className="hidden text-center text-xs sm:inline">{label}</span>
      </button>
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
          {tooltip}
        </div>
      )}
    </div>
  );
}
