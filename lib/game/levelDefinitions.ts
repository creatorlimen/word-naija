/**
 * Word Naija - Level Configuration
 * Defines the words and themes for each level.
 * The LevelGenerator converts these lists into playable grids.
 */

interface LevelConfig {
    words: string[];
    difficulty: "easy" | "medium" | "hard";
    title: string;
}

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
    1: {
        title: "Introduction",
        difficulty: "easy",
        words: ["CHOP", "HOT", "POT", "TOP"]
    },
    2: {
        title: "Family",
        difficulty: "easy",
        words: ["MAMA", "PAPA", "MAP", "PAM"]
    },
    3: {
        title: "Vibes",
        difficulty: "easy",
        words: ["PLAY", "PAY", "LAP", "PAL"]
    },
    4: {
        title: "Street",
        difficulty: "medium",
        words: ["MOTOR", "ROOM", "ROOT", "ROT"]
    },
    5: {
        title: "Market",
        difficulty: "medium",
        words: ["SHINE", "SHE", "HEN", "HIS"]
    },
    // Add more levels here...
};

export const TOTAL_LEVELS = Object.keys(LEVEL_CONFIGS).length;
