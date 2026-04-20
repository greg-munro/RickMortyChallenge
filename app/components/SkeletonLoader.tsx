import { StyleProp, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SkeletonLoaderProps {
  width?: number | `${number}%`
  height?: number
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

/**
 * Neo-brutalist skeleton loader.
 * Pulses between the neutral300 swatch (#e8e5dd) and pure black at low opacity,
 * giving a graphic ink-blot feel rather than a soft shimmer.
 * borderRadius defaults to 0 (sharp) to match the neo aesthetic.
 */
export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 0,
  style,
}: SkeletonLoaderProps) {
  const { themed } = useAppTheme()
  const opacity = useSharedValue(0.15)

  opacity.value = withRepeat(
    withSequence(withTiming(0.45, { duration: 600 }), withTiming(0.15, { duration: 600 })),
    -1,
    false,
  )

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View style={[themed($skeleton), { width, height, borderRadius }, animStyle, style]} />
  )
}

const $skeleton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.text, // pure ink — pulses in opacity
})
