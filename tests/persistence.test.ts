import assert from "node:assert/strict";
import Module from "node:module";
import test from "node:test";
import { getDefaultProgress } from "../lib/game/progress";

const modules = Module as unknown as { _load: (...args: any[]) => any };
const original = modules._load;
let value: string | null = null;
let read = async (): Promise<string | null> => value;
let write: (json: string) => Promise<void> = async (json) => { value = json; };
let persistence: typeof import("../lib/game/persistence");
try {
  modules._load = (name, ...args) => {
    if (name === "@react-native-async-storage/async-storage") return {
      getItem: async () => read(),
      setItem: async (_key: string, json: string) => write(json),
      removeItem: async () => { value = null; },
    };
    return original.call(Module, name, ...args);
  };
  persistence = require("../lib/game/persistence");
} finally {
  modules._load = original;
}

const tick = () => new Promise<void>((resolve) => setImmediate(resolve));

test("writes stay ordered and loading waits for the latest pending save", async () => {
  const pending: Array<() => void> = [];
  const started: number[] = [];
  write = (json) => new Promise((resolve) => {
    started.push(JSON.parse(json).coins);
    pending.push(() => { value = json; resolve(); });
  });
  const first = persistence.saveProgress({ ...getDefaultProgress(), coins: 10 });
  const second = persistence.saveProgress({ ...getDefaultProgress(), coins: 20 });
  let loaded = false;
  const loading = persistence.loadProgress().then((result) => { loaded = true; return result; });
  await tick();
  assert.deepEqual(started, [10]);
  assert.equal(loaded, false);
  pending.shift()!();
  await tick();
  assert.deepEqual(started, [10, 20]);
  assert.equal(loaded, false);
  pending.shift()!();
  await Promise.all([first, second]);
  assert.equal((await loading)?.coins, 20);
});

test("a failed write does not block later saves or clearing progress", async (context) => {
  const warning = context.mock.method(console, "warn", () => {});
  write = async () => { throw new Error("Simulated storage error"); };
  await persistence.saveProgress({ ...getDefaultProgress(), coins: 30 });
  assert.equal(warning.mock.callCount(), 1);
  write = async (json) => { value = json; };
  await persistence.saveProgress({ ...getDefaultProgress(), coins: 40 });
  assert.equal((await persistence.loadProgress())?.coins, 40);
  await persistence.clearProgress();
  assert.equal(await persistence.loadProgress(), null);
});

test("unreadable saves raise an error instead of becoming new-game defaults", async (context) => {
  context.mock.method(console, "warn", () => {});
  read = async () => { throw new Error("Simulated read failure"); };
  await assert.rejects(persistence.loadProgress(), /Could not load saved progress/);
  read = async () => "{broken-json";
  await assert.rejects(persistence.loadProgress(), /Could not load saved progress/);
  read = async () => value;
});
