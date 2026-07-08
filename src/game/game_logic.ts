import { Category, Difficulty, Player, GameState } from "./types";
import { loadQuestions, getByCategory, filterByDifficulty } from "./question";


const ALL_CATEGORIES: Category[] = [
    "Entertainment",
    "General Knowledge",
    "Geography",
    "History",
    "Science and Nature",
    "Sports",
];
const ALL_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];



// return initial game state
export function startGame(player_names: string[]): GameState {
    const players: Player[] = player_names.map((name, i) => ({
        id: `player-${i}`,
        name,
        score: 0,
    }));

    return {
        status: "playing",
        players,
        currentPlayerIndex: 0,
        remaining: loadQuestions(),
        currentQuestion: null,
    };
}


// -------- READ FUNCTIONS ----------

export function getCurrentPlayer(state: GameState): Player {
    return state.players[state.currentPlayerIndex];
}


// (helper) get available categories for the "wheel" (have at least one question left)
export function getAvailableCategories(state: GameState): Category[] {
    return ALL_CATEGORIES.filter(
        (c) => getByCategory(state.remaining, c).length > 0
    );
}


// (helper) get available difficulties within a cateogory (have at least one question left)
export function getAvailableDifficulties(state: GameState, category: Category): Difficulty[] {
    const inCategory = getByCategory(state.remaining, category);

    return ALL_DIFFICULTIES.filter(
        (d) => filterByDifficulty(inCategory, d).length > 0
    );
}


// function to check if game over - either no questions left 
// or a set point threshold reached by a player



// -------- ACTION FUNCTIONS ----------


// add to the current players score the points of the current question
// triggered when add points button on question card is pressed by users
export function givePoints(state: GameState) {
    if (state.currentQuestion == null) {
        return
    }
    state.players[state.currentPlayerIndex].score += state.currentQuestion.points
}


// minus points


// spin wheel


// draw question by picking difficulty


// skip turn - no guess


// end turn - clear card away, pass to ext player, check if game over 
// and remove current question from question bank



