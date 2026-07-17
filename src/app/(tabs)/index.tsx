import {
  drawQuestion,
  getAvailableDifficulties,
  spinWheel,
} from "@/game/game_logic";
import { Category, GameState, StartValues } from "@/game/types";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, font, spacing, categoryColors } from "@/ui/theme";

import { QuestionCard } from "@/components/question_card";
import { Results } from "@/components/results_screen";
import { Scoreboard } from "@/components/scoreboard";
import { Start } from "@/components/start_screen";
import { Button } from "@/components/button"

export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [category, setCategory] = useState<Category | null>(null);
  const [prefill, setPrefill] = useState<StartValues | null>(null);


  // ends the turn
  const finishTurn = (next: GameState) => {
    setGame(next);
    setCategory(null);
  };

  const startRematch = () => {
    if (game == null) return;
    setPrefill({
      names: game.players.map((p) => p.name),
      winningScore: game.winningScore,
      categories: game.categories,
    });
    setGame(null);
    setCategory(null);
  };

  // back to the start screen - new game
  const playAgain = () => {
    setGame(null);
    setCategory(null);
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
  
  // Question Card
  if (game.currentQuestion) {
    return <QuestionCard game={game} onFinishTurn={finishTurn} />;
  }

  // player's turn - spin & pick difficulty
  return (
    <View style={styles.screen}>

      <Scoreboard game={game} />

      <View style={styles.content}>
        <Text style={styles.title}>Playing</Text>

        <Text style={styles.body}>
            {game.players[game.currentPlayerIndex].name}&apos;s turn
        </Text>

        <Text
          style={[
            styles.heading,
            category && { color: categoryColors[category] },
          ]}
        >
          {category ?? "Spin the wheel!"}
        </Text>

        {category === null ? (
          <Button label="Spin" onPress={() => setCategory(spinWheel(game))} />
        ) : (
            getAvailableDifficulties(game, category).map((d) => (
              <Button
                key={d}
                label={d}
                onPress={() => setGame(drawQuestion(game, category, d))}
              />
            ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  title: {
    fontFamily: font.display,   // Georgia serif
    fontSize: font.sizes.title,
    color: colors.text,
  },
  body: {
    fontSize: font.sizes.body,
    color: colors.text,
  },
  heading: {
    fontFamily: font.display,
    fontSize: font.sizes.heading,
    color: colors.text,
  },
});
