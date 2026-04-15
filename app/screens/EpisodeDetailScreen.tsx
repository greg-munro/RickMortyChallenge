import { FC, useCallback, useEffect, useMemo } from "react"
import {
  FlatList,
  ListRenderItemInfo,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { useRickMorty } from "@/context/RickMortyContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import type { RickMortyCharacter } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { CharacterCard } from "@/components/CharacterCard"
import { SkeletonLoader } from "@/components/SkeletonLoader"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"

// ─── Types ───────────────────────────────────────────────────────────────────

interface EpisodeDetailScreenProps extends AppStackScreenProps<"EpisodeDetail"> {}

// ─── Screen ──────────────────────────────────────────────────────────────────

export const EpisodeDetailScreen: FC<EpisodeDetailScreenProps> = ({ navigation, route }) => {
  const { episodeId } = route.params
  const {
    episodes,
    charactersByEpisode,
    charactersLoading,
    charactersError,
    fetchCharactersForEpisode,
  } = useRickMorty()
  const { themed, theme } = useAppTheme()

  // ── Derive episode from context (already loaded) ──────────────────────────
  const episode = useMemo(
    () => episodes.find((ep) => ep.id === episodeId) ?? null,
    [episodes, episodeId],
  )

  const characters = episode ? (charactersByEpisode[episode.id] ?? []) : []
  const isLoading = episode ? (charactersLoading[episode.id] ?? false) : false
  const error = episode ? (charactersError[episode.id] ?? null) : null

  // ── Fetch characters on mount ─────────────────────────────────────────────
  useEffect(() => {
    if (episode) fetchCharactersForEpisode(episode)
  }, [episode, fetchCharactersForEpisode])

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderCharacter = useCallback(
    ({ item }: ListRenderItemInfo<RickMortyCharacter>) => <CharacterCard character={item} />,
    [],
  )

  const keyExtractor = useCallback((item: RickMortyCharacter) => String(item.id), [])

  // ── Character skeleton ─────────────────────────────────────────────────
  const renderCharacterSkeletons = () => (
    <View style={themed($skeletonGrid)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={themed($skeletonCard)}>
          <SkeletonLoader width="100%" height={150} borderRadius={0} />
          <View style={themed($skeletonCardInfo)}>
            <SkeletonLoader width="80%" height={14} />
            <SkeletonLoader width="50%" height={20} borderRadius={12} style={themed($skeletonBadge)} />
          </View>
        </View>
      ))}
    </View>
  )

  // ── Episode info header component ──────────────────────────────────────
  const ListHeader = useMemo(() => {
    if (!episode) return null
    return (
      <View style={themed($listHeaderContainer)}>
        {/* Episode code + name */}
        <View style={themed($episodeCodeBadge)}>
          <Text text={episode.episode} size="sm" weight="bold" style={themed($episodeCodeText)} />
        </View>
        <Text
          text={episode.name}
          preset="heading"
          style={themed($episodeTitle)}
          numberOfLines={3}
        />

        {/* Air date row */}
        <View style={themed($metaRow)}>
          <Icon icon="bell" size={14} color={theme.colors.textDim} />
          <Text
            text={episode.air_date}
            size="sm"
            weight="normal"
            style={themed($metaText)}
          />
        </View>

        {/* Character count */}
        <View style={themed($metaRow)}>
          <Icon icon="community" size={14} color={theme.colors.textDim} />
          <Text
            text={`${episode.characters.length} character${episode.characters.length !== 1 ? "s" : ""}`}
            size="sm"
            weight="normal"
            style={themed($metaText)}
          />
        </View>

        {/* Section divider */}
        <View style={themed($divider)} />

        <Text
          tx="episodeDetailScreen:characters"
          preset="subheading"
          style={themed($sectionTitle)}
        />

        {/* Loading / error state for characters */}
        {isLoading && renderCharacterSkeletons()}
        {!isLoading && error && (
          <View style={themed($errorContainer)}>
            <Text text={error} size="sm" style={themed($errorText)} />
            <TouchableOpacity
              style={themed($retryButton)}
              onPress={() => fetchCharactersForEpisode(episode)}
            >
              <Text tx="episodeDetailScreen:retry" size="sm" weight="bold" style={themed($retryText)} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }, [episode, isLoading, error, themed, theme.colors.textDim, fetchCharactersForEpisode])

  // ── Guard: episode not found ──────────────────────────────────────────────
  if (!episode) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} style={themed($screen)}>
        <View style={themed($notFound)}>
          <Text text="Episode not found." preset="subheading" style={themed($notFoundText)} />
        </View>
      </Screen>
    )
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)}>
      {/* Back button */}
      <TouchableOpacity
        style={themed($backButton)}
        onPress={() => navigation.goBack()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Icon icon="caretLeft" size={20} color={theme.colors.tint} />
        <Text text="Episodes" size="sm" weight="medium" style={themed($backText)} />
      </TouchableOpacity>

      {/* Character grid with episode info in the header */}
      {!isLoading && !error ? (
        <FlatList<RickMortyCharacter>
          data={characters}
          keyExtractor={keyExtractor}
          renderItem={renderCharacter}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={themed($listContent)}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={themed($columnWrapper)}
          initialNumToRender={8}
          windowSize={5}
        />
      ) : (
        <FlatList<RickMortyCharacter>
          data={[]}
          keyExtractor={keyExtractor}
          renderItem={renderCharacter}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={themed($listContent)}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $backButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: spacing.xxxs,
})

const $backText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $columnWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xs,
})

const $listHeaderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xs,
  paddingBottom: spacing.md,
})

const $episodeCodeBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.palette.primary100,
  borderRadius: 6,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxxs,
  marginBottom: spacing.xs,
})

const $episodeCodeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary600,
})

const $episodeTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.sm,
})

const $metaRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  marginBottom: spacing.xs,
})

const $metaText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.sm,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.lg,
  gap: spacing.sm,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  textAlign: "center",
})

const $retryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.tint,
  borderRadius: 8,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $retryText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $skeletonGrid: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  flexWrap: "wrap",
})

const $skeletonCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: "50%",
  padding: spacing.xs / 2,
  borderRadius: 12,
  backgroundColor: colors.palette.neutral100,
  overflow: "hidden",
})

const $skeletonCardInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  gap: spacing.xxxs,
})

const $skeletonBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxxs,
})

const $notFound: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xl,
})

const $notFoundText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})
