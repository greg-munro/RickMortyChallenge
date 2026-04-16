import { StyleProp, TextStyle, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import { HardShadowView, HardShadowSize } from "./HardShadowView"
import { Text } from "./Text"

export type NeoButtonVariant = "primary" | "secondary" | "outline"

interface NeoButtonProps {
  label: string
  onPress: () => void
  variant?: NeoButtonVariant
  shadowSize?: HardShadowSize
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  disabled?: boolean
}

/**
 * Neo-brutalist button with Reanimated "push-down" press effect.
 *
 * On pressIn the button translates by the shadow offset (covering its own
 * shadow), creating a mechanical click-down feel. On pressOut it springs back.
 */
export function NeoButton({
  label,
  onPress,
  variant = "primary",
  shadowSize = "sm",
  style,
  labelStyle,
  disabled = false,
}: NeoButtonProps) {
  const { theme } = useAppTheme()
  const OFFSET = { sm: 4, md: 6, lg: 8 }[shadowSize]

  const VARIANT_BG: Record<NeoButtonVariant, string> = {
    primary: theme.colors.palette.accent,
    secondary: theme.colors.palette.secondary,
    outline: theme.colors.palette.white,
  }
  const VARIANT_TEXT_COLOR: Record<NeoButtonVariant, string> = {
    primary: theme.colors.palette.ink,
    secondary: theme.colors.palette.ink,
    outline: theme.colors.palette.ink,
  }

  const pressed = useSharedValue(0)

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(pressed.value * OFFSET, { duration: 80 }) },
      { translateY: withTiming(pressed.value * OFFSET, { duration: 80 }) },
    ],
  }))

  const handlePressIn = () => {
    pressed.value = 1
  }
  const handlePressOut = () => {
    pressed.value = 0
    onPress()
  }

  const bg = VARIANT_BG[variant]
  const textColor = VARIANT_TEXT_COLOR[variant]
  const borderColor = theme.colors.border

  return (
    <HardShadowView size={shadowSize} style={style}>
      <Animated.View
        style={[
          animStyle,
          {
            backgroundColor: bg,
            borderWidth: 3,
            borderColor,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        // Animated.View doesn't have onStartShouldSetResponder natively,
        // so we use the responder props directly.
        onStartShouldSetResponder={() => !disabled}
        onResponderGrant={handlePressIn}
        onResponderRelease={handlePressOut}
        onResponderTerminate={() => {
          pressed.value = 0
        }}
      >
        <Text
          text={label}
          style={[
            {
              color: textColor,
              fontFamily: theme.typography.primary.bold,
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
            } as TextStyle,
            labelStyle,
          ]}
        />
      </Animated.View>
    </HardShadowView>
  )
}
