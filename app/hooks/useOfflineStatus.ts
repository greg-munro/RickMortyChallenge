import { useEffect, useState } from "react"
import NetInfo from "@react-native-community/netinfo"

export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsOffline(!state.isConnected || !state.isInternetReachable)
    })

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected || !state.isInternetReachable)
    })

    return unsubscribe
  }, [])

  return isOffline
}
