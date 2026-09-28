/**
 * SCREEN 12 — Profile / Saved Places
 *
 * Sections:
 *   - User info (phone, name)
 *   - Saved places (Home / Work / custom)
 *   - App settings (language, notifications)
 *   - Legal (Privacy, Terms)
 *   - Account actions (delete, sign out)
 *
 * Requires account for most actions — shows auth prompt if unauthenticated.
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
import { Button, Divider } from "../../src/components/ui";
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadow,
  Spacing,
} from "../../src/theme";

// Stub auth state — flip to test unauthenticated view
const IS_AUTHENTICATED = true;

const SAVED_PLACES = [
  { id: "home", icon: "🏠", label: "Home", address: "KG 7 Ave, Kacyiru" },
  { id: "work", icon: "💼", label: "Work", address: "KN 3 Rd, Nyarugenge" },
];

const SETTINGS_ROWS = [
  { icon: "🌐", label: "Language", value: "English", action: () => {} },
  { icon: "🔔", label: "Notifications", value: "On", action: () => {} },
];

const LEGAL_ROWS = [
  { icon: "🔒", label: "Privacy Policy", href: "https://kigaliride.app/privacy" },
  { icon: "📄", label: "Terms of Service", href: "https://kigaliride.app/terms" },
  { icon: "🤝", label: "Provider Agreements", href: "https://kigaliride.app/providers" },
];

const SUPPORT_ROWS = [
  { icon: "❓", label: "Help & Support" },
  { icon: "⚠️", label: "Report an app issue" },
];

export default function ProfileScreen() {
  const router = useRouter();

  if (!IS_AUTHENTICATED) {
    return <UnauthView router={router} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JP</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Jean-Paul</Text>
            <Text style={styles.userPhone}>+250 7XX XXX XXX</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Saved places */}
        <SectionHeader title="Saved places" action="+ Add" />
        <View style={styles.section}>
          {SAVED_PLACES.map((place) => (
            <TouchableOpacity key={place.id} style={styles.row}>
              <View style={styles.rowIcon}>
                <Text style={styles.rowIconText}>{place.icon}</Text>
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{place.label}</Text>
                <Text style={styles.rowSub}>{place.address}</Text>
              </View>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.row, styles.rowAdd]}>
            <View style={[styles.rowIcon, styles.rowIconAdd]}>
              <Text style={styles.rowIconText}>＋</Text>
            </View>
            <Text style={[styles.rowLabel, { color: Colors.primary }]}>
              Add new place
            </Text>
          </TouchableOpacity>
        </View>

        <Divider />

        {/* Settings */}
        <SectionHeader title="Settings" />
        <View style={styles.section}>
          {SETTINGS_ROWS.map((row) => (
            <TouchableOpacity
              key={row.label}
              style={styles.row}
              onPress={row.action}
            >
              <View style={styles.rowIcon}>
                <Text style={styles.rowIconText}>{row.icon}</Text>
              </View>
              <Text style={[styles.rowLabel, { flex: 1 }]}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider />

        {/* Support */}
        <SectionHeader title="Support" />
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => router.push("/help")}>
            <View style={styles.rowIcon}><Text style={styles.rowIconText}>❓</Text></View>
            <Text style={[styles.rowLabel, { flex: 1 }]}>Help & Support</Text>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowIcon}><Text style={styles.rowIconText}>⚠️</Text></View>
            <Text style={[styles.rowLabel, { flex: 1 }]}>Report an app issue</Text>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <Divider />
        <SectionHeader title="Legal & Privacy" />
        <View style={styles.section}>
          {LEGAL_ROWS.map((row) => (
            <TouchableOpacity key={row.label} style={styles.row}>
              <View style={styles.rowIcon}>
                <Text style={styles.rowIconText}>{row.icon}</Text>
              </View>
              <Text style={[styles.rowLabel, { flex: 1 }]}>{row.label}</Text>
              <Text style={styles.rowChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider />

        {/* Account actions */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowIcon}>
              <Text style={styles.rowIconText}>📥</Text>
            </View>
            <Text style={[styles.rowLabel, { flex: 1 }]}>Download my data</Text>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowIcon}>
              <Text style={styles.rowIconText}>🚪</Text>
            </View>
            <Text style={[styles.rowLabel, { flex: 1 }]}>Sign out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.row}>
            <View style={styles.rowIcon}>
              <Text style={styles.rowIconText}>🗑️</Text>
            </View>
            <Text style={[styles.rowLabel, { flex: 1, color: Colors.error }]}>
              Delete account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Kigali Ride v1.0.0 · SDK 57</Text>
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && <TouchableOpacity>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>}
    </View>
  );
}

function UnauthView({ router }: { router: any }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.authPrompt}>
        <Text style={styles.authIcon}>👤</Text>
        <Text style={styles.authTitle}>Create your account</Text>
        <Text style={styles.authBody}>
          Sign in to save places, view trip history, and manage your
          preferences.
        </Text>
        <Button
          label="Sign in with phone"
          onPress={() => router.push("/(onboarding)/auth")}
          style={{ marginTop: Spacing.md }}
        />
        <Button
          label="Continue as guest"
          variant="ghost"
          onPress={() => {}}
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
  scroll: { paddingBottom: Spacing.xxxl },
  // User card
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  userInfo: { flex: 1, gap: 2 },
  userName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  userPhone: { fontSize: FontSize.sm, color: Colors.mid },
  editBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  // Section
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.mid,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  sectionAction: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  section: {
    marginHorizontal: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.light,
    overflow: "hidden",
    ...Shadow.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceAlt,
  },
  rowAdd: { borderBottomWidth: 0 },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconAdd: { backgroundColor: Colors.primary + "18" },
  rowIconText: { fontSize: 16 },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.dark,
  },
  rowSub: { fontSize: FontSize.xs, color: Colors.mid },
  rowValue: { fontSize: FontSize.sm, color: Colors.mid },
  rowChevron: { fontSize: FontSize.lg, color: Colors.light },
  version: {
    textAlign: "center",
    fontSize: FontSize.xs,
    color: Colors.mid,
    marginTop: Spacing.xl,
  },
  // Auth prompt
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
