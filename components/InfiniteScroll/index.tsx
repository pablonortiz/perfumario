import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  loading,
  hasMore,
  onLoadMore,
  children,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [loading, pulseAnim]);

  return (
    <View style={{ flex: 1 }}>
      {children}
      {loading && hasMore && (
        <View
          style={{
            paddingVertical: 20,
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
              marginBottom: 8,
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="#6366f1" />
          </Animated.View>
          <Text
            style={{
              color: '#6366f1',
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            Cargando más perfumes...
          </Text>
        </View>
      )}
      {!hasMore && (
        <View
          style={{
            paddingVertical: 20,
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text
            style={{
              marginTop: 8,
              color: '#10b981',
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            Todos los perfumes cargados
          </Text>
        </View>
      )}
    </View>
  );
};

export default InfiniteScroll;
