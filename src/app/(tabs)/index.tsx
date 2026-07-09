import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput } from "react-native";
import {
    startGame,
    spinWheel,
    getAvailableDifficulties,
    drawQuestion,
} from "@/game/game_logic";
import { GameState, Category } from "@/game/types";

import { colors, spacing, radius, font } from "@/ui/theme";

export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  // --------- Home Screen -----------
  if (game == null) {
    return (
      <View style={styles.screen}>
          <Text style={styles.title}>Trivia</Text>

          <TextInput
            style={styles.input}
            placeholder="Player 1"
            placeholderTextColor={colors.textMuted}
            value={player1}
            onChangeText={setPlayer1}
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Player 2"
            placeholderTextColor={colors.textMuted}
            value={player2}
            onChangeText={setPlayer2}
            autoCorrect={false}
          />
          
          <Pressable 
              style={styles.button} 
              onPress={() => setGame(startGame([player1, player2], 30))}
          >
            <Text style={styles.buttonText}>Play</Text>
          </Pressable>
      </View>   
    );
  }

  // --------- Game Screen -----------
  
  // display question
  if (game.currentQuestion) {
    return (
      <View style={styles.screen}>
        <Text style={styles.body}>{category}</Text>
        <Text style={styles.title}>{game.currentQuestion.question}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Playing</Text>
      <Text style={styles.body}>
          {game.players[game.currentPlayerIndex].name}'s turn
      </Text>

      {/* show the spun category, or a prompt if we haven't spun yet */}
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
});
