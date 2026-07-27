import { Question, Category, Difficulty } from "./types";


// (helper) get questions of a given category
export function getByCategory(questions: Question[], category: Category): Question[] {
    return questions.filter((q) => q.category === category);
}

// (helper) get questions of a difficulty within a given set
export function filterByDifficulty(questions: Question[], difficulty: Difficulty): Question[] {
    return questions.filter((q) => q.difficulty === difficulty);
}