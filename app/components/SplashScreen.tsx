import { useEffect, useRef } from "react"
import { Animated, StyleSheet, TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SplashScreenProps {
  onFinish: () => void
}

/**
 * Neo-brutalist splash screen.
 *
 * Cream canvas background. "RICK & MORTY" in max-weight black uppercase at 48px,
 * tight letter-spacing. "CATALOG" in hot-red — same weight, acts as a color punch.
 * Tagline in small uppercase tracked out wide.
 *
 * Holds for 2s then fades + slides up and unmounts.
 */
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { themed } = useAppTheme()
  const opacity = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -32,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => onFinish())
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Animated.View style={[themed($container), { opacity, transform: [{ translateY }] }]}>
      {/* Decorative top border stripe */}
      <View style={themed($topStripe)} />

      <View style={themed($content)}>
        {/* Main headline block with black border */}
        <View style={themed($headlineBox)}>
          <Text text="RICK &" weight="bold" style={themed($headline)} />
          <Text text="MORTY" weight="bold" style={themed($headline)} />
          {/* "CATALOG" in accent red — punches through */}
          <Text text="CATALOG" weight="bold" style={themed($headlineAccent)} />
        </View>

        {/* Tagline */}
        <Text
          text="ALL EPISODES. ALL SEASONS."
          size="xs"
          weight="bold"
          style={themed($tagline)}
        />
      </View>

      {/* Decorative bottom border stripe */}
      <View style={themed($bottomStripe)} />
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

const $topStripe: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 8,
  backgroundColor: colors.palette.accent,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
})

const $bottomStripe: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 8,
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
