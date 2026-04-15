import { FC, useCallback, useEffect, useMemo, useState } from "react"
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { useRickMorty } from "@/context/RickMortyContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import type { CharacterStatus, RickMortyCharacter } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { CharacterCard } from "@/components/CharacterCard"
import { SkeletonLoader } from "@/components/SkeletonLoader"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { StatusFilterChip } from "@/components/StatusFilterChip"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"

interface EpisodeDetailScreenProps extends AppStackScreenProps<"EpisodeDetail"> {}

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

  // ── Filter state ──────────────────────────────────────────────────────────
  const [activeFilters, setActiveFilters] = useState<Set<CharacterStatus>>(new Set())

  const toggleFilter = useCallback((status: CharacterStatus) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(status)) {
        next.delete(status)
      } else {
        next.add(status)
      }
      return next
    })
  }, [])

  // ── Derive episode from context ───────────────────────────────────────────
  const episode = useMemo(
    () => episodes.find((ep) => ep.id === episodeId) ?? null,
    [episodes, episodeId],
  )

  const characters = episode ? (charactersByEpisode[episode.id] ?? []) : []
  const isLoading = episode ? (charactersLoading[episode.id] ?? false) : false
  const error = episode ? (charactersError[episode.id] ?? null) : null

  useEffect(() => {
    setActiveFilters(new Set())
  }, [episodeId])

  useEffect(() => {
    if (episode) fetchCharactersForEpisode(episode)
  }, [episode, fetchCharactersForEpisode])

  // ── Status counts & available filters ────────────────────────────────────
  const statusCounts = useMemo(() => {
    const counts = new Map<CharacterStatus, number>()
    for (const c of characters) {
      counts.set(c.status, (counts.get(c.status) ?? 0) + 1)
    }
    return counts
  }, [characters])

  const availableStatuses = useMemo(
    () => (["Alive", "Dead", "unknown"] as CharacterStatus[]).filter((s) => statusCounts.has(s)),
    [statusCounts],
  )

  // ── Filtered + sorted characters ─────────────────────────────────────────
  const filteredCharacters = useMemo(() => {
    const STATUS_ORDER: Record<CharacterStatus, number> = { Alive: 0, Dead: 1, unknown: 2 }
    if (activeFilters.size === 0) return characters
    return characters
      .filter((c) => activeFilters.has(c.status))
      .sort((a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3))
  }, [characters, activeFilters])

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderCharacter = useCallback(
    ({ item }: ListRenderItemInfo<RickMortyCharacter>) => <CharacterCard character={item} />,
    [],
  )

  const keyExtractor = useCallback((item: RickMortyCharacter) => String(item.id), [])

  // ── Character skeleton ────────────────────────────────────────────────────
  const renderCharacterSkeletons = () => (
    <View style={themed($skeletonGrid)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={themed($skeletonCard)}>
          <SkeletonLoader width="100%" height={150} borderRadius={0} />
          <View style={themed($skeletonCardInfo)}>
            <SkeletonLoader width="80%" height={14} borderRadius={0} />
            <SkeletonLoader width="50%" height={20} borderRadius={0} style={themed($skeletonBadge)} />
          </View>
        </View>
      ))}
    </View>
  )

  // ── Episode info header ───────────────────────────────────────────────────
  const ListHeader = useMemo(() => {
    if (!episode) return null
    return (
      <View style={themed($listHeaderContainer)}>
        {/* Episode code badge — yellow, sharp, bordered */}
        <View style={themed($episodeCodeBadge)}>
          <Text
            text={episode.episode}
            size="sm"
            weight="bold"
            style={themed($episodeCodeText)}
          />
        </View>

        {/* Episode title */}
        <Text
          text={episode.name.toUpperCase()}
          weight="bold"
          style={themed($episodeTitle)}
          numberOfLines={3}
        />

        {/* Meta rows */}
        <View style={themed($metaRow)}>
          <Text text="◉" style={themed($metaIcon)} />
          <Text text={episode.air_date} size="sm" weight="bold" style={themed($metaText)} />
        </View>

        <View style={themed($metaRow)}>
          <Text text="👤" style={themed($metaIcon)} />
          <Text
            text={`${episode.characters.length} CHARACTER${episode.characters.length !== 1 ? "S" : ""}`}
            size="sm"
            weight="bold"
            style={themed($metaText)}
          />
        </View>

        {/* Section divider — thick black border */}
        <View style={themed($divider)} />

        <Text
          tx="episodeDetailScreen:characters"
          weight="bold"
          style={themed($sectionTitle)}
        />

        {/* Status filter chips */}
        {!isLoading && !error && availableStatuses.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themed($chipsRow)}
            style={themed($chipsScroll)}
          >
            {availableStatuses.map((status) => (
              <StatusFilterChip
                key={status}
                status={status}
                count={statusCounts.get(status) ?? 0}
                isSelected={activeFilters.has(status)}
                onPress={() => toggleFilter(status)}
              />
            ))}
          </ScrollView>
        )}

        {/* Loading / error states */}
        {isLoading && renderCharacterSkeletons()}
        {!isLoading && error && (
          <ErrorDisplay
            heading="Couldn't load characters"
            message={error}
            onAction={() => fetchCharactersForEpisode(episode)}
          />
        )}
      </View>
    )
  }, [
    episode,
    isLoading,
    error,
    availableStatuses,
    statusCounts,
    activeFilters,
    toggleFilter,
    themed,
    theme.colors.textDim,
    fetchCharactersForEpisode,
  ])

  // ── Guard: episode not found ──────────────────────────────────────────────
  if (!episode) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} style={themed($screen)}>
        <View style={themed($notFound)}>
          <Text
            text="EPISODE NOT FOUND."
            weight="bold"
            style={themed($notFoundText)}
          />
        </View>
      </Screen>
    )
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)}>
      {/* Back button — bordered, bold, neo-styled */}
      <TouchableOpacity
        style={themed($backButton)}
        onPress={() => navigation.goBack()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text text="←" style={themed($backArrow)} />
        <Text text="EPISODES" size="sm" weight="bold" style={themed($backText)} />
      </TouchableOpacity>

      {/* Character grid */}
      {!isLoading && !error ? (
        <FlatList<RickMortyCharacter>
          data={filteredCharacters}
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

const $backButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
  backgroundColor: colors.palette.white,
  gap: spacing.xs,
})

const $backArrow: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 18,
  fontWeight: "700",
})

