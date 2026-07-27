import { Text, View, StyleSheet, Pressable, Modal } from "react-native";

import { Pack, ALL_DIFFICULTIES } from "@/game/types";
import { MAX_PACKS } from "@/game/packs";
import { filterByDifficulty } from "@/game/question"
import { colors, spacing, radius, font } from "@/ui/theme";

export function PackDetail({ pack, selected, disabled, onToggle, onClose }: {
    pack: Pack;
    selected: boolean;
    disabled: boolean,
    onToggle: () => void;
    onClose: () => void;
}) {
    const examples = [
        filterByDifficulty(pack.questions, "easy")[0],
        filterByDifficulty(pack.questions, "hard")[0],
    ].filter((q) => q != null); // if no questions in the requested difficulty, any question thats not null 


    const label = !disabled
        ? selected ? "Remove" : "Add"
        : selected ? "Keep at least one pack" : `${MAX_PACKS} packs already selected`;

    
    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <View style={[styles.popup, { borderColor: pack.color }]}>
                    <Text style={styles.title}>{pack.name}</Text>

                    <Text style={styles.description}>{pack.description}</Text>

                    <View style={styles.stats}>
                        <Text style={styles.stat}>{pack.questions.length} questions:</Text>
                        {ALL_DIFFICULTIES.map((d) => (
                            <Text key={d} style={styles.stat}>
                                {filterByDifficulty(pack.questions, d).length} {d}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.examples}>
                        {examples.map((q) => (
                            <Text key={q.id} style={styles.example} numberOfLines={4}>
                                {q.question}
                            </Text>
                        ))}
                    </View>

                    <Pressable
                        onPress={onToggle}
                        disabled={disabled}
                        style={[
                            styles.action,
                            { borderColor: pack.color },
                            selected && { backgroundColor: pack.color },
                            disabled && styles.actionDisabled,
                        ]}
                    >
                        <Text style={styles.actionText}>{label}</Text>
                    </Pressable>

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
    action: {
        alignSelf: "flex-start",
        marginTop: spacing.sm,
        borderWidth: 1.5,
        borderRadius: radius.pill,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
    },
    actionDisabled: { opacity: 0.4 },
    actionText: { fontSize: font.sizes.caption, color: colors.text },
});