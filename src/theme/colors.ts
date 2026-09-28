/**
 * Kigali Ride — Color Palette
 *
 * Aesthetic: Clean, minimal, warm
 * Inspired by Kigali's red-clay hills, green canopy, and modern urban texture.
 *
 * Primary: Deep earth red  (brand, CTAs)
 * Accent:  Warm amber      (live/active states, highlights)
 * Surface: Off-white cream (background warmth)
 * Dark:    Near-black      (text, heavy UI)
 */

export const Colors = {
  // ── Brand ────────────────────────────────────────────────────────────────
  primary: "#C0392B",      // Deep earth red — main CTA, tabs, active states
  primaryDark: "#922B21",  // Darker red — pressed states, headers
  primaryLight: "#F1948A", // Light red — tints, chips, backgrounds

  // ── Accent ───────────────────────────────────────────────────────────────
  accent: "#E67E22",       // Warm amber — live quote badges, highlights
  accentLight: "#FAD7A0",  // Pale amber — live quote backgrounds

  // ── Status ───────────────────────────────────────────────────────────────
  success: "#27AE60",      // Confirmed / driver assigned
  warning: "#F39C12",      // Estimated / expiring quote
  error: "#E74C3C",        // Error states
  info: "#2980B9",         // Informational

  // ── Neutrals ─────────────────────────────────────────────────────────────
  dark: "#1A1A1A",         // Primary text
  darkMid: "#3D3D3D",      // Secondary text
  mid: "#7F8C8D",          // Placeholder, disabled
  light: "#BDC3C7",        // Borders, dividers
  surface: "#FDFAF7",      // Main background — warm off-white
  surfaceAlt: "#F5F0EA",   // Card / section background
  white: "#FFFFFF",

  // ── Map overlay ──────────────────────────────────────────────────────────
  mapOverlay: "rgba(26,26,26,0.55)",

  // ── Provider badge backgrounds (seeded — update as integrations are added)
  providerYego: "#D63031",
  providerMove: "#0984E3",
  providerZelo: "#00B894",
  providerTugende: "#6C5CE7",
  providerRapide: "#FDCB6E",
  providerGreenRide: "#55EFC4",
  providerMavo: "#FD79A8",
} as const;

export type ColorKey = keyof typeof Colors;
