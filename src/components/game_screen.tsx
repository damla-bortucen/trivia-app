import { useState } from "react";
import {
  drawQuestion,
  getAvailableDifficulties,
  spinWheel,
} from "@/game/game_logic";
import { StyleSheet, Text, View } from "react-native";
import { Category, GameState } from "@/game/types";

import { colors, font, spacing, categoryColors } from "@/ui/theme";

import { Scoreboard } from "@/components/scoreboard";
import { Button } from "@/components/button";

export function GameScreen({ game, onDraw }: {
    game: GameState;
    onDraw: (next: GameState) => void;
}) {
    const [category, setCategory] = useState<Category | null>(null);

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
                onPress={() => onDraw(drawQuestion(game, category, d))}
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
        fontFamily: font.display,
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