/**
 * SCREEN 4 — Home / Map
 *
 * Layout:
 *   - Full-screen map placeholder (Google Maps will mount here)
 *   - Bottom sheet with pickup detected + destination search trigger
 *   - Saved places row
 *
 * No real location or map logic yet.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlaceholderBlock, Badge } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

const SAVED_PLACES = [
  { icon: "🏠", label: "Home", sublabel: "KG 7 Ave, Kacyiru" },
  { icon: "💼", label: "Work", sublabel: "KN 3 Rd, Nyarugenge" },
  { icon: "⭐", label: "Kigali Arena", sublabel: "KG 13 Ave" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* ── Map area ─────────────────────────────────── */}
      <View style={styles.mapArea}>
        <PlaceholderBlock
          label="🗺️  Google Maps — full-screen map renders here\nCurrent location pin + route overlay"
          height="100%"
          noPadding
          style={styles.mapPlaceholder}
        />

        {/* Top-left: logo badge */}
        <SafeAreaView
          style={styles.topBar}
          edges={["top"]}
          pointerEvents="box-none"
        >
          <View style={styles.topBarInner}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>KR</Text>
            </View>
            <Badge label="Kigali" type="neutral" />
          </View>
        </SafeAreaView>
      </View>

      {/* ── Bottom sheet ─────────────────────────────── */}
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Pickup row */}
        <View style={styles.pickupRow}>
          <View style={styles.dotGreen} />
          <View style={styles.pickupInfo}>
            <Text style={styles.pickupLabel}>Pickup</Text>
            <Text style={styles.pickupAddress} numberOfLines={1}>
              Detecting your location…
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Destination search trigger */}
        <TouchableOpacity
          style={styles.destinationBtn}
          onPress={() => router.push("/search")}
          accessibilityRole="button"
          accessibilityLabel="Search for destination"
        >
          <Text style={styles.destinationIcon}>🔍</Text>
          <Text style={styles.destinationText}>Where to?</Text>
        </TouchableOpacity>

        {/* Saved places */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.savedRow}
        >
          {SAVED_PLACES.map((place) => (
            <TouchableOpacity key={place.label} style={styles.savedCard}>
              <Text style={styles.savedIcon}>{place.icon}</Text>
              <View>
                <Text style={styles.savedLabel}>{place.label}</Text>
                <Text style={styles.savedSublabel} numberOfLines={1}>
                  {place.sublabel}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  // Map
  mapArea: {
    flex: 1,
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    borderRadius: 0,
    margin: 0,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBarInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.card,
  },
  logoText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  // Bottom sheet
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.sm,
    ...Shadow.sheet,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.light,
    borderRadius: Radius.pill,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  pickupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  pickupInfo: {
    flex: 1,
  },
  pickupLabel: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    fontWeight: FontWeight.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pickupAddress: {
    fontSize: FontSize.base,
    color: Colors.dark,
    fontWeight: FontWeight.medium,
  },
  editBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  editText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  // Destination
  destinationBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  destinationIcon: {
    fontSize: 16,
  },
  destinationText: {
    fontSize: FontSize.md,
    color: Colors.mid,
  },
  // Saved places
  savedRow: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light,
    minWidth: 150,
  },
  savedIcon: {
    fontSize: 20,
  },
  savedLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  savedSublabel: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    maxWidth: 110,
  },
} as any);
