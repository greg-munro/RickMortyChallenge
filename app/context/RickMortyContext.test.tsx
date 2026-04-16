import React from "react"
import { renderHook, act, waitFor } from "@testing-library/react-native"
import { useMMKVString } from "react-native-mmkv"

import { api } from "@/services/api"
import { load, save } from "@/utils/storage"
import type { RickMortyCharacter, RickMortyEpisode } from "@/services/api/types"
import { RickMortyProvider, useRickMorty } from "./RickMortyContext"

jest.mock("@/services/api", () => ({
  api: {
    getAllEpisodes: jest.fn(),
    getCharactersByIds: jest.fn(),
  },
}))

jest.mock("@/utils/storage", () => ({
  load: jest.fn(() => null),
  save: jest.fn(),
}))


const mockEpisode: RickMortyEpisode = {
  id: 1,
  name: "Pilot",
  air_date: "December 2, 2013",
  episode: "S01E01",
  characters: ["https://rickandmortyapi.com/api/character/1"],
  url: "https://rickandmortyapi.com/api/episode/1",
  created: "2017-11-10T12:56:33.798Z",
}

const mockCharacter: RickMortyCharacter = {
  id: 1,
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  origin: { name: "Earth (C-137)", url: "" },
  location: { name: "Earth (Replacement Dimension)", url: "" },
  image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  episode: [],
  url: "https://rickandmortyapi.com/api/character/1",
  created: "2017-11-04T18:48:46.250Z",
}


const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RickMortyProvider>{children}</RickMortyProvider>
)

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(useMMKVString).mockReturnValue([undefined, jest.fn()])
  jest.mocked(api.getAllEpisodes).mockResolvedValue({ kind: "ok", episodes: [mockEpisode] })
  jest.mocked(api.getCharactersByIds).mockResolvedValue({ kind: "ok", characters: [mockCharacter] })
  jest.mocked(load).mockReturnValue(null)
})


describe("useRickMorty", () => {
  it("throws when used outside RickMortyProvider", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    expect(() => renderHook(() => useRickMorty())).toThrow(
      "useRickMorty must be used within a RickMortyProvider",
    )
    spy.mockRestore()
  })
})


describe("RickMortyProvider — episodes", () => {
  it("fetches episodes from the API on mount", async () => {
    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))
    expect(api.getAllEpisodes).toHaveBeenCalledTimes(1)
    expect(result.current.episodes).toEqual([mockEpisode])
  })

  it("serves a fresh cache without calling the API", async () => {
    const freshTimestamp = Date.now() - 1000
    jest
      .mocked(useMMKVString)
      .mockReturnValueOnce([JSON.stringify([mockEpisode]), jest.fn()])
      .mockReturnValueOnce([JSON.stringify(freshTimestamp), jest.fn()])

    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodes).toHaveLength(1))
    expect(api.getAllEpisodes).not.toHaveBeenCalled()
  })

  it("calls the API when the cached timestamp is stale", async () => {
    const staleTimestamp = Date.now() - 2 * 60 * 60 * 1000
    jest
      .mocked(useMMKVString)
      .mockReturnValueOnce([JSON.stringify([mockEpisode]), jest.fn()])
      .mockReturnValueOnce([JSON.stringify(staleTimestamp), jest.fn()])

    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))
    expect(api.getAllEpisodes).toHaveBeenCalledTimes(1)
  })

  it("falls back to the stale cache and sets an error on network failure", async () => {
    jest
      .mocked(useMMKVString)
      .mockReturnValueOnce([JSON.stringify([mockEpisode]), jest.fn()])
      .mockReturnValueOnce([undefined, jest.fn()])
    jest.mocked(api.getAllEpisodes).mockResolvedValue({ kind: "cannot-connect", temporary: true })

    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))
    expect(result.current.episodes).toEqual([mockEpisode])
    expect(result.current.episodesError).toBe("No internet connection.")
  })

  it("sets a generic error message for non-network API failures", async () => {
    jest.mocked(api.getAllEpisodes).mockResolvedValue({ kind: "unknown", temporary: true })

    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))
    expect(result.current.episodesError).toBe("Failed to load episodes. Please try again.")
  })
})


describe("RickMortyProvider — characters", () => {
  it("fetches characters from the API and persists them to storage", async () => {
    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))

    await act(async () => {
      await result.current.fetchCharactersForEpisode(mockEpisode)
    })

    expect(api.getCharactersByIds).toHaveBeenCalledWith([1])
    expect(result.current.charactersByEpisode[1]).toEqual([mockCharacter])
    expect(save).toHaveBeenCalledWith("rickmorty.characters.1", [mockCharacter])
  })

  it("serves characters from persistent storage without calling the API", async () => {
    jest.mocked(load).mockReturnValue([mockCharacter])

    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))

    await act(async () => {
      await result.current.fetchCharactersForEpisode(mockEpisode)
    })

    expect(api.getCharactersByIds).not.toHaveBeenCalled()
    expect(result.current.charactersByEpisode[1]).toEqual([mockCharacter])
  })

  it("does not call the API again if characters are already loaded in memory", async () => {
    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))

    await act(async () => {
      await result.current.fetchCharactersForEpisode(mockEpisode)
    })
    await act(async () => {
      await result.current.fetchCharactersForEpisode(mockEpisode)
    })

    expect(api.getCharactersByIds).toHaveBeenCalledTimes(1)
  })

  it("sets a 'no internet' error on character fetch network failure", async () => {
    jest
      .mocked(api.getCharactersByIds)
      .mockResolvedValue({ kind: "cannot-connect", temporary: true })

    const { result } = renderHook(() => useRickMorty(), { wrapper })
    await waitFor(() => expect(result.current.episodesLoading).toBe(false))

    await act(async () => {
      await result.current.fetchCharactersForEpisode(mockEpisode)
    })

    expect(result.current.charactersError[1]).toBe("No internet connection.")
  })
})
