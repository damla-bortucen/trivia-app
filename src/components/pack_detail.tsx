import { Text, View, StyleSheet, Pressable, Modal } from "react-native";

import { Pack, ALL_DIFFICULTIES } from "@/game/types";
import { MAX_PACKS } from "@/game/packs";
import { colors, spacing, radius, font } from "@/ui/theme";

export function PackDetail({ pack, onClose }: {
    pack: Pack;
    onClose: () => void;
}) {
    const examples = [pack.questions[0], pack.questions[1]]
    
    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <View style={[styles.popup, { borderColor: pack.color }]}>
                    <Text style={styles.title}>{pack.name}</Text>

                    <Text style={styles.description}>{pack.description}</Text>

                    <View style={styles.stats}>
                        <Text style={styles.stat}>{pack.questions.length} questions</Text>
                    </View>

                    <View style={styles.examples}>
                        {examples.map((q) => (
                            <Text key={q.id} style={styles.example} numberOfLines={4}>
                                {q.question}
                            </Text>
                        ))}
                    </View>

                    <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
                        <Text style={styles.closeText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",        
        padding: spacing.lg,
    },
    popup: {
        width: "100%",
        gap: spacing.md,
        borderWidth: 2,
        borderRadius: radius.md,
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    title: { fontFamily: font.display, fontSize: font.sizes.heading, color: colors.text },
    description: { fontSize: font.sizes.body, color: colors.textMuted },
    stats: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
    stat: { fontSize: font.sizes.caption, color: colors.textMuted },
    examples: {
        gap: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    example: { fontSize: font.sizes.caption, color: colors.text },
    close: { alignSelf: "center", paddingTop: spacing.xs },
    closeText: { fontSize: font.sizes.caption, color: colors.textMuted },
});