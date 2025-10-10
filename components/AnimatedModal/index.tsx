import React, { useEffect, useRef } from 'react';
import { Modal, Animated, View, Pressable, ModalProps } from 'react-native';

interface AnimatedModalProps extends ModalProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slide';
  duration?: number;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  visible,
  animationType = 'fade',
  duration = 300,
  onRequestClose,
  ...props
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim, duration]);

  if (!visible) return null;

  return (
    <Modal
      {...props}
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onRequestClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: fadeAnim,
        }}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onRequestClose}
        />
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AnimatedModal;
