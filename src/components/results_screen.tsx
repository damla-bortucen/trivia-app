import { Text, View, StyleSheet, Pressable } from "react-native";
import { GameState } from "@/game/types";
import { getWinners } from "@/game/game_logic";
import { colors, spacing, font, radius } from "@/ui/theme";

export function Results({ game, onPlayAgain }: { game: GameState, onPlayAgain: () => void }) {
    const winners = getWinners(game);
    const heading = winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!";

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>{heading}</Text>

            {game.players.map((p) => (
            <Text key={p.id} style={styles.body}>
                {p.name}: {p.score}
            </Text>
            ))}

            <Pressable style={styles.button} onPress={onPlayAgain}>
            <Text style={styles.buttonText}>Play again</Text>
            </Pressable>
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
    title: {
        fontFamily: font.display,
        fontSize: font.sizes.title,
        color: colors.text,
    },
    body: { fontSize: font.sizes.body, color: colors.text },
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
});