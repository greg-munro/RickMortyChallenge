import { FC, useCallback, useMemo, useRef, useState } from "react"
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { useRickMorty } from "@/context/RickMortyContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import type { RickMortyEpisode } from "@/services/api/types"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { groupEpisodesBySeason, EpisodeSection } from "@/utils/episodeUtils"
import { EpisodeListItem } from "@/components/EpisodeListItem"
import { SectionHeader } from "@/components/SectionHeader"
import { SkeletonLoader } from "@/components/SkeletonLoader"
import { Text } from "@/components/Text"
import { Icon } from "@/components/Icon"
import { EmptyState } from "@/components/EmptyState"
import { Screen } from "@/components/Screen"

// ─── Types ───────────────────────────────────────────────────────────────────

interface EpisodeListScreenProps extends AppStackScreenProps<"EpisodeList"> {}

// ─── Screen ──────────────────────────────────────────────────────────────────

export const EpisodeListScreen: FC<EpisodeListScreenProps> = ({ navigation }) => {
  const { episodes, episodesLoading, episodesError, fetchEpisodes } = useRickMorty()
  const { themed, theme } = useAppTheme()

  // ── Search state ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text.trim().toLowerCase())
    }, 300)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedQuery("")
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
  }, [])

  // ── Filtered + grouped data ───────────────────────────────────────────────
  const sections = useMemo<SectionListData<RickMortyEpisode, EpisodeSection>[]>(() => {
    const filtered = debouncedQuery
      ? episodes.filter(
          (ep) =>
            ep.name.toLowerCase().includes(debouncedQuery) ||
            ep.episode.toLowerCase().includes(debouncedQuery),
        )
      : episodes
    return groupEpisodesBySeason(filtered)
  }, [episodes, debouncedQuery])

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleEpisodePress = useCallback(
    (episode: RickMortyEpisode) => {
      navigation.navigate("EpisodeDetail", { episodeId: episode.id })
    },
    [navigation],
  )

  // ── Render helpers ────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<RickMortyEpisode, EpisodeSection>) => (
      <EpisodeListItem episode={item} onPress={() => handleEpisodePress(item)} />
    ),
    [handleEpisodePress],
  )

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<RickMortyEpisode, EpisodeSection> }) => (
      <SectionHeader
        title={section.title as string}
        episodeCount={(section.data as RickMortyEpisode[]).length}
      />
    ),
    [],
  )

  const keyExtractor = useCallback((item: RickMortyEpisode) => String(item.id), [])

  // ── Loading skeleton ──────────────────────────────────────────────────────
  const renderSkeleton = () => (
    <View style={themed($skeletonContainer)}>
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={themed($skeletonRow)}>
          <SkeletonLoader width={56} height={28} borderRadius={6} />
          <View style={$skeletonTextBlock}>
            <SkeletonLoader width="70%" height={16} />
            <SkeletonLoader width="45%" height={12} style={themed($skeletonSecondLine)} />
          </View>
        </View>
      ))}
    </View>
  )

  // ── Error state ───────────────────────────────────────────────────────────
  const renderError = () => (
    <EmptyState
      preset="generic"
      heading="Couldn't load episodes"
      content={episodesError ?? "Check your connection and try again."}
      buttonOnPress={() => fetchEpisodes(true)}
      button="Try Again"
    />
  )

  // ── Empty search results ──────────────────────────────────────────────────
  const ListEmptyComponent = useMemo(() => {
    if (episodesLoading || episodes.length === 0) return null
    return (
      <View style={themed($emptySearch)}>
        <Text
          text={`No episodes match "${searchQuery}"`}
          size="sm"
          style={themed($emptySearchText)}
        />
      </View>
    )
  }, [episodesLoading, episodes.length, searchQuery, themed])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)}>
      {/* Header */}
      <View style={themed($header)}>
        <Text preset="heading" tx="episodeListScreen:title" style={themed($headerTitle)} />
      </View>

      {/* Search bar */}
      <View style={themed($searchBar)}>
        <Icon icon="view" size={18} color={theme.colors.textDim} />
        <TextInput
          style={themed($searchInput)}
          placeholder="Search episodes..."
          placeholderTextColor={theme.colors.textDim}
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} hitSlop={8}>
            <Icon icon="x" size={16} color={theme.colors.textDim} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {episodesLoading && episodes.length === 0 ? (
        renderSkeleton()
      ) : episodesError && episodes.length === 0 ? (
        renderError()
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          initialNumToRender={15}
          windowSize={5}
          ListEmptyComponent={ListEmptyComponent}
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

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xs,
})

const $headerTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $searchBar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  marginHorizontal: spacing.md,
  marginBottom: spacing.xs,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: colors.border,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  gap: spacing.xs,
})

const $searchInput: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  fontSize: 15,
  fontFamily: typography.primary.normal,
  color: colors.text,
  padding: 0,
  margin: 0,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $skeletonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xs,
})

const $skeletonRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
  gap: spacing.sm,
})

const $skeletonTextBlock: ViewStyle = {
  flex: 1,
  gap: 6,
}

const $skeletonSecondLine: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxxs,
})

const $emptySearch: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
})

const $emptySearchText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})
