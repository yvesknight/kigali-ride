/**
 * SCREEN 9 — Live Trip
 *
 * Shown while a trip is in progress (L1/L2).
 * For L0 handoffs: shows a lightweight "trip in progress" confirmation
 * with safety tools, since we don't have live driver data.
 *
 * Layout:
 *   - Full map (driver pin + route)
 *   - Bottom sheet: driver card, status, ETA, actions
 *   - Emergency strip always visible
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge, Button, PlaceholderBlock } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

type TripStatusUI = "driver_assigned" | "en_route" | "arrived" | "in_progress";

const STATUS_COPY: Record<TripStatusUI, { label: string; icon: string; badge: "assigned" | "live" | "neutral" }> = {
  driver_assigned: { label: "Driver assigned", icon: "🚗", badge: "assigned" },
  en_route: { label: "Driver on the way", icon: "🚗💨", badge: "live" },
  arrived: { label: "Driver arrived", icon: "📍", badge: "assigned" },
  in_progress: { label: "Trip in progress", icon: "🛣️", badge: "live" },
};

export default function LiveTripScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [status, setStatus] = useState<TripStatusUI>("en_route");

  const { label, icon, badge } = STATUS_COPY[status];

  return (
    <View style={styles.container}>
      {/* Map area */}
      <PlaceholderBlock
        label="🗺️  Live map — driver pin + route overlay\nReal-time position from provider (L1/L2)"
        height="55%"
        style={styles.map}
        noPadding
      />

      {/* Emergency strip */}
      <TouchableOpacity style={styles.emergencyStrip} accessibilityRole="button">
        <Text style={styles.emergencyText}>🆘 Emergency — tap to call 112</Text>
      </TouchableOpacity>

      {/* Bottom sheet */}
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <View style={styles.handle} />

        {/* Status row */}
        <View style={styles.statusRow}>
          <Text style={styles.statusIcon}>{icon}</Text>
          <View style={styles.statusInfo}>
            <Badge label={label} type={badge} />
            <Text style={styles.eta}>ETA 4 min · 1.2 km away</Text>
          </View>
        </View>

        {/* Driver card (L1/L2 only) */}
        <View style={styles.driverCard}>
          <PlaceholderBlock
            label="Driver photo"
            height={56}
            style={styles.driverPhoto}
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Jean-Paul K.</Text>
            <Text style={styles.driverMeta}>★ 4.8  ·  Toyota Corolla</Text>
            <Text style={styles.driverMeta}>Plate: RAE 123 A</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        {/* Trip details */}
        <View style={styles.tripDetails}>
          <TripDetailRow label="From" value="Current location" />
          <TripDetailRow label="To" value="Destination" />
          <TripDetailRow label="Provider" value="Move" />
          <TripDetailRow label="Est. fare" value="RWF 3,450" />
        </View>

        {/* Safety actions */}
        <View style={styles.safetyRow}>
          <SafetyBtn icon="📤" label="Share trip" />
          <SafetyBtn icon="🆘" label="Emergency" />
          <SafetyBtn icon="⚠️" label="Report issue" />
        </View>

        {/* Dev state switcher */}
        <View style={styles.devRow}>
          {(Object.keys(STATUS_COPY) as TripStatusUI[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.devChip, status === s && styles.devChipActive]}
              onPress={() => setStatus(s)}
            >
              <Text
                style={[
                  styles.devChipText,
                  status === s && styles.devChipTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Complete trip (dev shortcut) */}
        <Button
          label="Trip completed →"
          variant="secondary"
          onPress={() =>
            router.replace({
              pathname: "/rating/[tripId]",
              params: { tripId: tripId ?? "trip_stub_1" },
            })
          }
          style={{ marginTop: Spacing.sm }}
        />
      </SafeAreaView>
    </View>
  );
}

function TripDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function SafetyBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.safetyBtn}>
      <Text style={styles.safetyBtnIcon}>{icon}</Text>
      <Text style={styles.safetyBtnLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  map: { borderRadius: 0, margin: 0, flex: 0 } as any,
  emergencyStrip: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  emergencyText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  sheet: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
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
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusIcon: { fontSize: 28 },
  statusInfo: { gap: Spacing.xs },
  eta: { fontSize: FontSize.sm, color: Colors.mid },
  // Driver card
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  driverPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    margin: 0,
  } as any,
  driverInfo: { flex: 1, gap: 2 },
  driverName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  driverMeta: { fontSize: FontSize.sm, color: Colors.mid },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success + "22",
    alignItems: "center",
    justifyContent: "center",
  },
  callIcon: { fontSize: 18 },
  // Trip details
  tripDetails: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: { fontSize: FontSize.sm, color: Colors.mid },
  detailValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
  },
  // Safety row
  safetyRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  safetyBtn: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  safetyBtnIcon: { fontSize: 18 },
  safetyBtnLabel: { fontSize: FontSize.xs, color: Colors.darkMid },
  // Dev
  devRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    backgroundColor: "#FFFDE7",
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  devChip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.light,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: Colors.white,
  },
  devChipActive: { backgroundColor: Colors.dark },
  devChipText: { fontSize: FontSize.xs, color: Colors.darkMid },
  devChipTextActive: { color: Colors.white },
} as any);
