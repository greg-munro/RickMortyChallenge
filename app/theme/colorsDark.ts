// Dark theme: inverted high-contrast neo-brutalist palette.
// Black canvas, cream ink, same vivid accents.
const palette = {
  cream: "#FFFDF5",
  ink: "#000000",
  white: "#FFFFFF",

  accent: "#FF6B6B",
  secondary: "#FFD93D",
  muted: "#C4B5FD",

  statusAlive: "#4ade80",
  statusDead: "#FF6B6B",
  statusUnknown: "#C4B5FD",

  // In dark mode neutrals are inverted
  neutral100: "#000000",
  neutral200: "#111111",
  neutral300: "#222222",
  neutral400: "#FFFDF5",
  neutral500: "#FFFDF5",
  neutral600: "#FFFDF5",
  neutral700: "#FFFDF5",
  neutral800: "#FFFDF5",
  neutral900: "#FFFDF5",

  primary100: "#FFD93D",
  primary200: "#FFD93D",
  primary300: "#FF6B6B",
  primary400: "#FF6B6B",
  primary500: "#FF6B6B",
  primary600: "#ff9999",

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

  angry100: "#FFD93D",
  angry500: "#FF6B6B",

  overlay20: "rgba(255, 253, 245, 0.2)",
  overlay50: "rgba(255, 253, 245, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",

  text: palette.cream,
  textDim: palette.cream,
  background: "#0f0e0b", // near-black warm canvas
  border: palette.cream,
  tint: palette.accent,
  tintInactive: palette.neutral300,
  separator: palette.cream,
  error: palette.angry500,
  errorBackground: "#2a1f00",
} as const
