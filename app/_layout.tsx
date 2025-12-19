import React from "react";
import { Stack } from "expo-router";
import { AppSettingsProvider } from "../context/AppSettings";

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppSettingsProvider>
  );
}
