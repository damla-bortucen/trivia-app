import { Text, ScrollView, StyleSheet } from 'react-native';

import { colors, spacing, radius, font } from "@/ui/theme";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How to Play</Text>

      <Text style={styles.body}>
        This is a pass-and-play game for 2 to 6 players. Add everyone on the
        start screen, set a winning score, and pick which categories are in the game.
      </Text>

      <Text style={styles.heading}>On your turn</Text>
      <Text style={styles.body}>
        1. Spin the wheel to land on a category.{"\n"}
        2. Choose a difficulty: easy, medium, or hard. Easy questions are worth 1 point, 
        mediums are 2 and hard ones are 3.{"\n"}
        3. Read the question, answer and then tap Reveal answer.{"\n"}
        4. Tap + if you got it right to add the points, − if you got it 
        wrong to subtract them, or Skip to pass if you didn't answer.
      </Text>

      <Text style={styles.heading}>Winning</Text>
      <Text style={styles.body}>
        First player to reach the winning score wins. If the questions run out
        first, the player with the highest score wins.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontFamily: font.display,
    fontSize: font.sizes.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: font.sizes.body,
    color: colors.text,
    lineHeight: 26,
  },
  heading: {
    fontFamily: font.display,
    fontSize: font.sizes.heading,
    color: colors.text,
  },
});