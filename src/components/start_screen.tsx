import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { startGame } from "@/game/game_logic";
import { GameState, StartValues } from "@/game/types";
import { getPacks, DEFAULT_PACK_IDS } from "@/game/packs";
import { loadPacks } from "@/game/storage";
import { colors, spacing, radius, font } from "@/ui/theme";
import { Button } from "@/components/button";

const MAX_PLAYERS = 6;
const DEFAULT_WINNING_SCORE = 3;

const PACKS = getPacks();

function selectedPacks() {
    const ids = loadPacks() ?? DEFAULT_PACK_IDS;
    return PACKS.filter((p) => ids.includes(p.id));
}

// accepts initial values if rematch otherwise starts fresh
export function Start({ onStart, initial }: { 
    onStart: (game: GameState) => void;
    initial?: StartValues | null;
}) {
    const [names, setNames] = useState<string[]>(initial?.names ?? ["", ""]);
    const [winningScore, setWinningScore] = useState<number>(initial?.winningScore ?? DEFAULT_WINNING_SCORE);

    const [packs, setPacks] = useState(() => selectedPacks());

    // the Packs page can change the selection while this screen sits in the background
    // useFocusEffect reruns setPacks using the Callback hook every time this screen comes back into focus
    useFocusEffect(
        useCallback(() => {
            setPacks(selectedPacks());
        }, [])
    );

    const categories = packs.map((p) => p.id);

    const updateName = (index: number, value: string) =>
        setNames(names.map((n, i) => (i === index ? value : n)));

    const addPlayer = () => {
        if (names.length < MAX_PLAYERS) setNames([...names, ""]);
    };

    const reset = () => {
        setNames(["", ""]);
        setWinningScore(DEFAULT_WINNING_SCORE);
    };

    const filledNames = names.map((n) => n.trim()).filter((n) => n.length > 0);
    const canStart = filledNames.length >= 2 && categories.length > 0;

    return (
        <View style={styles.screen}>
            <Pressable style={styles.refresh} onPress={reset} hitSlop={8}>
                {({ pressed }) => (
                    <Ionicons
                        name="refresh"
                        size={24}
                        color={pressed ? colors.text : colors.textMuted}
                    />
                )}
            </Pressable>

            <Text style={styles.title}>Trivia</Text>

            <View style={styles.group}>
                {names.map((name, i) => (
                    <TextInput
                        key={i}
                        style={[styles.input, (names.length >= 4) && styles.inputCompact]}
                        placeholder={`Player ${i + 1}`}
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        autoCorrect={false}
                        onChangeText={(t) => updateName(i, t)}
                    />
                ))}

                {names.length < MAX_PLAYERS && (
                    <Button label="+ Add player" variant="link" onPress={addPlayer} />
                )}
            </View>
            
            
            <View style={styles.group}>
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
            </View>

            <View style={styles.group}>
                <Text style={styles.label}>Categories ({packs.length})</Text>
                <View style={styles.chips}>
                    {packs.map((p) => (
                        <View
                            key={p.id}
                            style={[styles.chip, { borderColor: p.color, backgroundColor: p.color }]}
                        >
                            <Text style={styles.chipText}>{p.name}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <Button
                label="Play"
                disabled={!canStart}
                onPress={() => onStart(startGame(filledNames, winningScore, categories))}
            />
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
    group: {
        gap: spacing.md
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
    inputCompact: {
        padding: spacing.sm,
    },
    label: { fontSize: font.sizes.caption, color: colors.textMuted, textAlign: "center" },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
        justifyContent: "center",
        paddingHorizontal: spacing.lg,
    },
    chip: {
        borderWidth: 1.5,
        borderRadius: radius.pill,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
    },
    chipText: { fontSize: font.sizes.caption,  color: colors.text },
    refresh: {
        position: "absolute",
        top: spacing.xs,
        left: spacing.lg,
        zIndex: 1,
    },
});