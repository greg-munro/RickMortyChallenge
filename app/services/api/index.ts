import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"
import type {
  ApiConfig,
  PaginatedResponse,
  RickMortyCharacter,
  RickMortyEpisode,
} from "./types"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}


export type GetEpisodesResult =
  | { kind: "ok"; episodes: RickMortyEpisode[] }
  | GeneralApiProblem

export type GetCharactersResult =
  | { kind: "ok"; characters: RickMortyCharacter[] }
  | GeneralApiProblem


/**
 * Manages all requests to the Rick and Morty API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Fetches all Rick and Morty episodes across all pages in parallel.
   *
   * The API paginates at 20 results per page (51 total → 3 pages).
   * We hit page 1 first, then fire the remaining pages concurrently.
   */
  async getAllEpisodes(): Promise<GetEpisodesResult> {
    try {
      // Fetch the first page to discover total page count
      const firstPage: ApiResponse<PaginatedResponse<RickMortyEpisode>> =
        await this.apisauce.get("episode", { page: 1 })

      if (!firstPage.ok) {
        const problem = getGeneralApiProblem(firstPage)
        if (problem) return problem
      }

      const totalPages = firstPage.data?.info.pages ?? 1
      const firstResults = firstPage.data?.results ?? []

      // If there's only one page we're done
      if (totalPages <= 1) {
        return { kind: "ok", episodes: firstResults }
      }

      // Fetch remaining pages in parallel
      const remainingPageNumbers = Array.from(
        { length: totalPages - 1 },
        (_, i) => i + 2,
      )

      const remainingResponses = await Promise.all(
        remainingPageNumbers.map((page) =>
          this.apisauce.get<PaginatedResponse<RickMortyEpisode>>("episode", { page }),
        ),
      )

      // Check for errors on any concurrent page
      for (const response of remainingResponses) {
        if (!response.ok) {
          const problem = getGeneralApiProblem(response)
          if (problem) return problem
        }
      }

      const allEpisodes: RickMortyEpisode[] = [
        ...firstResults,
        ...remainingResponses.flatMap((r) => r.data?.results ?? []),
      ]

      return { kind: "ok", episodes: allEpisodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`getAllEpisodes error: ${e.message}`, e.stack)
      }
      return { kind: "unknown", temporary: true }
    }
  }

  /**
   * Fetches multiple characters by their IDs in a single batched request.
   *
   * Edge case: when only one ID is passed the API returns a plain object
   * instead of an array. We normalise this here so callers always get an array.
   */
  async getCharactersByIds(ids: number[]): Promise<GetCharactersResult> {
    if (ids.length === 0) return { kind: "ok", characters: [] }

    try {
      const endpoint = `character/${ids.join(",")}`

      // The response is either RickMortyCharacter[] (multiple) or RickMortyCharacter (single)
      const response: ApiResponse<RickMortyCharacter[] | RickMortyCharacter> =
        await this.apisauce.get(endpoint)

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const raw = response.data
      if (!raw) return { kind: "ok", characters: [] }

      // Normalise: single object → array
      const characters: RickMortyCharacter[] = Array.isArray(raw) ? raw : [raw]

      return { kind: "ok", characters }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`getCharactersByIds error: ${e.message}`, e.stack)
      }
      return { kind: "unknown", temporary: true }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
