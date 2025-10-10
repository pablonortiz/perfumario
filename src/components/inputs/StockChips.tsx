import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

export interface StockChipsProps {
  values: number[];
  selected: number;
  onSelect: (value: number) => void;
  primaryColor?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Stock selection chips (0, 5, 10, 15, 20)
 */
export const StockChips: React.FC<StockChipsProps> = ({
  values,
  selected,
  onSelect,
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
          gap: 8,
          flexWrap: "wrap",
        },
        style,
      ]}
    >
      {values.map((value) => {
        const isSelected = selected === value;

        return (
          <Pressable
            key={value}
            testID={`${testID}-${value}`}
            accessibilityRole="button"
            accessibilityLabel={`Stock ${value}`}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(value)}
            style={[
              {
                minHeight: 44,
                minWidth: 44,
                borderRadius: 12,
                backgroundColor: isSelected ? primaryColor : "#FFFFFF",
                borderWidth: isSelected ? 0 : 1,
                borderColor: isSelected ? "transparent" : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
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
              {value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
