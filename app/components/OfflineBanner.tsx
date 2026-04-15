import { useEffect } from "react"
import { ViewStyle, TextStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import NetInfo from "@react-native-community/netinfo"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "./Text"

/**
 * Neo-brutalist offline banner.
 * Slides down from above when the device loses internet connectivity.
 * Slides back up and disappears when connectivity is restored.
 * Uses @react-native-community/netinfo to subscribe to connectivity changes.
 */
export function OfflineBanner() {
  const { themed } = useAppTheme()

  const translateY = useSharedValue(-60)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOffline = !state.isConnected || !state.isInternetReachable
      translateY.value = withSpring(isOffline ? 0 : -60, {
        damping: 18,
        stiffness: 220,
        mass: 0.7,
      })
    })

    return unsubscribe
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
