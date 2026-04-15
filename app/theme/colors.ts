// Neo-brutalist palette
// Philosophy: unapologetic visibility — pure black ink, cream canvas, vibrant accent bursts.
// No grays. No subtle transparencies. High contrast everywhere.
const palette = {
  // ── Canvas & Ink ──────────────────────────────────────────────────────────
  cream: "#FFFDF5", // main background — aged paper / newsprint
  ink: "#000000", // all text, all borders, all shadows
  white: "#FFFFFF", // card interiors, contrast panels

  // ── Accent Burst Colors ───────────────────────────────────────────────────
  accent: "#FF6B6B", // Hot Red — primary action, badges, tint
  secondary: "#FFD93D", // Vivid Yellow — secondary action, section highlights
  muted: "#C4B5FD", // Soft Violet — tertiary, subtle backgrounds

  // ── Status Colors (vivid, high-contrast) ─────────────────────────────────
  statusAlive: "#4ade80", // vivid green
  statusDead: "#FF6B6B", // reuse accent red
  statusUnknown: "#C4B5FD", // reuse muted violet

  // ── Legacy palette keys kept for Ignite internals ─────────────────────────
  neutral100: "#FFFFFF",
  neutral200: "#FFFDF5",
  neutral300: "#e8e5dd", // skeleton loader bg
  neutral400: "#000000",
  neutral500: "#000000",
  neutral600: "#000000",
  neutral700: "#000000",
  neutral800: "#000000",
  neutral900: "#000000",

  primary100: "#FFD93D",
  primary200: "#FFD93D",
  primary300: "#FF6B6B",
  primary400: "#FF6B6B",
  primary500: "#FF6B6B",
  primary600: "#cc3333",

  secondary100: "#C4B5FD",
  secondary200: "#C4B5FD",
  secondary300: "#C4B5FD",
  secondary400: "#C4B5FD",
  secondary500: "#C4B5FD",

  accent100: "#FFD93D",
  accent200: "#FFD93D",
  accent300: "#FFD93D",
  accent400: "#FFD93D",
  accent500: "#FFD93D",

  angry100: "#FFD93D", // error background → yellow banner
  angry500: "#FF6B6B", // error foreground → accent red

  overlay20: "rgba(0, 0, 0, 0.2)",
  overlay50: "rgba(0, 0, 0, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",

  /** Primary text — pure ink */
  text: palette.ink,
  /** Secondary text — still ink (neo-brutalism forbids subtle gray) */
  textDim: palette.ink,
  /** Main screen background — warm cream canvas */
  background: palette.cream,
  /** All borders — pure black */
  border: palette.ink,
  /** Primary tint / action color — Hot Red */
  tint: palette.accent,
  /** Inactive tint */
  tintInactive: palette.neutral300,
  /** Dividers / separators — pure black */
  separator: palette.ink,
  /** Error indicator */
  error: palette.angry500,
  /** Error background */
  errorBackground: palette.angry100,
} as const
