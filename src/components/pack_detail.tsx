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
            <View style={styles.background}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <View style={[styles.popup, { borderColor: pack.color }]}>
                    <Text style={styles.title}>{pack.name}</Text>

                    <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
                        <Text style={styles.closeText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",        
        padding: spacing.lg,
    },
    popup: {
        width: "100%",
        gap: spacing.sm,
        borderWidth: 2,
        borderRadius: radius.md,
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    title: { fontFamily: font.display, fontSize: font.sizes.heading, color: colors.text },
    close: { alignSelf: "center", paddingTop: spacing.xs },
    closeText: { fontSize: font.sizes.caption, color: colors.textMuted },
});