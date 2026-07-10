import { useState } from "react";
import { Text, View, Pressable, StyleSheet, TextInput } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { startGame } from "@/game/game_logic";
import { GameState } from "@/game/types";
import { colors, spacing, radius, font } from "@/ui/theme";

const MAX_PLAYERS = 6;
const DEFAULT_WINNING_SCORE = 3;

export function Start({ onStart }: { onStart: (game: GameState) => void }) {
    const [names, setNames] = useState<string[]>(["", ""]);
    const [winningScore, setWinningScore] = useState(String(DEFAULT_WINNING_SCORE));

    const updateName = (index: number, value: string) =>
        setNames(names.map((n, i) => (i === index ? value : n)));

    const addPlayer = () => {
        if (names.length < MAX_PLAYERS) setNames([...names, ""]);
    };

    const filledNames = names.map((n) => n.trim()).filter((n) => n.length > 0);
    const canStart = filledNames.length >= 2;

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Trivia</Text>

            {names.map((name, i) => (
                <TextInput
                    key={i}
                    style={styles.input}
                    placeholder={`Player ${i + 1}`}
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    autoCorrect={false}
                    onChangeText={(t) => updateName(i, t)}
                />
            ))}

            {names.length < MAX_PLAYERS && (
                <Pressable onPress={addPlayer}>
                    <Text style={styles.link}>+ Add player</Text>
                </Pressable>
            )}

            <Text style={styles.label}>Winning score</Text>
            <InputSpinner
                min={1}
                step={1}
                colorMin={colors.surface}
                value={winningScore}
                onChange={setWinningScore}
                width={130}
                height={40}
                colorRight={colors.border}
                colorLeft={colors.border}
                colorPress={colors.accent}
                buttonTextColor={colors.text}
            />

            <Pressable
                style={[styles.button, !canStart && styles.buttonDisabled]}
                disabled={!canStart}
                onPress={() => onStart(startGame(filledNames, Number(winningScore)))}
            >
                <Text style={styles.buttonText}>Play</Text>
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
    title: { fontFamily: font.display, fontSize: font.sizes.title, color: colors.text },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        padding: spacing.md,
        fontSize: font.sizes.body,
        color: colors.text,
    },
    link: { color: colors.textMuted, fontSize: font.sizes.body, textAlign: "center" },
    label: { fontSize: font.sizes.caption, color: colors.textMuted, textAlign: "center" },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.pill,
    },
    buttonDisabled: { opacity: 0.4 },
    buttonText: { color: colors.accentText, fontSize: font.sizes.body, fontWeight: font.weight.bold },
});