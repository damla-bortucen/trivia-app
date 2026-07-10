import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import {
    spinWheel,
    getAvailableDifficulties,
    drawQuestion,
    givePoints,
    deductPoints,
    skip,
    getWinners,
} from "@/game/game_logic";
import { GameState, Category } from "@/game/types";

import { colors, spacing, radius, font } from "@/ui/theme";

 import { Scoreboard } from "@/components/scoreboard";
 import { Results } from "@/components/results_screen";
 import { Start } from "@/components/start_screen";


export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [category, setCategory] = useState<Category | null>(null);
  const [revealed, setRevealed] = useState(false);


  // ends the turn
  const finishTurn = (next: GameState) => {
    setGame(next);
    setCategory(null);
    setRevealed(false);
  };

  // back to the start screen - new game
  const playAgain = () => {
    setGame(null);
    setCategory(null);
    setRevealed(false);
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
  
  // display question card
  if (game.currentQuestion) {
    const q = game.currentQuestion;
    return (
      <View style={styles.screen}>
        <Text style={styles.body}>{category}</Text>
        <Text style={styles.title}>{q.question}</Text>

        {!revealed ? (
          <Pressable style={styles.button} onPress={() => setRevealed(true)}>
            <Text style={styles.buttonText}>Reveal answer</Text>
          </Pressable>
         ) : (
          <>
            <Text style={styles.answer}>{q.answer}</Text>
            <View style={styles.scoreRow}>
              <Pressable
                style={[styles.scoreButton, { backgroundColor: colors.easy }]}
                onPress={() => finishTurn(givePoints(game))}
              >
                <Text style={styles.scoreButtonText}>+</Text>
              </Pressable>
              <Pressable
                style={[styles.scoreButton, { backgroundColor: colors.hard }]}
                onPress={() => finishTurn(deductPoints(game))}
              >
                <Text style={styles.scoreButtonText}>−</Text>
              </Pressable>

            </View>

            <Pressable onPress={() => finishTurn(skip(game))}>
              <Text style={styles.link}>Skip (no points)</Text>
            </Pressable>
          </>
         )}
      </View>
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
  scoreRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.lg,
  },
  scoreButton: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: font.weight.bold,
  },
  answer: {
    fontFamily: font.display,
    fontSize: font.sizes.heading,
    color: colors.text,
    textAlign: "center",
  },
  link: { color: colors.textMuted, fontSize: font.sizes.body, textAlign: "center" },
  label: { fontSize: font.sizes.caption, color: colors.textMuted, textAlign: "center" },
});
