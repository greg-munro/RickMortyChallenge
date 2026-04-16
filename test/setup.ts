// we always make sure 'react-native' gets included first
// eslint-disable-next-line no-restricted-imports
import * as ReactNative from "react-native"

import mockFile from "./mockFile"

// libraries to mock
jest.doMock("react-native", () => {
  // Extend ReactNative
  return Object.setPrototypeOf(
    {
      Image: {
        ...ReactNative.Image,
        resolveAssetSource: jest.fn((_source) => mockFile), // eslint-disable-line @typescript-eslint/no-unused-vars
        getSize: jest.fn(
          (
            uri: string, // eslint-disable-line @typescript-eslint/no-unused-vars
            success: (width: number, height: number) => void,
            failure?: (_error: any) => void, // eslint-disable-line @typescript-eslint/no-unused-vars
          ) => success(100, 100),
        ),
      },
    },
    ReactNative,
  )
})

jest.mock("i18next", () => ({
  currentLocale: "en",
  t: (key: string, params: Record<string, string>) => {
    return `${key} ${JSON.stringify(params)}`
  },
  translate: (key: string, params: Record<string, string>) => {
    return `${key} ${JSON.stringify(params)}`
  },
}))

jest.mock("../app/i18n/index.ts", () => ({
  i18n: {
    isInitialized: true,
    language: "en",
    t: (key: string, params: Record<string, string>) => {
      return `${key} ${JSON.stringify(params)}`
    },
    numberToCurrency: jest.fn(),
  },
}))

jest.mock("@react-native-community/netinfo", () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    fetch: jest.fn(() =>
      Promise.resolve({ isConnected: true, isInternetReachable: true }),
    ),
    addEventListener: jest.fn(() => jest.fn()),
  },
}))

jest.mock("react-native-mmkv", () => {
  const createStore = () => {
    const store: Record<string, string> = {}
    return {
      getString: jest.fn((key: string) => store[key]),
      set: jest.fn((key: string, value: string) => {
        store[key] = value
      }),
      delete: jest.fn((key: string) => {
        delete store[key]
      }),
      clearAll: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k])
      }),
      getAllKeys: jest.fn(() => Object.keys(store)),
    }
  }
  return {
    MMKV: jest.fn().mockImplementation(createStore),
    useMMKVString: jest.fn(() => [undefined, jest.fn()]),
  }
})

declare const tron // eslint-disable-line @typescript-eslint/no-unused-vars

declare global {
  let __TEST__: boolean
}
