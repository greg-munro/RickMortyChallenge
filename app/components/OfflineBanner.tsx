import { useEffect } from "react"
import { ViewStyle, TextStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "./Text"

interface OfflineBannerProps {
  isOffline: boolean
  pulseRef?: React.MutableRefObject<(() => void) | null>
}

export function OfflineBanner({ isOffline, pulseRef }: OfflineBannerProps) {
  const { themed } = useAppTheme()

  const translateY = useSharedValue(-60)
  const translateX = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
  }))

  useEffect(() => {
    translateY.value = withSpring(isOffline ? 0 : -60, {
      damping: 18,
      stiffness: 220,
      mass: 0.7,
    })
  }, [isOffline])

  useEffect(() => {
    if (pulseRef) {
      pulseRef.current = () => {
        translateX.value = withSequence(
          withTiming(-6, { duration: 40 }),
          withTiming(6, { duration: 40 }),
          withTiming(-4, { duration: 40 }),
          withTiming(4, { duration: 40 }),
          withTiming(0, { duration: 40 }),
        )
      }
    }
  }, [])

  return (
    <Animated.View style={[themed($banner), animStyle]} pointerEvents="none">
      <Text
        text="NO CONNECTION — VIEWING CACHED DATA"
        size="xs"
        weight="bold"
        style={themed($text)}
      />
    </Animated.View>
  )
}

const $banner: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  backgroundColor: colors.palette.accent,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  alignItems: "center",
})

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.white,
  letterSpacing: 1.5,
  textTransform: "uppercase",
})
