# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Product:** Word Naija  
**Version:** V1 (MVP)  
**Platform:** Android (React Native)  
**Status:** Specification-ready  

---

## 1. Product Overview

### 1.1 Purpose
Word Naija is a culturally localized word puzzle game that blends classic word gameplay with Nigerian language, slang, and everyday expressions.

### 1.2 Target User
- Nigerian users (primary)
- Casual mobile gamers
- Users familiar with word games but seeking local relevance

### 1.3 Core Value Proposition
“A familiar word puzzle experience with a distinctly Nigerian voice.”

---

## 2. Goals & Non-Goals

### 2.1 Goals (V1)
- Deliver a stable, offline-first word puzzle game
- Introduce Nigerian words in a playful, non-educational manner
- Ship a minimal, polished MVP suitable for Play Store approval

### 2.2 Non-Goals (Explicitly Out of Scope)
- Multiplayer or social features
- Time-based gameplay
- User accounts or authentication
- In-app purchases beyond coins
- Procedural or AI-generated content
- Leaderboards or rankings

---

## 3. Core Gameplay Requirements

### 3.1 Gameplay Loop
1. User opens app
2. User selects letters to form words
3. Correct words fill the grid
4. All target words solved → level complete
5. Coins awarded
6. User proceeds to next level

### 3.2 Input Mechanics
- Letters selectable via tap or drag
- Selection order determines attempted word
- Releasing selection submits the word

### 3.3 Word Validation Rules
- Case-insensitive
- Normalized before validation
- Must exist in dictionary
- Must be listed in level targets to affect grid

### 3.4 Extra Words
- Optional per level
- Must exist in dictionary
- Award coins once per unique word
- Do not affect grid completion

---

## 4. Dictionary & Word Curation

### 4.1 Dictionary Structure
Each dictionary entry must include:
- Canonical word
- Optional variants
- Short meaning
- Language tag (metadata only)
- Difficulty tag

### 4.2 Validation Logic
- Variants map to canonical word
- Canonical word used for scoring and display
- Dictionary is static at runtime

### 4.3 Content Rules
- No profanity
- No explicit content
- Neutral, informational meanings only
- Nigerian slang, food, culture encouraged

---

## 5. Level Design & Data Schema

### 5.1 Level Requirements
Each level must define:
- Unique levelId
- Grid size (rows, cols)
- Playable cell mask
- Letter pool
- Target words with coordinates

### 5.2 Solvability Rules
- All target words must be solvable
- Only provided letters may be used
- Grid layout is deterministic

### 5.3 Error Handling
- Malformed levels are skipped
- App must not crash due to bad data

---

## 6. Progression & Difficulty

### 6.1 Difficulty Ramp
- Early levels: short, common words
- Later levels: longer, culturally deeper words

Difficulty controlled via:
- Word length
- Grid complexity
- Letter reuse

### 6.2 Progress Persistence
- Completed levels saved locally
- Coins saved locally
- Progress survives app restarts

---

## 7. Hints & Economy

### 7.1 Coins
Earned via:
- Level completion
- Extra words

Stored locally.

### 7.2 Hints
- Cost coins
- Reveal one unresolved element
- No hint spam or forced usage

---

## 8. First-Time User Experience (FTUE)

### 8.1 FTUE Principles
- No friction
- No forced tutorial
- No ads or monetization prompts
- Immediate gameplay

### 8.2 FTUE Flow
- App launch
- Skippable welcome modal
- Level 001 loads immediately
- Single-line interaction tip
- First word success feedback
- Optional meaning reveal
- Level completion

### 8.3 FTUE Constraints
- Must complete in ≤ 30 seconds
- Must expose Nigerian flavor
- Must be skippable at all times

---

## 9. UX & UI Guidelines

### 9.1 Visual Tone
- Warm colors
- Clean typography
- Subtle animations
- Friendly feedback

### 9.2 Accessibility
- Large touch targets
- Clear contrast
- No time pressure

---

## 10. Technical Requirements

### 10.1 Platform
- Android
- Built with React Native
- Developed in VSCode

### 10.2 Architecture
- Offline-first
- Local JSON and CSV assets
- No required backend for V1

### 10.3 Stability
- Deterministic behavior
- Graceful error handling
- No runtime crashes from content

---

## 11. Play Store Compliance

### 11.1 Differentiation
- Localized dictionary
- Cultural flavor
- Original branding

### 11.2 Compliance Safeguards
- No trademarked content
- No misleading metadata
- No deceptive monetization
- Clear content ownership

---

## 12. Success Criteria (V1)
- App installs and runs without crashes
- First-time user completes Level 001
- User understands core mechanic without tutorial
- Play Store approval without rejection

---

# Appendix A: Canonical Examples (Normative)

## A1. Canonical Dictionary Example (words.csv)

