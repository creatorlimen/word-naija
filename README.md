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
- `npm test`: Run dictionary, game-rule, save/resume, reward, and completion-screen regression checks
- `npm run typecheck`: Check TypeScript without emitting files
- `npm run validate:levels`: Validate the dictionary and generate/check all configured levels using `tools/validate_levels.ts`

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
|  |- progress.ts              # Save migration, puzzle restoration, one-time completion rewards
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
6. Solving the last target immediately records completion and awards coins once. The final level returns to the dashboard; completed puzzles can be replayed.
7. Meaningful actions save progress immediately, including the current puzzle and purchased hints. Storage writes stay in order, with an additional save when the app moves to the background.

## Core Game Rules (Current Implementation)

- Target words are accepted even if missing from dictionary (level design is authoritative).
- Non-target words must be valid dictionary entries and at least 2 letters.
- Extra words are allowed when `extraWordsAllowed` is true for the level.
- Every 10 newly credited extra words grants a coin reward (`EXTRA_WORDS_REWARD`). Each bonus word earns credit once per level, including across restarts and replays.
- A hint costs 5 coins, requires sufficient balance, reveals one unresolved cell, and auto-completes any now-fully-filled target word.
- Badges use lifetime earnings and recorded discoveries. Words Mastered counts each word once per level, with bonuses counted once.

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
- Run `npm run validate:levels` after content edits. It checks CSV structure, word and variant collisions, excluded offensive entries, damaged meanings, and agreement with level clues.

Selected English definitions are adapted from [Princeton WordNet 3.1](https://wordnet.princeton.edu/). The full notice is in [assets/data/WordNet-LICENSE.txt](assets/data/WordNet-LICENSE.txt) and the CSV notes, so it accompanies the bundled dictionary. Retain it when redistributing this data. See [the cleanup record](docs/dictionary-cleanup.md) for the reviewed removals and level replacements.

## Persistence

Save format version 2 uses AsyncStorage key `wordnaija_progress` in `lib/game/persistence.ts`:

- `coins`
- `completedLevels`
- `soundEnabled`
- `lastPlayed`
- `currentLevelId` and `currentLevelSnapshot` (solved words, bonus words, hints, wheel order, and completion reward)
- `wordsFoundByLevel`
- `extraWordsFoundByLevel`
- `extraWordsCollected`
- `totalCoinsEarned`

Legacy saves migrate automatically, retaining balances, completed levels, settings, and recorded bonus history. Invalid negative balances from the old hint bug become zero. Missing historical bonus discoveries and spent bonus earnings cannot be recovered; lifetime earnings begin at the larger of the saved balance and known completion rewards. Already completed levels retain their original target history when content is corrected.

Snapshots validate the puzzle layout and hint letters before restoration. If level content changes, still-valid solved words are retained and incompatible hint coordinates are discarded.

Bonus words removed from the dictionary are excluded from resumed puzzle lists. Their existing history and earned credit are retained.

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

No overall project license is currently defined. The adapted WordNet definitions carry the notice in [assets/data/WordNet-LICENSE.txt](assets/data/WordNet-LICENSE.txt).
