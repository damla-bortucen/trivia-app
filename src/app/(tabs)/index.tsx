import { GameState, StartValues } from "@/game/types";
import { useState } from "react";

import { QuestionCard } from "@/components/question_card";
import { Results } from "@/components/results_screen";
import { Start } from "@/components/start_screen";
import { GameScreen, Undo } from "@/components/game_screen";
import { ResumePrompt } from "@/components/resume_prompt";
import { loadGame, saveGame, clearGame } from "@/game/storage"

export default function Index() {
  // what was on disk at launch. kept out of game so the player is asked
  // rather than dropped straight back into a match
  // react only invokes loadGame() when it needs an initial value
  const [saved, setSaved] = useState<GameState | null>(() => loadGame());
  const [game, setGameState] = useState<GameState | null>(null);
  const [prefill, setPrefill] = useState<StartValues | null>(null);

  // the state just before the last answer was marked, so a mis-tap can be
  // taken back. lives in memory only - an undo doesn't survive a relaunch
  const [lastTurn, setLastTurn] = useState<GameState | null>(null);
  // true when the question card is reopened by an undo, so it shows the answer
  const [reopened, setReopened] = useState(false);

  // wrap setGame so every update persists or clears
  const setGame = (next: GameState | null) => {
    setGameState(next);
    if (next == null) setLastTurn(null);   // leaving the game drops the undo
    if (next == null || next.status === "finished") {
      clearGame();
    } else {
      saveGame(next);
    }
  };


  // marking an answer remembers where we were before it
  const finishTurn = (next: GameState) => {
    setLastTurn(game);
    setReopened(false);
    setGame(next);
  };

  // drawing the next question commits the last turn for good
  const startQuestion = (next: GameState) => {
    setLastTurn(null);
    setReopened(false);
    setGame(next);
  };

  const undoTurn = () => {
    if (lastTurn == null) return;
    setGame(lastTurn);
    setLastTurn(null);
    setReopened(true);
  };

  const undo: Undo | null = lastTurn && {
    name: lastTurn.players[lastTurn.currentPlayerIndex].name,
    onPress: undoTurn,
  };


  const continueSaved = () => {
    setGameState(saved);
    setSaved(null);
  }

  const discardSaved = () => {
    clearGame();
    setSaved(null);
  }


  const startRematch = () => {
    if (game == null) return;
    setPrefill({
      names: game.players.map((p) => p.name),
      winningScore: game.winningScore,
      categories: game.categories,
    });
    setGame(null);
  };

  // back to the start screen - new game
  const playAgain = () => {
    setGame(null);
    setPrefill(null);
  };

  // quit mid-game - abandon and return to a clean start screen
  // deletes saved game
  const quitGame = () => {
    setGame(null);
    setPrefill(null);
  };


  // --------- Start Screen -----------
  if (game == null) {
      return (
          <>
            <Start onStart={setGame} initial={prefill} />
              {saved != null && (
                  <ResumePrompt
                      game={saved}
                      onContinue={continueSaved}
                      onNew={discardSaved}
                  />
              )}
          </>
      );
  }

  // --------- Results Screen -----------
  if (game.status === "finished") {
    return <Results game={game} onPlayAgain={playAgain} onRematch={startRematch} undo={undo} />;
  }

  // --------- Game Screen -----------
  if (game.currentQuestion) {
    return <QuestionCard game={game} onFinishTurn={finishTurn} onQuit={quitGame} startRevealed={reopened} />;
  }

  return <GameScreen game={game} onDraw={startQuestion} onQuit={quitGame} undo={undo} />;


}
