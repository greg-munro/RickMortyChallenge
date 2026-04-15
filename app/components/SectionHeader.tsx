import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "./Text"

interface SectionHeaderProps {
  title: string
  episodeCount: number
}

/**
 * Neo-brutalist sticky section header.
 * Hot red banner with white uppercase text, thick top and bottom borders.
 * Episode count shown in a black pill on the right.
 */
export function SectionHeader({ title, episodeCount }: SectionHeaderProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <Text text={title.toUpperCase()} weight="bold" style={themed($title)} />
      <View style={themed($badge)}>
        <Text
          text={`${episodeCount} EP${episodeCount !== 1 ? "S" : ""}`}
          size="xxs"
          weight="bold"
          style={themed($badgeText)}
        />
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.accent,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderTopWidth: 3,
  borderBottomWidth: 3,
  borderColor: colors.border,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.white,
  fontSize: 13,
  letterSpacing: 2,
  textTransform: "uppercase",
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.ink,
  borderWidth: 2,
  borderColor: colors.palette.ink,
  paddingHorizontal: spacing.xs,
  paddingVertical: 2,
})

const $badgeText: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  letterSpacing: 1,
})
