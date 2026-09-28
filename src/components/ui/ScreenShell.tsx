/**
 * ScreenShell — wraps every screen with safe-area insets, background color,
 * and an optional header row.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, FontSize, FontWeight, Spacing } from "../../theme";

interface Props {
  title?: string;
  showBack?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

export default function ScreenShell({
  title,
  showBack = false,
  children,
  style,
  headerRight,
  noPadding = false,
}: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      {(title || showBack || headerRight) && (
        <View style={styles.header}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}

          {title ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {headerRight ? (
            <View style={styles.headerRight}>{headerRight}</View>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>
      )}

      {/* Content */}
      <View style={[styles.content, noPadding && styles.noPadding, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: FontSize.lg,
    color: Colors.dark,
  },
  headerSpacer: {
    width: 36,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.dark,
  },
  headerRight: {
    width: 36,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.base,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
});
