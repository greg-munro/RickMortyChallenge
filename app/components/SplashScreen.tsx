import { useEffect } from "react"
import { Dimensions, Image, ImageStyle, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

interface SplashScreenProps {
  onFinish: () => void
}

/**
 * Neo-brutalist splash screen — fully Reanimated 3.
 *
 * Entrance sequence (staggered):
 *  0ms   — stripes expand width from centre
 *  200ms — headline box slams down with spring + thud scale
 *  500ms — GIF scales up + fades in
 *  700ms — tagline slides up + fades in
 *
 * Exit (after 2800ms hold):
 *  Entire screen slams down off screen.
 */
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { themed } = useAppTheme()

  const stripeWidth = useSharedValue(0)

  const headlineY = useSharedValue(-100)
  const headlineOpacity = useSharedValue(0)
  const headlineScale = useSharedValue(1)

  const gifScale = useSharedValue(0.6)
  const gifOpacity = useSharedValue(0)

  const taglineY = useSharedValue(24)
  const taglineOpacity = useSharedValue(0)

  const exitY = useSharedValue(0)
  const exitOpacity = useSharedValue(1)

  useEffect(() => {
    // 1. Stripes expand
    stripeWidth.value = withTiming(100, { duration: 400, easing: Easing.out(Easing.cubic) })

    // 2. Headline slams down
    headlineOpacity.value = withDelay(200, withTiming(1, { duration: 100 }))
    headlineY.value = withDelay(
      200,
      withSpring(0, { damping: 12, stiffness: 200, mass: 0.8 }),
    )
    // Thud scale pulse on landing
    headlineScale.value = withDelay(
      380,
      withSequence(
        withTiming(1.05, { duration: 80, easing: Easing.out(Easing.cubic) }),
        withSpring(1.0, { damping: 8, stiffness: 300 }),
      ),
    )

    // 3. GIF scales up + fades in
    gifOpacity.value = withDelay(500, withTiming(1, { duration: 300 }))
    gifScale.value = withDelay(
      500,
      withSpring(1.0, { damping: 14, stiffness: 160, mass: 0.9 }),
    )

    // 4. Tagline slides up + fades in
    taglineOpacity.value = withDelay(700, withTiming(1, { duration: 350 }))
    taglineY.value = withDelay(
      700,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) }),
    )

    // 5. Exit — slam down
    const exitDelay = setTimeout(() => {
      exitOpacity.value = withTiming(0, { duration: 300 })
      exitY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 420, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(onFinish)()
        },
      )
    }, 2800)

    return () => clearTimeout(exitDelay)
  }, [])


  const $stripeAnimStyle = useAnimatedStyle(() => ({
    width: `${stripeWidth.value}%`,
  }))

  const $headlineAnimStyle = useAnimatedStyle(() => ({
    opacity: headlineOpacity.value,
    transform: [
      { translateY: headlineY.value },
      { scale: headlineScale.value },
    ],
  }))

  const $gifAnimStyle = useAnimatedStyle(() => ({
    opacity: gifOpacity.value,
    transform: [{ scale: gifScale.value }],
  }))

  const $taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }))

  const $exitAnimStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
    transform: [{ translateY: exitY.value }],
  }))

  return (
    <Animated.View style={[themed($container), $exitAnimStyle]}>
      {/* Top stripe — expands from left */}
      <View style={themed($topStripeOuter)}>
        <Animated.View style={[themed($topStripeInner), $stripeAnimStyle]} />
      </View>

      <View style={themed($content)}>
        {/* Headline box — slams down */}
        <Animated.View style={[$headlineAnimStyle, themed($headlineBox)]}>
          <Text text="RICK &" weight="bold" style={themed($headline)} />
          <Text text="MORTY" weight="bold" style={themed($headline)} />
          <Text text="CATALOG" weight="bold" style={themed($headlineAccent)} />
        </Animated.View>

        {/* GIF — scales up */}
        <Animated.View style={$gifAnimStyle}>
          <Image
            source={require("../../assets/images/splash.gif")}
            style={$gif}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Tagline — slides up */}
        <Animated.View style={$taglineAnimStyle}>
          <Text
            text="ALL EPISODES. ALL SEASONS."
            size="xs"
            weight="bold"
            style={themed($tagline)}
          />
        </Animated.View>
      </View>

      {/* Bottom stripe — expands from left */}
      <View style={themed($bottomStripeOuter)}>
        <Animated.View style={[themed($bottomStripeInner), $stripeAnimStyle]} />
      </View>
    </Animated.View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: colors.background,
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
})

const $topStripeOuter: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 64,
  overflow: "hidden",
})

const $topStripeInner: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: "100%",
  backgroundColor: colors.palette.accent,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
})

const $bottomStripeOuter: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 64,
  overflow: "hidden",
})

const $bottomStripeInner: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: "100%",
  backgroundColor: colors.palette.secondary,
  borderTopWidth: 3,
  borderTopColor: colors.border,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  gap: spacing.md,
})

const $headlineBox: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 4,
  borderColor: colors.border,
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.md,
  alignItems: "center",
  gap: 0,
})

const $headline: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.text,
  fontFamily: typography.primary.black,
  fontSize: 48,
  lineHeight: 52,
  letterSpacing: -1,
  textTransform: "uppercase",
})

const $headlineAccent: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.palette.accent,
  fontFamily: typography.primary.black,
  fontSize: 48,
  lineHeight: 52,
  letterSpacing: -1,
  textTransform: "uppercase",
  borderTopWidth: 3,
  borderTopColor: colors.border,
  paddingTop: 4,
  marginTop: 4,
})

const $tagline: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 4,
  textTransform: "uppercase",
})

const $gif: ImageStyle = {
  width: 260,
  height: 260,
}
