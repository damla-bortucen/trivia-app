import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import InputSpinner from "react-native-input-spinner";
import { startGame } from "@/game/game_logic";
import { GameState, Category, StartValues } from "@/game/types";
import { getPacks } from "@/game/packs";
import { colors, spacing, radius, font } from "@/ui/theme";
import { Button } from "@/components/button";

const MAX_PLAYERS = 6;
const MAX_PACKS = 6;
const DEFAULT_WINNING_SCORE = 3;

const PACKS = getPacks();
const DEFAULT_PACKS = PACKS.slice(0, MAX_PACKS).map((p) => p.id);

// accepts initial values if rematch otherwise starts fresh
export function Start({ onStart, initial }: { 
    onStart: (game: GameState) => void;
    initial?: StartValues | null;
}) {
    const [names, setNames] = useState<string[]>(initial?.names ?? ["", ""]);
    const [winningScore, setWinningScore] = useState<number>(initial?.winningScore ?? DEFAULT_WINNING_SCORE);

    const [categories, setCategories] = useState<Category[]>(initial?.categories ?? DEFAULT_PACKS);
    const atLimit = categories.length >= MAX_PACKS;
  
    const toggleCategory = (c: Category) =>
        setCategories((prev) => {
        if (prev.includes(c)) return prev.filter((x) => x !== c); // if category already selected, deselect
        if (prev.length >= MAX_PACKS) return prev; // at cap ignore
        return [...prev, c]; // otherwise add category to current selection
    });

    const updateName = (index: number, value: string) =>
        setNames(names.map((n, i) => (i === index ? value : n)));

    const addPlayer = () => {
        if (names.length < MAX_PLAYERS) setNames([...names, ""]);
    };

    const reset = () => {
        setNames(["", ""]);
        setWinningScore(DEFAULT_WINNING_SCORE);
        setCategories(DEFAULT_PACKS);
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
                <Text style={styles.label}>Categories ({categories.length}/{MAX_PACKS})</Text>
                <View style={styles.chips}>
                    {PACKS.map((p) => {
                        const on = categories.includes(p.id);
                        const locked = !on && atLimit;
                        return (
                            <Pressable
                                key={p.id}
                                onPress={() => toggleCategory(p.id)}
                                disabled={locked}
                                style={[
                                    styles.chip,
                                    { borderColor: p.color },
                                    on && { backgroundColor: p.color },
                                    locked && styles.chipLocked,
                                ]}
                            >
                                <Text style={[styles.chipText, on && styles.chipTextOn]}>{p.name}</Text>
                            </Pressable>
                        );
                    })}
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
    chipText: { fontSize: font.sizes.caption, color: colors.text },
    chipTextOn: { color: colors.accentText },
    chipLocked: { opacity: 0.35 },
    refresh: {
        position: "absolute",
        top: spacing.xs,
        left: spacing.lg,
        zIndex: 1,
    },
});