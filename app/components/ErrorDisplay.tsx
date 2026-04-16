import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

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
 * Rick & Morty error image, uppercase heading, NeoButton for retry.
 */
export function ErrorDisplay({
  heading,
  message,
  actionLabel = "TRY AGAIN",
  onAction,
}: ErrorDisplayProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($outer)}>
      <HardShadowView size="md" style={themed($shadowWrapper)}>
        <View style={themed($container)}>
          <Image
            source={require("../../assets/images/rmerror.gif")}
            style={$image}
            resizeMode="contain"
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
  paddingBottom: spacing.xl * 6,
})

const $shadowWrapper: ThemedStyle<ViewStyle> = () => ({
  alignSelf: "stretch",
})

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.secondary,
  borderWidth: 3,
  borderColor: colors.border,
  alignItems: "center",
  padding: spacing.lg,
  gap: spacing.sm,
})

const $image: ImageStyle = {
  width: 200,
  height: 200,
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
