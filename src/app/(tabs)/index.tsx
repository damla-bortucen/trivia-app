import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import {
    spinWheel,
    getAvailableDifficulties,
    drawQuestion,
} from "@/game/game_logic";
import { GameState, Category } from "@/game/types";

import { colors, spacing, radius, font } from "@/ui/theme";

import { Scoreboard } from "@/components/scoreboard";
import { Results } from "@/components/results_screen";
import { Start } from "@/components/start_screen";
import { QuestionCard } from "@/components/question_card";


export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [category, setCategory] = useState<Category | null>(null);


  // ends the turn
  const finishTurn = (next: GameState) => {
    setGame(next);
    setCategory(null);
  };

  // back to the start screen - new game
  const playAgain = () => {
    setGame(null);
    setCategory(null);
  };


  // --------- Home Screen -----------
  if (game == null) {
    return <Start onStart={setGame} />;
  }

  // --------- Results Screen -----------
  if (game.status === "finished") {
    return <Results game={game} onPlayAgain={playAgain} />;
  }


  // --------- Game Screen -----------
  
  // Question Card
  if (game.currentQuestion) {
    return (
        <QuestionCard game={game} category={category} onFinishTurn={finishTurn} />
    );
  }

  // player's turn - no question
  return (
    <View style={styles.screen}>

      <Scoreboard game={game} />

      <Text style={styles.title}>Playing</Text>

      <Text style={styles.body}>
          {game.players[game.currentPlayerIndex].name}'s turn
      </Text>

      <Text style={styles.heading}>
          {category ?? "Spin the wheel!"}
      </Text>

      {category === null ? (
        <>
        <Pressable
            style={styles.button}
            onPress={() => setCategory(spinWheel(game))}
        >
            <Text style={styles.buttonText}>Spin</Text>
        </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.title}>{category}</Text>
          {getAvailableDifficulties(game, category).map((d) => (
            <Pressable
              key={d}
              style={styles.button}
              onPress={() => setGame(drawQuestion(game, category, d))}
            >
              <Text style={styles.buttonText}>{d}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: colors.accentText,
    fontSize: font.sizes.body,
    fontWeight: font.weight.bold,
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: font.sizes.body,
    color: colors.text,
  },
  heading: {
    fontFamily: font.display,
    fontSize: font.sizes.heading,
    color: colors.text,
  },
  link: { color: colors.textMuted, fontSize: font.sizes.body, textAlign: "center" },
  label: { fontSize: font.sizes.caption, color: colors.textMuted, textAlign: "center" },
});
