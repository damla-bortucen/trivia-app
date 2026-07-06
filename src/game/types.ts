export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category =
    | 'Entertainment'
    | 'General Knowledge'
    | 'Geography'
    | 'History'
    | 'Science and Nature'
    | 'Sports';

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
    questions: Question[];
    currentIndex: number;
    }