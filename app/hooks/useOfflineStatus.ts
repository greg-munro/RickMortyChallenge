import { useEffect, useState } from "react"
import NetInfo, { NetInfoState } from "@react-native-community/netinfo"

function deriveOffline(state: NetInfoState): boolean {
  if (!state.isConnected) return true
  if (state.isInternetReachable === false) return true
  return false
}

export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsOffline(deriveOffline(state))
    })

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(deriveOffline(state))
    })

    return unsubscribe
  }, [])

  return isOffline
}
