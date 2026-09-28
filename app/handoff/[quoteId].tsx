/**
 * SCREEN 8 — Handoff / Booking Status
 *
 * Shown immediately after the user taps "Open [Provider]".
 * Resolves the deep-link chain and reports back:
 *   - Attempting deep link…
 *   - App opened / failed
 *   - Destination prefilled / not prefilled
 *   - Fallback options (web / store / copy address)
 *
 * Also the anchor for trip sharing and emergency action.
 * No real deep-link logic yet.
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
import { Badge, Button, Divider, PlaceholderBlock } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

type HandoffState = "attempting" | "success" | "partial" | "failed";

const STATE_COPY: Record<
  HandoffState,
  { icon: string; title: string; body: string; badgeType: "live" | "assigned" | "estimate" | "error" | "neutral"; badgeLabel: string }
> = {
  attempting: {
    icon: "⏳",
    title: "Opening provider…",
    body: "Launching the provider app with your trip details.",
    badgeType: "neutral",
    badgeLabel: "Connecting",
  },
  success: {
    icon: "✅",
    title: "Provider app opened",
    body: "Your destination was transferred. Complete your booking inside the provider app.",
    badgeType: "assigned",
    badgeLabel: "Handoff complete",
  },
  partial: {
    icon: "⚠️",
    title: "App opened — destination not filled",
    body: "The provider app opened but couldn't pre-fill your destination. Copy the address below and paste it in.",
    badgeType: "estimate",
    badgeLabel: "Partial handoff",
  },
  failed: {
    icon: "❌",
    title: "Could not open provider app",
    body: "We couldn't launch the provider app. Use one of the fallback options below.",
    badgeType: "error",
    badgeLabel: "Handoff failed",
  },
};

export default function HandoffScreen() {
  const router = useRouter();
  const { quoteId } = useLocalSearchParams<{ quoteId: string }>();

  // Stub: cycle through states with a toggle (real logic will drive this)
  const [handoffState, setHandoffState] = useState<HandoffState>("success");

  const copy = STATE_COPY[handoffState];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Handoff</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Status card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>{copy.icon}</Text>
          <View style={styles.statusText}>
            <View style={styles.statusTitleRow}>
              <Text style={styles.statusTitle}>{copy.title}</Text>
              <Badge label={copy.badgeLabel} type={copy.badgeType} />
            </View>
            <Text style={styles.statusBody}>{copy.body}</Text>
          </View>
        </View>

        {/* Dev-only state switcher — remove before launch */}
        <View style={styles.devRow}>
          <Text style={styles.devLabel}>DEV — switch state:</Text>
          {(["attempting", "success", "partial", "failed"] as HandoffState[]).map(
            (s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.devChip,
                  handoffState === s && styles.devChipActive,
                ]}
                onPress={() => setHandoffState(s)}
              >
                <Text
                  style={[
                    styles.devChipText,
                    handoffState === s && styles.devChipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <Divider />

        {/* Trip summary */}
        <View style={styles.tripSummary}>
          <Text style={styles.sectionTitle}>Trip details</Text>
          <View style={styles.summaryRow}>
            <View style={styles.dotGreen} />
            <Text style={styles.summaryText}>Current location (pickup)</Text>
          </View>
          <View style={styles.summaryLine} />
          <View style={styles.summaryRow}>
            <View style={styles.dotRed} />
            <Text style={styles.summaryText}>Destination</Text>
          </View>
        </View>

        <Divider />

        {/* Fallback options — visible if partial or failed */}
        {(handoffState === "partial" || handoffState === "failed") && (
          <>
            <Text style={styles.sectionTitle}>Fallback options</Text>
            <View style={styles.fallbackList}>
              <FallbackOption icon="📋" label="Copy destination address" />
              <FallbackOption icon="🌐" label="Open provider website" />
              <FallbackOption icon="📲" label="Open in Play Store" />
              <FallbackOption icon="📞" label="Call provider" />
            </View>
            <Divider />
          </>
        )}

        {/* Safety tools */}
        <Text style={styles.sectionTitle}>Safety</Text>
        <View style={styles.safetyGrid}>
          <SafetyCard
            icon="📤"
            label="Share trip"
            sub="Send details to a contact"
          />
          <SafetyCard
            icon="🆘"
            label="Emergency"
            sub="Call 112 or local emergency"
          />
        </View>

        <Divider />

        {/* Provider info placeholder */}
        <PlaceholderBlock
          label="Provider contact / support info goes here"
          height={60}
        />

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* Bottom CTA: mark trip started */}
      {handoffState === "success" && (
        <View style={styles.ctaArea}>
          <Button
            label="Trip started — track it"
            onPress={() =>
              router.push({
                pathname: "/trip/[tripId]",
                params: { tripId: "trip_stub_1" },
              })
            }
          />
          <Text style={styles.ctaNote}>
            Tap after the provider confirms your driver.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function FallbackOption({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={styles.fallbackRow}>
      <Text style={styles.fallbackIcon}>{icon}</Text>
      <Text style={styles.fallbackLabel}>{label}</Text>
      <Text style={styles.fallbackChevron}>›</Text>
    </TouchableOpacity>
  );
}

function SafetyCard({
  icon,
  label,
  sub,
}: {
  icon: string;
  label: string;
  sub: string;
}) {
  return (
    <TouchableOpacity style={styles.safetyCard}>
      <Text style={styles.safetyIcon}>{icon}</Text>
      <Text style={styles.safetyLabel}>{label}</Text>
      <Text style={styles.safetySub}>{sub}</Text>
    </TouchableOpacity>
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
  // Status card
  statusCard: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.light,
    ...Shadow.card,
  },
  statusIcon: { fontSize: 32 },
  statusText: { flex: 1, gap: Spacing.xs },
  statusTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  statusTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  statusBody: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
    lineHeight: FontSize.sm * 1.6,
  },
  // Dev tools
  devRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: "#FFFDE7",
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  devLabel: { fontSize: FontSize.xs, color: Colors.mid },
  devChip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.light,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: Colors.white,
  },
  devChipActive: { backgroundColor: Colors.dark, borderColor: Colors.dark },
  devChipText: { fontSize: FontSize.xs, color: Colors.darkMid },
  devChipTextActive: { color: Colors.white },
  // Trip summary
  tripSummary: { gap: Spacing.xs, paddingVertical: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.mid,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  summaryRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  dotGreen: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.success },
  dotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  summaryLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.light,
    marginLeft: 4,
    marginVertical: 2,
  },
  summaryText: { fontSize: FontSize.base, color: Colors.dark },
  // Fallback
  fallbackList: { gap: Spacing.xs, marginBottom: Spacing.sm },
  fallbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  fallbackIcon: { fontSize: 18, width: 24, textAlign: "center" },
  fallbackLabel: { flex: 1, fontSize: FontSize.base, color: Colors.dark },
  fallbackChevron: { fontSize: FontSize.lg, color: Colors.light },
  // Safety
  safetyGrid: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  safetyCard: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: "center",
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  safetyIcon: { fontSize: 24 },
  safetyLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  safetySub: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    textAlign: "center",
  },
  // CTA
  ctaArea: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    gap: Spacing.sm,
  },
  ctaNote: {
    fontSize: FontSize.xs,
    color: Colors.mid,
    textAlign: "center",
  },
});
