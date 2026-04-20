import type { CharacterStatus } from "@/services/api/types"
import { colors } from "@/theme/colors"

export const STATUS_COLORS: Record<CharacterStatus, string> = {
  Alive: colors.palette.statusAlive,
  Dead: colors.palette.statusDead,
  unknown: colors.palette.statusUnknown,
}

export const STATUS_LABELS: Record<CharacterStatus, string> = {
  Alive: "Alive",
  Dead: "Dead",
  unknown: "Unknown",
}

export const STATUS_ORDER: Record<CharacterStatus, number> = {
  Alive: 0,
  Dead: 1,
  unknown: 2,
}
