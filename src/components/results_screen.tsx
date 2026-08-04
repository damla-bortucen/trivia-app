import { Text, View, StyleSheet } from "react-native";
import { GameState } from "@/game/types";
import { getWinners } from "@/game/game_logic";
import { colors, spacing, text } from "@/ui/theme";
import { Button } from "@/components/button";

export function Results({ game, onPlayAgain, onRematch }: { game: GameState, onPlayAgain: () => void, onRematch: () => void }) {
    const winners = getWinners(game);
    const heading = winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!";

    return (
        <View style={styles.screen}>
            <Text style={text.title}>{heading}</Text>

            {game.players.map((p) => (
            <Text key={p.id} style={text.body}>
                {p.name}: {p.score}
            </Text>
            ))}

            <Button label="Rematch" onPress={onRematch} />
            <Button label="New Game" variant="link" onPress={onPlayAgain} />
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
});