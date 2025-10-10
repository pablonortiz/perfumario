import { useBrandName } from "@/hooks/useBrandName";
import { useToast } from "@/hooks/useToast";
import { useUpdateStock } from "@/hooks/useUpdateStock";
import { Ionicons } from "@expo/vector-icons";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  Text,
  View,
} from "react-native";
import { SwipeableCard } from "../SwipeableCard";
import { Toast } from "../Toast";
import { getGenderProps } from "./utils/getGenderProps";

type Props = {
  id: string;
  gender: "male" | "female" | "unisex";
  name: string;
  brandId: string;
  stock: number;
  onEdit: (perfume: {
    id: string;
    name: string;
    gender: "male" | "female" | "unisex";
    brandId: string;
    stock: number;
  }) => void;
  onDelete: (perfumeId: string) => void;
};

const ProductCard: React.FC<Props> = memo(
  ({ id, gender, name, brandId, stock, onEdit, onDelete }) => {
    // Lógica de stock con tres estados - memoizada
    const stockStatus = useMemo(() => {
      if (stock === 0) {
        return {
          text: "Sin stock",
          backgroundColor: "#EF4444", // red-500
          textColor: "#FFFFFF",
        };
      } else if (stock >= 1 && stock <= 3) {
        return {
          text: "Bajo stock",
          backgroundColor: "#F59E0B", // amber-500
          textColor: "#FFFFFF",
        };
      } else {
        return {
          text: "Disponible",
          backgroundColor: "#10B981", // emerald-500
          textColor: "#FFFFFF",
        };
      }
    }, [stock]);
    // Props de género memoizadas
    const genderProps = useMemo(() => getGenderProps(gender), [gender]);
    const { genderBackgroundColor, genderIconColor, genderIconName } =
      genderProps;

    // Usar useBrandName para resolver el nombre de la marca
    const brandName = useBrandName(brandId);

    // Estado del contador
    const [counter, setCounter] = useState(0);
    const [showConfirmButtons, setShowConfirmButtons] = useState(false);

    // Hook para actualizar stock
    const updateStockMutation = useUpdateStock();

    // Hook para toast notifications
    const { toast, showSuccess, showError, hideToast } = useToast();

    // Animaciones para el chip de estado
    const chipScale = useRef(new Animated.Value(1)).current;
    const chipOpacity = useRef(new Animated.Value(1)).current;
    const [previousStock, setPreviousStock] = useState(stock);

    // Efecto para animar el chip cuando cambia el stock
    useEffect(() => {
      if (stock !== previousStock) {
        // Animación de transición
        Animated.sequence([
          Animated.parallel([
            Animated.timing(chipScale, {
              toValue: 1.1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(chipOpacity, {
              toValue: 0.7,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(chipScale, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(chipOpacity, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]),
        ]).start();

        setPreviousStock(stock);
      }
    }, [stock, previousStock, chipScale, chipOpacity]);

    const handleEdit = useCallback(() => {
      onEdit({ id, name, gender, brandId, stock });
    }, [id, name, gender, brandId, stock, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(id);
    }, [id, onDelete]);

    // Funciones del contador - memoizadas
    const handleIncrement = useCallback(() => {
      setCounter((prev) => prev + 1);
      setShowConfirmButtons(true);
    }, []);

    const handleDecrement = useCallback(() => {
      // Permitir decrementar hasta -stock (reducir todo el stock disponible)
      setCounter((prev) => {
        if (prev > -stock) {
          setShowConfirmButtons(true);
          return prev - 1;
        }
        return prev;
      });
    }, [stock]);

    const handleConfirm = useCallback(() => {
      updateStockMutation.mutate(
        {
          perfumeId: id,
          stockChange: counter,
        },
        {
          onSuccess: () => {
            const changeText = counter > 0 ? `+${counter}` : `${counter}`;
            showSuccess(`Stock actualizado: ${changeText} unidades`);
          },
          onError: () => {
            showError("Error al actualizar el stock");
          },
        },
      );
      setCounter(0);
      setShowConfirmButtons(false);
    }, [id, counter, updateStockMutation, showSuccess, showError]);

    const handleReset = useCallback(() => {
      setCounter(0);
      setShowConfirmButtons(false);
    }, []);

    return (
      <SwipeableCard
        onEdit={handleEdit}
        onDelete={handleDelete}
        editButtonColor="#6366F1"
        deleteButtonColor="#EF4444"
        hideButtonsInitially={true}
        animationDelay={800}
      >
        <View
          className="rounded-2xl shadow-md m-4 p-4 mb-4 relative"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Loading overlay */}
          {updateStockMutation.isPending && (
            <View className="absolute inset-0 bg-white/80 rounded-2xl z-10 flex items-center justify-center">
              <View className="bg-white rounded-lg p-4 shadow-lg flex-row items-center">
                <ActivityIndicator size="small" color="#603780" />
                <Text className="ml-2 text-gray-700 font-medium">
                  Actualizando stock...
                </Text>
              </View>
            </View>
          )}
          {/* Top section with icon and product info */}
          <View className="flex-row items-center mb-4">
            {/* Icon section - centered and large */}
            <View
              className="w-20 h-20 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: genderBackgroundColor }}
            >
              <Ionicons
                name={genderIconName}
                size={40}
                color={genderIconColor}
              />
            </View>

            {/* Product info */}
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {name}
              </Text>
              <Text className="text-sm text-gray-500">{brandName}</Text>
            </View>
          </View>

          {/* Bottom section with status, stock and counter */}
          <View className="flex-row items-center justify-between">
            {/* Left side - Status and stock */}
            <View className="flex-row items-center">
              {/* Status pill */}
              <Animated.View
                className="px-3 py-1 rounded-full mr-3"
                style={{
                  backgroundColor: stockStatus.backgroundColor,
                  transform: [{ scale: chipScale }],
                  opacity: chipOpacity,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: stockStatus.textColor }}
                >
                  {stockStatus.text}
                </Text>
              </Animated.View>

              {/* Stock quantity */}
              <Text className="text-sm text-gray-700">{stock} u.</Text>
            </View>

            {/* Right side - Counter buttons */}
            <View className="flex-row items-center">
              <Pressable
                className={`rounded-lg px-3 py-2 ${
                  counter <= -stock || updateStockMutation.isPending
                    ? "bg-gray-200"
                    : "bg-gray-100"
                }`}
                onPress={handleDecrement}
                disabled={counter <= -stock || updateStockMutation.isPending}
              >
                <Text
                  className={`text-xl font-bold ${
                    counter <= -stock || updateStockMutation.isPending
                      ? "text-gray-400"
                      : "text-purple-600"
                  }`}
                >
                  −
                </Text>
              </Pressable>
              <Text className="mx-3 text-base font-semibold text-gray-700 min-w-[30px] text-center">
                {counter}
              </Text>
              <Pressable
                className={`rounded-lg px-3 py-2 ${
                  updateStockMutation.isPending
                    ? "bg-gray-200"
                    : "bg-purple-100"
                }`}
                onPress={handleIncrement}
                disabled={updateStockMutation.isPending}
              >
                <Text
                  className={`text-xl font-bold ${
                    updateStockMutation.isPending
                      ? "text-gray-400"
                      : "text-purple-600"
                  }`}
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Botones de confirmación - aparecen cuando se modifica el contador */}
          {showConfirmButtons && (
            <View className="flex-row justify-center mt-4 space-x-3 gap-5">
              <Pressable
                className={`rounded-lg px-4 py-2 flex-row items-center ${
                  updateStockMutation.isPending ? "bg-gray-100" : "bg-gray-200"
                }`}
                onPress={handleReset}
                disabled={updateStockMutation.isPending}
              >
                <Ionicons
                  name="close"
                  size={16}
                  color={updateStockMutation.isPending ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`font-medium ml-1 ${
                    updateStockMutation.isPending
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                className={`rounded-lg px-4 py-2 flex-row items-center ${
                  updateStockMutation.isPending
                    ? "bg-green-300"
                    : "bg-green-500"
                }`}
                onPress={handleConfirm}
                disabled={updateStockMutation.isPending}
              >
                {updateStockMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
                <Text className="text-white font-medium ml-1">
                  {updateStockMutation.isPending ? "Guardando..." : "Confirmar"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Toast notifications */}
        <Toast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onHide={hideToast}
        />
      </SwipeableCard>
    );
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
