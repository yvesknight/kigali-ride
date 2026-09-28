/**
 * Badge — small status chip: LIVE / ESTIMATE / ASSIGNED / etc.
 */
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../theme";

type BadgeType = "live" | "estimate" | "assigned" | "neutral" | "error";

const config: Record<BadgeType, { bg: string; text: string }> = {
  live: { bg: Colors.accentLight, text: Colors.accent },
  estimate: { bg: Colors.surfaceAlt, text: Colors.mid },
  assigned: { bg: "#D5F5E3", text: Colors.success },
  neutral: { bg: Colors.surfaceAlt, text: Colors.darkMid },
  error: { bg: "#FADBD8", text: Colors.error },
};

interface Props {
  label: string;
  type?: BadgeType;
  style?: ViewStyle;
}

export default function Badge({ label, type = "neutral", style }: Props) {
  const { bg, text } = config[type];
  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs + 1,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
