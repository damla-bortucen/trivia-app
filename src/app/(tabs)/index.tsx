import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput } from "react-native";
import {
    startGame,
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
import InputSpinner from "react-native-input-spinner";

const MAX_PLAYERS = 6;
const DEFAULT_WINNING_SCORE = 3;

export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [names, setNames] = useState<string[]>(["", ""]);
  const [category, setCategory] = useState<Category | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [winningScore, setWinningScore] = useState(String(DEFAULT_WINNING_SCORE));

  // change one name in the list
  const updateName = (index: number, value: string) =>
    setNames(names.map((n, i) => (i === index ? value : n)));

  // add an empty name box, up to the max
  const addPlayer = () => {
    if (names.length < MAX_PLAYERS) setNames([...names, ""]);
  };

  // need at least 2 non-empty names to start
  const filledNames = names.map((n) => n.trim()).filter((n) => n.length > 0);
  const canStart = filledNames.length >= 2;


  // ends the turn
  const finishTurn = (next: GameState) => {
    setGame(next);
    setCategory(null);
    setRevealed(false);
  };

  // back to the start screen - new game
    const playAgain = () => {
      setGame(null);
      setNames(["", ""]);
      setCategory(null);
      setRevealed(false);
      setWinningScore(String(DEFAULT_WINNING_SCORE));
    };


  // --------- Home Screen -----------
  if (game == null) {
    return (
      <View style={styles.screen}>
          <Text style={styles.title}>Trivia</Text>

          {names.map((name, i) => (
            <TextInput
              key={i}
              style={styles.input}
              placeholder={`Player ${i + 1}`}
              placeholderTextColor={colors.textMuted}
              value={name}
              autoCorrect={false}
              onChangeText={(t) => updateName(i, t)}
            />
          ))}

          {names.length < MAX_PLAYERS && (
            <Pressable onPress={addPlayer}>
              <Text style={styles.link}>+ Add player</Text>
            </Pressable>
          )}

          <Text style={styles.label}>Winning score</Text>
          <InputSpinner
            min={1}
            step={1}
            colorMin={colors.surface}
            value={winningScore}
            onChange={setWinningScore}
            width={130}
            height={40}
            colorRight={colors.border}
            colorLeft={colors.border}
            colorPress={colors.accent}
            buttonTextColor={colors.text}
          />
          
          <Pressable 
              style={[styles.button, !canStart && styles.buttonDisabled]} 
              disabled={!canStart}
              onPress={() => setGame(startGame(filledNames, Number(winningScore)))}
          >
            <Text style={styles.buttonText}>Play</Text>
          </Pressable>
      </View>   
    );
  }

  // --------- Results Screen -----------
  if (game.status === "finished") {
    const winners = getWinners(game);
    const heading =
        winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!";

    return (
      <View style={styles.screen}>
        <Text style={styles.title}>{heading}</Text>

        {game.players.map((p) => (
          <Text key={p.id} style={styles.body}>
              {p.name}: {p.score}
          </Text>
        ))}

        <Pressable style={styles.button} onPress={playAgain}>
          <Text style={styles.buttonText}>Play again</Text>
        </Pressable>
      </View>
    );
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

      <View style={styles.scoreboard}>
        {game.players.map((p, i) => (
          <View key={p.id} style={styles.scoreItem}>
            <Text
              style={[
                styles.scoreName,
                i === game.currentPlayerIndex && styles.scoreNameActive,
              ]}
            >
              {p.name}
            </Text>
            <Text style={styles.scoreValue}>{p.score}</Text>
          </View>
        ))}
      </View>

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
  scoreboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.lg,
    marginBottom: spacing.lg,

  },
  scoreItem: { alignItems: "center" },
  scoreName: { fontSize: font.sizes.caption, color: colors.textMuted },
  scoreNameActive: { color: colors.text, fontWeight: font.weight.bold },
  scoreValue: {
      fontFamily: font.display,
      fontSize: font.sizes.heading,
      color: colors.text,
  },
  label: { fontSize: font.sizes.caption, color: colors.textMuted, textAlign: "center" },
});
