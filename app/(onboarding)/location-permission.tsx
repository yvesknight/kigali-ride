/**
 * SCREEN 2 — Location Permission
 * Asks for foreground location access before entering the main app.
 * Actual expo-location permission call is stubbed — no logic yet.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, PlaceholderBlock } from "../../src/components/ui";
import { Colors, FontSize, FontWeight, Spacing } from "../../src/theme";

export default function LocationPermissionScreen() {
  const router = useRouter();

  const handleAllow = () => {
    // TODO: call expo-location requestForegroundPermissionsAsync()
    router.replace("/(tabs)/home");
  };

  const handleSkip = () => {
    // TODO: flag as manual-pickup mode
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration placeholder */}
        <PlaceholderBlock
          label="📍  Location illustration (SVG asset goes here)"
          height={220}
          style={styles.illustration}
        />

        <Text style={styles.heading}>Where are you?</Text>
        <Text style={styles.body}>
          Kigali Ride uses your current location to detect your pickup point and
          show accurate price estimates from nearby providers.
        </Text>

        <Text style={styles.privacy}>
          Your location is only used while the app is open. Read our Privacy
          Policy to learn how we handle your data.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Allow location access" onPress={handleAllow} />
        <Button
          label="Set pickup manually"
          onPress={handleSkip}
          variant="ghost"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
    paddingBottom: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.base,
  },
  illustration: {
    marginBottom: Spacing.lg,
  },
  heading: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  body: {
    fontSize: FontSize.base,
    color: Colors.darkMid,
    lineHeight: FontSize.base * 1.6,
  },
  privacy: {
    fontSize: FontSize.sm,
    color: Colors.mid,
    lineHeight: FontSize.sm * 1.6,
  },
  actions: {
    gap: Spacing.sm,
  },
});
