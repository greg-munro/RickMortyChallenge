import { View, ViewStyle, TextStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated"

import type { RickMortyEpisode } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

interface EpisodeListItemProps {
  episode: RickMortyEpisode
  onPress: () => void
}

/**
 * Neo-brutalist episode list row.
 * Yellow episode-code badge, bold uppercase name, thick bottom border divider.
 * Reanimated press: scales down to 0.97 with a spring on press, navigates on release.
 */
export function EpisodeListItem({ episode, onPress }: EpisodeListItemProps) {
  const { themed } = useAppTheme()

  const scale = useSharedValue(1)

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400, mass: 0.6 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { damping: 12, stiffness: 300 })
  }

  const handlePress = () => {
    scale.value = withTiming(0.97, { duration: 60 }, () => {
      scale.value = withSpring(1.0, { damping: 12, stiffness: 300 })
      runOnJS(onPress)()
    })
  }

  return (
    <Animated.View
      style={[themed($container), animStyle]}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handlePressIn}
      onResponderRelease={() => {
        handlePressOut()
        handlePress()
      }}
      onResponderTerminate={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${episode.episode} — ${episode.name}`}
    >
      {/* Episode code badge — yellow, sharp corners, black border */}
      <View style={themed($badge)}>
        <Text text={episode.episode} size="xs" weight="bold" style={themed($badgeText)} />
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

      {/* Arrow */}
      <Text text="→" style={themed($arrow)} />
    </Animated.View>
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
