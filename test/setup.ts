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
    fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
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
