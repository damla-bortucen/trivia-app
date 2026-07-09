import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput } from "react-native";
import { startGame } from "@/game/game_logic";
import { GameState } from "@/game/types";

import { colors, spacing, radius, font } from "@/ui/theme";

export default function Index() {
  const [game, setGame] = useState<GameState | null>(null);
  // creates either a GameState or null and setGame is the only way to change it
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

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
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Playing</Text>
      <Text style={styles.body}>
          {game.players[game.currentPlayerIndex].name}'s turn
      </Text>
      <Text style={styles.body}>{game.remaining.length} questions left</Text>
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
});
