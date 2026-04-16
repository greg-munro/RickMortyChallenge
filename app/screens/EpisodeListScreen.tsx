import { FC, useEffect, useRef, useState } from "react"
import NetInfo from "@react-native-community/netinfo"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import {
  RefreshControl,
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
import { useOfflineStatus } from "@/hooks/useOfflineStatus"
import { EpisodeListItem } from "@/components/EpisodeListItem"
import { SectionHeader } from "@/components/SectionHeader"
import { SkeletonLoader } from "@/components/SkeletonLoader"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { Text } from "@/components/Text"
import { Screen } from "@/components/Screen"

interface EpisodeListScreenProps extends AppStackScreenProps<"EpisodeList"> {}

export const EpisodeListScreen: FC<EpisodeListScreenProps> = ({ navigation }) => {
  const { episodes, episodesLoading, episodesError, fetchEpisodes } = useRickMorty()
  const { themed, theme } = useAppTheme()
  const isOffline = useOfflineStatus()

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const chipScale = useSharedValue(0)
  const chipOpacity = useSharedValue(0)
  const chipTranslateX = useSharedValue(0)

  const chipAnimStyle = useAnimatedStyle(() => ({
    opacity: chipOpacity.value,
    transform: [{ scale: chipScale.value }, { translateX: chipTranslateX.value }],
  }))

  useEffect(() => {
    if (isOffline) {
      chipScale.value = withSpring(1, { damping: 16, stiffness: 260, mass: 0.6 })
      chipOpacity.value = withTiming(1, { duration: 200 })
    } else {
      chipScale.value = withTiming(0, { duration: 180 })
      chipOpacity.value = withTiming(0, { duration: 180 })
    }
  }, [isOffline])

  const triggerChipShake = () => {
    chipTranslateX.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(-4, { duration: 40 }),
      withTiming(4, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    )
  }

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text.trim().toLowerCase())
    }, 300)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setDebouncedQuery("")
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
  }

  const handleRefresh = async () => {
    const state = await NetInfo.fetch()
    const currentlyOffline = !state.isConnected || state.isInternetReachable === false
    if (currentlyOffline) {
      triggerChipShake()
      return
    }
    fetchEpisodes(true)
  }

  const sections: SectionListData<RickMortyEpisode, EpisodeSection>[] = (() => {
    const filtered = debouncedQuery
      ? episodes.filter(
          (ep) =>
            ep.name.toLowerCase().includes(debouncedQuery) ||
            ep.episode.toLowerCase().includes(debouncedQuery),
        )
      : episodes
    return groupEpisodesBySeason(filtered)
  })()

  const handleEpisodePress = (episode: RickMortyEpisode) => {
      navigation.navigate("EpisodeDetail", { episodeId: episode.id })
    }

  const renderItem = ({ item }: SectionListRenderItemInfo<RickMortyEpisode, EpisodeSection>) => (
      <EpisodeListItem episode={item} onPress={() => handleEpisodePress(item)} />
    )

  const renderSectionHeader = ({ section }: { section: SectionListData<RickMortyEpisode, EpisodeSection> }) => (
      <SectionHeader
        title={section.title as string}
        episodeCount={(section.data as RickMortyEpisode[]).length}
      />
    )

  const keyExtractor = (item: RickMortyEpisode) => String(item.id)

  const renderSkeleton = () => (
    <View style={themed($skeletonContainer)}>
      {Array.from({ length: 10 }).map((_, i) => (
        <View key={i} style={themed($skeletonRow)}>
          <SkeletonLoader width={56} height={28} borderRadius={0} />
          <View style={$skeletonTextBlock}>
            <SkeletonLoader width="70%" height={14} borderRadius={0} />
            <SkeletonLoader width="45%" height={11} borderRadius={0} style={themed($skeletonSecondLine)} />
          </View>
        </View>
      ))}
    </View>
  )

  const renderError = () => (
    <ErrorDisplay
      heading="Couldn't load episodes"
      message={episodesError ?? "Check your connection and try again."}
      onAction={() => fetchEpisodes(true)}
    />
  )

  const ListEmptyComponent = (() => {
    if (episodesLoading || episodes.length === 0) return null
    return (
      <View style={themed($emptySearch)}>
        <Text
          text={`NO RESULTS FOR "${searchQuery.toUpperCase()}"`}
          size="sm"
          weight="bold"
          style={themed($emptySearchText)}
        />
      </View>
    )
  })()

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)} contentContainerStyle={$flex}>
      <View style={themed($header)}>
        <View style={$headerRow}>
          <View style={$headerLeft}>
            <Text
              preset="heading"
              tx="episodeListScreen:title"
              style={themed($headerTitle)}
            />
            <View style={themed($headerUnderline)} />
          </View>
          <Animated.View style={[themed($offlineChip), chipAnimStyle]} pointerEvents="none">
            <Text text="OFFLINE" size="xs" weight="bold" style={$offlineChipText} />
          </Animated.View>
        </View>
      </View>

      <View style={themed($searchBarOuter)}>
        <View style={themed($searchBar)}>
          <Text text="/" style={themed($searchIcon)} />
          <TextInput
            style={themed($searchInput)}
            placeholder="SEARCH EPISODES..."
            placeholderTextColor={theme.colors.text + "55"}
            value={searchQuery}
            onChangeText={handleSearchChange}
            returnKeyType="search"
            clearButtonMode="never"
            autoCorrect={false}
            autoCapitalize="characters"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} hitSlop={8}>
              <Text text="×" style={themed($clearButton)} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {episodesLoading && episodes.length === 0 ? (
        renderSkeleton()
      ) : episodesError && episodes.length === 0 ? (
        <View style={$flex}>{renderError()}</View>
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          refreshControl={
            <RefreshControl
              refreshing={episodesLoading && !isOffline}
              onRefresh={handleRefresh}
              tintColor="#FF6B6B"
              colors={["#FF6B6B"]}
            />
          }
        />
      )}
    </Screen>
  )
}


