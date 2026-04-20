import { ErrorInfo } from "react"
import { ViewStyle } from "react-native"

import { ErrorDisplay } from "@/components/ErrorDisplay"
import { Screen } from "@/components/Screen"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface ErrorDetailsProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

export function ErrorDetails(props: ErrorDetailsProps) {
  const { themed } = useAppTheme()
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={themed($contentContainer)}
    >
      <ErrorDisplay
        heading="Something went wrong"
        message="An unexpected error occurred. Tap below to restart the app."
        actionLabel="Reset App"
        onAction={props.onReset}
      />
    </Screen>
  )
}

const $contentContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})
