// scores can be negative and halves since a wrong answer costs half the
// points. JS prints a hyphen for negatives; use a true minus sign so the
// scoreboard matches the "−1.5" on the answer card
export function formatScore(score: number): string {
    return score < 0 ? `−${-score}` : `${score}`;
}
