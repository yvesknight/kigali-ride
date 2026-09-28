/**
 * PlaceholderBlock — visible placeholder tile used in every screen
 * to mark where real content will go.
 */
import React from "react";
import { View, Text, StyleSheet, ViewStyle, DimensionValue } from "react-native";
import { Colors, FontSize, FontWeight, Radius, Spacing } from "../../theme";

interface Props {
  label: string;
  height?: DimensionValue;
  style?: ViewStyle;
  dim?: boolean;
  noPadding?: boolean;
}

export default function PlaceholderBlock({
  label,
  height = 80,
  style,
  dim = false,
  noPadding = false,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: dim ? Colors.surfaceAlt : Colors.light + "55" },
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.mid,
    textAlign: "center",
    paddingHorizontal: Spacing.base,
  },
});
