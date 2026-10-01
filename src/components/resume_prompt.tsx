import { Text, View, StyleSheet, Modal } from "react-native";

import { GameState } from "@/game/types";
import { Button } from "@/components/button";
import { Scoreboard } from "@/components/scoreboard";
import { useTheme, Colors, spacing, radius, font } from "@/ui/theme";

export function ResumePrompt({ game, onContinue, onNew }: {
    game: GameState;
    onContinue: () => void;
    onNew: () => void;
}) {
    const { colors, text } = useTheme();
    const styles = makeStyles(colors);
    const drawn = game.askedIds.length;

    return (
        // no backdrop dismiss - one of the choices throws the game away,
        // so it should be deliberate
        <Modal visible transparent animationType="fade" onRequestClose={onContinue}>
            <View style={styles.backdrop}>
                <View style={styles.popup}>
                    <Text style={styles.title}>Unfinished game</Text>
                    <Text style={text.label}>
                        {drawn} {drawn === 1 ? "question" : "questions"} in
                    </Text>

                    <Scoreboard game={game} />

                    <Button label="Continue" color={colors.border} textColor={colors.text} onPress={onContinue} />
                    <Button label="New game" variant="link" onPress={onNew} />
                </View>
            </View>
        </Modal>
    );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
    backdrop: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        padding: spacing.lg,
    },
    popup: {
        width: "100%",
        maxWidth: 300,
        gap: spacing.sm,
        borderColor: colors.border,
        borderRadius: radius.md,
        borderWidth: 2,
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    // system sans and small, so the popup reads as chrome rather than
    // part of the game
    title: {
        fontSize: font.sizes.heading,
        fontWeight: font.weight.bold,
        color: colors.text,
        textAlign: "center",
    },
    // flattened - a bordered box inside a bordered box is busy at this size
    scoreboard: {
        marginHorizontal: 0,
        marginTop: 0,
        borderWidth: 0,
        padding: 0,
    },
});