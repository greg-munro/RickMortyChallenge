import { useState } from "react"
import { View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { RickMortyCharacter } from "@/services/api/types"
import { HardShadowView } from "./HardShadowView"
import { SkeletonLoader } from "./SkeletonLoader"
import { StatusBadge } from "./StatusBadge"
import { Text } from "./Text"

interface CharacterCardProps {
  character: RickMortyCharacter
}

/**
 * Neo-brutalist character card.
 * White card with thick black border + hard offset shadow (HardShadowView).
 * Sharp corners, uppercase bold name, vivid status badge.
 * Shows a skeleton shimmer while the character image loads.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const { themed } = useAppTheme()
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <HardShadowView size="sm" style={themed($wrapper)}>
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
