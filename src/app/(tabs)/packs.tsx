import { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";

import { ALL_SOURCES, Category, Pack } from "@/game/types";
import { getPacks, MAX_PACKS, DEFAULT_PACK_IDS } from "@/game/packs";
import { loadPacks, savePacks } from "@/game/storage";
import { PackCard } from "@/components/pack_card";
import { PackDetail } from "@/components/pack_detail";
import { colors, spacing, text } from "@/ui/theme";
import { sourceLabel } from "@/components/source_badge";


const PACKS = getPacks();

export default function PacksScreen() {
    const [selected, setSelected] = useState<Category[]>(() => loadPacks() ?? DEFAULT_PACK_IDS);
    const [detail, setDetail] = useState<Pack | null>(null);


    // persist whenever the selection changes
    useEffect(() => { savePacks(selected) }, [selected]);


    // the last pack cannot be unticked, and none can be added once six are chosen
    const isBlocked = (id: Category) =>
        selected.includes(id)
            ? selected.length === 1
            : selected.length >= MAX_PACKS;

    
    // use prev not selected ([...selected, id]) to avoid rapid clicks acting on the same array
    // prev governed by React so safe
    const toggle = (id: Category) => {
        if (isBlocked(id)) return;

        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const chosen = PACKS.filter((p) => selected.includes(p.id));
    const available = PACKS.filter((p) => !selected.includes(p.id));
    

    const renderCard = (pack: Pack) => (
        <PackCard
            key={pack.id}
            pack={pack}
            selected={selected.includes(pack.id)}
            disabled={isBlocked(pack.id)}
            onToggle={() => toggle(pack.id)}
            onPress={() => setDetail(pack)}
        />
    );


    return (
        <>
            <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={[text.body, styles.sectionTitle]}>Selected ({selected.length}/{MAX_PACKS})</Text>
                    <View style={styles.grid}>{chosen.map(renderCard)}</View>
                </View>

                {available.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[text.body, styles.sectionTitle]}>Available ({available.length})</Text>

                        {ALL_SOURCES.map((source) => {
                            const group = available.filter((p) => p.source === source);
                            if (group.length === 0) return null;

                            return (
                                <View key={source} style={styles.group}>
                                    <Text style={text.label}>{sourceLabel(source)} ({group.length})</Text>
                                    <View style={styles.grid}>{group.map(renderCard)}</View>
                                </View>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {detail && (
                <PackDetail 
                    pack={detail} 
                    selected={selected.includes(detail.id)}
                    disabled={isBlocked(detail.id)}
                    onToggle={() => toggle(detail.id)}
                    onClose={() => setDetail(null)} />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md, gap: spacing.lg },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: spacing.md,
    },
    section: { gap: spacing.md },
    group: { gap: spacing.sm },
    sectionTitle: { color: colors.textDarkMuted },
});