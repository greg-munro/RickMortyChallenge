import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { RickMortyEpisode } from "@/services/api/types"
import { Text } from "./Text"
import { Icon } from "./Icon"

interface EpisodeListItemProps {
  episode: RickMortyEpisode
  onPress: () => void
}

/**
 * A single row in the episode list.
 * Displays the episode code badge, name, air date and a chevron.
 */
export function EpisodeListItem({ episode, onPress }: EpisodeListItemProps) {
  const { themed } = useAppTheme()

  return (
    <TouchableOpacity
      style={themed($container)}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${episode.episode} — ${episode.name}`}
    >
      {/* Episode code badge */}
      <View style={themed($badge)}>
        <Text text={episode.episode} size="xs" weight="bold" style={themed($badgeText)} />
      </View>

      {/* Text block */}
      <View style={$textBlock}>
        <Text
          text={episode.name}
          preset="bold"
          size="sm"
          numberOfLines={1}
          style={themed($episodeName)}
        />
        <Text
          text={episode.air_date}
          size="xs"
          weight="normal"
          style={themed($airDate)}
          numberOfLines={1}
        />
      </View>

      {/* Chevron */}
      <Icon icon="caretRight" size={18} color={useAppTheme().theme.colors.textDim} />
    </TouchableOpacity>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
  gap: spacing.sm,
})

const $badge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.primary100,
  borderRadius: 6,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  minWidth: 56,
  alignItems: "center",
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
})

const $textBlock: ViewStyle = {
  flex: 1,
  gap: 2,
}

const $episodeName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $airDate: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
