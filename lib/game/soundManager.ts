/**
 * Word Naija - Sound Manager
 * Handles sound effects for game events
 */

type SoundType = "tap" | "success" | "error" | "complete" | "hint";

interface AudioElement {
  audio: HTMLAudioElement;
  playing: boolean;
}

const sounds: Record<SoundType, AudioElement | null> = {
  tap: null,
  success: null,
  error: null,
  complete: null,
  hint: null,
};

/**
 * Initialize sounds (can be called from browser context only)
 */
export function initializeSounds(): void {
  if (typeof window === "undefined") return;

  try {
    // Simple beep sounds using Web Audio API instead of loading files
    // This ensures sounds work without external files
  } catch (error) {
    console.warn("[Word Naija] Sound initialization failed:", error);
  }
}

/**
 * Play a sound effect
 */
export function playSound(soundType: SoundType, enabled: boolean): void {
  if (!enabled || typeof window === "undefined") return;

  try {
    // Use Web Audio API to create simple beep sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    // Different frequencies for different sounds
    const frequencies: Record<SoundType, number> = {
      tap: 800,
      success: 1000,
      error: 400,
      complete: 1200,
      hint: 900,
    };

    // Different durations for different sounds
    const durations: Record<SoundType, number> = {
      tap: 0.1,
      success: 0.2,
      error: 0.15,
      complete: 0.3,
      hint: 0.15,
    };

    oscillator.frequency.value = frequencies[soundType];
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + durations[soundType]
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + durations[soundType]);
  } catch (error) {
    console.warn(`[Word Naija] Failed to play ${soundType} sound:`, error);
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
