# Word Naija — Full Remediation & RN Port Plan

## Phase 1 — Project Scaffold & Cleanup ✅ COMPLETE
- Initialized Expo TypeScript project
- Deleted 30+ unused shadcn/ui components, dead RN imports, duplicate CSS
- Removed all Next.js/Tailwind/PostCSS config
- Ported persistence (IndexedDB → AsyncStorage), sound (Web Audio → expo-av), 
  dictionary loader (fetch → expo-asset), level loader (fetch → require registry)
- Created constants/theme.ts with game color palette
- TypeScript compiles with zero errors

## Phase 2 — Fix Core Game Logic Bugs ✅ COMPLETE
1. Fix letter reuse in `submitWord` — remove `used: true` marking
2. Fix `revealHint` coordinate comparison — deep compare tuples
3. Fix `resetLevel` mutation — new Set() instead of .clear()
4. Fix `shuffleLetters` — proper Fisher-Yates shuffle
5. Fix `selectLetter` — prevent re-selecting already-selected index
6. Fix `averageWordsPerLevel` in stats — correct formula
7. Remove unused `GameAction` union type from types.ts

## Phase 3 — Fix Level Data & Expand Dictionary ✅ COMPLETE
1. Fix level-002.json SAY non-contiguous coords
2. Fix level-003.json STAY non-contiguous coords
3. Fix level-005.json CAST non-contiguous coords
4. Audit levels 001 and 004 for correctness
5. Remove duplicate dictionary entries (SHOUT, SHOT, SORE, SLOW, LAST)
6. Expand Nigerian/Pidgin dictionary (50+ new words)
7. Build level generator tool (tools/generate-levels.ts)
8. Generate levels 006-020 (initial batch)

## Phase 4 — Port UI to React Native ✅ COMPLETE
1. Build Grid component (View + animated cells)
2. Build LetterWheel component (Pressable letter tiles with haptics)
3. Build Controls component (shuffle/hint/sound/reset)
4. Build LevelComplete component (Modal)
5. Build GameBoard (main game screen orchestrator)
6. Build HomeScreen (welcome screen with stats + achievements)
7. Wire up App.tsx with GameProvider, ErrorBoundary, FTUE, and screen navigation

## Phase 5 — Missing PRD Features ✅ COMPLETE
1. FTUE onboarding modal (4-slide walkthrough, AsyncStorage persistence)
2. Haptic feedback (expo-haptics on letter select + word submit)
3. Selected path highlighting on Grid (cellHighlighted style)
4. Cell fill animations (Animated.spring on letter reveal)
5. Achievements display on HomeScreen (badge grid component)

## Phase 6 — Polish & Performance ✅ COMPLETE
1. ErrorBoundary component wrapping entire app
2. Memoization (React.memo on Grid cells)
3. Clean console logging (removed all dev logs)
4. Sound manager placeholder silenced

## Phase 7 — Build Config ✅ COMPLETE
1. app.json configured (name, slug, splash, package, orientation)
2. Placeholder icon assets generated
3. Dependencies updated to Expo SDK 54 compatible versions
4. Verified `npx expo start` launches Metro bundler successfully
5. TypeScript compiles with zero errors across all files

---

## Phase 8 — Runtime Fixes & Gameplay Redesign ✅ COMPLETE

### 8A — Critical runtime bugs ✅
1. ✅ **Dictionary loader** — Changed `require("expo-file-system")` → `require("expo-file-system/legacy")`
2. ✅ **SafeAreaView deprecated** — Installed `react-native-safe-area-context`, replaced all imports,
   added `SafeAreaProvider` in App.tsx
3. ✅ **Excessive "Progress saved" logging** — Debounced saves (1s timer), removed all console.log
4. ✅ **Remaining console.log noise** — Stripped from persistence.ts, gameState.ts, dictionaryLoader.ts

### 8B — Gameplay redesign (match reference screenshots) ✅
1. ✅ **LetterCircle** — New component with circular absolute-positioned tiles (trig layout)
2. ✅ **Auto-submit** — `tryAutoSubmit()` in gameState.ts, wired into context `selectLetter` action
3. ✅ **Submit button removed** — GameBoard no longer has a Submit button
4. ✅ **Toolbar** — New fixed-bottom bar with SHUFFLE, coin display, HINT
5. ✅ **GameBoard rewrite** — Grid(top) → LetterCircle(center, flex:1) → Toolbar(bottom)
6. ✅ **HomeScreen verified** — Correct SafeAreaView, ScrollView, achievements, stats
7. ✅ **TypeScript** — Zero errors across all files

---

## Phase 9 — Swipe Gesture, Crossword Grid Fix & Level Navigation ✅ COMPLETE

### 9A — Swipe-to-select gesture (LetterCircle rewrite) ✅
The reference game uses a **swipe** to build words: the player touches a letter, drags
through subsequent letters without lifting their finger, then lifts to submit.

Changes needed:
1. Replace `Pressable` tap handlers with `PanResponder` in LetterCircle
2. On touch start → detect which tile was pressed, begin selection
3. On pan move → hit-test finger position against tile centers (within ~30px radius),
   select new tiles as finger enters them. If finger backtracks to the second-to-last
   selected tile, undo the last pick (natural "backspace by retracing").
