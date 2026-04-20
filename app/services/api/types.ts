/**
 * Rick and Morty API type definitions.
 * https://rickandmortyapi.com/documentation/#rest
 */

export interface PaginationInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface PaginatedResponse<T> {
  info: PaginationInfo
  results: T[]
}

export interface RickMortyEpisode {
  id: number
  name: string
  /** e.g. "December 2, 2013" */
  air_date: string
  /** e.g. "S01E01" */
  episode: string
  /** Array of full character endpoint URLs */
  characters: string[]
  url: string
  created: string
}

export type CharacterStatus = "Alive" | "Dead" | "unknown"
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown"

export interface CharacterLocation {
  name: string
  url: string
}

export interface RickMortyCharacter {
  id: number
  name: string
  status: CharacterStatus
  species: string
  type: string
  gender: CharacterGender
  origin: CharacterLocation
  location: CharacterLocation
  /** 300×300 JPEG */
  image: string
  /** Array of full episode endpoint URLs */
  episode: string[]
  url: string
  created: string
}

export interface ApiConfig {
  /** Base URL for the API */
  url: string
  /** Milliseconds before we timeout the request */
  timeout: number
}
