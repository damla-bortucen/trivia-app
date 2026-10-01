import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from "@/ui/theme";


export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: colors.text,
      tabBarInactiveTintColor: colors.textMuted,
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      },
    }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="packs"
        options={{
          title: 'Packs',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'albums-sharp' : 'albums-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,   // settings has its own stack, which draws the header
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}

