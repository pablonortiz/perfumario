import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type: ToastType;
  duration?: number;
  onHide: () => void;
}

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        backgroundColor: "#10B981", // emerald-500
        icon: "checkmark-circle" as const,
        iconColor: "#FFFFFF",
      };
    case "error":
      return {
        backgroundColor: "#EF4444", // red-500
        icon: "close-circle" as const,
        iconColor: "#FFFFFF",
      };
    case "info":
      return {
        backgroundColor: "#3B82F6", // blue-500
        icon: "information-circle" as const,
        iconColor: "#FFFFFF",
      };
    default:
      return {
        backgroundColor: "#6B7280", // gray-500
        icon: "information-circle" as const,
        iconColor: "#FFFFFF",
      };
  }
};

export const Toast: React.FC<ToastProps> = memo(
  ({ visible, message, type, duration = 3000, onHide }) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const hideToast = useCallback(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }, [translateY, opacity, onHide]);

    useEffect(() => {
      if (visible) {
        // Mostrar toast
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Auto-hide después del duration
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      } else {
        hideToast();
      }
    }, [visible, duration, hideToast, translateY, opacity]);

    const config = useMemo(() => getToastConfig(type), [type]);

    if (!visible) return null;

    return (
      <Animated.View
        style={{
          position: "absolute",
          top: 20,
          left: 16,
          right: 16,
          zIndex: 1000,
          transform: [{ translateY }],
          opacity,
        }}
      >
        <View
          style={{
            backgroundColor: config.backgroundColor,
            borderRadius: 12,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons
            name={config.icon}
            size={24}
            color={config.iconColor}
            style={{ marginRight: 12 }}
          />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "500",
              flex: 1,
            }}
          >
            {message}
          </Text>
          <Pressable
            onPress={hideToast}
            style={{
              padding: 4,
              marginLeft: 8,
            }}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </Animated.View>
    );
  },
);

Toast.displayName = "Toast";
