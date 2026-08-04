import { useState } from "react";
import {
  drawQuestion,
  getAvailableDifficulties,
  spinWheel,
} from "@/game/game_logic";
import { StyleSheet, Text, View } from "react-native";
import { Category, GameState } from "@/game/types";
import { getPackById } from "@/game/packs";

import { colors, spacing, text } from "@/ui/theme";

import { Scoreboard } from "@/components/scoreboard";
import { Button } from "@/components/button";
import { Quit } from "@/components/quit";

export function GameScreen({ game, onDraw, onQuit }: {
    game: GameState;
    onDraw: (next: GameState) => void;
    onQuit: () => void;
}) {
    const [category, setCategory] = useState<Category | null>(null);

    const pack = category ? getPackById(category) : undefined;

    return (
    <View style={styles.screen}>
        <Quit onQuit={onQuit} />
        <Scoreboard game={game} />

        <View style={styles.content}>
            <Text style={text.body}>
                {game.players[game.currentPlayerIndex].name}&apos;s turn
            </Text>

            <Text
            style={[
                text.heading,
                pack && { color: pack.color },
            ]}
            >
            {category ? pack?.name ?? category : "Spin the wheel!"}
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
});