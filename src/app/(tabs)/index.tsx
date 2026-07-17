import { GameState, StartValues } from "@/game/types";
import { useState } from "react";

import { QuestionCard } from "@/components/question_card";
import { Results } from "@/components/results_screen";
import { Start } from "@/components/start_screen";
import { GameScreen } from "@/components/game_screen";

export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [prefill, setPrefill] = useState<StartValues | null>(null);


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


  // --------- Start Screen -----------
  if (game == null) {
    return <Start onStart={setGame} initial={prefill} />;
  }

  // --------- Results Screen -----------
  if (game.status === "finished") {
    return <Results game={game} onPlayAgain={playAgain} onRematch={startRematch} />;
  }

  // --------- Game Screen -----------
  if (game.currentQuestion) {
    return <QuestionCard game={game} onFinishTurn={setGame} />;
  }

  return <GameScreen game={game} onDraw={setGame} />;


}
