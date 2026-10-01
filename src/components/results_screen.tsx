import { Text, View, StyleSheet } from "react-native";
import { GameState } from "@/game/types";
import { getWinners } from "@/game/game_logic";
import { useTheme, Colors, spacing, radius, font } from "@/ui/theme";
import { formatScore } from "@/ui/format";
import { Button } from "@/components/button";
import { Undo } from "@/components/game_screen";

export function Results({ game, onPlayAgain, onRematch, undo }: {
    game: GameState;
    onPlayAgain: () => void;
    onRematch: () => void;
    undo?: Undo | null;
}) {
    const { colors, text } = useTheme();
    const styles = makeStyles(colors);

    const winners = getWinners(game);
    const heading = winners.length === 1 ? `${winners[0].name} wins!` : "It's a tie!";

    // highest first - sort is stable, so tied players keep seating order
    const standings = [...game.players].sort((a, b) => b.score - a.score);

    return (
        <View style={styles.screen}>
            <Text style={text.title}>{heading}</Text>

            <View style={styles.standings}>
                {standings.map((p) => {
                    const won = winners.includes(p);
                    return (
                        <View key={p.id} style={[styles.row, won && styles.rowWinner]}>
                            <Text style={[text.body, styles.name, won && styles.bold]} numberOfLines={1}>{p.name}</Text>
                            <Text style={[text.body, styles.score, won && styles.bold]}>{formatScore(p.score)}</Text>
                        </View>
                    );
                })}
            </View>

            <Button label="Rematch" onPress={onRematch} style={styles.action} />
            <Button label="New Game" variant="secondary" onPress={onPlayAgain} style={styles.action} />
            {/* a mis-tap on the last answer would otherwise hand someone the win */}
            {undo && (
                <Button label={`Undo ${undo.name}'s turn`} variant="link" onPress={undo.onPress} />
            )}
        </View>
    );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.lg,
    },
    standings: {
        alignSelf: "stretch",
        marginHorizontal: spacing.xl,
        gap: spacing.xs,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: spacing.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1.5,
        borderColor: "transparent",   // same box as the winner row, so names line up
    },
    // the winning row gets the card treatment, everyone else sits on the page
    rowWinner: {
        backgroundColor: colors.surface,
        borderColor: colors.accent,
    },
    name: { flexShrink: 1 },   // long names truncate instead of pushing the score off
    bold: { fontWeight: font.weight.bold },
    // both pills share one width so they stack as a pair, whatever the labels
    action: { minWidth: 180 },
    score: { fontVariant: ["tabular-nums"] },
});
