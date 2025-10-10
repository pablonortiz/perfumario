import React from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";

export interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  primaryColor?: string;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Stepper control with minus/plus buttons and centered value
 */
export const Stepper: React.FC<StepperProps> = ({
  value,
  min = 0,
  max,
  step = 1,
  onChange,
  primaryColor = "#603780",
  style,
  testID,
}) => {
  const handleDecrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  const handleIncrement = () => {
    const newValue = value + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const canDecrement = value > min;
  const canIncrement = max === undefined || value < max;

  return (
    <View
      testID={testID}
      style={[
        {
          height: 56,
          borderRadius: 16,
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        },
        style,
      ]}
    >
      <Pressable
        testID={`${testID}-decrement`}
        accessibilityRole="button"
        accessibilityLabel="Decrementar"
        accessibilityState={{ disabled: !canDecrement }}
        onPress={handleDecrement}
        disabled={!canDecrement}
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: canDecrement ? primaryColor : "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: canDecrement ? "#FFFFFF" : "#9CA3AF",
          }}
        >
          −
        </Text>
      </Pressable>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#111827",
          minWidth: 40,
          textAlign: "center",
        }}
      >
        {value}
      </Text>

      <Pressable
        testID={`${testID}-increment`}
        accessibilityRole="button"
        accessibilityLabel="Incrementar"
        accessibilityState={{ disabled: !canIncrement }}
        onPress={handleIncrement}
        disabled={!canIncrement}
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: canIncrement ? primaryColor : "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: canIncrement ? "#FFFFFF" : "#9CA3AF",
          }}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
};
