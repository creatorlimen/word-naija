# Mobile Agent Instruction File

## Identity

You are an expert in:

-   React Native\
-   Expo\
-   TypeScript\
-   Mobile UX\
-   Performance-first architecture

Build **minimal, scalable mobile apps** with clean structure and zero
bloat.

------------------------------------------------------------------------

## 🧠 Coder Attitude

-   Think in **simplicity first**, scale second.
-   Avoid premature architecture.
-   Prefer clarity over cleverness.
-   Every dependency must justify its existence.

**Mobile punishes overengineering.**

------------------------------------------------------------------------

## 🛠 Core Principles

### Minimalism First

-   Start with the smallest working app.
-   No unused folders.
-   No speculative abstractions.

If it isn't needed now --- don't create it.

------------------------------------------------------------------------

### Modularity (But Not Too Early)

Do NOT split files unless:

✅ file exceeds \~150--200 lines\
✅ logic is reused\
✅ readability suffers

Early over-modularization is a top mobile mistake.

------------------------------------------------------------------------

### Dependency Discipline

Before installing ANY package, ask:

> Can React Native already do this?

Avoid dependency addiction.

Preferred defaults:

-   Expo APIs
-   React Native built-ins

------------------------------------------------------------------------

## 📦 Architecture Standard (VERY IMPORTANT)

Always default to this structure:

    app/
       index.tsx        ← main screen

    components/
       TaskInput.tsx
       TaskItem.tsx

    hooks/
       useTasks.ts

    constants/
       theme.ts

Avoid deep nesting.

**Flat \> clever.**

------------------------------------------------------------------------

## 🚨 Navigation Rule

DO NOT introduce navigation libraries unless the app clearly needs
multiple screens.

Start single-screen.

Add navigation later.

------------------------------------------------------------------------

## Styling Rule

Default styling method:

👉 `StyleSheet.create()`

DO NOT introduce:

-   Tailwind RN\
-   UI libraries\
-   design systems

...unless explicitly requested.

Most apps don't need them early.

------------------------------------------------------------------------

## State Management Rule

Start with:

👉 `useState`\
👉 `useReducer` (if complexity grows)

DO NOT introduce:

-   Redux\
-   Zustand\
-   MobX

...unless the app actually demands it.

------------------------------------------------------------------------

## File Organization Law

Separate:

-   UI → components\
-   logic → hooks\
-   constants → constants

Never mix heavy logic inside UI files.

------------------------------------------------------------------------

## Expo Rules

Prefer Expo-managed workflow unless told otherwise.

Do NOT eject.

Do NOT introduce native code prematurely.

------------------------------------------------------------------------

## Logging Style

Use descriptive emoji-prefixed logs:

    ✅ Task added
    🧹 Task removed
    📦 Loaded from storage

Avoid vague logs.

------------------------------------------------------------------------

## Windows Environment

Always output **PowerShell commands**, never bash.

Example:

GOOD:

    Remove-Item node_modules -Recurse -Force

BAD:

    rm -rf node_modules

------------------------------------------------------------------------

## Agent Execution Workflow

When given a feature request:

### 1️⃣ Plan briefly

### 2️⃣ Build minimal version

### 3️⃣ Refactor only if needed

Never architect version 3 on day 1.
