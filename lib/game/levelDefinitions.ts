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
    6: {
        title: "Fruit",
        difficulty: "medium",
        words: ["MANGO", "AMONG", "MOAN", "MAN", "AGO"]
    },
    7: {
        title: "Symbol",
        difficulty: "medium",
        words: ["EAGLE", "GLEE", "GALE", "AGE", "LEG"]
    },
    8: {
        title: "Nature",
        difficulty: "medium",
        words: ["WATER", "RATE", "TEAR", "WEAR", "EAR"]
    },
    9: {
        title: "Together",
        difficulty: "medium",
        words: ["UNITY", "TINY", "UNIT", "NUT", "TIN"]
    },
    10: {
        title: "Energy",
        difficulty: "medium",
        words: ["POWER", "ROPE", "PORE", "ROW", "OWE"]
    },
    11: {
        title: "Parents",
        difficulty: "hard",
        words: ["FATHER", "AFTER", "HEART", "FEAR", "TEAR", "HAT"]
    },
    12: {
        title: "Expert",
        difficulty: "hard",
        words: ["MASTER", "STEAM", "SMART", "TEAM", "STAR", "ART"]
    },
    13: {
        title: "Road",
        difficulty: "hard",
        words: ["STREET", "TREES", "TREE", "REST", "TEST", "SET"]
    },
    14: {
        title: "Quiet",
        difficulty: "hard",
        words: ["SILENT", "LISTEN", "INLET", "LENT", "NET", "SIT"]
    },
    15: {
        title: "Agriculture",
        difficulty: "hard",
        words: ["FARMER", "FRAME", "RARE", "FEAR", "ARM", "FAR"]
    },
    16: {
        title: "Dawn",
        difficulty: "hard",
        words: ["MORNING", "NORMS", "IRON", "RING", "GRIN", "INN"]
    },
    17: {
        title: "Transport",
        difficulty: "hard",
        words: ["STATION", "SATIN", "SAINT", "ANTS", "INTO", "TON"]
    },
    18: {
        title: "Law",
        difficulty: "hard",
        words: ["JUSTICE", "JUICE", "SUITE", "JUST", "CUT", "ICE"]
    },
    19: {
        title: "Home",
        difficulty: "hard",
        words: ["VILLAGE", "VILLA", "LIVE", "VILE", "AGE", "ALL"]
    },
    20: {
        title: "Liberty",
        difficulty: "hard",
        words: ["FREEDOM", "MODE", "DOME", "FREE", "FORM", "RED"]
    }
};

export const TOTAL_LEVELS = Object.keys(LEVEL_CONFIGS).length;
