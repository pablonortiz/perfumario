import React from "react";
import { View, ViewStyle } from "react-native";
import FloatingActionButton from "../FloatingActionButton";
import { AnimatedButton } from "@/components/AnimatedButton";

type FooterProps = {
  onFABPress: () => void;
  backgroundColor?: string;
  fabBackgroundColor?: string;
  fabIconColor?: string;
  fabSize?: number;
  style?: ViewStyle;
};

const Footer: React.FC<FooterProps> = ({
  onFABPress,
  backgroundColor = "#5B21B6", // Púrpura oscuro que complementa el FAB
  fabBackgroundColor,
  fabIconColor,
  fabSize = 64,
  style,
}) => {
  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 20,
          paddingBottom: 20,
          shadowColor: "#5B21B6",
          shadowOffset: {
            width: 0,
            height: -6,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 12, // Para Android
          position: "relative",
        },
        style,
      ]}
    >
      {/* FAB posicionado absolutamente con su centro en el borde superior */}
      <View
        style={{
          position: "absolute",
          top: -fabSize / 2, // Posiciona el centro del FAB en el borde superior
          left: "50%",
          marginLeft: -fabSize / 2, // Centra horizontalmente
          zIndex: 10,
        }}
      >
        <AnimatedButton onPress={onFABPress}>
          <FloatingActionButton
            onPress={onFABPress}
            backgroundColor={fabBackgroundColor}
            iconColor={fabIconColor}
            size={fabSize}
          />
        </AnimatedButton>
      </View>
    </View>
  );
};

export default Footer;
