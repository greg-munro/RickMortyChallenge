import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { RickMortyEpisode } from "@/services/api/types"
import { Text } from "./Text"

interface EpisodeListItemProps {
  episode: RickMortyEpisode
  onPress: () => void
}

/**
 * Neo-brutalist episode list row.
 * Yellow episode-code badge, bold uppercase name, thick bottom border divider.
 * No card treatment — keeps the dense list feel per design decision.
 */
export function EpisodeListItem({ episode, onPress }: EpisodeListItemProps) {
  const { themed } = useAppTheme()

  return (
    <TouchableOpacity
      style={themed($container)}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${episode.episode} — ${episode.name}`}
    >
      {/* Episode code badge — yellow, sharp corners, black border */}
      <View style={themed($badge)}>
        <Text
          text={episode.episode}
          size="xs"
          weight="bold"
          style={themed($badgeText)}
        />
      </View>

      {/* Text block */}
      <View style={$textBlock}>
        <Text
          text={episode.name.toUpperCase()}
          weight="bold"
          size="sm"
          numberOfLines={1}
          style={themed($episodeName)}
        />
        <Text
          text={episode.air_date}
          size="xs"
          weight="medium"
          style={themed($airDate)}
          numberOfLines={1}
        />
      </View>

      {/* Arrow — bold text chevron instead of icon */}
      <Text text="→" style={themed($arrow)} />
    </TouchableOpacity>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.white,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
  gap: spacing.sm,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.secondary,
  borderWidth: 2,
  borderColor: colors.border,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  minWidth: 56,
  alignItems: "center",
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 0.5,
})

const $textBlock: ViewStyle = {
  flex: 1,
  gap: 2,
}

const $episodeName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 0.3,
})

const $airDate: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  opacity: 0.6,
})

const $arrow: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 18,
  fontWeight: "700",
})
