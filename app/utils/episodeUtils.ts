import type { RickMortyEpisode } from "@/services/api/types"
import { SectionListData } from "react-native"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ParsedEpisodeCode {
  season: number
  episode: number
  /** e.g. "S01E01" */
  label: string
}

export interface EpisodeSection {
  /** e.g. "Season 1" */
  title: string
  season: number
  data: RickMortyEpisode[]
}

// ─── Parsing ────────────────────────────────────────────────────────────────

/**
 * Parses an episode code string (e.g. "S01E01") into its component parts.
 * Returns null if the string doesn't match the expected format.
 */
export function parseEpisodeCode(code: string): ParsedEpisodeCode | null {
  const match = code.match(/^S(\d{2})E(\d{2})$/i)
  if (!match) return null
  return {
    season: parseInt(match[1], 10),
    episode: parseInt(match[2], 10),
    label: code.toUpperCase(),
  }
}

/**
 * Returns a human-readable season label, e.g. "Season 1"
 */
export function seasonLabel(season: number): string {
  return `Season ${season}`
}

// ─── Grouping ───────────────────────────────────────────────────────────────

/**
 * Groups a flat array of episodes into sections by season, sorted ascending.
 * Episodes within each season are also sorted by episode number.
 */
export function groupEpisodesBySeason(
  episodes: RickMortyEpisode[],
): SectionListData<RickMortyEpisode, EpisodeSection>[] {
  const seasonMap = new Map<number, RickMortyEpisode[]>()

  for (const ep of episodes) {
    const parsed = parseEpisodeCode(ep.episode)
    const season = parsed?.season ?? 0
    if (!seasonMap.has(season)) seasonMap.set(season, [])
    seasonMap.get(season)!.push(ep)
  }

  // Sort episodes within each season by episode number
  for (const [, eps] of seasonMap) {
    eps.sort((a, b) => {
      const pa = parseEpisodeCode(a.episode)
      const pb = parseEpisodeCode(b.episode)
      return (pa?.episode ?? 0) - (pb?.episode ?? 0)
    })
  }

  // Sort seasons ascending and build SectionList data
  return Array.from(seasonMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([season, data]) => ({
      title: seasonLabel(season),
      season,
      data,
    }))
}

// ─── Character IDs ──────────────────────────────────────────────────────────

/**
 * Extracts numeric character IDs from the array of full character URLs
 * that the episode endpoint returns.
 *
 * e.g. "https://rickandmortyapi.com/api/character/1" → 1
 */
export function extractCharacterIds(characterUrls: string[]): number[] {
  return characterUrls
    .map((url) => {
      const parts = url.split("/")
      const id = parseInt(parts[parts.length - 1], 10)
      return Number.isNaN(id) ? null : id
    })
    .filter((id): id is number => id !== null)
}
