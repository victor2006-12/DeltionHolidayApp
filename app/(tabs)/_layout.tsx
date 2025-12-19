import React from "react";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitleAlign: "left",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "#fff" },
        headerTitleStyle: { fontSize: 28, fontWeight: "900" },
        headerRight: () => (
          <Pressable style={{ marginRight: 16 }}>
            <MaterialCommunityIcons name="menu" size={26} color="#111827" />
          </Pressable>
        ),
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#e5e7eb" },
        tabBarIcon: ({ color, size }) => {
          let iconName: IconName = "help-circle";
          switch (route.name) {
            case "overview":
              iconName = "calendar-month";
              break;
            case "countdown":
              iconName = "timer-sand";
              break;
            case "settings":
              iconName = "cog";
              break;
            case "about":
              iconName = "information";
              break;
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="overview" options={{ title: "School Holidays" }} />
      <Tabs.Screen name="countdown" options={{ title: "Next Holiday" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen name="about" options={{ title: "About" }} />
    </Tabs>
  );
}
