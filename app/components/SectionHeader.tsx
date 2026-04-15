import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { Text } from "./Text"

interface SectionHeaderProps {
  /** e.g. "Season 1" */
  title: string
  /** Number of episodes in this section */
  episodeCount: number
}

/**
 * Sticky section header used in the episode list SectionList.
 * Shows the season name and a dimmed episode count badge.
 */
export function SectionHeader({ title, episodeCount }: SectionHeaderProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <Text text={title} preset="subheading" style={themed($title)} />
      <View style={themed($badge)}>
        <Text
          text={`${episodeCount} ep${episodeCount !== 1 ? "s" : ""}`}
          size="xxs"
          weight="medium"
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
  backgroundColor: colors.background,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: 10,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
})
