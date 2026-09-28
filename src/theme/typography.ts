import { Platform } from "react-native";

/**
 * Typography scale — system fonts, clean & legible on Android.
 * Using Inter via system font stack (no extra bundle weight for MVP).
 */
export const FontFamily = {
  regular: Platform.select({ android: "sans-serif", default: "System" }),
  medium: Platform.select({ android: "sans-serif-medium", default: "System" }),
  bold: Platform.select({ android: "sans-serif", default: "System" }),
  mono: Platform.select({ android: "monospace", default: "Courier" }),
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  display: 38,
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  loose: 1.8,
} as const;

export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};