const $backText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 2,
  textTransform: "uppercase",
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $columnWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xs,
})

const $listHeaderContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  paddingBottom: spacing.md,
})

const $episodeCodeBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignSelf: "flex-start",
  backgroundColor: colors.palette.secondary,
  borderWidth: 2,
  borderColor: colors.border,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxxs,
  marginBottom: spacing.xs,
})

const $episodeCodeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 1,
})

const $episodeTitle: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  color: colors.text,
  fontFamily: typography.primary.black,
  fontSize: 28,
  lineHeight: 32,
  letterSpacing: -0.5,
  textTransform: "uppercase",
  marginBottom: spacing.sm,
})

const $metaRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
  marginBottom: spacing.xs,
})

const $metaIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.accent,
  fontSize: 14,
})

const $metaText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 0.5,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 3,
  backgroundColor: colors.border,
  marginVertical: spacing.md,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  color: colors.text,
  fontFamily: typography.primary.black,
  fontSize: 18,
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: spacing.sm,
})

const $chipsScroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
  marginHorizontal: -spacing.md,
})

const $chipsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.xs,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xxxs,
})

const $skeletonGrid: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  flexWrap: "wrap",
})

const $skeletonCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: "50%",
  padding: spacing.xs / 2,
  backgroundColor: colors.palette.white,
  borderWidth: 2,
  borderColor: colors.border,
  overflow: "hidden",
})

const $skeletonCardInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
  gap: spacing.xxxs,
})

const $skeletonBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxxs,
})

const $notFound: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xl,
  borderWidth: 3,
  borderColor: colors.border,
  margin: spacing.md,
  backgroundColor: colors.palette.white,
})

const $notFoundText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 2,
  textAlign: "center",
})
