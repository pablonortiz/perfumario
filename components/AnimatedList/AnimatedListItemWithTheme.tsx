import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedListItemWithThemeProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  duration?: number;
  style?: any;
  theme?: "purple" | "violet" | "gradient";
}

export const AnimatedListItemWithTheme: React.FC<
  AnimatedListItemWithThemeProps
> = ({
  children,
  index,
  delay = 120,
  duration = 700,
  style,
  theme = "purple",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(80)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay: index * delay,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          delay: index * delay,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * delay,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: duration + 300,
          delay: index * delay + 100,
          useNativeDriver: false, // borderWidth no es compatible con native driver
        }),
      ]).start();
    };

    startAnimation();
  }, [fadeAnim, slideAnim, scaleAnim, borderAnim, index, delay, duration]);

  const getThemeColors = () => {
    switch (theme) {
      case "violet":
        return {
          borderColor: "#7C3AED",
          shadowColor: "#7C3AED",
          glowColor: "#A78BFA",
        };
      case "gradient":
        return {
          borderColor: "#8B5CF6",
          shadowColor: "#8B5CF6",
          glowColor: "#C4B5FD",
        };
      default: // purple
        return {
          borderColor: "#8B5CF6",
          shadowColor: "#8B5CF6",
          glowColor: "#A78BFA",
        };
    }
  };

  const colors = getThemeColors();

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2],
  });

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
        style,
      ]}
    >
      {/* Contenedor con borde animado */}
      <Animated.View
        style={{
          borderWidth,
          borderColor: colors.borderColor,
          borderRadius: 16,
          shadowColor: colors.shadowColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* Efecto de resplandor interno */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.glowColor,
            borderRadius: 14,
            opacity: borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.05],
            }),
          }}
        />
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedListItemWithTheme;
