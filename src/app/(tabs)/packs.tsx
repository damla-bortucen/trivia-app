import { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Category, Pack } from "@/game/types";
import { getPacks } from "@/game/packs";
import { loadPacks, savePacks } from "@/game/storage";
import { colors, spacing, radius, font } from "@/ui/theme";

const PACKS = getPacks();
const MAX_PACKS = 6;

// fresh install start with a full selection of valid packs
const DEFAULT_IDS = PACKS.slice(0, MAX_PACKS).map((p) => p.id);

export default function PacksScreen() {
    const [selected, setSelected] = useState<Category[]>(() => loadPacks() ?? DEFAULT_IDS);


    // persist whenever the selection changes
    useEffect(() => { savePacks(selected) }, [selected]);


    // use prev not selected ([...selected, id]) to avoid rapid clicks acting on the same array
    // prec governed by React so safe
    const toggle = (id: Category) => 
        setSelected((prev) => {
            const on = prev.includes(id);

            // blocked actions
            if (on && prev.length === 1) return prev; // there has to be one pack
            if (!on && prev.length >= MAX_PACKS) return prev; // there cant be more than 6

            return on ? prev.filter((x) => x !== id) : [...prev, id];
        }); 

    const chosen = PACKS.filter((p) => selected.includes(p.id));
    const available = PACKS.filter((p) => !selected.includes(p.id));
    

    const renderCard = (pack: Pack) => {
        const on = selected.includes(pack.id);
        const locked = !on && selected.length >= MAX_PACKS;
        const last = on && selected.length === 1;

        return (
            <View
                key={pack.id}
                style={[styles.card, { borderColor: pack.color }, on && styles.cardOn]}
            >
                <Text style={styles.name} numberOfLines={2}>{pack.name}</Text>
                <Text style={styles.count}>{pack.questions.length} questions</Text>

                <Pressable
                    style={styles.check}
                    hitSlop={10}
                    onPress={() => toggle(pack.id)}
                    disabled={locked || last}
                >
                    <Ionicons
                        name={on ? "checkmark-circle" : "ellipse-outline"}
                        size={24}
                        color={on ? pack.color : locked ? colors.border : colors.textMuted}
                    />
                </Pressable>
            </View>
        );
    };


    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Packs</Text>
            <Text style={styles.counter}>Selected ({selected.length}/{MAX_PACKS})</Text>

            <View style={styles.grid}>{chosen.map(renderCard)}</View>

            {available.length > 0 && (
                <>
                    <Text style={styles.counter}>Available ({available.length})</Text> 
                    <View style={styles.grid}>{available.map(renderCard)}</View>
                </>
            )}
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
    counter: {
        fontSize: font.sizes.caption,
        color: colors.textMuted,
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
    cardOn: { borderWidth: 2.5 },
    name: {
        fontSize: font.sizes.body,
        color: colors.text,
        paddingRight: spacing.lg,
    },
    count: { fontSize: font.sizes.caption, color: colors.textMuted },
    check: { position: "absolute", top: spacing.sm, right: spacing.sm },
});