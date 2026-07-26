import { Text, View, StyleSheet } from 'react-native';

import { colors, spacing, font } from "@/ui/theme";

export default function PacksScreen() {
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Packs</Text>
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
    title: {
        fontFamily: font.display,
        fontSize: font.sizes.title,
        color: colors.text,
        marginBottom: spacing.sm,
    },
});