const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $header: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xs,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
  backgroundColor: colors.background,
})

const $headerRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}

const $headerLeft: ViewStyle = {
  flex: 1,
}

const $headerTitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  color: colors.text,
  fontFamily: typography.primary.black,
  fontSize: 32,
  letterSpacing: -0.5,
  textTransform: "uppercase",
})

const $headerUnderline: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 4,
  width: 48,
  backgroundColor: colors.palette.accent,
  marginTop: 4,
})

const $offlineChip: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.accent,
  borderWidth: 2,
  borderColor: colors.border,
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 0,
  marginLeft: 12,
})

const $offlineChipText: TextStyle = {
  color: "#FFFFFF",
  letterSpacing: 1.5,
  textTransform: "uppercase",
}

const $searchBarOuter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $searchBar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.white,
  borderWidth: 3,
  borderColor: colors.border,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  gap: spacing.xs,
})

const $searchIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 18,
  fontWeight: "700",
  opacity: 0.4,
})

const $searchInput: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  fontSize: 14,
  fontFamily: typography.primary.bold,
  color: colors.text,
  letterSpacing: 1,
  padding: 0,
  margin: 0,
})

const $clearButton: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 22,
  fontWeight: "700",
  lineHeight: 24,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xl,
})

const $skeletonContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopWidth: 3,
  borderTopColor: colors.border,
})

const $skeletonRow: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.white,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomWidth: 3,
  borderBottomColor: colors.border,
  gap: spacing.sm,
})

const $skeletonTextBlock: ViewStyle = {
  flex: 1,
  gap: 6,
}

const $skeletonSecondLine: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xxxs,
})

const $emptySearch: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  margin: spacing.md,
  padding: spacing.lg,
  borderWidth: 3,
  borderColor: colors.border,
  backgroundColor: colors.palette.white,
  alignItems: "center",
})

const $emptySearchText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  letterSpacing: 1,
  textAlign: "center",
})

const $flex: ViewStyle = { flex: 1 }
