# Word Naija

A culturally localized, offline-first word puzzle game built with Expo + React Native.

Word Naija blends familiar word-game mechanics with Nigerian English and Pidgin vocabulary. Players swipe letters to form words, fill a crossword-style grid, unlock levels, and earn coins through level completion and bonus words.

## Highlights

- Offline-first gameplay with local dictionary and generated levels
- Nigerian/Pidgin flavored vocabulary and themed level titles
- Swipe-based letter selection with backtrack support
- Crossword grid with animated reveals and completion effects
- Bonus extra-word system with coin reward milestones
- Onboarding (FTUE), coach marks, haptics, and synthesized audio cues
- Progress persistence via AsyncStorage

## Tech Stack

- Expo SDK 54
- React 19 + React Native 0.81
- TypeScript
- `expo-audio`, `expo-asset`, `expo-file-system/legacy`, `expo-haptics`, `expo-linear-gradient`, `expo-blur`
- `@react-native-async-storage/async-storage`

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Expo CLI via `npx expo`
- Android Studio emulator or physical device with Expo Go/Dev build

### Install

```bash
npm install
```

### Run

```bash
npm run start
```

Useful variants:

```bash
npm run android
npm run ios
npm run web
```

If Metro cache issues appear:

```bash
npx expo start -c
```

## Scripts

- `npm run start`: Start Expo Metro server
- `npm run android`: Launch Android target via Expo
- `npm run ios`: Launch iOS target via Expo
- `npm run web`: Launch web target via Expo
- `npm run validate:levels`: Generate/validate all configured levels using `tools/validate_levels.ts`

## Project Structure

```text
.
|- App.tsx                     # App root: providers, font loading, navigator shell
|- index.ts                    # Expo root registration
|- components/                 # UI screens and reusable game components
|  |- HomeScreen.tsx
|  |- GameBoard.tsx
|  |- Grid.tsx
|  |- LetterCircle.tsx
|  |- Toolbar.tsx
|  |- LevelComplete.tsx
|  |- SettingsModal.tsx
|  |- FTUE.tsx
|- lib/game/                   # Game domain logic
|  |- context.tsx              # Global game state provider + actions
|  |- gameState.ts             # Core rules (selection, submit, hint, reset, progress)
|  |- levelDefinitions.ts      # Source of all level word configs
|  |- levelGenerator.ts        # Procedural crossword layout generator
|  |- levelLoader.ts           # Runtime level creation + validation
|  |- dictionaryLoader.ts      # CSV parser + dictionary index/lookup
|  |- persistence.ts           # AsyncStorage persistence
|  |- soundManager.ts          # Runtime sound synthesis/playback
|  |- stats.ts                 # Derived stats + achievement logic
|- assets/data/dictionary.csv  # Dictionary corpus used at runtime
|- constants/theme.ts          # Design tokens, colors, typography, gradients
|- tools/                      # Content generation and audits
|  |- generate_levels_v5.ts
|  |- validate_levels.ts
|  |- audit_islands.ts
```

## Gameplay Flow

1. App initializes dictionary, audio, and saved progress in `lib/game/context.tsx`.
2. Current level is loaded through `lib/game/levelLoader.ts`.
3. `components/GameBoard.tsx` renders:
   - Crossword `Grid`
   - Swipe `LetterCircle`
   - Action `Toolbar` (hint, shuffle, extra words)
4. On swipe release, `commitSelection` submits via `submitWord` in `lib/game/gameState.ts`.
5. Correct target words fill grid cells; extra words count toward reward milestones.
6. When all target words are solved, level-complete modal is shown and next level can load.
7. Progress (coins, completed levels, settings, extra-word counters) is auto-saved.

## Core Game Rules (Current Implementation)

- Target words are accepted even if missing from dictionary (level design is authoritative).
- Non-target words must be valid dictionary entries and at least 2 letters.
- Extra words are allowed when `extraWordsAllowed` is true for the level.
- Every 10 extra words grants a coin reward (`EXTRA_WORDS_REWARD`).
- Hint usage reveals one unresolved cell and auto-completes any now-fully-filled target word.

## Levels

Levels are defined as word lists in `lib/game/levelDefinitions.ts`, then generated into crossword layouts at runtime.

- `TOTAL_LEVELS` is derived from the number of level configs.
- Validation enforces playable coordinates, dimensions, letter-pool compatibility, and word-length/coordinate consistency.
- Generator (`lib/game/levelGenerator.ts`) attempts intersecting placements first, then fails loudly if a word cannot be placed.

Validate all levels:

```bash
npm run validate:levels
```

Audit island/disconnected layouts:

```bash
npx tsx tools/audit_islands.ts
```

Regenerate bulk level configs:

```bash
npx tsx tools/generate_levels_v5.ts
```

## Dictionary

Dictionary data is loaded from `assets/data/dictionary.csv` and indexed in memory.

Expected CSV columns:

```csv
word,variants,meaning,language_tag,difficulty,notes
```

Notes:

- Validation/lookup is case-insensitive.
- Variants map to canonical word entries.
- Dictionary is static at runtime.

## Persistence

Saved with AsyncStorage key `wordnaija_progress` in `lib/game/persistence.ts`:

- `coins`
- `completedLevels`
- `soundEnabled`
- `lastPlayed`
- `extraWordsFoundByLevel`
- `extraWordsCollected`

## UI and Theming

The visual system is centralized in `constants/theme.ts`:

- Semantic color tokens (surfaces, outlines, text, accents)
- Gradient sets for background, CTA, cards, and wheel
- Typography scale (Poppins + DM Sans)
- Shared spacing, radii, and shadow tokens

## Troubleshooting

- Dictionary load errors:
  - Ensure `expo-file-system/legacy` is available (used intentionally for `readAsStringAsync`).
- App starts but shows error screen:
  - Check malformed level data by running `npm run validate:levels`.
- Audio not playing on emulator:
  - Audio is best-effort; gameplay remains functional if playback initialization fails.

## Product Scope (MVP)

- Offline single-player word puzzle
- No account/auth, multiplayer, or backend dependency
- Nigerian/Pidgin localization and culturally themed content

## License

No license file is currently defined in this repository.
