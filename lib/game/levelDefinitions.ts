/**
 * Word Naija - Level Configuration
 * Defines the words and themes for each level.
 * The LevelGenerator converts these lists into playable grids.
 *
 * ≥ 50 % of words in every level are Pidgin / Nigerian English.
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
    // ── Easy levels (1-7): 4 words, 3-5 letters ──────────────────────
    1: {
        title: "Chop Life",
        difficulty: "easy",
        words: [
            { word: "CHOP", meaning: "To eat or consume food" },
            { word: "OGA", meaning: "Boss or person in charge" },
            { word: "COP", meaning: "To seize or catch" },
            { word: "GAP", meaning: "An opening or space between" },
        ],
    },
    2: {
        title: "Family",
        difficulty: "easy",
        words: [
            { word: "MAMA", meaning: "Mother" },
            { word: "PAPA", meaning: "Father or grandfather" },
            { word: "BABA", meaning: "Father (Yoruba)" },
            { word: "BAM", meaning: "To strike with great force" },
        ],
    },
    3: {
        title: "Money Matters",
        difficulty: "easy",
        words: [
            { word: "SAPA", meaning: "Being broke financially" },
            { word: "PARA", meaning: "To get angry" },
            { word: "DASH", meaning: "A gift or bribe" },
            { word: "SABI", meaning: "To know or understand" },
        ],
    },
    4: {
        title: "Vibes",
        difficulty: "easy",
        words: [
            { word: "FLEX", meaning: "To show off or chill" },
            { word: "VIBE", meaning: "A feeling or atmosphere" },
            { word: "FINE", meaning: "Beautiful or alright" },
            { word: "LIFE", meaning: "Not at all; as in 'no life'" },
        ],
    },
    5: {
        title: "Greetings",
        difficulty: "easy",
        words: [
            { word: "ABEG", meaning: "Please; I beg you" },
            { word: "BABE", meaning: "Term of endearment between women" },
            { word: "GELE", meaning: "Yoruba female head wrap" },
            { word: "BALE", meaning: "To eat greedily" },
        ],
    },
    6: {
        title: "Chow Time",
        difficulty: "easy",
        words: [
            { word: "JARA", meaning: "A bonus or extra" },
            { word: "AKARA", meaning: "Fried bean cake" },
            { word: "SUYA", meaning: "Grilled spiced meat" },
            { word: "YARN", meaning: "To talk or tell stories" },
        ],
    },
    7: {
        title: "Street Talk",
        difficulty: "easy",
        words: [
            { word: "KOLO", meaning: "To go crazy" },
            { word: "FORM", meaning: "To pretend or show off" },
            { word: "COOL", meaning: "Calm or impressive" },
            { word: "ROOM", meaning: "A space within a building" },
        ],
    },

    // ── Medium levels (8-14): 5 words, 3-7 letters ───────────────────
    8: {
        title: "Motor Park",
        difficulty: "medium",
        words: [
            { word: "DANFO", meaning: "A yellow commercial bus (Lagos)" },
            { word: "OKADA", meaning: "Motorcycle taxi" },
            { word: "FADA", meaning: "Father" },
            { word: "KANDA", meaning: "Peelings, hide, or skin" },
            { word: "ODA", meaning: "Other" },
        ],
    },
    9: {
        title: "Market Day",
        difficulty: "medium",
        words: [
            { word: "WAHALA", meaning: "Trouble or problem" },
            { word: "PALAVA", meaning: "Problem or trouble" },
            { word: "WAKA", meaning: "To walk or travel" },
            { word: "ALABA", meaning: "Famous Lagos electronics market" },
            { word: "PARA", meaning: "To get angry" },
        ],
    },
    10: {
        title: "Owambe",
        difficulty: "medium",
        words: [
            { word: "AMALA", meaning: "Yam flour dough served with soup" },
            { word: "AGBO", meaning: "Herbal medicine concoction" },
            { word: "BOLE", meaning: "Roasted plantain" },
            { word: "MANGO", meaning: "A sweet tropical fruit" },
            { word: "LAMB", meaning: "The young of a sheep" },
        ],
    },
    11: {
        title: "Hustle",
        difficulty: "medium",
        words: [
            { word: "NAIJA", meaning: "Nigeria or Nigerian" },
            { word: "NAIRA", meaning: "Nigerian currency" },
            { word: "SHINE", meaning: "To look well or glamorous" },
            { word: "RAIN", meaning: "Water falling from clouds" },
            { word: "GAIN", meaning: "To obtain or increase" },
        ],
    },
    12: {
        title: "Gbedu",
        difficulty: "medium",
        words: [
            { word: "ARIYA", meaning: "A good time" },
            { word: "FAAJI", meaning: "The pleasure of having a good time" },
            { word: "JARA", meaning: "A bonus or extra" },
            { word: "AFAR", meaning: "How are you?" },
            { word: "FAIRY", meaning: "A chicken-hearted person; a fool" },
        ],
    },
    13: {
        title: "Pepper Dem",
        difficulty: "medium",
        words: [
            { word: "PEPPER", meaning: "To show off or stunt" },
            { word: "SHAKARA", meaning: "Showing off or forming" },
            { word: "SPARK", meaning: "To lose one's temper" },
            { word: "PRESS", meaning: "To dominate; or to iron clothes" },
            { word: "PARSE", meaning: "To break down into parts" },
        ],
    },
    14: {
        title: "Tori",
        difficulty: "medium",
        words: [
            { word: "AMEBO", meaning: "A gossip or talebearer" },
            { word: "MOTOR", meaning: "A vehicle or car" },
            { word: "TORI", meaning: "An interesting or humorous story" },
            { word: "TRIBE", meaning: "A family or ethnic group" },
            { word: "ORBIT", meaning: "A circular path" },
        ],
    },

    // ── Hard levels (15-20): 5 words, 4-7 letters ────────────────────
    15: {
        title: "Aso Rock",
        difficulty: "hard",
        words: [
            { word: "AGBADA", meaning: "Large traditional garment worn by men" },
            { word: "OYINBO", meaning: "A Caucasian person; big English words" },
            { word: "BINGO", meaning: "Dog; or cooked dog meat" },
            { word: "GRIND", meaning: "To reduce to powder by friction" },
            { word: "DANDY", meaning: "One who dresses with flair" },
        ],
    },
    16: {
        title: "Mama Put",
        difficulty: "hard",
        words: [
            { word: "AKARA", meaning: "Fried bean cake" },
            { word: "GARRI", meaning: "Dried cassava flour" },
            { word: "AGIDI", meaning: "Mashed rice cake" },
            { word: "DRAG", meaning: "To pull along with effort" },
            { word: "ARID", meaning: "Extremely dry" },
        ],
    },
    17: {
        title: "Japa Season",
        difficulty: "hard",
        words: [
            { word: "AJEBOTA", meaning: "Rich spoilt kid; one used to butter" },
            { word: "JOLLOF", meaning: "Popular West African rice dish" },
            { word: "ABOKI", meaning: "A naive or clueless person" },
            { word: "FABLE", meaning: "A tale meant to teach a lesson" },
            { word: "BLOAT", meaning: "To swell up" },
        ],
    },
    18: {
        title: "Campus Life",
        difficulty: "hard",
        words: [
            { word: "ACADA", meaning: "An intellectual or bookworm" },
            { word: "MATRIC", meaning: "University matriculation" },
            { word: "CREDIT", meaning: "Airtime voucher for a phone" },
            { word: "ACATA", meaning: "USA/UK; or someone living abroad" },
            { word: "CRAM", meaning: "To memorise intensely" },
        ],
    },
    19: {
        title: "Big Man Ting",
        difficulty: "hard",
        words: [
            { word: "AGBERO", meaning: "Labourer who carries heavy goods" },
            { word: "GINGER", meaning: "To be pumped up or motivated" },
            { word: "ARISTO", meaning: "A sugar daddy" },
            { word: "OGBENI", meaning: "Mister (Yoruba)" },
            { word: "REIGN", meaning: "In vogue; trending" },
        ],
    },
    20: {
        title: "Legend",
        difficulty: "hard",
        words: [
            { word: "CORRECT", meaning: "Very good; e.g. 'na correct guy'" },
            { word: "COLLECT", meaning: "To get punished or scolded" },
            { word: "TOKUNBO", meaning: "Second-hand goods; child born overseas" },
            { word: "CONTROL", meaning: "To speak to or influence someone" },
            { word: "CONTOUR", meaning: "The outline of a figure or shape" },
        ],
    },
};

export const TOTAL_LEVELS = Object.keys(LEVEL_CONFIGS).length;
