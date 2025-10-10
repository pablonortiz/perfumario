import React from "react";
import { Text, TextInput, TextStyle, View, ViewStyle } from "react-native";

export interface FormTextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helpText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Reusable form text field with label, error handling, and accessibility support
 */
export const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helpText,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const hasError = Boolean(error);

  return (
    <View style={style}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: "#111827",
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}

      <TextInput
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[
          {
            height: multiline ? undefined : 52,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: "#F6F6F8",
            fontSize: 16,
            color: "#111827",
            borderWidth: hasError ? 1 : 0,
            borderColor: hasError ? "#EF4444" : "transparent",
            textAlignVertical: multiline ? "top" : "center",
            paddingTop: multiline ? 16 : 0,
            paddingBottom: multiline ? 16 : 0,
          },
          inputStyle,
        ]}
      />

      {helpText && !hasError && (
        <Text
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginTop: 4,
          }}
        >
          {helpText}
        </Text>
      )}

      {hasError && (
        <Text
          style={{
            fontSize: 12,
            color: "#EF4444",
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
