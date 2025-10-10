import { Ionicons } from "@expo/vector-icons";
import React, { useRef, memo, useCallback } from "react";
import { Animated, Pressable, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";

type SwipeableCardProps = {
  children: React.ReactNode;
  onEdit: () => void; // acción del botón derecho (← abre derecha)
  onDelete: () => void; // acción del botón izquierdo (→ abre izquierda)
  editButtonColor?: string; // color botón derecho (EDITAR)
  deleteButtonColor?: string; // color botón izquierdo (ELIMINAR)
  swipeThreshold?: number; // ancho de revelado
};

export const SwipeableCard: React.FC<SwipeableCardProps> = memo(({
  children,
  onEdit,
  onDelete,
  editButtonColor = "#FF9500",
  deleteButtonColor = "#FF3B30",
  swipeThreshold = 120,
}) => {
  // dragX: gesto actual; offsetX: posición "snappeada"; translateX = dragX + offsetX
  const dragX = useRef(new Animated.Value(0)).current;
  const offsetX = useRef(new Animated.Value(0)).current;
  const translateX = Animated.add(dragX, offsetX);

  // Guardamos el último snap numérico para no leer valores internos de Animated
  const lastSnap = useRef(0);

  const onGestureEvent = Animated.event<
    PanGestureHandlerGestureEvent["nativeEvent"]
  >([{ nativeEvent: { translationX: dragX } }], { useNativeDriver: true });

  const snapTo = useCallback((toValue: number) => {
    lastSnap.current = toValue;
    Animated.spring(offsetX, {
      toValue,
      useNativeDriver: true,
      bounciness: 0,
    }).start(() => {
      // se resetea el drag del gesto
      dragX.setValue(0);
    });
  }, [offsetX, dragX]);

  const close = useCallback(() => snapTo(0), [snapTo]);

  const onHandlerStateChange = ({
    nativeEvent,
  }: PanGestureHandlerGestureEvent) => {
    if (
      nativeEvent.state === State.END ||
      nativeEvent.state === State.CANCELLED
    ) {
      const total = lastSnap.current + (nativeEvent.translationX ?? 0);

      // Regla de decisión (mitad del threshold)
      const next =
        total > swipeThreshold / 2
          ? swipeThreshold // → revela IZQUIERDA = ELIMINAR
          : total < -swipeThreshold / 2
            ? -swipeThreshold // ← revela DERECHA  = EDITAR
            : 0;

      snapTo(next);
    }
  };

  const handleEdit = useCallback(() => {
    close();
    onEdit();
  }, [close, onEdit]);

  const handleDelete = useCallback(() => {
    close();
    onDelete();
  }, [close, onDelete]);

  return (
    <View
      style={{ position: "relative", borderRadius: 16, overflow: "hidden" }}
    >
      {/* FONDO: botones SIEMPRE visibles detrás */}

      {/* IZQUIERDA: ELIMINAR (se muestra al deslizar a la DERECHA → translateX positivo) */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: swipeThreshold,
          backgroundColor: deleteButtonColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={handleDelete}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* DERECHA: EDITAR (se muestra al deslizar a la IZQUIERDA → translateX negativo) */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: swipeThreshold,
          backgroundColor: editButtonColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={handleEdit}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="pencil" size={24} color="#fff" />
        </Pressable>
      </View>

      {/* CONTENIDO: se traslada para descubrir los botones */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-20, 20]} // evita toques cortos accidentales
        failOffsetY={[-10, 10]} // reduce conflicto con scroll vertical
      >
        <Animated.View
          style={{
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [
                    -swipeThreshold * 2,
                    -swipeThreshold,
                    0,
                    swipeThreshold,
                    swipeThreshold * 2,
                  ],
                  outputRange: [
                    -swipeThreshold,
                    -swipeThreshold,
                    0,
                    swipeThreshold,
                    swipeThreshold,
                  ],
                  extrapolate: "clamp",
                }),
              },
            ],
            backgroundColor: "#fff",
            borderRadius: 16,
            elevation: 2, // Android
            shadowColor: "#000", // iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

SwipeableCard.displayName = 'SwipeableCard';

export default SwipeableCard;
