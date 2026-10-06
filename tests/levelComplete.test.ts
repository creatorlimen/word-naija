import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import React, { type ReactNode } from "react";
import { loadLevel, TOTAL_LEVELS } from "../lib/game/levelLoader";

// Inspect the component's output and actions without a native device or renderer.
const modules = Module as unknown as {
  _load: (name: string, parent: unknown, isMain: boolean) => unknown;
};
const originalLoad = modules._load;
let LevelComplete: typeof import("../components/LevelComplete").default;
try {
  modules._load = (name, parent, isMain) => {
    if (name === "react-native") {
      return {
        View: "View", Text: "Text", Pressable: "Pressable",
        Modal: "Modal", ScrollView: "ScrollView",
        StyleSheet: { create: (styles: unknown) => styles, absoluteFill: {} },
      };
    }
    if (name === "expo-blur") return { BlurView: "BlurView" };
    if (name === "expo-linear-gradient") return { LinearGradient: "LinearGradient" };
    if (name === "@expo/vector-icons") return { Feather: "Feather" };
    return originalLoad.call(Module, name, parent, isMain);
  };
  LevelComplete = require("../components/LevelComplete").default;
} finally {
  modules._load = originalLoad;
}

type Props = { children?: ReactNode; onPress?: () => void; onRequestClose?: () => void };

function elements(node: ReactNode): React.ReactElement<Props>[] {
  if (!React.isValidElement<Props>(node)) return [];
  return [node, ...React.Children.toArray(node.props.children).flatMap(elements)];
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!React.isValidElement<Props>(node)) return "";
  return React.Children.toArray(node.props.children).map(textOf).join("");
}

async function screen(levelId: number, reward: number) {
  const level = await loadLevel(levelId);
  const calls = { next: 0, replay: 0, home: 0 };
  const tree = LevelComplete({
    visible: true, level,
    solvedWords: new Set([...level.targetWords.map((target) => target.word), "EXTRA"]),
    extraWords: new Set(["EXTRA"]), coinsEarned: reward,
    onNextLevel: () => { calls.next++; },
    onPlayAgain: () => { calls.replay++; },
    onGoHome: () => { calls.home++; },
  });
  const nodes = elements(tree);
  const press = (label: string) => {
    const button = nodes.find((node) => node.props.onPress && textOf(node) === label);
    assert.ok(button, `Missing button: ${label}`);
    button.props.onPress!();
  };
  return { tree, nodes, calls, press, level };
}

test("ordinary completion advances and counts target words separately from bonuses", async () => {
  const view = await screen(1, 20);
  assert.ok(textOf(view.tree).includes("Level Complete!"));
  assert.ok(textOf(view.tree).includes(`Words${view.level.targetWords.length}Bonus1Coins20`));
  view.press("Next Level →");
  assert.deepEqual(view.calls, { next: 1, replay: 0, home: 0 });
});

test("the final completion action returns home instead of requesting level 301", async () => {
  const view = await screen(TOTAL_LEVELS, 1515);
  assert.ok(textOf(view.tree).includes("All Levels Complete!"));
  assert.ok(!textOf(view.tree).includes("Next Level"));
  view.press("Back to Dashboard");
  assert.deepEqual(view.calls, { next: 0, replay: 0, home: 1 });
  view.tree.props.onRequestClose!();
  assert.equal(view.calls.home, 2);
});

test("replays display the supplied zero reward and remain playable", async () => {
  const view = await screen(TOTAL_LEVELS, 0);
  assert.ok(textOf(view.tree).includes("Coins0"));
  view.press("Play Again");
  assert.deepEqual(view.calls, { next: 0, replay: 1, home: 0 });
});
