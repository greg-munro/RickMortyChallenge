/**
 * Utilities for managing MMKV cache freshness.
 */

const ONE_HOUR_MS = 60 * 60 * 1000

/**
 * Returns true if the cached data is older than the given TTL.
 *
 * @param timestampMs - The time the cache was last written (Date.now() value)
 * @param ttlMs       - Time-to-live in milliseconds (default: 1 hour)
 */
export function isCacheStale(
  timestampMs: number | undefined | null,
  ttlMs: number = ONE_HOUR_MS,
): boolean {
  if (timestampMs == null) return true
  return Date.now() - timestampMs > ttlMs
}

/**
 * Safely parses a JSON string from MMKV.
 * Returns null if the string is undefined/null or fails to parse.
 */
export function safeJsonParse<T>(raw: string | undefined | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
