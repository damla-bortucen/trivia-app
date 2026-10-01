import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { GameState } from "@/game/types";
import {
    givePoints,
    deductPoints,
    skip,
    wrongAnswerPenalty,
} from "@/game/game_logic";
import { getPackById } from "@/game/packs";
import { useTheme, Colors, spacing, radius, font } from "@/ui/theme";

import { Button } from "@/components/button";
import { Quit } from "@/components/quit";
import { Scoreboard } from "@/components/scoreboard";

export function QuestionCard({ game, onFinishTurn, onQuit }: { 
    game: GameState,
    onFinishTurn: (next: GameState) => void;
    onQuit: () => void;
}) {
    const { colors, text } = useTheme();
    const styles = makeStyles(colors);
    const [revealed, setRevealed] = useState(false);

    const q = game.currentQuestion;
    if (!q) return null;

    const pack = getPackById(q.category);
    const accent = pack?.color;

    return (
      <View style={styles.screen}>
        <Quit onQuit={onQuit} />
        <Scoreboard game={game} />

        <View style={styles.cardScreen}>
          <View style={styles.card}>
            <Text style={[styles.category, { color: accent }]}>{pack?.name}</Text>

            {/* the answer takes the question's place once revealed */}
            <View style={styles.questionArea}>
              {revealed && <Text style={[styles.category, styles.answerLabel]}>Answer</Text>}
              <Text
                  style={[text.title, revealed && styles.answer]}
                  adjustsFontSizeToFit
                  numberOfLines={16}
                  minimumFontScale={0.6}
              >
                  {revealed ? q.answer : q.question}
              </Text>
            </View>

            {!revealed ? (
              <Button label="Reveal answer" onPress={() => setRevealed(true)} />
            ) : (
              <>
                {/* outlined pills, like the pack cards and chips - the colour
                    marks the outcome, the label says it in words */}
                <View style={styles.scoreRow}>
                  <Pressable
                    style={({ pressed }) => [styles.scoreButton, { borderColor: colors.correct, backgroundColor: colors.correctFill }, pressed && styles.scoreButtonPressed]}
                    onPress={() => onFinishTurn(givePoints(game))}
                    accessibilityRole="button"
                    accessibilityLabel={`Correct, plus ${q.points}`}
                  >
                    <SymbolView name="checkmark" weight="bold" size={16} tintColor={colors.correct} />
                    <Text style={text.body}>Correct</Text>
                    <Text style={[text.body, styles.scorePoints, { color: colors.correct }]}>+{q.points}</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [styles.scoreButton, { borderColor: colors.wrong, backgroundColor: colors.wrongFill }, pressed && styles.scoreButtonPressed]}
                    onPress={() => onFinishTurn(deductPoints(game))}
                    accessibilityRole="button"
                    accessibilityLabel={`Wrong, minus ${wrongAnswerPenalty(q)}`}
                  >
                    <SymbolView name="xmark" weight="bold" size={16} tintColor={colors.wrong} />
                    <Text style={text.body}>Wrong</Text>
                    <Text style={[text.body, styles.scorePoints, { color: colors.wrong }]}>−{wrongAnswerPenalty(q)}</Text>
                  </Pressable>
                </View>
    
                <Button
                    label="Skip (no points)"
                    variant="link"
                    onPress={() => onFinishTurn(skip(game))}
                />
              </>
            )}
          </View>
        </View>
      </View>
    );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    cardScreen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        alignSelf: "stretch",   // fixed width, so revealing a short answer doesn't shrink the card
        backgroundColor: colors.surface,
        gap: spacing.lg,
        marginHorizontal: spacing.xl,
        marginVertical: spacing.lg,
        borderColor: colors.border,
        borderRadius: radius.md,
        borderWidth: 1.5,
        padding: spacing.lg,
        maxHeight: "85%",
    },
    questionArea: {
        flexShrink: 1,          // gives up space when the card hits maxHeight
        justifyContent: "center",
        gap: spacing.sm,
    },
    scoreRow: {
        flexDirection: "row",
        gap: spacing.sm,
    },
    scoreButton: {
        flex: 1,                // equal halves of the card
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.xs,
        minHeight: 48,
        borderWidth: 1.5,
        borderRadius: radius.pill,
    },
    scoreButtonPressed: { opacity: 0.7 },   // fills are tinted, so dim rather than recolour
    scorePoints: { fontWeight: font.weight.bold, fontVariant: ["tabular-nums"] },
    answer: {
        textAlign: "center",
    },
    answerLabel: {
        color: colors.textMuted,
        textAlign: "center",
    },
    category: {
        fontSize: font.sizes.caption,
        fontWeight: font.weight.bold,
        letterSpacing: 1.25,
        textTransform: "uppercase",
  },
});