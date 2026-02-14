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
