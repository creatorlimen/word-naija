import { generateLevelFromWords } from "./lib/game/levelGenerator";
import { Level, TargetWord } from "./lib/game/types";

const words = ["SHINE", "SHE", "HEN", "HIS"];
const level: Level = generateLevelFromWords(5, words, "medium");

console.log("Placed words:", level.targetWords.map((t: TargetWord) => t.word));
console.log("Available letters:", level.letters);
console.log("Grid Mask:");
level.mask.forEach((row: boolean[]) => console.log(row.map((b: boolean) => b ? "X" : ".").join("")));
