import { View, ViewStyle, TextStyle } from "react-native"

import type { CharacterStatus } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/characterUtils"

import { Text } from "./Text"

interface StatusBadgeProps {
  status: CharacterStatus
}

/**
 * Neo-brutalist status badge.
 * Solid vivid background matching the status color, sharp corners, black border.
 * No dot — the color block IS the indicator.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const { themed } = useAppTheme()
  const bgColor = STATUS_COLORS[status] ?? STATUS_COLORS.unknown
  const label = STATUS_LABELS[status] ?? "Unknown"

  return (
    <View style={[themed($container), { backgroundColor: bgColor }]}>
      <Text text={label.toUpperCase()} size="xs" weight="bold" style={themed($label)} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 2,
  borderColor: colors.border,
  paddingHorizontal: spacing.xs,
  paddingVertical: 2,
  alignSelf: "flex-start",
})

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 0.5,
})
