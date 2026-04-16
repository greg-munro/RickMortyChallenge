const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    retry: "Try Again",
  },

  episodeListScreen: {
    title: "Episodes",
    searchPlaceholder: "Search episodes...",
    noResults: "No episodes match your search.",
    episodeCount: "{{count}} episode",
    episodeCount_plural: "{{count}} episodes",
    errorHeading: "Couldn't load episodes",
    errorContent: "Check your connection and try again.",
  },

  episodeDetailScreen: {
    airDate: "Air Date",
    characters: "Characters",
    characterCount: "{{count}} character",
    characterCount_plural: "{{count}} characters",
    errorLoadingCharacters: "Couldn't load characters.",
    retry: "Retry",
  },

  characterStatus: {
    Alive: "Alive",
    Dead: "Dead",
    unknown: "Unknown",
  },

  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },

  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
}

export default en
export type Translations = typeof en
