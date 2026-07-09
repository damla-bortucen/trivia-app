import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Link } from 'expo-router';

import { colors, spacing, radius, font } from "@/ui/theme";

export default function Index() {
  const [started, setStarted] = useState(false); 
  // creates a piece of state - started is the current value (false) 
  // and setStarted is the only way to change it

  // --------- Game Screen ------------
    if (started) {
        return (
            <View style={styles.screen}>
                <Text style={styles.title}>Game started!</Text>
            </View>
        );
    }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home Screen</Text>
      <Pressable style={styles.button} onPress={() => setStarted(true)}>
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
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
  },
  buttonText: {
    color: colors.accentText,
    fontSize: font.sizes.body,
    fontWeight: font.weight.bold,
  },
  title: {
    fontFamily: font.display,   // Georgia serif
    fontSize: font.sizes.title,
    color: colors.text,
  },
});
