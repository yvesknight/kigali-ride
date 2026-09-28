/**
 * SCREEN 13 — Help & Support
 *
 * Sections:
 *   - Search help (stub)
 *   - Common topics
 *   - Support boundaries (aggregator vs provider)
 *   - Contact options
 *   - Report an issue
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../src/theme";

// ── Help topics ────────────────────────────────────────────────────────────
const AGGREGATOR_TOPICS = [
  {
    icon: "💰",
    title: "Why is my comparison price different from the final fare?",
    sub: "Price estimates vs live quotes",
  },
  {
    icon: "📲",
    title: "The provider app didn't open correctly",
    sub: "Deep-link handoff issues",
  },
  {
    icon: "📍",
    title: "My destination wasn't transferred to the provider",
    sub: "Handoff pre-fill failures",
  },
  {
    icon: "📱",
    title: "App crashed or froze",
    sub: "Technical problems",
  },
  {
    icon: "👤",
    title: "Account & saved places",
    sub: "Profile, history, deletion",
  },
  {
    icon: "🔒",
    title: "Privacy & your data",
    sub: "What we store and why",
  },
];

const PROVIDER_TOPICS = [
  { icon: "🧑", title: "Driver behaviour issue" },
  { icon: "🚗", title: "Vehicle condition" },
  { icon: "🧾", title: "Final fare dispute" },
  { icon: "❌", title: "Driver cancelled on me" },
  { icon: "🎒", title: "Lost property" },
  { icon: "🛡️", title: "Trip safety incident" },
];

const CONTACT_OPTIONS = [
  { icon: "💬", label: "Chat with us", sub: "Typical reply in <2 hours" },
  { icon: "📧", label: "Email support", sub: "support@kigaliride.app" },
  { icon: "📞", label: "Call us", sub: "+250 XXX XXX XXX" },
];

// ── Screen ─────────────────────────────────────────────────────────────────
export default function HelpScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search help articles…"
            placeholderTextColor={Colors.mid}
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search help"
          />
        </View>

        <Divider />

        {/* Aggregator topics */}
        <SectionHeader
          title="Kigali Ride can help with"
          note="These are app-level issues we handle directly."
        />
        <View style={styles.topicList}>
          {AGGREGATOR_TOPICS.map((t) => (
            <TopicRow key={t.title} icon={t.icon} title={t.title} sub={t.sub} />
          ))}
        </View>

        <Divider />

        {/* Provider boundary callout */}
        <View style={styles.boundaryBox}>
          <Text style={styles.boundaryIcon}>⚠️</Text>
          <View style={styles.boundaryText}>
            <Text style={styles.boundaryTitle}>
              Some issues must go to the provider
            </Text>
            <Text style={styles.boundaryBody}>
              Kigali Ride hands you off to providers for booking. Driver
              behaviour, vehicle conditions, final fare disputes, and trip
              incidents are handled by the provider's support team — not us.
            </Text>
          </View>
        </View>

        {/* Provider topics */}
        <SectionHeader
          title="Contact your provider for"
          note="Select your provider for their support contact."
        />
        <View style={styles.topicList}>
          {PROVIDER_TOPICS.map((t) => (
            <TopicRow key={t.title} icon={t.icon} title={t.title} />
          ))}
        </View>

        {/* Provider selector */}
        <View style={styles.providerRow}>
          {["YEGO", "Move", "Zelo", "Tugende", "Rapide", "GreenRide", "Mavo"].map(
            (p) => (
              <TouchableOpacity key={p} style={styles.providerChip}>
                <Text style={styles.providerChipText}>{p}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <Divider />

        {/* Contact us */}
        <SectionHeader title="Contact Kigali Ride" />
        <View style={styles.contactList}>
          {CONTACT_OPTIONS.map((c) => (
            <TouchableOpacity key={c.label} style={styles.contactRow}>
              <Text style={styles.contactIcon}>{c.icon}</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactSub}>{c.sub}</Text>
              </View>
              <Text style={styles.contactChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <View style={styles.sectionHeaderWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {note && <Text style={styles.sectionNote}>{note}</Text>}
    </View>
  );
}

function TopicRow({
  icon,
  title,
  sub,
}: {
  icon: string;
  title: string;
  sub?: string;
}) {
  return (
    <TouchableOpacity style={styles.topicRow}>
      <Text style={styles.topicIcon}>{icon}</Text>
      <View style={styles.topicContent}>
        <Text style={styles.topicTitle}>{title}</Text>
        {sub && <Text style={styles.topicSub}>{sub}</Text>}
      </View>
      <Text style={styles.topicChevron}>›</Text>
    </TouchableOpacity>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
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
  scroll: { paddingBottom: Spacing.xxxl },
  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    margin: Spacing.base,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.dark,
    padding: 0,
  },
  // Section header
  sectionHeaderWrap: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: 2,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.mid,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  sectionNote: {
    fontSize: FontSize.xs,
    color: Colors.mid,
  },
  // Topics
  topicList: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light,
    overflow: "hidden",
    ...Shadow.card,
    marginBottom: Spacing.sm,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  topicIcon: { fontSize: 18, width: 24, textAlign: "center" },
  topicContent: { flex: 1, gap: 2 },
  topicTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
  },
  topicSub: { fontSize: FontSize.xs, color: Colors.mid },
  topicChevron: { fontSize: FontSize.lg, color: Colors.light },
  // Boundary callout
  boundaryBox: {
    flexDirection: "row",
    gap: Spacing.md,
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent + "44",
  },
  boundaryIcon: { fontSize: 20 },
  boundaryText: { flex: 1, gap: Spacing.xs },
  boundaryTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  boundaryBody: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
    lineHeight: FontSize.sm * 1.6,
  },
  // Provider chips
  providerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  providerChip: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.white,
  },
  providerChipText: { fontSize: FontSize.sm, color: Colors.darkMid },
  // Contact
  contactList: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light,
    overflow: "hidden",
    ...Shadow.card,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  contactIcon: { fontSize: 20, width: 28, textAlign: "center" },
  contactInfo: { flex: 1, gap: 2 },
  contactLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
  },
  contactSub: { fontSize: FontSize.xs, color: Colors.mid },
  contactChevron: { fontSize: FontSize.lg, color: Colors.light },
});
