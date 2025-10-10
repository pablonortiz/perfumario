import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PullToRefreshProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  refreshing,
  onRefresh,
  children,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (refreshing) {
      // Start spinning animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animations
      spinValue.stopAnimation();
      scaleValue.stopAnimation();
      spinValue.setValue(0);
      scaleValue.setValue(1);
    }
  }, [refreshing, spinValue, scaleValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ flex: 1 }}>
      {refreshing && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#f8fafc',
            paddingVertical: 20,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
          }}
        >
          <Animated.View
            style={{
              transform: [
                { rotate: spin },
                { scale: scaleValue },
              ],
            }}
          >
            <Ionicons name="refresh" size={24} color="#6366f1" />
          </Animated.View>
          <Text
            style={{
              marginTop: 8,
              color: '#6366f1',
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            Actualizando...
          </Text>
        </View>
      )}
      <View style={{ flex: 1, marginTop: refreshing ? 80 : 0 }}>
        {children}
      </View>
    </View>
  );
};

export default PullToRefresh;
