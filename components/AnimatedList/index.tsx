import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  delay?: number;
  duration?: number;
  style?: any;
}

export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  delay = 100,
  duration = 600,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

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
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: index * delay,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: duration + 200,
          delay: index * delay,
          useNativeDriver: true,
        }),
      ]).start();
    };

    startAnimation();
  }, [fadeAnim, slideAnim, scaleAnim, glowAnim, index, delay, duration]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.1],
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
      {/* Efecto de resplandor púrpura */}
      <Animated.View
        style={{
          position: "absolute",
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          backgroundColor: "#8B5CF6",
          borderRadius: 18,
          opacity: glowOpacity,
          shadowColor: "#8B5CF6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      />
      {children}
    </Animated.View>
  );
};

export default AnimatedListItem;
