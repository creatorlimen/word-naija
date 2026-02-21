/**
 * Word Naija - Sound Manager
 * Generates WAV tones programmatically, writes them to the Expo cache
 * directory, then preloads them as expo-audio AudioPlayer objects for instant playback.
 *
 * No binary asset files required — everything is synthesised at runtime.
 */

import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import type { AudioPlayer } from "expo-audio";

// Use the legacy expo-file-system API (same path used by dictionaryLoader)
// We declare only the slice of the API we need to avoid the v2 type mismatch.
interface LegacyFS {
  cacheDirectory: string | null;
  EncodingType: { Base64: string; UTF8: string };
  writeAsStringAsync(
    path: string,
    content: string,
    options?: { encoding?: string }
  ): Promise<void>;
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FileSystem: LegacyFS = require("expo-file-system/legacy");

type SoundType = "tap" | "success" | "extra" | "error" | "complete" | "hint";

let audioReady = false;
const soundCache = new Map<SoundType, AudioPlayer>();

// ─── WAV builder ──────────────────────────────────────────────────────────────

const SAMPLE_RATE = 22050; // Hz — low enough to keep file sizes tiny

/**
 * Write a standard 44-byte PCM WAV header into a DataView.
 */
function writeWavHeader(view: DataView, numSamples: number): void {
  const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);   // PCM fmt chunk size
  view.setUint16(20, 1, true);    // AudioFormat = PCM
  view.setUint16(22, 1, true);    // Channels = mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true); // ByteRate
  view.setUint16(32, 2, true);    // BlockAlign
  view.setUint16(34, 16, true);   // BitsPerSample
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
}

/**
 * Synthesise a tone and return a base64-encoded WAV string ready for
 * FileSystem.writeAsStringAsync(..., { encoding: Base64 }).
 *
 * @param durationMs  Length of the sound in milliseconds
 * @param getSample   Function(t in seconds, progress 0–1) → amplitude (-1..1)
 */
function synthesiseWav(
  durationMs: number,
  getSample: (t: number, progress: number) => number
): string {
  const numSamples = Math.floor(SAMPLE_RATE * durationMs / 1000);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  writeWavHeader(view, numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    const progress = i / numSamples;

    // Simple ADSR-like envelope: 10 % attack, sustain, 25 % release
    const fade =
      progress < 0.10 ? progress / 0.10
      : progress > 0.75 ? (1 - progress) / 0.25
      : 1.0;

    const sample = Math.max(-1, Math.min(1, getSample(t, progress) * fade));
    view.setInt16(44 + i * 2, Math.round(sample * 32767), true);
  }

  // Convert raw bytes → base64
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ─── Tone recipes ─────────────────────────────────────────────────────────────

const TONES: Record<SoundType, () => string> = {
  /** Short, bright tick — one letter selected */
  tap: () =>
    synthesiseWav(65, (t) => 0.45 * Math.sin(2 * Math.PI * 880 * t)),

  /** Rising chirp from A4 → A5 — upbeat "word found" */
  success: () =>
    synthesiseWav(320, (t, p) => {
      const freq = 440 + p * 440; // sweep 440 Hz → 880 Hz
      return 0.5 * Math.sin(2 * Math.PI * freq * t);
    }),

  /**
   * Extra-word variant — same upbeat chirp but shorter, followed by a
   * soft trailing ping after a gap (played as two sequential sounds).
   * This tone is just the trailing ping; the main success sound fires first.
   */
  extra: () =>
    synthesiseWav(90, (t) => 0.28 * Math.sin(2 * Math.PI * 1047 * t)), // C6 soft ping
  error: () =>
    synthesiseWav(200, (t, p) => {
      const freq = 340 - p * 170; // sweep 340 Hz → 170 Hz
      return 0.5 * Math.sin(2 * Math.PI * freq * t);
    }),

  /** Upbeat "ta-da-daa" three-note fanfare — level complete */
  complete: () =>
    synthesiseWav(560, (t) => {
      // Three staccato notes with short silent gaps between them
      //   "ta"  — C5 (523 Hz) 0.00–0.11 s
      //   "da"  — E5 (659 Hz) 0.16–0.27 s
      //   "daa" — G5 (784 Hz) 0.32–0.56 s  (held longer for emphasis)
      const notes: { start: number; end: number; freq: number }[] = [
        { start: 0.00, end: 0.11, freq: 523 },
        { start: 0.16, end: 0.27, freq: 659 },
        { start: 0.32, end: 0.56, freq: 784 },
      ];
      for (const note of notes) {
        if (t >= note.start && t < note.end) {
          const p = (t - note.start) / (note.end - note.start);
          // Per-note envelope: sharp attack (10%), sustain, soft release (20%)
          const env =
            p < 0.10 ? p / 0.10
            : p > 0.80 ? (1 - p) / 0.20
            : 1.0;
          return 0.6 * env * Math.sin(2 * Math.PI * note.freq * t);
        }
      }
      return 0; // silence in the gaps between notes
    }),

  /** Soft mid-range ping — hint used */
  hint: () =>
    synthesiseWav(110, (t) => 0.4 * Math.sin(2 * Math.PI * 660 * t)),
};

// ─── Preloading ───────────────────────────────────────────────────────────────

async function preloadAllSounds(): Promise<void> {
  const cacheDir = FileSystem.cacheDirectory ?? "";
  const types: SoundType[] = ["tap", "success", "extra", "error", "complete", "hint"];

  await Promise.all(
    types.map(async (type) => {
      try {
        const base64wav = TONES[type]();
        const filePath = `${cacheDir}wn_snd_${type}.wav`;

        await FileSystem.writeAsStringAsync(filePath, base64wav, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const player = createAudioPlayer({ uri: filePath });
        player.volume = 1.0;
        soundCache.set(type, player);
      } catch {
        // This particular sound won't play; others will still work
      }
    })
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Call once at app startup (inside GameProvider's init effect).
 * Sets audio mode and preloads all synthesised tones.
 */
export async function initializeSounds(): Promise<void> {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
    });
    await preloadAllSounds();
    audioReady = true;
  } catch {
    // Audio unavailable on this device/emulator — game still works
  }
}

/**
 * Play a preloaded sound. Fire-and-forget (async errors silently swallowed).
 */
export async function playSound(
  soundType: SoundType,
  enabled: boolean
): Promise<void> {
  if (!enabled || !audioReady) return;
  const player = soundCache.get(soundType);
  if (!player) return;
  try {
    await player.seekTo(0);
    player.play();
  } catch {
    // Silently fail — transient playback errors are non-critical
  }
}

export function playTapSound(enabled: boolean): void {
  void playSound("tap", enabled);
}

export function playSuccessSound(enabled: boolean): void {
  void playSound("success", enabled);
}

/**
 * Extra word found: plays the regular success chirp, then a soft C6 ping
 * ~330 ms later to subtly distinguish it from a target-word solve.
 */
export function playExtraWordSound(enabled: boolean): void {
  void playSound("success", enabled);
  setTimeout(() => void playSound("extra", enabled), 330);
}

export function playErrorSound(enabled: boolean): void {
  void playSound("error", enabled);
}

export function playCompleteSound(enabled: boolean): void {
  void playSound("complete", enabled);
}

export function playHintSound(enabled: boolean): void {
  void playSound("hint", enabled);
}
