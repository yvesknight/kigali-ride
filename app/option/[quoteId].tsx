/**
 * SCREEN 7 — Option Detail
 *
 * Expanded view of a single provider quote before the user commits to handoff.
 * Shows full pricing breakdown, quote freshness, capability level explanation,
 * payment methods, and the primary action (Open provider / Book).
 *
 * No real data yet — driven by stub quote id lookup.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge, Button, Divider, PlaceholderBlock } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

// Reuse the same stub data shape from compare screen
const STUB: Record<
  string,
  {
    provider: string;
    vehicleType: string;
    priceMin: number;
    priceMax: number;
    currency: string;
    etaMinutes?: number;
    source: "live" | "estimate";
    updatedSecondsAgo: number;
    expiresInSeconds?: number;
    providerColor: string;
    capabilityLevel: "L0" | "L1" | "L2";
    paymentMethods: string[];
    pricingNote: string;
  }
> = {
  q1: {
    provider: "YEGO",
    vehicleType: "Cab",
    priceMin: 3100,
    priceMax: 3500,
    currency: "RWF",
    source: "estimate",
    updatedSecondsAgo: 20,
    providerColor: Colors.providerYego,
    capabilityLevel: "L0",
    paymentMethods: ["Cash", "MTN MoMo"],
    pricingNote:
      "Based on current route distance. Final price set by YEGO at trip end.",
  },
  q2: {
    provider: "Move",
    vehicleType: "Car",
    priceMin: 3450,
    priceMax: 3450,
    currency: "RWF",
    etaMinutes: 6,
    source: "live",
    updatedSecondsAgo: 8,
    expiresInSeconds: 35,
    providerColor: Colors.providerMove,
    capabilityLevel: "L1",
    paymentMethods: ["Cash", "MTN MoMo", "Airtel Money"],
    pricingNote: "Live price from Move. Expires in ~35 seconds.",
  },
  q3: {
    provider: "Zelo",
    vehicleType: "Moto",
    priceMin: 1200,
    priceMax: 1500,
    currency: "RWF",
    etaMinutes: 3,
    source: "live",
    updatedSecondsAgo: 15,
    expiresInSeconds: 50,
    providerColor: Colors.providerZelo,
    capabilityLevel: "L1",
    paymentMethods: ["Cash", "MTN MoMo"],
    pricingNote: "Live price from Zelo.",
  },
  q4: {
    provider: "Tugende",
    vehicleType: "Car",
    priceMin: 2900,
    priceMax: 3200,
    currency: "RWF",
    source: "estimate",
    updatedSecondsAgo: 45,
    providerColor: Colors.providerTugende,
    capabilityLevel: "L0",
    paymentMethods: ["Cash"],
    pricingNote:
      "Estimated from Tugende's published fare model. Verify in-app.",
  },
  q5: {
    provider: "GreenRide",
    vehicleType: "Electric",
    priceMin: 3800,
    priceMax: 4100,
    currency: "RWF",
    etaMinutes: 9,
    source: "estimate",
    updatedSecondsAgo: 30,
    providerColor: Colors.providerGreenRide,
    capabilityLevel: "L0",
    paymentMethods: ["Cash", "MTN MoMo", "Visa"],
    pricingNote: "Estimated price. Electric vehicle — no surge.",
  },
};

const CAPABILITY_COPY: Record<"L0" | "L1" | "L2", { title: string; body: string; icon: string }> = {
  L0: {
    icon: "📊",
    title: "Price estimate",
    body: "This is our calculated estimate based on the provider's published fares. You will be handed off to the provider app to get the final price and book.",
  },
  L1: {
    icon: "📡",
    title: "Live quote",
    body: "This price came directly from the provider and reflects current availability. Tap to continue booking inside the provider app.",
  },
  L2: {
    icon: "✅",
    title: "Full booking",
    body: "You can complete the entire booking here. Driver details and live tracking will appear once assigned.",
  },
};

export default function OptionDetailScreen() {
  const router = useRouter();
  const { quoteId } = useLocalSearchParams<{ quoteId: string }>();
  const q = STUB[quoteId ?? "q1"] ?? STUB.q1;

  const isLive = q.source === "live";
  const priceLabel =
    q.priceMin === q.priceMax
      ? `${q.currency} ${q.priceMin.toLocaleString()}`
      : `${q.currency} ${q.priceMin.toLocaleString()}–${q.priceMax.toLocaleString()}`;

  const cap = CAPABILITY_COPY[q.capabilityLevel];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Option details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Provider hero */}
        <View style={[styles.hero, { borderTopColor: q.providerColor }]}>
          <View style={styles.heroLeft}>
            <View style={[styles.providerDot, { backgroundColor: q.providerColor }]} />
            <View>
              <Text style={styles.providerName}>{q.provider}</Text>
              <Text style={styles.vehicleType}>{q.vehicleType}</Text>
            </View>
          </View>
          <Badge
            label={isLive ? "Live" : "Estimate"}
            type={isLive ? "live" : "estimate"}
          />
        </View>

        {/* Price block */}
        <View style={styles.priceBlock}>
          <Text style={styles.price}>{priceLabel}</Text>
          <Text style={styles.priceNote}>{q.pricingNote}</Text>
          <Text style={styles.freshness}>
            Updated {q.updatedSecondsAgo}s ago
            {q.expiresInSeconds != null
              ? `  ·  Expires in ${q.expiresInSeconds}s`
              : ""}
          </Text>
        </View>

        <Divider />

        {/* ETA + meta row */}
        <View style={styles.metaGrid}>
          <MetaCell
            icon="⏱️"
            label="ETA"
            value={q.etaMinutes != null ? `${q.etaMinutes} min` : "Unavailable"}
          />
          <MetaCell icon="🚗" label="Vehicle" value={q.vehicleType} />
          <MetaCell icon="💳" label="Payment" value={q.paymentMethods.join(", ")} />
        </View>

        <Divider />

        {/* Capability explanation */}
        <View style={styles.capBox}>
          <Text style={styles.capIcon}>{cap.icon}</Text>
          <View style={styles.capText}>
            <Text style={styles.capTitle}>{cap.title}</Text>
            <Text style={styles.capBody}>{cap.body}</Text>
          </View>
        </View>

        <Divider />

        {/* Route map placeholder */}
        <PlaceholderBlock
          label="🗺️  Route map with pickup → dropoff pins"
          height={160}
        />

        {/* Safety note */}
        <View style={styles.safetyBox}>
          <Text style={styles.safetyIcon}>🛡️</Text>
          <Text style={styles.safetyText}>
            Once you open {q.provider}, your trip is handled by them. For
            driver issues, vehicle problems, or fare disputes — contact{" "}
            {q.provider} support directly.
          </Text>
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaArea}>
        <Button
          label={
            q.capabilityLevel === "L2"
              ? `Book with ${q.provider}`
              : `Open ${q.provider}`
          }
          onPress={() =>
            router.push({
              pathname: "/handoff/[quoteId]",
              params: { quoteId },
            })
          }
        />
        {q.capabilityLevel !== "L2" && (
          <Text style={styles.ctaNote}>
            You will be taken to the {q.provider} app to complete your booking.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

function MetaCell({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaCell}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  backBtn: { width: 36, height: 36, justifyContent: "center" },
  backText: { fontSize: FontSize.lg, color: Colors.dark },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
  // Hero
  hero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderTopWidth: 3,
    borderTopColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.light,
    ...Shadow.card,
  },
  heroLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  providerDot: { width: 12, height: 12, borderRadius: 6 },
  providerName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  vehicleType: { fontSize: FontSize.sm, color: Colors.mid },
  // Price
  priceBlock: {
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  price: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  priceNote: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
    lineHeight: FontSize.sm * 1.6,
  },
  freshness: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    marginTop: Spacing.xs,
  },
  // Meta grid
  metaGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  metaCell: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  metaIcon: { fontSize: 18 },
  metaLabel: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
    textAlign: "center",
  },
  // Capability
  capBox: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  capIcon: { fontSize: 24 },
  capText: { flex: 1, gap: Spacing.xs },
  capTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  capBody: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
    lineHeight: FontSize.sm * 1.6,
  },
  // Safety
  safetyBox: {
    flexDirection: "row",
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  safetyIcon: { fontSize: 16 },
  safetyText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.mid,
    lineHeight: FontSize.xs * 1.7,
  },
  // CTA
  ctaArea: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    backgroundColor: Colors.surface,
    gap: Spacing.sm,
  },
  ctaNote: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    textAlign: "center",
    lineHeight: FontSize.xs * 1.6,
  },
});
