/**
 * Word Naija - Home Screen
 * Welcome screen with game info and start button
 */

import React from "react";
import { Play, Settings } from "lucide-react";

interface HomeScreenProps {
  coins: number;
  levelsCompleted: number;
  totalLevels: number;
  onStart: () => void;
  onSettings?: () => void;
}

export function HomeScreen({
  coins,
  levelsCompleted,
  totalLevels,
  onStart,
  onSettings,
}: HomeScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-900 via-amber-950 to-black px-4 py-8">
      {/* Logo/Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-5xl font-black text-amber-50">Word Naija</h1>
        <p className="text-lg text-amber-200">Nigerian Word Puzzle Game</p>
        <p className="mt-2 text-sm text-amber-300">
          Solve crosswords with Nigerian English & Pidgin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-12 grid w-full max-w-sm grid-cols-3 gap-4">
        <StatCard
          label="Coins"
          value={coins.toString()}
          icon="💰"
          color="from-amber-400 to-amber-300"
        />
        <StatCard
          label="Levels"
          value={`${levelsCompleted}/${totalLevels}`}
          icon="🎯"
          color="from-green-400 to-green-300"
        />
        <StatCard
          label="Progress"
          value={`${Math.round((levelsCompleted / totalLevels) * 100)}%`}
          icon="⭐"
          color="from-blue-400 to-blue-300"
        />
      </div>

      {/* Feature List */}
      <div className="mb-12 w-full max-w-sm space-y-3">
        <FeatureItem icon="🎮" text="120 Challenging Levels" />
        <FeatureItem icon="🇳🇬" text="Nigerian & Pidgin Words" />
        <FeatureItem icon="💾" text="Auto-Save Progress" />
        <FeatureItem icon="🔕" text="Optional Sound Effects" />
      </div>

      {/* Action Buttons */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        <button
          onClick={onStart}
          className="flex items-center justify-center gap-3 rounded-xl border-2 border-green-600 bg-gradient-to-r from-green-500 to-green-600 py-4 text-lg font-bold text-white transition-all hover:shadow-lg active:scale-95"
        >
          <Play size={24} />
          Start Game
        </button>

        {onSettings && (
          <button
            onClick={onSettings}
            className="flex items-center justify-center gap-3 rounded-xl border-2 border-amber-600 bg-gradient-to-r from-amber-500 to-amber-600 py-4 text-lg font-bold text-white transition-all hover:shadow-lg active:scale-95"
          >
            <Settings size={24} />
            Settings
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-xs text-amber-300">
        <p>Word Naija • Offline Game • No Ads</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div
      className={`rounded-lg bg-gradient-to-br ${color} p-4 text-center shadow-lg`}
    >
      <div className="mb-2 text-2xl">{icon}</div>
      <p className="text-xs font-semibold uppercase text-gray-900">{label}</p>
      <p className="text-2xl font-bold text-gray-950">{value}</p>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 backdrop-blur-sm">
      <span className="text-xl">{icon}</span>
      <span className="font-semibold text-amber-50">{text}</span>
    </div>
  );
}
