import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { useTheme, applyAppearance } from "@/ui/theme";
import { loadAppearance } from "@/game/storage";

// runs once at load, before the first render, so a saved light/dark choice
// never flashes the system scheme first
applyAppearance(loadAppearance());

export default function RootLayout() {
  const { colors } = useTheme();
  const base = useColorScheme() === 'dark' ? DarkTheme : DefaultTheme;

  // the navigation container paints behind every screen, so it needs the
  // app's palette too or it flashes white during transitions
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
