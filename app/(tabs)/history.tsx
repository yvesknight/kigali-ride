/**
 * SCREEN 11 — Trip History
 *
 * Lists past trips with provider, route, fare, status, and rating.
 * Requires account — shows auth prompt if no session.
 * Stub data only — no Supabase query yet.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge, Button, Divider } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

// ── Stub data ──────────────────────────────────────────────────────────────
interface StubTrip {
  id: string;
  date: string;
  provider: string;
  providerColor: string;
  from: string;
  to: string;
  fare: string;
  status: "completed" | "cancelled";
  stars?: number;
}

const STUB_TRIPS: StubTrip[] = [
  {
    id: "t1",
    date: "Today, 09:14",
    provider: "Move",
    providerColor: Colors.providerMove,
    from: "Kacyiru",
    to: "Kigali Heights",
    fare: "RWF 3,450",
    status: "completed",
    stars: 5,
  },
  {
    id: "t2",
    date: "Yesterday, 18:32",
    provider: "YEGO",
    providerColor: Colors.providerYego,
    from: "Nyabugogo",
    to: "KBC",
    fare: "RWF 2,800",
    status: "completed",
    stars: 4,
  },
  {
    id: "t3",
    date: "Sep 26, 12:05",
    provider: "Zelo",
    providerColor: Colors.providerZelo,
    from: "Kimironko Market",
    to: "University of Rwanda",
    fare: "RWF 1,200",
    status: "cancelled",
  },
  {
    id: "t4",
    date: "Sep 25, 07:50",
    provider: "Tugende",
    providerColor: Colors.providerTugende,
    from: "Kicukiro",
    to: "Kigali Convention Centre",
    fare: "RWF 3,100",
    status: "completed",
    stars: 3,
  },
];

// ── Screen ─────────────────────────────────────────────────────────────────
// Stub auth state — flip to false to see unauthenticated view
const IS_AUTHENTICATED = true;

export default function HistoryScreen() {
  const router = useRouter();

  if (!IS_AUTHENTICATED) {
    return <UnauthenticatedState router={router} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trips</Text>
      </View>

      <FlatList
        data={STUB_TRIPS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🕓</Text>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyBody}>
              Your completed trips will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => <TripCard trip={item} router={router} />}
      />
    </SafeAreaView>
  );
}

// ── Trip Card ──────────────────────────────────────────────────────────────
function TripCard({ trip, router }: { trip: StubTrip; router: any }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push({ pathname: "/rating/[tripId]", params: { tripId: trip.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`Trip with ${trip.provider} from ${trip.from} to ${trip.to}`}
    >
      {/* Left accent */}
      <View style={[styles.cardAccent, { backgroundColor: trip.providerColor }]} />

      <View style={styles.cardBody}>
        {/* Top row */}
        <View style={styles.cardTopRow}>
          <Text style={styles.cardProvider}>{trip.provider}</Text>
          <View style={{ flex: 1 }} />
          <Badge
            label={trip.status === "completed" ? "Completed" : "Cancelled"}
            type={trip.status === "completed" ? "assigned" : "error"}
          />
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View style={styles.routeDots}>
            <View style={styles.dotGreen} />
            <View style={styles.routeLine} />
            <View style={styles.dotRed} />
          </View>
          <View style={styles.routeLabels}>
            <Text style={styles.routeText} numberOfLines={1}>{trip.from}</Text>
            <Text style={styles.routeText} numberOfLines={1}>{trip.to}</Text>
          </View>
        </View>

        {/* Bottom row */}
        <View style={styles.cardBottomRow}>
          <Text style={styles.cardDate}>{trip.date}</Text>
          <View style={{ flex: 1 }} />
          <Text style={styles.cardFare}>{trip.fare}</Text>
          {trip.stars != null && (
            <Text style={styles.cardStars}>
              {"★".repeat(trip.stars)}
              {"☆".repeat(5 - trip.stars)}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// ── Unauthenticated state ──────────────────────────────────────────────────
function UnauthenticatedState({ router }: { router: any }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trips</Text>
      </View>
      <View style={styles.authPrompt}>
        <Text style={styles.authIcon}>🔐</Text>
        <Text style={styles.authTitle}>Sign in to see your trips</Text>
        <Text style={styles.authBody}>
          Your trip history is saved to your account. Sign in with your phone
          number to access it across devices.
        </Text>
        <Button
          label="Sign in"
          onPress={() => router.push("/(onboarding)/auth")}
          style={{ marginTop: Spacing.md }}
        />
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  // Card
  card: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light,
    overflow: "hidden",
    ...Shadow.card,
  },
  cardAccent: { width: 4 },
  cardBody: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardProvider: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  routeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  routeDots: {
    alignItems: "center",
    gap: 2,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  routeLine: {
    width: 1,
    height: 12,
    backgroundColor: Colors.light,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  routeLabels: { flex: 1, gap: Spacing.xs },
  routeText: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardDate: { fontSize: FontSize.xs, color: Colors.mid },
  cardFare: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  cardStars: {
    fontSize: FontSize.xs,
    color: Colors.accent,
    letterSpacing: 1,
  },
  chevron: {
    width: 28,
    textAlign: "center",
    fontSize: FontSize.xl,
    color: Colors.light,
    alignSelf: "center",
  },
  // Empty
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingTop: Spacing.section,
    gap: Spacing.md,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  emptyBody: {
    fontSize: FontSize.base,
    color: Colors.mid,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
  // Auth
  authPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  authIcon: { fontSize: 48, marginBottom: Spacing.md },
  authTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
    textAlign: "center",
  },
  authBody: {
    fontSize: FontSize.base,
    color: Colors.mid,
    textAlign: "center",
    lineHeight: FontSize.base * 1.6,
  },
});
