import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedListItemElegantProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  duration?: number;
  style?: any;
}

export const AnimatedListItemElegant: React.FC<
  AnimatedListItemElegantProps
> = ({ children, index, delay = 150, duration = 800, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Animación principal
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
          tension: 30,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * delay,
          tension: 30,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Efecto ripple con delay adicional
      setTimeout(
        () => {
          Animated.timing(rippleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }).start();
        },
        index * delay + 200,
      );
    };

    startAnimation();
  }, [fadeAnim, slideAnim, scaleAnim, rippleAnim, index, delay, duration]);

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.1],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.08, 0],
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
      {/* Efecto ripple púrpura sutil */}
      <Animated.View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 120,
          height: 120,
          marginTop: -60,
          marginLeft: -60,
          backgroundColor: "#7C3AED",
          borderRadius: 60,
          opacity: rippleOpacity,
          transform: [{ scale: rippleScale }],
        }}
      />

      {/* Contenedor con sombra sutil */}
      <Animated.View
        style={{
          shadowColor: "#8B5CF6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.15],
          }),
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedListItemElegant;
