import { Category, Difficulty, Player, GameState } from "./types";
import { loadQuestions, getByCategory, filterByDifficulty, pickByCatDif } from "./question";


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
export function startGame(player_names: string[], winningScore: number): GameState {
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
        winningScore,
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


// function to check if game over - are there no questions left? 
// or a set point threshold reached by a player
export function isGameOver(state: GameState): boolean {
    if (state.remaining.length === 0) return true;

    const target = state.winningScore;
    if (target !== null && state.players.some((p) => p.score >= target)) {
        return true;
    }

    return false;
}



// -------- ACTION FUNCTIONS ----------


// add to the current players score the points of the current question
// triggered when add points button (+) on question card is pressed by users
// and end current players turn
export function givePoints(state: GameState): GameState {
    if (state.currentQuestion == null) return state;

    const points = state.currentQuestion.points;
    
    // make a new players array -- do not edit the existing state object 
    const players = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? { ...p, score: p.score + points } : p
    );

    return endTurn({ ...state, players });
}


// reduce the question's points from current player due to wrong answer
// triggered when deduct points button (-) on question card is pressed by users
// and end current players turn
export function deductPoints(state: GameState): GameState {
    if (state.currentQuestion == null) return state;

    const points = state.currentQuestion.points;
    
    const players = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? { ...p, score: p.score - points } : p
    );

    return endTurn({ ...state, players });
}


// spin wheel - pick and return a random category
export function spinWheel(state: GameState): Category | null {
    const available = getAvailableCategories(state);
    if (available.length === 0) return null;

    return available[Math.floor(Math.random() * available.length)];
}


// draw question by picking difficulty
export function drawQuestion(state: GameState, category: Category, difficulty: Difficulty): GameState {
    const question = pickByCatDif(state.remaining, category, difficulty)

    if (question == null) return state;

    return {
        ...state,
        currentQuestion: question,
        remaining: state.remaining.filter((q) => q.id !== question.id),
    };
}


// skip turn - no guess
export function skip(state: GameState): GameState {
    return endTurn(state);
}


// end turn - clear card away, pass to next player, check if game over
function endTurn(state: GameState): GameState {
    const nextPlayer = (state.currentPlayerIndex + 1) % state.players.length;

    return {
        ...state,
        currentQuestion: null,
        currentPlayerIndex: nextPlayer,
        status: isGameOver(state) ? "finished" : "playing",
    };
}



