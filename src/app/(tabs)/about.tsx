import { Text, ScrollView, StyleSheet } from 'react-native';

import { colors, spacing, text } from "@/ui/theme";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={[text.title, styles.title]}>How to Play</Text>

      <Text style={[text.body, styles.body]}>
        This is a pass-and-play game for 2 to 6 players. Add everyone on the start
        screen, set a winning score, then hand the phone around.
      </Text>

      <Text style={text.heading}>Choosing packs</Text>
      <Text style={[text.body, styles.body]}>
        Questions come in packs, and each pack is a category. Pick
        up to six on the Packs tab and tap one to see what is inside before you
        add it. Your choice is remembered between games.
      </Text>

      <Text style={text.heading}>On your turn</Text>
      <Text style={[text.body, styles.body]}>
        1. Spin the wheel to land on a category.{"\n"}
        2. Choose a difficulty. Easy questions are worth 1 point, medium 2 and
        hard 3.{"\n"}
        3. Read the question out, answer, then tap Reveal answer.{"\n"}
        4. Tap + if you got it right, − if you got it wrong and lose the points,
        or Skip to pass.
      </Text>

      <Text style={text.heading}>Winning</Text>
      <Text style={[text.body, styles.body]}>
        First player to reach the winning score wins. If the questions run out
        first, the highest score wins.
      </Text>

      <Text style={text.heading}>Leaving a game</Text>
      <Text style={[text.body, styles.body]}>
        Close the app mid-game and it will ask whether to carry on next time you
        open it. Quitting with the back arrow ends the game for good.
      </Text>

      <Text style={text.heading}>Where the questions come from</Text>
      <Text style={[text.body, styles.body]}>
        Some packs come from the Open Trivia Database, shared under the Creative
        Commons Attribution-ShareAlike 4.0 licence. Others are generated with AI.
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
  title: { marginBottom: spacing.sm },
  body: { lineHeight: 26 },   // long form reading needs more than the default
});