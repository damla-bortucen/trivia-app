import { Text, View, StyleSheet } from "react-native";
import { GameState } from "@/game/types";
import { colors, spacing, font } from "@/ui/theme";

export function Scoreboard({ game }: { game: GameState }) {
    return (
        <View style={styles.scoreboard}>
            {game.players.map((p, i) => (
                <View key={p.id} style={styles.scoreItem}>
                    <Text
                        style={[ styles.scoreName, i === game.currentPlayerIndex && styles.scoreNameActive ]}
                    >
                        {p.name}
                    </Text>
                    <Text style={styles.scoreValue}>{p.score}</Text>
                </View>
            ))}
        </View>
    );
}


const styles = StyleSheet.create({
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
});