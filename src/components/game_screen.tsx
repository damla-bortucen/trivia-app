import { useState } from "react";
import {
  drawQuestion,
  getAvailableDifficulties,
  spinWheel,
} from "@/game/game_logic";
import { StyleSheet, Text, View } from "react-native";
import { Category, GameState } from "@/game/types";
import { getPackById } from "@/game/packs";

import { useTheme, Colors, spacing } from "@/ui/theme";

import { Scoreboard } from "@/components/scoreboard";
import { Button } from "@/components/button";
import { Quit } from "@/components/quit";

// lets the player who just went take their turn back - offered on the
// screen that follows a marked answer
export type Undo = { name: string; onPress: () => void };

export function GameScreen({ game, onDraw, onQuit, undo }: {
    game: GameState;
    onDraw: (next: GameState) => void;
    onQuit: () => void;
    undo?: Undo | null;
}) {
    const { colors, text } = useTheme();
    const styles = makeStyles(colors);
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
            <>
                <Button label="Spin" onPress={() => setCategory(spinWheel(game))} />
                {/* gone once the next player spins - by then they've moved on */}
                {undo && (
                    <Button label={`Undo ${undo.name}'s turn`} variant="link" onPress={undo.onPress} />
                )}
            </>
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

const makeStyles = (colors: Colors) => StyleSheet.create({
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