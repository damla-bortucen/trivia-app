import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { GameState, Category } from "@/game/types";
import {
    givePoints,
    deductPoints,
    skip,
} from "@/game/game_logic";
import { colors, spacing, radius, font } from "@/ui/theme";

export function QuestionCard({ game, category, onFinishTurn, }: { 
    game: GameState,
    category: Category | null,
    onFinishTurn: (next: GameState) => void;
}) {
    const [revealed, setRevealed] = useState(false);

    const q = game.currentQuestion;
    if (!q) return null;

    return (
          <View style={styles.screen}>
            <View style={styles.card}>
              <Text style={styles.body}>{category}</Text>
              <Text style={styles.title}>{q.question}</Text>
      
              {!revealed ? (
                <Pressable style={styles.button} onPress={() => setRevealed(true)}>
                  <Text style={styles.buttonText}>Reveal answer</Text>
                </Pressable>
              ) : (
                <>
                  <Text style={styles.answer}>{q.answer}</Text>
                  <View style={styles.scoreRow}>
                    <Pressable
                      style={[styles.scoreButton, { backgroundColor: colors.easy }]}
                      onPress={() => onFinishTurn(givePoints(game))}
                    >
                      <Text style={styles.scoreButtonText}>+</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.scoreButton, { backgroundColor: colors.hard }]}
                      onPress={() => onFinishTurn(deductPoints(game))}
                    >
                      <Text style={styles.scoreButtonText}>−</Text>
                    </Pressable>
      
                  </View>
      
                  <Pressable onPress={() => onFinishTurn(skip(game))}>
                    <Text style={styles.link}>Skip (no points)</Text>
                  </Pressable>
                </>
              )}
            </View>
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
    card: {
        backgroundColor: colors.surface,
        gap: spacing.lg,
        marginLeft: spacing.xl,
        marginRight: spacing.xl,
        marginTop: spacing.lg,
        marginBottom: spacing.lg,
        borderColor: colors.border,
        borderRadius: radius.sm,
        borderWidth: 2,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
    },
    title: {
        fontFamily: font.display,   // Georgia serif
        fontSize: font.sizes.title,
        color: colors.text,
    },
    body: {
        fontSize: font.sizes.body,
        color: colors.text,
    },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.pill,
    },
    buttonText: { 
        color: colors.accentText, 
        fontSize: font.sizes.body, 
        fontWeight: font.weight.bold 
    },
    scoreRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: spacing.lg,
    },
    scoreButton: {
        width: 64,
        height: 64,
        borderRadius: radius.pill,
        alignItems: "center",
        justifyContent: "center",
    },
    scoreButtonText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: font.weight.bold,
    },
    answer: {
        fontFamily: font.display,
        fontSize: font.sizes.heading,
        color: colors.text,
        textAlign: "center",
    },
    link: { color: colors.textMuted, fontSize: font.sizes.body, textAlign: "center" },
    label: { fontSize: font.sizes.caption, color: colors.textMuted, textAlign: "center" },
});