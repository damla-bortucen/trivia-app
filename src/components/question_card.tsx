import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { GameState } from "@/game/types";
import {
    givePoints,
    deductPoints,
    skip,
} from "@/game/game_logic";
import { colors, spacing, radius, font, categoryColors } from "@/ui/theme";

import { Button } from "@/components/button";
import { Quit } from "@/components/quit";

export function QuestionCard({ game, onFinishTurn, onQuit }: { 
    game: GameState,
    onFinishTurn: (next: GameState) => void;
    onQuit: () => void;
}) {
    const [revealed, setRevealed] = useState(false);

    const q = game.currentQuestion;
    if (!q) return null;

    const accent = categoryColors[q.category];

    return (
      <View style={styles.screen}>
        <Quit onQuit={onQuit} />
        <View style={styles.cardScreen}>
          <View style={styles.card}>
            <Text style={[styles.category, { color: accent }]}>{q.category}</Text>
            
            <View style={styles.questionArea}>
              <Text
                  style={styles.title}
                  adjustsFontSizeToFit
                  numberOfLines={16}
                  minimumFontScale={0.6}
              >
                  {q.question}
              </Text>
            </View>
    
            {!revealed ? (
              <Button label="Reveal answer" onPress={() => setRevealed(true)} />
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

const styles = StyleSheet.create({
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
    category: {
        fontSize: font.sizes.caption,
        fontWeight: font.weight.bold,
        letterSpacing: 1.25,
        textTransform: "uppercase",
  },
});