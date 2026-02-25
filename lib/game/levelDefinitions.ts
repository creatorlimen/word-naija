/**
 * Word Naija - Level Configuration
 * Defines the words and themes for each level.
 * The LevelGenerator converts these lists into playable grids.
 */

interface WordDef {
    word: string;
    meaning: string;
}

interface LevelConfig {
    words: WordDef[];
    difficulty: "easy" | "medium" | "hard";
    title: string;
}

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
    1: {
        title: "Introduction",
        difficulty: "easy",
        words: [
            { word: "CHOP", meaning: "To eat or consume food (Nigerian slang)" },
            { word: "HOT", meaning: "Having a high temperature" },
            { word: "POT", meaning: "A container used for cooking" },
            { word: "TOP", meaning: "The highest point or surface" },
        ]
    },
    2: {
        title: "Family",
        difficulty: "easy",
        words: [
            { word: "MAMA", meaning: "Mother (informal)" },
            { word: "PAPA", meaning: "Father (informal)" },
            { word: "MAP", meaning: "A diagram of an area of land" },
            { word: "PAM", meaning: "A common Nigerian name" },
        ]
    },
    3: {
        title: "Vibes",
        difficulty: "easy",
        words: [
            { word: "PLAN", meaning: "A detailed proposal for doing something" },
            { word: "PLAY", meaning: "To engage in recreation or fun" },
            { word: "PAN", meaning: "A flat container used for cooking" },
            { word: "NAP", meaning: "A short sleep during the day" },
        ]
    },
    4: {
        title: "Street",
        difficulty: "medium",
        words: [
            { word: "MOTOR", meaning: "A vehicle, especially a car (Nigerian)" },
            { word: "ROOM", meaning: "A partitioned space in a building" },
            { word: "ROOT", meaning: "The base part of a plant" },
            { word: "ROT", meaning: "To decay or decompose" },
        ]
    },
    5: {
        title: "Market",
        difficulty: "medium",
        words: [
            { word: "SHINE", meaning: "To emit or reflect light" },
            { word: "SHE", meaning: "A female person" },
            { word: "HEN", meaning: "A female chicken" },
            { word: "HIS", meaning: "Belonging to a male person" },
        ]
    },
    6: {
        title: "Fruit",
        difficulty: "medium",
        words: [
            { word: "MANGO", meaning: "A sweet tropical fruit" },
            { word: "AMONG", meaning: "In the middle of; surrounded by" },
            { word: "MOAN", meaning: "To groan or lament" },
            { word: "MAN", meaning: "An adult male person" },
            { word: "AGO", meaning: "In the past; before now" },
        ]
    },
    7: {
        title: "Symbol",
        difficulty: "medium",
        words: [
            { word: "EAGLE", meaning: "A large bird of prey" },
            { word: "GLEE", meaning: "Great delight or joy" },
            { word: "GALE", meaning: "A very strong wind" },
            { word: "AGE", meaning: "The length of time lived" },
            { word: "LEG", meaning: "A limb used for walking" },
        ]
    },
    8: {
        title: "Nature",
        difficulty: "medium",
        words: [
            { word: "WATER", meaning: "A clear liquid essential for life" },
            { word: "RATE", meaning: "A measure or standard" },
            { word: "TEAR", meaning: "To pull apart; or a drop from the eye" },
            { word: "WEAR", meaning: "To have clothing on the body" },
            { word: "EAR", meaning: "The organ used for hearing" },
        ]
    },
    9: {
        title: "Together",
        difficulty: "medium",
        words: [
            { word: "UNITY", meaning: "The state of being united as one" },
            { word: "TINY", meaning: "Very small in size" },
            { word: "UNIT", meaning: "A single complete thing" },
            { word: "NUT", meaning: "A hard-shelled fruit or seed" },
            { word: "TIN", meaning: "A metal container" },
        ]
    },
    10: {
        title: "Energy",
        difficulty: "medium",
        words: [
            { word: "POWER", meaning: "The ability to do or act; strength" },
            { word: "ROPE", meaning: "Thick cord made of twisted strands" },
            { word: "PORE", meaning: "A tiny opening in skin or surface" },
            { word: "ROW", meaning: "A line of things side by side" },
            { word: "OWE", meaning: "To be indebted to someone" },
        ]
    },
    11: {
        title: "Parents",
        difficulty: "hard",
        words: [
            { word: "FATHER", meaning: "A male parent" },
            { word: "AFTER", meaning: "Following in time or place" },
            { word: "HEART", meaning: "The organ that pumps blood" },
            { word: "FEAR", meaning: "An unpleasant emotion of danger" },
            { word: "TEAR", meaning: "A drop from the eye when crying" },
            { word: "HAT", meaning: "A head covering" },
        ]
    },
    12: {
        title: "Expert",
        difficulty: "hard",
        words: [
            { word: "MASTER", meaning: "One who has control or expertise" },
            { word: "STEAM", meaning: "Water vapour from boiling" },
            { word: "SMART", meaning: "Intelligent or well-dressed" },
            { word: "TEAM", meaning: "A group working together" },
            { word: "STAR", meaning: "A luminous point in the sky" },
            { word: "ART", meaning: "Creative expression or skill" },
        ]
    },
    13: {
        title: "Road",
        difficulty: "hard",
        words: [
            { word: "STREET", meaning: "A public road in a city or town" },
            { word: "TREES", meaning: "Tall woody plants with branches" },
            { word: "TREE", meaning: "A tall woody plant" },
            { word: "REST", meaning: "To cease work or relax" },
            { word: "TEST", meaning: "An examination or trial" },
            { word: "SET", meaning: "To put in a particular place" },
        ]
    },
    14: {
        title: "Quiet",
        difficulty: "hard",
        words: [
            { word: "SILENT", meaning: "Making no sound" },
            { word: "LISTEN", meaning: "To pay attention to sound" },
            { word: "INLET", meaning: "A narrow body of water" },
            { word: "LENT", meaning: "Past tense of lend" },
            { word: "NET", meaning: "A mesh material for catching" },
            { word: "TEN", meaning: "The number after nine" },
        ]
    },
    15: {
        title: "Agriculture",
        difficulty: "hard",
        words: [
            { word: "FARMER", meaning: "One who works the land" },
            { word: "FRAME", meaning: "A rigid structure that surrounds" },
            { word: "RARE", meaning: "Not occurring very often" },
            { word: "FEAR", meaning: "An unpleasant feeling of danger" },
            { word: "ARM", meaning: "The upper limb of the body" },
            { word: "FAR", meaning: "At a great distance" },
        ]
    },
    16: {
        title: "Dawn",
        difficulty: "hard",
        words: [
            { word: "MORNING", meaning: "The early part of the day" },
            { word: "NORMS", meaning: "Standards of proper behaviour" },
            { word: "IRON", meaning: "A strong silvery metal" },
            { word: "RING", meaning: "A circular band worn on the finger" },
            { word: "GRIN", meaning: "A broad smile" },
            { word: "INN", meaning: "A small hotel or pub" },
        ]
    },
    17: {
        title: "Transport",
        difficulty: "hard",
        words: [
            { word: "STATION", meaning: "A place for trains or buses" },
            { word: "SATIN", meaning: "A smooth glossy fabric" },
            { word: "SAINT", meaning: "A holy or virtuous person" },
            { word: "ANTS", meaning: "Small industrious insects" },
            { word: "INTO", meaning: "Moving to the inside of" },
            { word: "TON", meaning: "A unit of weight (1000 kg)" },
        ]
    },
    18: {
        title: "Law",
        difficulty: "hard",
        words: [
            { word: "JUSTICE", meaning: "Fairness in treatment and rights" },
            { word: "JUICE", meaning: "Liquid extracted from fruit" },
            { word: "SUITE", meaning: "A set of connected rooms" },
            { word: "JUST", meaning: "Based on what is fair and right" },
            { word: "CUT", meaning: "To divide with a sharp instrument" },
            { word: "ICE", meaning: "Frozen water" },
        ]
    },
    19: {
        title: "Home",
        difficulty: "hard",
        words: [
            { word: "VILLAGE", meaning: "A small settlement in a rural area" },
            { word: "VILLA", meaning: "A large country house" },
            { word: "LIVE", meaning: "To be alive; to reside" },
            { word: "VILE", meaning: "Extremely unpleasant or bad" },
            { word: "AGE", meaning: "The length of time lived" },
            { word: "ALL", meaning: "Every one; the whole amount" },
        ]
    },
    20: {
        title: "Liberty",
        difficulty: "hard",
        words: [
            { word: "FREEDOM", meaning: "The state of being free" },
            { word: "NORM", meaning: "A standard or pattern of behaviour" },
            { word: "MODE", meaning: "A way or manner of doing" },
            { word: "DOME", meaning: "A rounded vault forming a roof" },
            { word: "FREE", meaning: "Not imprisoned or enslaved" },
            { word: "RED", meaning: "A colour at the end of the spectrum" },
        ]
    }
};

export const TOTAL_LEVELS = Object.keys(LEVEL_CONFIGS).length;
