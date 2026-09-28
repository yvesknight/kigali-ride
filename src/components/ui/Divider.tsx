import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors, Spacing } from "../../theme";

interface Props {
  style?: ViewStyle;
}

export default function Divider({ style }: Props) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.light,
    marginVertical: Spacing.md,
  },
});