4. On pan release (finger lift) → call a new `commitSelection` action that submits the word
5. Remove `tryAutoSubmit` from the per-letter `selectLetter` action in context — submission
   now only happens on finger lift, preventing mid-swipe auto-submit of partial matches
6. Add `commitSelection` and `undoSelection` to LetterCircle props; wire through GameBoard
7. Update word preview placeholder text: "Swipe letters to form a word"
8. Track selection locally via `useRef` during gesture to avoid stale-state issues

### 9B — Fix level data (proper crossword arrangement) ✅
**Root cause:** Every level (1–10) has fundamentally broken crossword structure:
- Words are placed in parallel rows that never intersect (levels 2, 4–10)
- Some levels have letter conflicts at shared coords (level 1: P vs I at (1,2);
  level 3: T vs E at (2,3); level 4: S vs A at (1,2))
- Level 3 EASE has non-contiguous coords and insufficient letter pool (needs 2× E, pool has 1)

**Fix:** Redesign all 10 levels as proper crosswords:
- Words placed strictly horizontally or vertically
- Intersecting words share the SAME letter at the crossing cell
- Mask matches exactly the union of all word coordinates
- Letter pool validated: each word can individually be formed from the pool
- Progressive difficulty: 2-word levels → 3-word → 4-word

### 9C — Fix next-level button ✅
**Root cause:** The `nextLevel` action's catch block silently swallows errors:
```typescript
} catch (err) {
  // Silently handle — user stays on current level
}
```
If level loading throws (e.g., validation error from broken level data), the user sees
nothing happen. Also, the LevelComplete modal stays visible because state never changes.

**Fix:**
1. Surface the error: call `setError()` in the catch block so the error screen appears
2. Close the LevelComplete modal on attempt (set a loading state or dismiss modal first)
3. Verify all 10 levels load correctly after the data fix in 9B

---

## Phase 10 — Module Fix, Dictionary Gaps, Level Redesign & Grid Polish ✅ COMPLETE

### 10A — Fix LetterCircle module resolution ✅
1. ✅ Removed unused `syncRef` callback from LetterCircle.tsx
2. ✅ Touched GameBoard import, restarted TS server → diagnostic resolved
3. ✅ `npx tsc --noEmit` compiles cleanly

### 10B — Expand dictionary with all missing words ✅
1. ✅ Added ~100 common English words to dictionary.csv (156 → 237 entries)
2. ✅ All 14 previously-missing target words now covered
3. ✅ Broad 3-5 letter English word coverage for extra-word discovery

### 10C — Redesign all 10 levels with dense crossword patterns ✅
All 10 levels redesigned and validated (zero errors):
| Level | Title          | Difficulty | Words | Intersections | Letters     |
|-------|----------------|------------|-------|---------------|-------------|
| 1     | First Chop     | easy       | 3     | 2             | C,H,O,P,A,T|
| 2     | Sharp Style    | easy       | 3     | 2             | S,L,A,Y,T  |
| 3     | Kitchen Talk   | easy       | 3     | 2             | S,T,E,W,A  |
| 4     | Glass House    | medium     | 4     | 3             | S,L,A,P,G  |
| 5     | Star Turn      | medium     | 4     | 3             | S,T,A,R    |
| 6     | Road Trip      | medium     | 5     | 4             | W,A,R,D,P  |
| 7     | Making Haste   | medium     | 5     | 4             | H,A,S,T,E  |
| 8     | Mail Call      | hard       | 5     | 4             | R,A,I,L,N,M|
| 9     | Flaming Words  | hard       | 6     | 5             | F,L,A,M,E  |
| 10    | Grand Finale   | hard       | 6     | 7             | B,L,A,S,T,R|

### 10D — Grid visual improvements ✅
1. ✅ Absolute positioning — blocked cells skipped entirely (floating crossword look)
2. ✅ MAX_CELL_SIZE increased 48→60px for larger, more prominent cells
3. ✅ Subtle shadows/elevation on all cells (iOS shadows, Android elevation)
4. ✅ Rounded corners (borderRadius.md) and thicker borders (1.5px)
5. ✅ TypeScript compiles cleanly, Metro bundler starts successfully

---

## Phase 11 — Layout Tuning, Hint Auto-Complete & UX Cleanup ✅ COMPLETE

### 11A — Shrink LetterCircle & reclaim grid space ✅
1. ✅ Reduced `CIRCLE_SIZE` 300→220, `TILE_SIZE` 54→46
2. ✅ `HIT_RADIUS` adjusted proportionally
3. ✅ ~80px reclaimed for grid area

### 11B — Remove placeholder text ✅
1. ✅ Removed "Swipe letters to form a word" from LetterCircle
2. ✅ Preview bar only renders when actively swiping (conditional render)
3. ✅ No wasted vertical space when idle

### 11C — Auto-complete words on hint & trigger level completion ✅
1. ✅ After filling a cell in `revealHint()`, scans all unsolved target words
2. ✅ If all cells of a word are filled, auto-adds to `solvedWords`
3. ✅ `isLevelComplete()` naturally triggers level completion modal
4. ✅ TypeScript compiles cleanly
