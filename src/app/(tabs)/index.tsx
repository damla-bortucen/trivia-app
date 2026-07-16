import {
  drawQuestion,
  getAvailableDifficulties,
  spinWheel,
} from "@/game/game_logic";
import { Category, GameState } from "@/game/types";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, font, radius, spacing, categoryColors } from "@/ui/theme";

import { QuestionCard } from "@/components/question_card";
import { Results } from "@/components/results_screen";
import { Scoreboard } from "@/components/scoreboard";
import { Start } from "@/components/start_screen";

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

      <View style={styles.content}>
        <Text style={styles.title}>Playing</Text>

        <Text style={styles.body}>
            {game.players[game.currentPlayerIndex].name}'s turn
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
  scorescreen: {
    flex: 1,
    backgroundColor: colors.background,
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
