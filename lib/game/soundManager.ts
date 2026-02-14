/**
 * Word Naija - Sound Manager
 * Handles sound effects using expo-av
 */

import { Audio } from "expo-av";

type SoundType = "tap" | "success" | "error" | "complete" | "hint";

let audioReady = false;

/**
 * Initialize audio mode for the app
 */
export async function initializeSounds(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
    });
    audioReady = true;
  } catch {
    // Audio not available on this device
  }
}

/**
 * Play a sound effect using expo-av tone generation
 * Uses short beeps with different frequencies per sound type
 */
export async function playSound(
  soundType: SoundType,
  enabled: boolean
): Promise<void> {
  if (!enabled || !audioReady) return;

  // For now we use a simple approach — in Phase 5 we'll add actual sound assets
  // expo-av doesn't have oscillator API like Web Audio, so we'll skip audio
  // until we bundle proper .wav/.mp3 files
  try {
    // Placeholder: will be replaced with actual sound file playback
    void soundType;
  } catch {
    // Silently fail
  }
}

/**
 * Play tap sound when selecting letter
 */
export function playTapSound(enabled: boolean): void {
  playSound("tap", enabled);
}

/**
 * Play success sound when word is found
 */
export function playSuccessSound(enabled: boolean): void {
  playSound("success", enabled);
}

/**
 * Play error sound when word is invalid
 */
export function playErrorSound(enabled: boolean): void {
  playSound("error", enabled);
}

/**
 * Play complete sound when level is complete
 */
export function playCompleteSound(enabled: boolean): void {
  playSound("complete", enabled);
}

/**
 * Play hint sound when hint is used
 */
export function playHintSound(enabled: boolean): void {
  playSound("hint", enabled);
}
