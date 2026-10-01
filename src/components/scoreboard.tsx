import { Text, View, StyleSheet } from "react-native";
import { GameState } from "@/game/types";
import { useTheme, Colors, spacing, font, radius } from "@/ui/theme";
import { formatScore } from "@/ui/format";

export function Scoreboard({ game }: { game: GameState }) {
    const { colors, text } = useTheme();
    const styles = makeStyles(colors);

    return (
        <View style={styles.scoreboard}>
            {game.players.map((p, i) => (
                <View key={p.id} style={styles.scoreItem}>
                    <Text
                        style={[ text.label, i === game.currentPlayerIndex && styles.scoreNameActive ]}
                    >
                        {p.name}
                    </Text>
                    <Text style={text.heading}>{formatScore(p.score)}</Text>
                </View>
            ))}
        </View>
    );
}


const makeStyles = (colors: Colors) => StyleSheet.create({
    scoreboard: {
        alignSelf: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: spacing.lg,
        marginHorizontal: spacing.xl,
        marginTop: spacing.lg,
        padding: spacing.sm,
        borderColor: colors.border,
        borderRadius: radius.sm,
        borderWidth: 1,
    },
    scoreItem: { alignItems: "center" },
    scoreNameActive: { color: colors.text, fontWeight: font.weight.bold },
});