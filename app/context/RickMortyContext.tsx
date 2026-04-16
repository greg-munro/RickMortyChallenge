import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react"
import { useMMKVString } from "react-native-mmkv"

import { api } from "@/services/api"
import type { RickMortyCharacter, RickMortyEpisode } from "@/services/api/types"
import { extractCharacterIds } from "@/utils/episodeUtils"
import { isCacheStale, safeJsonParse } from "@/utils/cacheUtils"
import { load, save } from "@/utils/storage"


const EPISODES_CACHE_KEY = "rickmorty.episodes"
const EPISODES_TIMESTAMP_KEY = "rickmorty.episodes.timestamp"
/** Character cache is keyed per episode: rickmorty.characters.<episodeId> */
const characterCacheKey = (episodeId: number) => `rickmorty.characters.${episodeId}`


export interface RickMortyContextType {
  episodes: RickMortyEpisode[]
  episodesLoading: boolean
  episodesError: string | null
  /** Call to (re)fetch all episodes. Respects 1-hour MMKV cache by default. */
  fetchEpisodes: (force?: boolean) => Promise<void>

  /** Characters keyed by episode ID, populated on demand */
  charactersByEpisode: Record<number, RickMortyCharacter[]>
  /** Per-episode loading states */
  charactersLoading: Record<number, boolean>
  /** Per-episode error messages */
  charactersError: Record<number, string | null>
  /** Fetches characters for a given episode (batched). Uses MMKV cache. */
  fetchCharactersForEpisode: (episode: RickMortyEpisode) => Promise<void>
}


export const RickMortyContext = createContext<RickMortyContextType | null>(null)

export const useRickMorty = (): RickMortyContextType => {
  const ctx = useContext(RickMortyContext)
  if (!ctx) throw new Error("useRickMorty must be used within a RickMortyProvider")
  return ctx
}


export function RickMortyProvider({ children }: PropsWithChildren) {
  const [episodes, setEpisodes] = useState<RickMortyEpisode[]>([])
  const [episodesLoading, setEpisodesLoading] = useState(false)
  const [episodesError, setEpisodesError] = useState<string | null>(null)

  const [charactersByEpisode, setCharactersByEpisode] = useState<
    Record<number, RickMortyCharacter[]>
  >({})
  const [charactersLoading, setCharactersLoading] = useState<Record<number, boolean>>({})
  const [charactersError, setCharactersError] = useState<Record<number, string | null>>({})

  const [cachedEpisodesRaw, setCachedEpisodesRaw] = useMMKVString(EPISODES_CACHE_KEY)
  const [cachedTimestampRaw, setCachedTimestampRaw] = useMMKVString(EPISODES_TIMESTAMP_KEY)

  useEffect(() => {
    const cached = safeJsonParse<RickMortyEpisode[]>(cachedEpisodesRaw)
    if (cached && cached.length > 0) setEpisodes(cached)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally runs once on mount to hydrate state
  }, [])


  const fetchEpisodes = async (force = false) => {
      const cachedTimestamp = safeJsonParse<number>(cachedTimestampRaw)
      const cached = safeJsonParse<RickMortyEpisode[]>(cachedEpisodesRaw)

      // Serve from cache if fresh and not forced
      if (!force && cached && cached.length > 0 && !isCacheStale(cachedTimestamp)) {
        setEpisodes(cached)
        return
      }

      setEpisodesLoading(true)
      setEpisodesError(null)

      const result = await api.getAllEpisodes()

      if (result.kind === "ok") {
        setEpisodes(result.episodes)
        setCachedEpisodesRaw(JSON.stringify(result.episodes))
        setCachedTimestampRaw(JSON.stringify(Date.now()))
        setEpisodesError(null)
      } else {
        // On network failure, fall back to stale cache if available
        const staleCache = safeJsonParse<RickMortyEpisode[]>(cachedEpisodesRaw)
        if (staleCache && staleCache.length > 0) setEpisodes(staleCache)
        setEpisodesError(
          result.kind === "cannot-connect"
            ? "No internet connection."
            : "Failed to load episodes. Please try again.",
        )
      }

      setEpisodesLoading(false)
    }


  const fetchCharactersForEpisode = async (episode: RickMortyEpisode) => {
      const epId = episode.id

      // Already loaded in-memory or currently fetching — skip
      if (charactersByEpisode[epId] || charactersLoading[epId]) return

      // Check persistent MMKV cache (character data is immutable, no TTL needed)
      const cachedChars = load<RickMortyCharacter[]>(characterCacheKey(epId))
      if (cachedChars && cachedChars.length > 0) {
        setCharactersByEpisode((prev) => ({ ...prev, [epId]: cachedChars }))
        return
      }

      setCharactersLoading((prev) => ({ ...prev, [epId]: true }))
      setCharactersError((prev) => ({ ...prev, [epId]: null }))

      const ids = extractCharacterIds(episode.characters)
      const result = await api.getCharactersByIds(ids)

      if (result.kind === "ok") {
        setCharactersByEpisode((prev) => ({ ...prev, [epId]: result.characters }))
        setCharactersError((prev) => ({ ...prev, [epId]: null }))
        // Persist to MMKV — characters never change so this cache is permanent
        save(characterCacheKey(epId), result.characters)
      } else {
        setCharactersError((prev) => ({
          ...prev,
          [epId]:
            result.kind === "cannot-connect"
              ? "No internet connection."
              : "Failed to load characters.",
        }))
      }

      setCharactersLoading((prev) => ({ ...prev, [epId]: false }))
    }


  useEffect(() => {
    fetchEpisodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally runs once on mount
  }, [])


  const value: RickMortyContextType = {
    episodes,
    episodesLoading,
    episodesError,
    fetchEpisodes,
    charactersByEpisode,
    charactersLoading,
    charactersError,
    fetchCharactersForEpisode,
  }

  return <RickMortyContext.Provider value={value}>{children}</RickMortyContext.Provider>
}
