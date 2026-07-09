import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors, font } from "@/ui/theme";


export default function TabLayout() {
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
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}

