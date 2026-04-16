import type { CharacterStatus } from "@/services/api/types"

export const STATUS_COLORS: Record<CharacterStatus, string> = {
  Alive: "#55CC44",
  Dead: "#D63D2E",
  unknown: "#9E9E9E",
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
