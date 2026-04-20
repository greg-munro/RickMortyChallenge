import { ReactNode } from "react"
import { StyleProp, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"

export type HardShadowSize = "sm" | "md" | "lg"

const SHADOW_OFFSETS: Record<HardShadowSize, number> = {
  sm: 4,
  md: 6,
  lg: 8,
}

interface HardShadowViewProps {
  children: ReactNode
  size?: HardShadowSize
  /** Override the shadow color — defaults to pure black / pure cream in dark mode */
  shadowColor?: string
  style?: StyleProp<ViewStyle>
  /** Style applied to the inner content view */
  contentStyle?: StyleProp<ViewStyle>
}

/**
 * Wraps children with a hard offset shadow — the neo-brutalist signature.
 *
 * React Native cannot produce zero-blur hard shadows natively, so we achieve
 * the effect by rendering a solid black rectangle absolutely behind the content,
 * offset by `size` pixels down and to the right.
 *
 * Layout: the outer View is `position: relative` with padding-bottom + padding-right
 * equal to the offset so that the shadow rectangle is visible without clipping.
 */
export function HardShadowView({
  children,
  size = "md",
  shadowColor,
  style,
  contentStyle,
}: HardShadowViewProps) {
  const { theme } = useAppTheme()
  const offset = SHADOW_OFFSETS[size]
  const resolvedShadowColor = shadowColor ?? theme.colors.border
  const $outerPadding: ViewStyle = { paddingBottom: offset, paddingRight: offset }
  const $shadowPosition: ViewStyle = {
    left: offset,
    top: offset,
    backgroundColor: resolvedShadowColor,
  }

  return (
    <View style={[$outerPadding, style]}>
      {/* Shadow layer — sits behind content via zIndex */}
      <View style={[$shadowLayer, $shadowPosition]} />
      {/* Content layer */}
      <View style={[$contentLayer, contentStyle]}>{children}</View>
    </View>
  )
}

const $shadowLayer: ViewStyle = {
  position: "absolute",
  bottom: 0,
  right: 0,
}

const $contentLayer: ViewStyle = { position: "relative" }
