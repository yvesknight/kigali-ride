/**
 * SCREEN 1 — Splash
 * Shows brand mark for ~2s then routes to location permission.
 * No logic yet — manual "Continue" button for structure verification.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/ui";
import { Colors, FontSize, FontWeight, Spacing } from "../../src/theme";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand mark */}
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>KR</Text>
        </View>
        <Text style={styles.appName}>Kigali Ride</Text>
        <Text style={styles.tagline}>Compare. Choose. Go.</Text>
      </View>

      {/* Provider pills (placeholder) */}
      <View style={styles.providerRow}>
        {["YEGO", "Move", "Zelo", "Tugende", "Rapide"].map((p) => (
          <View key={p} style={styles.pill}>
            <Text style={styles.pillText}>{p}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          label="Get started"
          onPress={() => router.replace("/(onboarding)/location-permission")}
        />
        <Text style={styles.locale}>English · Kinyarwanda</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
    paddingVertical: Spacing.xxxl,
  },
  brand: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  logoText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  appName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  tagline: {
    fontSize: FontSize.md,
    color: Colors.white + "CC",
  },
  providerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  pill: {
    backgroundColor: Colors.white + "22",
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.white + "44",
  },
  pillText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  footer: {
    gap: Spacing.md,
    alignItems: "center",
  },
  locale: {
    fontSize: FontSize.sm,
    color: Colors.white + "88",
  },
});
