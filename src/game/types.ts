export const ALL_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type Difficulty = typeof ALL_DIFFICULTIES[number];
//   Difficulty  ===  "easy" | "medium" | "hard"

export const ALL_SOURCES = ["opentdb", "generated"] as const;

export type Source = typeof ALL_SOURCES[number];

// a category is a pack
export type Category = string;

export interface Pack {
    id: Category;
    name: string;
    description: string;
    color: string;
    source: Source;
    questions: Question[];
}

export interface Question {
    id: string;
    category: Category;
    question: string;
    answer: string;
    difficulty: Difficulty;
    points: number;
}

export interface Player {
    id: string;
    name: string;
    score: number;
}

export type GameStatus = "start" | "playing" | "finished";

export interface GameState {
    status: GameStatus;
    players: Player[];
    askedIds: string[]; // questions already drawn this game
    currentQuestion: Question | null;
    currentPlayerIndex: number;
    winningScore: number;
    categories: Category[]; // holds pack ids
    }

export type StartValues = {
    names: string[];
    winningScore: number;
    categories: Category[];
};