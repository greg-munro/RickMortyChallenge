import { useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { RickMortyCharacter } from "@/services/api/types"
import { HardShadowView } from "./HardShadowView"
import { SkeletonLoader } from "./SkeletonLoader"
import { StatusBadge } from "./StatusBadge"
import { Text } from "./Text"

interface CharacterCardProps {
  character: RickMortyCharacter
  /** Used to stagger the entrance animation — pass the FlatList index */
  index?: number
}

const STAGGER_MS = 40
const MAX_STAGGER_INDEX = 12 // cap delay so late items don't wait too long

/**
 * Neo-brutalist character card.
 * White card with thick black border + hard offset shadow (HardShadowView).
 * Sharp corners, uppercase bold name, vivid status badge.
 * Staggered spring entrance animation on mount.
 * Skeleton shimmer while the character image loads.
 */
export function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const { themed } = useAppTheme()
  const [imageLoading, setImageLoading] = useState(true)

  const scale = useSharedValue(0.75)
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    const delay = Math.min(index, MAX_STAGGER_INDEX) * STAGGER_MS
    opacity.value = withDelay(delay, withTiming(1, { duration: 250 }))
    translateY.value = withDelay(delay, withTiming(0, { duration: 250 }))
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 14, stiffness: 180, mass: 0.7 }),
    )
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }))

  return (
    <Animated.View style={[themed($wrapper), animStyle]}>
      <HardShadowView size="sm">
        <View style={themed($card)}>
          <View style={$imageContainer}>
            <Image
              source={{ uri: character.image }}
              style={$image}
              resizeMode="cover"
              accessibilityLabel={character.name}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <SkeletonLoader
                width="100%"
                height={1}
                borderRadius={0}
                style={$imageSkeleton}
              />
            )}
          </View>
          <View style={themed($info)}>
            <Text
              text={character.name.toUpperCase()}
              size="xs"
              weight="bold"
              numberOfLines={1}
              style={themed($name)}
            />
            <StatusBadge status={character.status} />
          </View>
        </View>
      </HardShadowView>
    </Animated.View>
  )
}

const $wrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  maxWidth: "50%",
  margin: spacing.xs / 2,
})

const $card: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.white,
  borderWidth: 3,
  borderColor: colors.border,
  overflow: "hidden",
})

const $imageContainer: ViewStyle = {
  width: "100%",
  aspectRatio: 1,
}

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
}

const $imageSkeleton: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const $info: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  gap: spacing.xxxs,
})

const $name: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 0.5,
})
