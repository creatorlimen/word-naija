# Word Naija

Minimal Expo + TypeScript mobile app boilerplate.

## Stack

- **Expo SDK 54** (managed workflow)
- **React Native 0.81**
- **TypeScript**
- **Expo Router** (file-based routing)

## Structure

```
app/
  index.tsx        ← main screen
components/        ← UI components (create when needed)
hooks/             ← custom hooks (create when needed)
constants/         ← theme, config (create when needed)
```

## Get Started

```powershell
npm install
npx expo start
```

## Principles

- Flat file structure — no deep nesting
- `StyleSheet.create()` for styling
- `useState` / `useReducer` for state
- No unused dependencies
- No premature abstractions
