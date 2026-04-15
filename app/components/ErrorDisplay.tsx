import { useRef, useEffect } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import LottieView from "lottie-react-native"

import { Text } from "@/components/Text"
import { NeoButton } from "@/components/NeoButton"
import { HardShadowView } from "@/components/HardShadowView"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ErrorDisplayProps {
  heading: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * Neo-brutalist error panel.
 * Yellow (#FFD93D) container with thick black border + hard shadow.
 * Morty-cry Lottie animation, uppercase heading, NeoButton for retry.
 */
export function ErrorDisplay({
  heading,
  message,
  actionLabel = "TRY AGAIN",
  onAction,
}: ErrorDisplayProps) {
  const { themed } = useAppTheme()
  const lottieRef = useRef<LottieView>(null)

  useEffect(() => {
    lottieRef.current?.play()
  }, [])

  return (
    <View style={themed($outer)}>
      <HardShadowView size="md" style={themed($shadowWrapper)}>
        <View style={themed($container)}>
          <LottieView
            ref={lottieRef}
            source={require("../../assets/animations/morty-cry.json")}
            style={$animation}
            autoPlay
            loop
          />
          <Text
            text={heading.toUpperCase()}
            weight="bold"
            style={themed($heading)}
          />
          {!!message && (
            <Text text={message} size="sm" weight="medium" style={themed($message)} />
          )}
          {!!onAction && (
            <NeoButton
              label={actionLabel}
              onPress={onAction}
              variant="primary"
              shadowSize="sm"
              style={themed($buttonWrapper)}
            />
          )}
        </View>
      </HardShadowView>
    </View>
  )
}

const $outer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.xl,
})

const $shadowWrapper: ThemedStyle<ViewStyle> = () => ({
  alignSelf: "stretch",
})

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.secondary, // Vivid Yellow
  borderWidth: 3,
  borderColor: colors.border,
  alignItems: "center",
  padding: spacing.lg,
  gap: spacing.sm,
})

const $animation: ViewStyle = {
  width: 160,
  height: 160,
}

const $heading: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 16,
  letterSpacing: 1,
  textAlign: "center",
})

const $message: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
  opacity: 0.7,
})

const $buttonWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
