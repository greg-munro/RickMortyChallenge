import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { CharacterStatus } from "@/services/api/types"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/characterUtils"
import { Text } from "./Text"

interface StatusFilterChipProps {
  status: CharacterStatus
  count: number
  isSelected: boolean
  onPress: () => void
}

export function StatusFilterChip({ status, count, isSelected, onPress }: StatusFilterChipProps) {
  const { themed } = useAppTheme()
  const color = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        themed($chip),
        { backgroundColor: isSelected ? color + "26" : undefined },
        isSelected && { borderColor: color },
      ]}
    >
      <View style={[$dot, { backgroundColor: color }]} />
      <Text
        text={`${label} ${count}`}
        size="xs"
        weight={isSelected ? "bold" : "normal"}
        style={[themed($label), isSelected && { color }]}
      />
    </TouchableOpacity>
  )
}

const $chip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 20,
  borderWidth: 1.5,
  borderColor: "transparent",
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxxs + 2,
  gap: 5,
})

const $dot: ViewStyle = {
  width: 7,
  height: 7,
  borderRadius: 4,
}

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
