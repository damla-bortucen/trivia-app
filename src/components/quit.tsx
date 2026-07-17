import { Pressable, View, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/ui/theme";

export function Quit({ onQuit }: { onQuit: () => void }) {
    const confirmQuit = () =>
        Alert.alert("Quit game?", "Current scores will be lost.", [
            { text: "Cancel", style: "cancel" },
            { text: "Quit", style: "destructive", onPress: onQuit },
        ]);
    
    return (
        <View style={styles.header}>
            <Pressable onPress={confirmQuit} hitSlop={8}>
                {({ pressed }) => (
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={pressed ? colors.text : colors.textMuted}
                    />
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs,
    },
});