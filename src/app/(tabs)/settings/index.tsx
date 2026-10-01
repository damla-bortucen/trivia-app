import { useState } from "react";
import { Text, View, ScrollView, Pressable, StyleSheet, useColorScheme } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Host, Picker, Text as SwiftText } from "@expo/ui/swift-ui";
import { pickerStyle, tag } from "@expo/ui/swift-ui/modifiers";

import { AppearanceChoice } from "@/game/types";
import { loadAppearance, saveAppearance } from "@/game/storage";
import { useTheme, applyAppearance, Colors, spacing, radius } from "@/ui/theme";

const APPEARANCES: { value: AppearanceChoice; label: string }[] = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
];

export default function SettingsScreen() {
    const { colors, text } = useTheme();
    const styles = makeStyles(colors);
    const scheme = useColorScheme();

    const [appearance, setAppearance] = useState<AppearanceChoice>(() => loadAppearance());

    const chooseAppearance = (choice: AppearanceChoice) => {
        setAppearance(choice);
        saveAppearance(choice);
        applyAppearance(choice);
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.section}>
                <Text style={text.label}>Appearance</Text>
                {/* native SwiftUI segmented control - width comes from RN,
                    height from SwiftUI */}
                <Host matchContents={{ vertical: true }} colorScheme={scheme === "dark" ? "dark" : "light"}>
                    <Picker
                        modifiers={[pickerStyle("segmented")]}
                        label="Appearance"
                        selection={appearance}
                        onSelectionChange={chooseAppearance}
                    >
                        {APPEARANCES.map((a) => (
                            <SwiftText key={a.value} modifiers={[tag(a.value)]}>
                                {a.label}
                            </SwiftText>
                        ))}
                    </Picker>
                </Host>
            </View>

            <View style={styles.section}>
                <Text style={text.label}>Help</Text>
                <Link href="/settings/how-to-play" asChild>
                    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
                        <Text style={text.body}>How to play</Text>
                    </Pressable>
                </Link>
            </View>
        </ScrollView>
    );
}

const makeStyles = (colors: Colors) => StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, gap: spacing.lg },
    section: { gap: spacing.sm },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacing.md,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    rowPressed: { backgroundColor: colors.border },
});
