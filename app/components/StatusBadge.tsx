import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { CharacterStatus } from "@/services/api/types"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/characterUtils"
import { Text } from "./Text"

interface StatusBadgeProps {
  status: CharacterStatus
}

/**
 * A small pill showing a colored dot and a status label.
 * Used on character cards to indicate Alive / Dead / Unknown.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const { themed } = useAppTheme()
  const dotColor = STATUS_COLORS[status] ?? STATUS_COLORS.unknown
  const label = STATUS_LABELS[status] ?? "Unknown"

  return (
    <View style={themed($container)}>
      <View style={[$dot, { backgroundColor: dotColor }]} />
      <Text text={label} size="xs" weight="medium" style={themed($label)} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  alignSelf: "flex-start",
})

const $dot: ViewStyle = {
  width: 7,
  height: 7,
  borderRadius: 4,
  marginRight: 4,
}

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
