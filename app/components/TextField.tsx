import { forwardRef } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, type TextInputProps } from "react-native"

/**
 * Thin wrapper around React Native's TextInput.
 * Exists so that the no-restricted-imports ESLint rule can enforce
 * that all text inputs go through this single import point.
 */
export const TextField = forwardRef<TextInput, TextInputProps>(function TextField(props, ref) {
  return <TextInput ref={ref} {...props} />
})
