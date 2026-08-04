import { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";

import { Category, Pack } from "@/game/types";
import { getPacks, MAX_PACKS, DEFAULT_PACK_IDS } from "@/game/packs";
import { loadPacks, savePacks } from "@/game/storage";
import { PackCard } from "@/components/pack_card";
import { PackDetail } from "@/components/pack_detail";
import { colors, spacing, text } from "@/ui/theme";

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
                <Text style={text.label}>Selected ({selected.length}/{MAX_PACKS})</Text>

                <View style={styles.grid}>{chosen.map(renderCard)}</View>

                {available.length > 0 && (
                    <>
                        <Text style={text.label}>Available ({available.length})</Text> 
                        <View style={styles.grid}>{available.map(renderCard)}</View>
                    </>
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
    content: { padding: spacing.md, gap: spacing.md },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: spacing.md,
    },
});