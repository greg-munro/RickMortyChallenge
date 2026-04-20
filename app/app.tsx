/* eslint-disable import/first */
if (__DEV__) {
  // Load Reactotron in development only.
  // Note that you must be using metro's `inlineRequires` for this to work.
  // If you turn it off in metro.config.js, you'll have to manually import it.
  require("./devtools/ReactotronConfig.ts")
}
import "./utils/gestureHandler"

import { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import NetInfo from "@react-native-community/netinfo"
import i18n from "i18next"
import { KeyboardProvider } from "react-native-keyboard-controller"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

NetInfo.configure({
  useNativeReachability: false,
})

import { SplashScreen } from "./components/SplashScreen"
import { RickMortyProvider } from "./context/RickMortyContext"
import { initI18n } from "./i18n"
import { AppNavigator } from "./navigators/AppNavigator"
import { useNavigationPersistence } from "./navigators/navigationUtilities"
import { ThemeProvider } from "./theme/context"
import { customFontsToLoad } from "./theme/typography"
import * as storage from "./utils/storage"

function loadDateFnsLocale() {
  const primaryTag = i18n.language.split("-")[0]
  switch (primaryTag) {
    case "ar":
      require("date-fns/locale/ar")
      break
    case "ko":
      require("date-fns/locale/ko")
      break
    case "es":
      require("date-fns/locale/es")
      break
    case "fr":
      require("date-fns/locale/fr")
      break
    case "hi":
      require("date-fns/locale/hi")
      break
    case "ja":
      require("date-fns/locale/ja")
      break
    default:
      require("date-fns/locale/en-US")
      break
  }
}

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web deep-link prefixes
const prefix = Linking.createURL("/")
const config = {
  screens: {
    EpisodeList: "episodes",
    EpisodeDetail: "episodes/:episodeId",
  },
}

export function App() {
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded, fontLoadError] = useFonts(customFontsToLoad)
  const [isI18nInitialized, setIsI18nInitialized] = useState(false)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale())
  }, [])

  if (!isNavigationStateRestored || !isI18nInitialized || (!areFontsLoaded && !fontLoadError)) {
    return null
  }

  const linking = {
    prefixes: [prefix],
    config,
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <ThemeProvider>
          <RickMortyProvider>
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
          </RickMortyProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}
