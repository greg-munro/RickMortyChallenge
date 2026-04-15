import { useEffect, useRef } from "react"
import { Animated, StyleSheet, TextStyle, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const { themed } = useAppTheme()
  const opacity = useRef(new Animated.Value(1)).current
  const translateY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -24,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => onFinish())
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <Animated.View style={[themed($container), { opacity, transform: [{ translateY }] }]}>
      <Text text="Rick & Morty" preset="heading" style={themed($title)} />
      <Text text="Catalog" preset="heading" style={themed($subtitle)} />
      <Text text="All episodes. All seasons." size="sm" style={themed($tagline)} />
    </Animated.View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: colors.background,
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  zIndex: 999,
})

const $title: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.text,
  fontFamily: typography.primary.bold,
  fontSize: 36,
  lineHeight: 40,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.tint,
  fontFamily: typography.primary.bold,
  fontSize: 36,
  lineHeight: 40,
})

const $tagline: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.sm,
  letterSpacing: 0.5,
})
