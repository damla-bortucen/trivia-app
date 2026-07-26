import { useState } from "react";
import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Category } from "@/game/types";
import { getPacks } from "@/game/packs";
import { colors, spacing, radius, font } from "@/ui/theme";

const PACKS = getPacks();

export default function PacksScreen() {
    const [selected, setSelected] = useState<Category[]>(() => PACKS.map((p) => p.id));

    // use prev not selected ([...selected, id]) to avoid rapid clicks acting on the same array
    // prec governed by React so safe
    const toggle = (id: Category) =>
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]); 

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Packs</Text>

            <View style={styles.grid}>
                {PACKS.map((pack) => {
                    const on = selected.includes(pack.id);

                    return(
                        <View
                            key={pack.id}
                            style={[styles.card, { borderColor: pack.color }, on && styles.cardOn]}
                        >
                            <Text style={styles.name} numberOfLines={2}>{pack.name}</Text>
                            <Text style={styles.count}>{pack.questions.length} questions</Text>

                            <Pressable
                                style={styles.check}
                                hitSlop={8}
                                onPress={() => toggle(pack.id)}
                            >
                                <Ionicons
                                    name={on ? "checkmark-circle" : "ellipse-outline"}
                                    size={24}
                                    color={on ? pack.color : colors.textMuted}
                                />
                            </Pressable>
                        </View>
                    );
                })}
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
    check: { position: "absolute", top: spacing.sm, right: spacing.sm },
});