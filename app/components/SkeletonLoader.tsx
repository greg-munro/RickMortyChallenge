import { useEffect, useRef } from "react"
import { Animated, StyleProp, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SkeletonLoaderProps {
  /** Width of the skeleton box */
  width?: number | `${number}%`
  /** Height of the skeleton box */
  height?: number
  /** Border radius */
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

/**
 * Animated shimmer skeleton box used as a loading placeholder.
 * Uses Animated.Value so it works without Reanimated (no worklet needed).
 */
export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const { themed } = useAppTheme()
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    )
    pulse.start()
    return () => pulse.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        themed($skeleton),
        { width, height, borderRadius, opacity },
        style,
      ]}
    />
  )
}

const $skeleton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
})
