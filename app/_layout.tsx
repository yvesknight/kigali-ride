/**
 * Root layout — wraps the entire app with providers.
 * Expo Router uses this as the entry shell.
 */
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Colors } from "../src/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Onboarding group */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />

        {/* Main app group */}
        <Stack.Screen name="(tabs)" />

        {/* Full-screen modal-style flows */}
        <Stack.Screen name="search" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="compare" />
        <Stack.Screen name="option/[quoteId]" />
        <Stack.Screen name="handoff/[quoteId]" />
        <Stack.Screen name="trip/[tripId]" />
        <Stack.Screen name="rating/[tripId]" />
        <Stack.Screen name="help" />
      </Stack>
    </SafeAreaProvider>
  );
}
