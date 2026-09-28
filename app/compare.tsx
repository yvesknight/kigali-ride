/**
 * SCREEN 6 — Comparison Screen
 *
 * THE core product screen. Shows all provider options side-by-side.
 * Each card shows: provider, vehicle type, price, price type (LIVE/ESTIMATE),
 * ETA, quote age, and a primary action.
 *
 * Sort controls: Price | ETA | Provider
 * No real quote logic yet — seeded with stub data.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Badge, PlaceholderBlock } from "../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../src/theme";

// ── Stub data ──────────────────────────────────────────────────────────────
type SortKey = "price" | "eta" | "provider";

interface StubQuote {
  id: string;
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
}

const STUB_QUOTES: StubQuote[] = [
  {
    id: "q1",
    provider: "YEGO",
    vehicleType: "Cab",
    priceMin: 3100,
    priceMax: 3500,
    currency: "RWF",
    etaMinutes: undefined,
    source: "estimate",
    updatedSecondsAgo: 20,
    providerColor: Colors.providerYego,
    capabilityLevel: "L0",
  },
  {
    id: "q2",
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
  },
  {
    id: "q3",
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
  },
  {
    id: "q4",
    provider: "Tugende",
    vehicleType: "Car",
    priceMin: 2900,
    priceMax: 3200,
    currency: "RWF",
    etaMinutes: undefined,
    source: "estimate",
    updatedSecondsAgo: 45,
    providerColor: Colors.providerTugende,
    capabilityLevel: "L0",
  },
  {
    id: "q5",
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
  },
];

// ── Sort helpers ───────────────────────────────────────────────────────────
function sortQuotes(quotes: StubQuote[], key: SortKey): StubQuote[] {
  return [...quotes].sort((a, b) => {
    if (key === "price") return a.priceMin - b.priceMin;
    if (key === "eta") {
      if (a.etaMinutes == null && b.etaMinutes == null) return 0;
      if (a.etaMinutes == null) return 1;
      if (b.etaMinutes == null) return -1;
      return a.etaMinutes - b.etaMinutes;
    }
    return a.provider.localeCompare(b.provider);
  });
}

function formatPrice(q: StubQuote): string {
  if (q.priceMin === q.priceMax) return `${q.currency} ${q.priceMin.toLocaleString()}`;
  return `${q.currency} ${q.priceMin.toLocaleString()}–${q.priceMax.toLocaleString()}`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CompareScreen() {
  const router = useRouter();
  const { destination } = useLocalSearchParams<{ destination?: string }>();
  const [sortKey, setSortKey] = useState<SortKey>("price");

  const sorted = sortQuotes(STUB_QUOTES, sortKey);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {destination ?? "Destination"}
          </Text>
          <Text style={styles.headerSub}>5 options · 2.4 km · ~8 min</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => router.back()}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Route summary strip */}
      <PlaceholderBlock
        label="🗺️  Compact route map strip"
        height={72}
        style={styles.routeStrip}
      />

      {/* Sort controls */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        {(["price", "eta", "provider"] as SortKey[]).map((k) => (
          <TouchableOpacity
            key={k}
            style={[styles.sortChip, sortKey === k && styles.sortChipActive]}
            onPress={() => setSortKey(k)}
          >
            <Text
              style={[
                styles.sortChipText,
                sortKey === k && styles.sortChipTextActive,
              ]}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quote cards */}
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <QuoteCard
            quote={item}
            onSelect={() =>
              router.push({
                pathname: "/option/[quoteId]",
                params: { quoteId: item.id },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

// ── Quote Card ─────────────────────────────────────────────────────────────
function QuoteCard({
  quote,
  onSelect,
}: {
  quote: StubQuote;
  onSelect: () => void;
}) {
  const isLive = quote.source === "live";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onSelect}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${quote.provider} ${quote.vehicleType}, ${formatPrice(quote)}`}
    >
      {/* Left: provider colour bar */}
      <View
        style={[styles.cardAccent, { backgroundColor: quote.providerColor }]}
      />

      <View style={styles.cardBody}>
        {/* Row 1: provider + vehicle + capability pill */}
        <View style={styles.cardTopRow}>
          <Text style={styles.cardProvider}>{quote.provider}</Text>
          <Text style={styles.cardVehicle}>{quote.vehicleType}</Text>
          <View style={{ flex: 1 }} />
          <CapabilityPill level={quote.capabilityLevel} />
        </View>

        {/* Row 2: price + source badge */}
        <View style={styles.cardPriceRow}>
          <Text style={styles.cardPrice}>{formatPrice(quote)}</Text>
          <Badge
            label={isLive ? "Live" : "Estimate"}
            type={isLive ? "live" : "estimate"}
          />
        </View>

        {/* Row 3: ETA + quote age */}
        <View style={styles.cardMetaRow}>
          <Text style={styles.cardMeta}>
            {quote.etaMinutes != null
              ? `ETA ${quote.etaMinutes} min`
              : "ETA unavailable"}
          </Text>
          <Text style={styles.cardDot}>·</Text>
          <Text style={styles.cardMeta}>
            Updated {quote.updatedSecondsAgo}s ago
          </Text>
          {quote.expiresInSeconds != null && (
            <>
              <Text style={styles.cardDot}>·</Text>
              <Text style={[styles.cardMeta, styles.expiring]}>
                Expires in {quote.expiresInSeconds}s
              </Text>
            </>
          )}
        </View>
      </View>

      {/* CTA chevron */}
      <View style={styles.cardChevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function CapabilityPill({ level }: { level: "L0" | "L1" | "L2" }) {
  const config = {
    L0: { label: "Estimate", color: Colors.mid },
    L1: { label: "Live quote", color: Colors.accent },
    L2: { label: "Full booking", color: Colors.success },
  };
  return (
    <View
      style={[
        styles.capPill,
        { borderColor: config[level].color + "55" },
      ]}
    >
      <Text style={[styles.capPillText, { color: config[level].color }]}>
        {config[level].label}
      </Text>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { fontSize: FontSize.lg, color: Colors.dark },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  headerSub: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    marginTop: 2,
  },
  editBtn: { paddingHorizontal: Spacing.xs },
  editText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  routeStrip: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  // Sort
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  sortLabel: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    fontWeight: FontWeight.medium,
    marginRight: Spacing.xs,
  },
  sortChip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 1,
    backgroundColor: Colors.surfaceAlt,
  },
  sortChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortChipText: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
    fontWeight: FontWeight.medium,
  },
  sortChipTextActive: {
    color: Colors.white,
  },
  // List
  list: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
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
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
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
  cardVehicle: {
    fontSize: FontSize.sm,
    color: Colors.mid,
  },
  capPill: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  capPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  cardPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardPrice: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    flexWrap: "wrap",
  },
  cardMeta: {
    fontSize: FontSize.xs,
    color: Colors.mid,
  },
  cardDot: {
    fontSize: FontSize.xs,
    color: Colors.light,
  },
  expiring: {
    color: Colors.warning,
    fontWeight: FontWeight.medium,
  },
  cardChevron: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronText: {
    fontSize: FontSize.xl,
    color: Colors.light,
  },
});
