/**
 * SCREEN 10 — Trip Completed / Rating
 *
 * Shown after trip ends. Structured feedback as per PRD:
 *   - Star rating
 *   - Tag chips (Price issue / Driver issue / etc.)
 *   - Optional comment
 *   - Trip summary card
 *   - Issue report shortcut
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

const RATING_TAGS = [
  { id: "price", label: "Price issue", icon: "💰" },
  { id: "driver", label: "Driver issue", icon: "🧑" },
  { id: "pickup", label: "Pickup problem", icon: "📍" },
  { id: "vehicle", label: "Vehicle problem", icon: "🚗" },
  { id: "safety", label: "Safety concern", icon: "🛡️" },
  { id: "app", label: "App problem", icon: "📱" },
];

export default function RatingScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const [stars, setStars] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // TODO: POST rating to Supabase, then navigate home
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>How was your ride?</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Trip summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Provider</Text>
            <Text style={styles.summaryValue}>Move</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Route</Text>
            <Text style={styles.summaryValue}>Current location → Destination</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated fare</Text>
            <Text style={styles.summaryValue}>RWF 3,450</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Final fare</Text>
            <Text style={[styles.summaryValue, styles.summaryFinal]}>
              RWF — (confirm with provider)
            </Text>
          </View>
        </View>

        <Divider />

        {/* Star rating */}
        <Text style={styles.sectionTitle}>Rate this trip</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setStars(s)}
              accessibilityRole="button"
              accessibilityLabel={`${s} star${s !== 1 ? "s" : ""}`}
              style={styles.starBtn}
            >
              <Text style={[styles.star, s <= stars && styles.starFilled]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider />

        {/* Tag chips — only shown after star selection */}
        {stars > 0 && (
          <>
            <Text style={styles.sectionTitle}>Anything specific?</Text>
            <View style={styles.tagsGrid}>
              {RATING_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag.id) && styles.tagChipActive,
                  ]}
                  onPress={() => toggleTag(tag.id)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selectedTags.includes(tag.id) }}
                >
                  <Text style={styles.tagIcon}>{tag.icon}</Text>
                  <Text
                    style={[
                      styles.tagLabel,
                      selectedTags.includes(tag.id) && styles.tagLabelActive,
                    ]}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Divider />

            {/* Comment */}
            <Text style={styles.sectionTitle}>Comment (optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell us more…"
              placeholderTextColor={Colors.mid}
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
              accessibilityLabel="Trip comment"
            />

            <Divider />
          </>
        )}

        {/* Report issue shortcut */}
        <TouchableOpacity style={styles.reportRow}>
          <Text style={styles.reportIcon}>⚠️</Text>
          <View>
            <Text style={styles.reportLabel}>Report a serious issue</Text>
            <Text style={styles.reportSub}>
              Safety concern, incorrect charge, lost property
            </Text>
          </View>
          <Text style={styles.reportChevron}>›</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaArea}>
        <Button
          label={stars > 0 ? "Submit feedback" : "Skip"}
          onPress={handleSubmit}
          variant={stars > 0 ? "primary" : "ghost"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  scroll: { paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
  // Summary
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light,
    ...Shadow.card,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: FontSize.sm, color: Colors.mid },
  summaryValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
    textAlign: "right",
    maxWidth: "60%",
  },
  summaryFinal: { color: Colors.warning },
  // Section
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.mid,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: Spacing.md,
  },
  // Stars
  starsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    justifyContent: "center",
    paddingVertical: Spacing.sm,
  },
  starBtn: { padding: Spacing.xs },
  star: {
    fontSize: 40,
    color: Colors.light,
  },
  starFilled: { color: Colors.accent },
  // Tags
  tagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.light,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
  },
  tagChipActive: {
    backgroundColor: Colors.primary + "18",
    borderColor: Colors.primary,
  },
  tagIcon: { fontSize: 14 },
  tagLabel: { fontSize: FontSize.sm, color: Colors.darkMid },
  tagLabelActive: { color: Colors.primary, fontWeight: FontWeight.medium },
  // Comment
  commentInput: {
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: FontSize.base,
    color: Colors.dark,
    textAlignVertical: "top",
    backgroundColor: Colors.white,
    minHeight: 96,
  },
  // Report
  reportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light,
    marginBottom: Spacing.sm,
  },
  reportIcon: { fontSize: 20 },
  reportLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
  },
  reportSub: { fontSize: FontSize.xs, color: Colors.mid, marginTop: 2 },
  reportChevron: { marginLeft: "auto", fontSize: FontSize.lg, color: Colors.light },
  // CTA
  ctaArea: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
  },
} as any);
