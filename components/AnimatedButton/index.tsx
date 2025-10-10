import React, { useRef } from 'react';
import { Pressable, Animated, PressableProps } from 'react-native';

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  scaleValue?: number;
  duration?: number;
  style?: any;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  scaleValue = 0.95,
  duration = 100,
  style,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.timing(scaleAnim, {
      toValue: scaleValue,
      duration,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        {...props}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedButton;
