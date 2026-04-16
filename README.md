# Rick & Morty Catalog

A React Native episode browser for all 51 Rick & Morty episodes, built with Ignite CLI starter a neo-brutalist design system.

### Overview 


https://github.com/user-attachments/assets/840aa07a-c4b6-4f78-8a70-ca194101b1b7


## Features

- **Episode browser** — all 51 episodes grouped by season, with sticky section headers
- **Search** — 300ms debounced local filter across episode name and code (e.g. `S03E07`)
- **Episode detail** — full character roster fetched in a single batched request per episode
- **Status filter chips** — multi-select Alive / Dead / Unknown filter with per-status counts
- **Offline mode** — episodes cached with a 1-hour TTL; character data cached permanently; offline banner with animated indicator
- **Neo-brutalist design system** — cream canvas, hard offset shadows, sharp corners, Space Grotesk typeface
- **Reanimated 4 animations** — entrance sequences, press interactions, skeleton shimmer, custom splash screen

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.83 / Expo SDK 55 |
| Language | TypeScript 5.9 (strict) |
| Navigation | React Navigation v7 (native stack) |
| State | React Context + hooks |
| Storage | react-native-mmkv |
| Animations | react-native-reanimated 4 |
| HTTP | apisauce |
| Fonts | Space Grotesk via @expo-google-fonts |
| Testing | Jest + React Native Testing Library |
| Compiler | React Compiler (babel-plugin-react-compiler) |
| Build | EAS Build |

## Project Structure

```
app/
├── components/       # Shared UI primitives (Text, Screen, NeoButton, HardShadowView, …)
├── context/          # RickMortyContext — global episode + character state
├── hooks/            # useOfflineStatus, useSafeAreaInsetsStyle, useIsMounted
├── navigators/       # AppNavigator, screen param types
├── screens/          # EpisodeListScreen, EpisodeDetailScreen
├── services/api/     # apisauce client, typed response helpers
├── theme/            # Colors, spacing, typography, ThemedStyle types
├── i18n/             # English strings
└── utils/            # Cache helpers, episode/character utilities, MMKV storage
```

## Prerequisites

- Node ≥ 20
- pnpm (`npm i -g pnpm`)
- [Expo Go](https://expo.dev/go) **or** a local dev client build (see [Building](#building))
- For native builds: Xcode (iOS) or Android Studio (Android)

## Getting Started

```bash
git clone https://github.com/greg-munro/RickMortyChallenge.git
cd RickMortyChallenge
pnpm install
```

### iOS

```bash
pnpm ios
```

### Android

```bash
pnpm android
```

### Start the Metro bundler only

```bash
pnpm start
```

## Available Scripts

| Script | Description |
|---|---|
| `pnpm start` | Start Metro bundler |
| `pnpm ios` | Build and run on iOS simulator |
| `pnpm android` | Build and run on Android emulator |
| `pnpm test` | Run Jest test suite |
| `pnpm test:watch` | Jest in watch mode |
| `pnpm compile` | TypeScript type check (no emit) |
| `pnpm lint` | ESLint with auto-fix |
| `pnpm lint:check` | ESLint without auto-fix |

## Building

Local EAS builds — no EAS cloud account required.

| Script | Target |
|---|---|
| `pnpm build:ios:sim` | iOS simulator (debug) |
| `pnpm build:ios:device` | iOS device (debug) |
| `pnpm build:ios:preview` | iOS simulator (release-like) |
| `pnpm build:android:sim` | Android emulator (debug APK) |
| `pnpm build:android:device` | Android device (debug APK) |
| `pnpm build:android:preview` | Android device (release APK) |

## Testing

```bash
pnpm test          # run all tests
pnpm test:watch    # watch mode
pnpm compile       # type check
```

61 tests covering context, hooks, utilities, and components.

## Architecture Notes

**Data fetching** — all 51 episodes are loaded at startup via `Promise.all` across the three API pages. Characters are fetched on demand when an episode is opened, batched into a single request by ID array.

**Caching** — episodes use a 1-hour TTL in MMKV; characters are cached permanently (the Rick & Morty API is immutable). Both layers survive app restarts without a network round-trip.

**No manual memoisation** — the React Compiler (`babel-plugin-react-compiler`) handles all `useMemo` / `useCallback` automatically. These are not used anywhere in the codebase.

**Theming** — all styles are co-located at the bottom of each file using `ThemedStyle<T>` with a `$` prefix. No separate `.styles.ts` files.

## Coding Standards

See [docs/development-best-practices.md](docs/development-best-practices.md).
