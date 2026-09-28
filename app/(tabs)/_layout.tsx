/**
 * Tab navigator — bottom tabs for the main app shell.
 * Tabs: Home, History, Profile
 * The core booking flow (search → compare → handoff) lives outside tabs as full-screen stacks.
 */
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Colors, FontSize } from "../../src/theme";

function TabIcon({ symbol, focused }: { symbol: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{symbol}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mid,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.light,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="🗺️" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Trips",
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="🕓" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon symbol="👤" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
