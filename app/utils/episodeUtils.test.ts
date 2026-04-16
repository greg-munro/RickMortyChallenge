import type { RickMortyEpisode } from "@/services/api/types"
import {
  parseEpisodeCode,
  seasonLabel,
  groupEpisodesBySeason,
  extractCharacterIds,
} from "./episodeUtils"

const makeEpisode = (id: number, episode: string): RickMortyEpisode => ({
  id,
  episode,
  name: `Episode ${id}`,
  air_date: "January 1, 2014",
  characters: [],
  url: `https://rickandmortyapi.com/api/episode/${id}`,
  created: "2017-11-10T12:56:33.798Z",
})

// ─── parseEpisodeCode ────────────────────────────────────────────────────────

describe("parseEpisodeCode", () => {
  it("parses a valid uppercase code", () => {
    expect(parseEpisodeCode("S01E05")).toEqual({ season: 1, episode: 5, label: "S01E05" })
  })

  it("parses a lowercase code and uppercases the label", () => {
    expect(parseEpisodeCode("s02e11")).toEqual({ season: 2, episode: 11, label: "S02E11" })
  })

  it("returns null for a non-standard format", () => {
    expect(parseEpisodeCode("EP01")).toBeNull()
  })

  it("returns null for an empty string", () => {
    expect(parseEpisodeCode("")).toBeNull()
  })

  it("returns null when only season is present", () => {
    expect(parseEpisodeCode("S01")).toBeNull()
  })
})

// ─── seasonLabel ─────────────────────────────────────────────────────────────

describe("seasonLabel", () => {
  it("returns a human-readable label", () => {
    expect(seasonLabel(1)).toBe("Season 1")
    expect(seasonLabel(5)).toBe("Season 5")
  })
})

// ─── groupEpisodesBySeason ───────────────────────────────────────────────────

describe("groupEpisodesBySeason", () => {
  it("returns an empty array when given no episodes", () => {
    expect(groupEpisodesBySeason([])).toEqual([])
  })

  it("groups episodes into the correct season buckets", () => {
    const episodes = [
      makeEpisode(1, "S01E01"),
      makeEpisode(2, "S01E02"),
      makeEpisode(3, "S02E01"),
    ]
    const sections = groupEpisodesBySeason(episodes)
    expect(sections).toHaveLength(2)
    expect(sections[0].season).toBe(1)
    expect(sections[0].data).toHaveLength(2)
    expect(sections[1].season).toBe(2)
    expect(sections[1].data).toHaveLength(1)
  })

  it("sorts seasons in ascending order", () => {
    const episodes = [
      makeEpisode(3, "S03E01"),
      makeEpisode(1, "S01E01"),
      makeEpisode(2, "S02E01"),
    ]
    const sections = groupEpisodesBySeason(episodes)
    expect(sections.map((s) => s.season)).toEqual([1, 2, 3])
  })

  it("sorts episodes within a season by episode number", () => {
    const episodes = [
      makeEpisode(3, "S01E03"),
      makeEpisode(1, "S01E01"),
      makeEpisode(2, "S01E02"),
    ]
    const sections = groupEpisodesBySeason(episodes)
    expect(sections[0].data.map((ep) => ep.id)).toEqual([1, 2, 3])
  })

  it("sets the section title using seasonLabel", () => {
    const sections = groupEpisodesBySeason([makeEpisode(1, "S02E01")])
    expect(sections[0].title).toBe("Season 2")
  })
})

// ─── extractCharacterIds ─────────────────────────────────────────────────────

describe("extractCharacterIds", () => {
  it("extracts numeric IDs from full API URLs", () => {
    const urls = [
      "https://rickandmortyapi.com/api/character/1",
      "https://rickandmortyapi.com/api/character/42",
    ]
    expect(extractCharacterIds(urls)).toEqual([1, 42])
  })

  it("filters out URLs with non-numeric endings", () => {
    const urls = [
      "https://rickandmortyapi.com/api/character/abc",
      "https://rickandmortyapi.com/api/character/1",
    ]
    expect(extractCharacterIds(urls)).toEqual([1])
  })

  it("returns an empty array for empty input", () => {
    expect(extractCharacterIds([])).toEqual([])
  })
})
