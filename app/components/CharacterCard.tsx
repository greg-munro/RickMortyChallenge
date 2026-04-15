import { View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { RickMortyCharacter } from "@/services/api/types"
import { HardShadowView } from "./HardShadowView"
import { StatusBadge } from "./StatusBadge"
import { Text } from "./Text"

interface CharacterCardProps {
  character: RickMortyCharacter
}

/**
 * Neo-brutalist character card.
 * White card with thick black border + hard offset shadow (HardShadowView).
 * Sharp corners, uppercase bold name, vivid status badge.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const { themed } = useAppTheme()

  return (
    <HardShadowView size="sm" style={themed($wrapper)}>
      <View style={themed($card)}>
        <Image
          source={{ uri: character.image }}
          style={$image}
          resizeMode="cover"
          accessibilityLabel={character.name}
        />
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

const $image: ImageStyle = {
  width: "100%",
  aspectRatio: 1,
}

const $info: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  gap: spacing.xxxs,
})

const $name: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 0.5,
})
