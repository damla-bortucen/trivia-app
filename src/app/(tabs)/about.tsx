import { Text, ScrollView, StyleSheet } from 'react-native';

import { colors, spacing, radius, font } from "@/ui/theme";

export default function AboutScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>How to Play</Text>
      <Text style={styles.body}>About screen for Rules of the Game</Text>
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
});