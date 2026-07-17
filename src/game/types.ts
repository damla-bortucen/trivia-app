export const ALL_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type Difficulty = typeof ALL_DIFFICULTIES[number];
//   Difficulty  ===  "easy" | "medium" | "hard"


export const ALL_CATEGORIES = [
    "Entertainment",
    "General Knowledge",
    "Geography",
    "History",
    "Science and Nature",
    "Sports",
] as const;

export type Category = typeof ALL_CATEGORIES[number];

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
    categories: Category[];
    }

export type StartValues = {
    names: string[];
    winningScore: number;
    categories: Category[];
};