import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedListItemSubtleProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  duration?: number;
  style?: any;
}

export const AnimatedListItemSubtle: React.FC<AnimatedListItemSubtleProps> = ({
  children,
  index,
  delay = 150,
  duration = 800,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(80)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

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
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: duration + 200,
          delay: index * delay + 100,
          useNativeDriver: false,
        }),
      ]).start();
    };

    startAnimation();
  }, [fadeAnim, slideAnim, scaleAnim, shadowAnim, index, delay, duration]);

  const shadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });

  const shadowRadius = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
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
      {/* Contenedor con sombra púrpura sutil */}
      <Animated.View
        style={{
          shadowColor: "#7C3AED",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity,
          shadowRadius,
          elevation: 4,
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedListItemSubtle;
