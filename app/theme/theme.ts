import { colors as colorsLight } from "./colors"
import { colors as colorsDark } from "./colorsDark"
import { spacing } from "./spacing"
import type { Theme } from "./types"
import { typography } from "./typography"

export const lightTheme: Theme = {
  colors: colorsLight,
  spacing,
  typography,
  isDark: false,
}
export const darkTheme: Theme = {
  colors: colorsDark,
  spacing,
  typography,
  isDark: true,
}
