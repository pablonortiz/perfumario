import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ViewStyle } from "react-native";

type FloatingActionButtonProps = {
  onPress: () => void;
  backgroundColor?: string;
  iconColor?: string;
  size?: number;
  style?: ViewStyle;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  backgroundColor = "#8B5CF6", // Purple por defecto
  iconColor = "#FFFFFF",
  size = 64,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8, // Para Android
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Ionicons name="add" size={size * 0.4} color={iconColor} />
    </Pressable>
  );
};

export default FloatingActionButton;
