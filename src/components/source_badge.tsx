import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Source } from "@/game/types";
import { colors, spacing, font, text } from "@/ui/theme";

const SOURCES: Record<Source, {
    icon: keyof typeof Ionicons.glyphMap;
    short: string;
    full: string;
}> = {
    opentdb: { icon: "globe-outline", short: "OpenTDB", full: "Open Trivia Database" },
    generated: { icon: "sparkles-outline", short: "AI", full: "Written by AI" },
};

// full spells the source out, for where there is room to say it
export function SourceBadge({ source, full = false }: { source: Source; full?: boolean }) {
    const { icon, short, full: fullLabel } = SOURCES[source];

    return (
        <View style={styles.badge}>
            <Ionicons name={icon} size={font.sizes.caption} color={colors.textMuted} />
            <Text style={text.label}>{full ? fullLabel : short}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
});