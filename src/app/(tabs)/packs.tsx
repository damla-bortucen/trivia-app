import { Text, View, ScrollView, StyleSheet } from "react-native";

import { getPacks } from "@/game/packs";
import { colors, spacing, radius, font } from "@/ui/theme";

const PACKS = getPacks();

export default function PacksScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Packs</Text>

            <View style={styles.grid}>
                {PACKS.map((pack) => (
                    <View key={pack.id} style={[styles.card, { borderColor: pack.color }]}>
                        <Text style={styles.name} numberOfLines={2}>{pack.name}</Text>
                        <Text style={styles.count}>{pack.questions.length} questions</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, gap: spacing.md },
    title: {
        fontFamily: font.display,
        fontSize: font.sizes.title,
        color: colors.text,
        textAlign: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: spacing.md,
    },
    card: {
        width: "48%",
        aspectRatio: 1.5,
        justifyContent: "center",
        gap: spacing.xs,
        borderWidth: 1.5,
        borderRadius: radius.md,
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    name: { fontSize: font.sizes.body, color: colors.text },
    count: { fontSize: font.sizes.caption, color: colors.textMuted },
});