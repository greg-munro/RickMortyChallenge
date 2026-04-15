import { View, ViewStyle, TextStyle, Image, ImageStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { RickMortyCharacter } from "@/services/api/types"
import { Text } from "./Text"
import { StatusBadge } from "./StatusBadge"

interface CharacterCardProps {
  character: RickMortyCharacter
}

/**
 * Grid card displaying a character's image, name and status.
 * Designed for a 2-column FlatList layout.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($card)}>
      <Image
        source={{ uri: character.image }}
        style={themed($image)}
        resizeMode="cover"
        accessibilityLabel={character.name}
      />
      <View style={themed($info)}>
        <Text
          text={character.name}
          size="sm"
          weight="semiBold"
          numberOfLines={1}
          style={themed($name)}
        />
        <StatusBadge status={character.status} />
      </View>
    </View>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  margin: spacing.xs / 2,
  borderRadius: 12,
  backgroundColor: colors.palette.neutral100,
  overflow: "hidden",
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  // Shadow
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 3,
})

const $image: ThemedStyle<ImageStyle> = () => ({
  width: "100%",
  aspectRatio: 1,
})

const $info: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  gap: spacing.xxxs,
})

const $name: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})
