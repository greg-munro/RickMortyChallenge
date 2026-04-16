import { isCacheStale, safeJsonParse } from "./cacheUtils"

const ONE_HOUR_MS = 60 * 60 * 1000

// ─── isCacheStale ─────────────────────────────────────────────────────────────

describe("isCacheStale", () => {
  it("is stale when timestamp is null", () => {
    expect(isCacheStale(null)).toBe(true)
  })

  it("is stale when timestamp is undefined", () => {
    expect(isCacheStale(undefined)).toBe(true)
  })

  it("is fresh when the timestamp is within the default 1-hour TTL", () => {
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000
    expect(isCacheStale(thirtyMinutesAgo)).toBe(false)
  })

  it("is stale when the timestamp is older than the default 1-hour TTL", () => {
    const twoHoursAgo = Date.now() - 2 * ONE_HOUR_MS
    expect(isCacheStale(twoHoursAgo)).toBe(true)
  })

  it("respects a custom TTL", () => {
    const fiveMinutesMs = 5 * 60 * 1000
    const fourMinutesAgo = Date.now() - 4 * 60 * 1000
    const sixMinutesAgo = Date.now() - 6 * 60 * 1000
    expect(isCacheStale(fourMinutesAgo, fiveMinutesMs)).toBe(false)
    expect(isCacheStale(sixMinutesAgo, fiveMinutesMs)).toBe(true)
  })
})

// ─── safeJsonParse ────────────────────────────────────────────────────────────

describe("safeJsonParse", () => {
  it("parses a valid JSON string", () => {
    expect(safeJsonParse<number[]>("[1, 2, 3]")).toEqual([1, 2, 3])
  })

  it("parses a valid JSON object", () => {
    expect(safeJsonParse<{ a: number }>('{"a":1}')).toEqual({ a: 1 })
  })

  it("returns null for malformed JSON", () => {
    expect(safeJsonParse("{not valid json}")).toBeNull()
  })

  it("returns null for a null input", () => {
    expect(safeJsonParse(null)).toBeNull()
  })

  it("returns null for an undefined input", () => {
    expect(safeJsonParse(undefined)).toBeNull()
  })

  it("returns null for an empty string", () => {
    expect(safeJsonParse("")).toBeNull()
  })
})
