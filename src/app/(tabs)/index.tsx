import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { startGame } from "@/game/game_logic";
import { GameState } from "@/game/types";

import { colors, spacing, radius, font } from "@/ui/theme";

export default function Index() {
  const [game, setGame] = useState<GameState | null>(null); 
  // creates either a GameState or null
  // and setStarted is the only way to change it

  // --------- Home Screen -----------
  if (game == null) {
    return (
      <View style={styles.screen}>
          <Text style={styles.title}>Trivia</Text>
          
          <Pressable 
              style={styles.button} 
              onPress={() => setGame(startGame(["Alice", "Bob"], 10))}
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
});