```csv
word,variants,meaning,language_tag,difficulty,notes
wahala,,Trouble; problem or stress,ng_en,easy,Very common
chop,,To eat or consume food,pidgin,easy,Core slang
gist,,Casual talk or gossip,ng_en,easy,
abeg,,Please; I beg you,pidgin,easy,
oga,,Boss; person in charge,ng_en,easy,
sharp-sharp,sharpsharp,Quickly; without delay,pidgin,medium,Hyphen normalized
sabi,,To know or understand,pidgin,medium,
jollof,,Popular West African rice dish,ng_en,medium,
suya,,Spicy grilled meat snack,ng_en,medium,
owambe,,Big party or celebration,ng_en,medium,
keke,,Tricycle taxi,ng_en,easy,
akara,,Fried bean cake,ng_en,medium,
oyinbo,,Foreigner; white person,ng_en,medium,
agbada,,Traditional flowing robe,ng_en,hard,
balogun,,Market leader or title,ng_en,hard,
kunu,,Millet-based drink,ng_en,medium,
banga,,Palm fruit soup,ng_en,hard,
omo,,Child; young person,ng_en,easy,
mama,,Mother; respectful term,ng_en,easy,
ekene,,Praise or thanks,igbo,hard,Igbo-origin word
```

## A2. Canonical Level Examples (levels/*.json)

### Level 001 — Intro Level (FTUE-safe)

```json
{
  "levelId": 1,
  "title": "First Gist",
  "difficulty": "easy",
  "rows": 4,
  "cols": 4,
  "mask": [
    [1,1,1,0],
    [0,1,1,1],
    [0,0,1,1],
    [0,0,0,1]
  ],
  "letters": ["C","H","O","P","G","I","S","T"],
  "targetWords": [
    { "word": "CHOP", "coords": [[0,0],[0,1],[0,2],[1,2]] },
    { "word": "GIST", "coords": [[1,1],[1,2],[1,3],[2,3]] }
  ],
  "extraWordsAllowed": true,
  "flavorWords": [
    { "word": "CHOP", "meaning": "To eat or consume food" }
  ]
}
```

### Level 006 — Early Progression

```json
{
  "levelId": 6,
  "title": "No Wahala",
  "difficulty": "easy",
  "rows": 5,
  "cols": 5,
  "mask": [
    [1,1,1,1,0],
    [0,1,1,1,1],
    [0,0,1,1,1],
    [1,1,1,0,0],
    [0,0,1,1,0]
  ],
  "letters": ["W","A","H","A","L","A","S","A","B","I"],
  "targetWords": [
    { "word": "WAHALA", "coords": [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3]] },
    { "word": "SABI", "coords": [[3,0],[3,1],[3,2],[4,2]] }
  ],
  "extraWordsAllowed": true,
  "flavorWords": [
    { "word": "WAHALA", "meaning": "Trouble or stress" }
  ]
}
```

## A3. Canonical FTUE Flow (30-Second Script)

**0–2s:** Launch – Logo + warm color background  
**2–6s:** Welcome modal (skippable)  
**6–10s:** Level 001 loads immediately, 1-line tip  
**10–18s:** First successful word (CHOP)  
**18–24s:** Optional meaning reveal  
**24–30s:** Level completion & forward momentum  

_No ads. No ratings. No accounts._


---

# ADDENDUM — V1 FEATURE BOUNDARY (LOCKED FOR SHIPPING)

This section clarifies the **exact shipping boundary** to ensure the MVP ships fast while maintaining a premium feel.

## MUST SHIP (Non-Negotiable)

### Core Gameplay
- Swipe-to-select letters
- Crossword-style grid filling
- Correct-word validation
- Level completion flow
- Extra word detection

### Premium Feel (Low Engineering Cost, High Perceived Quality)
- Smooth tile animations (150–250ms)
- Subtle success vibration (optional)
- Clean sound effects (tap, success, level complete)
- Polished color system (warm Nigerian palette)
- Consistent typography

### Essential Controls
- Shuffle letters button
- Hint button (coin cost)
- Coins counter
- Settings (sound on/off only)

### Content
- Minimum 120 handcrafted levels
- Fully curated Nigerian dictionary
- Meaning reveal for flavor words

### Persistence
- Local save for:
  - Level progress
  - Coins
  - Settings

---

## MUST NOT SHIP (Hard Boundary)

These are intentionally excluded to protect timeline and reduce engineering risk:

- Daily puzzles
- Leaderboards
- Social features
- Friends
- Themes / skins
- Complex achievements
- Timers
- Lives / energy systems
- Backend services
- User accounts
- Push notifications
- Advanced analytics

---

## OPTIONAL (Ship Only If Zero Risk)

- Very light haptics
- One-step onboarding illustration
- Micro celebration animation on level completion

If any optional feature threatens schedule → **cut immediately**.