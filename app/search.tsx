/**
 * SCREEN 5 — Destination Search
 *
 * Layout:
 *   - Search input (autofocused)
 *   - Recent searches
 *   - Search results list (Google Places autocomplete goes here)
 *   - Selecting a result → /compare
 *
 * No real Places API call yet.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
} from "../src/theme";

const RECENT: { icon: string; label: string; sub: string }[] = [
  { icon: "🕓", label: "Kigali Convention Centre", sub: "KG 2 Roundabout" },
  { icon: "🕓", label: "Nyabugogo Bus Terminal", sub: "RN1, Nyarugenge" },
  { icon: "⭐", label: "Home", sub: "KG 7 Ave, Kacyiru" },
];

// Stub results — replace with Google Places API response
const STUB_RESULTS: { placeId: string; primary: string; secondary: string }[] =
  [
    {
      placeId: "stub_1",
      primary: "Kigali International Airport",
      secondary: "KK 15 Rd, Kanombe",
    },
    {
      placeId: "stub_2",
      primary: "Kimironko Market",
      secondary: "KG 11 Ave, Kimironko",
    },
    {
      placeId: "stub_3",
      primary: "Kigali Heights Mall",
      secondary: "KG 7 Ave, Kiyovu",
    },
    {
      placeId: "stub_4",
      primary: "University of Rwanda (CST)",
      secondary: "KK 737 St, Kicukiro",
    },
  ];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const results = query.length >= 2 ? STUB_RESULTS : [];

  const handleSelect = (placeId: string, label: string) => {
    // TODO: encode place into route params
    router.push({ pathname: "/compare", params: { destination: label } });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Search header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityLabel="Cancel search"
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.inputWrap}>
            {/* Pickup (read-only) */}
            <View style={styles.inputRow}>
              <View style={styles.dotGreen} />
              <Text style={styles.pickupText} numberOfLines={1}>
                Current location
              </Text>
            </View>

            <View style={styles.inputDivider} />

            {/* Destination input */}
            <View style={styles.inputRow}>
              <View style={styles.dotRed} />
              <TextInput
                style={styles.textInput}
                placeholder="Search destination…"
                placeholderTextColor={Colors.mid}
                autoFocus
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                accessibilityLabel="Destination search"
              />
            </View>
          </View>
        </View>

        <Divider style={{ marginVertical: 0 }} />

        {/* Results / recents */}
        {query.length < 2 ? (
          <>
            <Text style={styles.sectionLabel}>Recent</Text>
            {RECENT.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.resultRow}
                onPress={() => handleSelect("recent", item.label)}
              >
                <Text style={styles.resultIcon}>{item.icon}</Text>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultPrimary}>{item.label}</Text>
                  <Text style={styles.resultSecondary}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                onPress={() => handleSelect(item.placeId, item.primary)}
              >
                <Text style={styles.resultIcon}>📍</Text>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultPrimary}>{item.primary}</Text>
                  <Text style={styles.resultSecondary}>{item.secondary}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            }
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: FontSize.lg,
    color: Colors.dark,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light,
    gap: Spacing.xs,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 32,
  },
  inputDivider: {
    height: 1,
    backgroundColor: Colors.light,
    marginLeft: 18,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  dotRed: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  pickupText: {
    fontSize: FontSize.sm,
    color: Colors.darkMid,
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.dark,
    padding: 0,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.mid,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  resultIcon: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  resultInfo: {
    flex: 1,
  },
  resultPrimary: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
  },
  resultSecondary: {
    fontSize: FontSize.sm,
    color: Colors.mid,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.mid,
    marginTop: Spacing.xxl,
    fontSize: FontSize.base,
  },
});
