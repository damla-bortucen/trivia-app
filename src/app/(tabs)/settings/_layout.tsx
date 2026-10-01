import { Stack } from 'expo-router';

import { useTheme } from "@/ui/theme";

// a stack inside the tab, so How to Play pushes with a back button and the
// tab bar stays put
export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="how-to-play" options={{ title: 'How to Play' }} />
    </Stack>
  );
}
