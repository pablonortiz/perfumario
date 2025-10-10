import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

export type Gender = "female" | "male" | "unisex";

export interface SegmentedControlOption {
  label: string;
  value: Gender;
  iconName?: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: Gender;
  onChange: (value: Gender) => void;
  primaryColor?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Segmented control for gender selection (Mujer/Hombre/Unisex)
 */
export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  primaryColor = "#603780",
  style,
  testID,
}) => {
  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: "row",
          gap: 12,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <Pressable
            key={option.value}
            testID={`${testID}-${option.value}`}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={[
              {
                flex: 1,
                height: 44,
                borderRadius: 16,
                backgroundColor: isSelected ? primaryColor : "#FFFFFF",
                borderWidth: isSelected ? 0 : 1,
                borderColor: isSelected ? "transparent" : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 16,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: isSelected ? "#FFFFFF" : "#6B7280",
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
