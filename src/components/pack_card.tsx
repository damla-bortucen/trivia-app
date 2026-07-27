import { Text, View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pack } from "@/game/types";
import { colors, spacing, radius, font } from "@/ui/theme";


export function PackCard({ pack, selected, disabled, onToggle}: {
    pack: Pack;
    selected: boolean;
    disabled: boolean;
    onToggle: () => void;
}) {
    return (
        <View style={[styles.card, { borderColor: pack.color }, selected && styles.cardOn]}>
            <Text style={styles.name} numberOfLines={2}>{pack.name}</Text>
            <Text style={styles.count}>{pack.questions.length} questions</Text>

            <Pressable
                style={styles.check}
                hitSlop={8}
                onPress={onToggle}
                disabled={disabled}
            >
                <Ionicons
                    name={selected ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={selected ? pack.color : disabled ? colors.border : colors.textMuted}
                />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        aspectRatio: 1.5,
        borderWidth: 1.5,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    cardOn: { borderWidth: 3 },
    body: {
        flex: 1,
        justifyContent: "center",
        gap: spacing.xs,
        padding: spacing.md,
        paddingRight: spacing.xl,
    },
    check: { position: "absolute", top: spacing.sm, right: spacing.sm },
    name: { fontSize: font.sizes.body, color: colors.text },
    count: { fontSize: font.sizes.caption, color: colors.textMuted },
});