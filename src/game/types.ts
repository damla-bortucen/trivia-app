export const ALL_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type Difficulty = typeof ALL_DIFFICULTIES[number];
//   Difficulty  ===  "easy" | "medium" | "hard"


// a category IS a pack - packs are the unit of content and the wheel's segments.
// the id is open-ended so generated packs can add themselves without a code change
export type Category = string;

export interface Pack {
    id: Category;
    name: string;
    description: string;
    color: string;
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
    remaining: Question[] // starts as all questions, reduces as game goes on
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