import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, spacing, radius, font } from "@/ui/theme";

type Variant = "primary" | "link";

export function Button({
    label,
    onPress,
    variant = "primary",
    color,
    disabled = false,
    style,
}: {
    label: string;
    onPress: () => void;
    variant?: Variant;
    color?: string;        
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
}) {
    if (variant === "link") {
        return (
            <Pressable onPress={onPress} disabled={disabled} style={style}>
                <Text style={[styles.link, disabled && styles.disabled]}>{label}</Text>
            </Pressable>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                color && { backgroundColor: color },
                disabled && styles.disabled,
                style,
            ]}
        >
            <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.pill,
        alignItems: "center",
    },
    buttonText: {
        color: colors.accentText,
        fontSize: font.sizes.body,
        fontWeight: font.weight.bold,
        textTransform: "capitalize",
    },
    disabled: { opacity: 0.4 },
    link: { color: colors.textMuted, fontSize: font.sizes.body, textAlign: "center" },
});