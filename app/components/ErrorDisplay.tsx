import { useRef, useEffect } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import LottieView from "lottie-react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ErrorDisplayProps {
  heading: string
  message?: string
  /** Label for the action button. Defaults to "Try Again". Omit onAction to hide the button. */
  actionLabel?: string
  onAction?: () => void
}

export function ErrorDisplay({
  heading,
  message,
  actionLabel = "Try Again",
  onAction,
}: ErrorDisplayProps) {
  const { themed } = useAppTheme()
  const lottieRef = useRef<LottieView>(null)

  useEffect(() => {
    lottieRef.current?.play()
  }, [])

  return (
    <View style={themed($container)}>
      <LottieView
        ref={lottieRef}
        source={require("../../assets/animations/morty-cry.json")}
        style={$animation}
        autoPlay
        loop
      />
      <Text text={heading} preset="subheading" style={themed($heading)} />
      {!!message && <Text text={message} size="sm" style={themed($message)} />}
      {!!onAction && (
        <TouchableOpacity style={themed($button)} onPress={onAction} activeOpacity={0.8}>
          <Text text={actionLabel} size="sm" weight="bold" style={themed($buttonText)} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.xl,
  gap: spacing.sm,
})

const $animation: ViewStyle = {
  width: 200,
  height: 200,
}

const $heading: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
})

const $message: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $button: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  marginTop: spacing.xs,
  backgroundColor: colors.tint,
  borderRadius: 8,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})
