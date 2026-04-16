import { TextStyle, View, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { CharacterStatus } from "@/services/api/types"
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/characterUtils"
import { HardShadowView } from "./HardShadowView"
import { Text } from "./Text"

interface StatusFilterChipProps {
  status: CharacterStatus
  count: number
  isSelected: boolean
  onPress: () => void
}

/**
 * Neo-brutalist filter chip with push-down press animation.
 *
 * Unselected: white bg, black border (2px), no shadow.
 * Selected: status color bg, black border (3px), hard shadow (sm).
 *
 * On press the chip translates to cover its shadow — same mechanic as NeoButton.
 */
export function StatusFilterChip({ status, count, isSelected, onPress }: StatusFilterChipProps) {
  const { themed, theme } = useAppTheme()
  const color = STATUS_COLORS[status]
  const label = STATUS_LABELS[status]
  const OFFSET = 4

  const pressed = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(pressed.value * OFFSET, { duration: 80 }) },
      { translateY: withTiming(pressed.value * OFFSET, { duration: 80 }) },
    ],
  }))

  return (
    <HardShadowView
      size="sm"
      shadowColor={isSelected ? theme.colors.border : "transparent"}
    >
      <Animated.View
        style={[
          themed($chip),
          {
            backgroundColor: isSelected ? color : theme.colors.palette.white,
            borderWidth: isSelected ? 3 : 2,
          },
          animStyle,
        ]}
        onStartShouldSetResponder={() => true}
        onResponderGrant={() => {
          pressed.value = 1
        }}
        onResponderRelease={() => {
          pressed.value = 0
          onPress()
        }}
        onResponderTerminate={() => {
          pressed.value = 0
        }}
      >
        <Text
          text={label.toUpperCase()}
          size="xs"
          weight="bold"
          style={[themed($label), isSelected && themed($labelSelected)]}
        />
        <View style={[
          themed($countBadge),
          isSelected && { backgroundColor: theme.colors.palette.white },
        ]}>
          <Text
            text={String(count)}
            size="xs"
            weight="bold"
            style={[
              themed($countText),
              isSelected && { color: theme.colors.palette.ink },
            ]}
          />
        </View>
      </Animated.View>
    </HardShadowView>
  )
}

const $chip: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  borderColor: colors.border,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxxs + 2,
})

const $label: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 1,
})

const $labelSelected: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.ink,
})

const $countBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.ink,
  paddingHorizontal: 5,
  paddingVertical: 1,
  minWidth: 20,
  alignItems: "center",
})

const $countText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.white,
  fontSize: 10,
  lineHeight: 14,
  fontWeight: "700",
  letterSpacing: 0.5,
})
