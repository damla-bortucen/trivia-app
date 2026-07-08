import { Question, Category, Difficulty } from "./types";

import entertainment from "@/assets/questions/entertainment.json";
import generalKnowledge from "@/assets/questions/general-knowledge.json";
import geography from "@/assets/questions/geography.json";
import history from "@/assets/questions/history.json";
import scienceNature from "@/assets/questions/science-nature.json";
import sports from "@/assets/questions/sports.json";

const ALL_QUESTIONS: Question[] = [
    ...entertainment,
    ...generalKnowledge,
    ...geography,
    ...history,
    ...scienceNature,
    ...sports,
] as Question[];


// return all questions
export function loadQuestions(): Question[] {
    return ALL_QUESTIONS;
}

// (helper) get questions of a given category
export function getByCategory(questions: Question[], category: Category): Question[] {
    return questions.filter((q) => q.category === category);
}

// (helper) get questions of a difficulty within a given set
export function filterByDifficulty(questions: Question[], difficulty: Difficulty): Question[] {
    return questions.filter((q) => q.difficulty === difficulty);
}


// function to return a random question from CATEGORY C of DIFFICULTY D
export function pickByCatDif(category: Category, difficulty: Difficulty): Question | null {
    const cat_questions = getByCategory(ALL_QUESTIONS, category);
    const catdif_questions = filterByDifficulty(cat_questions, difficulty);

    const n = catdif_questions.length;
    if (n === 0) return null;
    const question = catdif_questions[Math.floor(Math.random() * n)];

    return question;
}