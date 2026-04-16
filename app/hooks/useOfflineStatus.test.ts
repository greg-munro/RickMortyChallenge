import { renderHook, act } from "@testing-library/react-native"
import NetInfo from "@react-native-community/netinfo"

import { useOfflineStatus } from "./useOfflineStatus"

const mockNetInfo = NetInfo as unknown as {
  fetch: jest.Mock
  addEventListener: jest.Mock
}

beforeEach(() => {
  jest.clearAllMocks()
  mockNetInfo.fetch.mockResolvedValue({ isConnected: true, isInternetReachable: true })
  mockNetInfo.addEventListener.mockReturnValue(jest.fn())
})

// ─── useOfflineStatus ─────────────────────────────────────────────────────────

describe("useOfflineStatus", () => {
  it("returns false initially (online assumed until proven otherwise)", () => {
    const { result } = renderHook(() => useOfflineStatus())
    expect(result.current).toBe(false)
  })

  it("returns true when isConnected is false", async () => {
    mockNetInfo.fetch.mockResolvedValue({ isConnected: false, isInternetReachable: null })
    const { result } = renderHook(() => useOfflineStatus())
    await act(async () => {})
    expect(result.current).toBe(true)
  })

  it("returns true when isInternetReachable is explicitly false", async () => {
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true, isInternetReachable: false })
    const { result } = renderHook(() => useOfflineStatus())
    await act(async () => {})
    expect(result.current).toBe(true)
  })

  it("returns false when isInternetReachable is null (probe in-flight, not yet confirmed offline)", async () => {
    mockNetInfo.fetch.mockResolvedValue({ isConnected: true, isInternetReachable: null })
    const { result } = renderHook(() => useOfflineStatus())
    await act(async () => {})
    expect(result.current).toBe(false)
  })

  it("updates reactively when the network state changes via the event listener", async () => {
    let capturedListener: ((state: { isConnected: boolean; isInternetReachable: boolean | null }) => void) | null = null
    mockNetInfo.addEventListener.mockImplementation((listener: typeof capturedListener) => {
      capturedListener = listener
      return jest.fn()
    })

    const { result } = renderHook(() => useOfflineStatus())
    await act(async () => {})
    expect(result.current).toBe(false)

    await act(async () => {
      capturedListener!({ isConnected: false, isInternetReachable: false })
    })
    expect(result.current).toBe(true)

    await act(async () => {
      capturedListener!({ isConnected: true, isInternetReachable: true })
    })
    expect(result.current).toBe(false)
  })

  it("unsubscribes from NetInfo when the component unmounts", () => {
    const unsubscribe = jest.fn()
    mockNetInfo.addEventListener.mockReturnValue(unsubscribe)

    const { unmount } = renderHook(() => useOfflineStatus())
    unmount()

    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })
})
