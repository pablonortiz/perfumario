import { useDeleteBrand } from "@/hooks/useDeleteBrand";
import { BrandFromAPI, PerfumeFromAPI } from "@/types/perfume";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

interface BrandManagementModalProps {
  visible: boolean;
  onClose: () => void;
  brands: BrandFromAPI[];
  perfumes: PerfumeFromAPI[];
}

export const BrandManagementModal: React.FC<BrandManagementModalProps> = ({
  visible,
  onClose,
  brands,
  perfumes,
}) => {
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);
  const deleteBrandMutation = useDeleteBrand();

  // Función para contar perfumes por marca
  const getPerfumeCountByBrand = useCallback(
    (brandId: string) => {
      return perfumes.filter((perfume) => perfume.brandId === brandId).length;
    },
    [perfumes],
  );

  // Función para verificar si una marca está en uso
  const isBrandInUse = useCallback(
    (brandId: string) => {
      return getPerfumeCountByBrand(brandId) > 0;
    },
    [getPerfumeCountByBrand],
  );

  // Ordenar marcas por nombre
  const sortedBrands = useMemo(() => {
    return [...brands].sort((a, b) => a.name.localeCompare(b.name));
  }, [brands]);

  const handleDeleteBrand = useCallback(
    (brand: BrandFromAPI) => {
      const perfumeCount = getPerfumeCountByBrand(brand.id);

      if (perfumeCount > 0) {
        Alert.alert(
          "No se puede eliminar",
          `La marca "${brand.name}" está siendo utilizada por ${perfumeCount} perfume${perfumeCount !== 1 ? "s" : ""}. Primero debes eliminar o cambiar la marca de esos perfumes.`,
          [{ text: "Entendido" }],
        );
        return;
      }

      Alert.alert(
        "Eliminar marca",
        `¿Estás seguro de que quieres eliminar la marca "${brand.name}"? Esta acción es irreversible.`,
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                setDeletingBrandId(brand.id);
                await deleteBrandMutation.mutateAsync({ brandId: brand.id });
                Alert.alert("Éxito", "Marca eliminada correctamente");
              } catch (error) {
                Alert.alert(
                  "Error",
                  `No se pudo eliminar la marca: ${error instanceof Error ? error.message : "Error desconocido"}`,
                );
              } finally {
                setDeletingBrandId(null);
              }
            },
          },
        ],
      );
    },
    [getPerfumeCountByBrand, deleteBrandMutation],
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 shadow-lg max-h-[85%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Gestionar Marcas
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {brands.length} marca{brands.length !== 1 ? "s" : ""} en total
              </Text>
            </View>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={28} color="#4B5563" />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedBrands.length === 0 ? (
              <View className="items-center py-8">
                <Ionicons name="pricetag-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg font-medium mt-4">
                  No hay marcas
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Las marcas aparecerán aquí cuando se creen
                </Text>
              </View>
            ) : (
              <View className="space-y-3">
                {sortedBrands.map((brand) => {
                  const perfumeCount = getPerfumeCountByBrand(brand.id);
                  const isInUse = isBrandInUse(brand.id);
                  const isDeleting = deletingBrandId === brand.id;

                  return (
                    <View
                      key={brand.id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text className="text-lg font-semibold text-gray-800">
                            {brand.name}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons
                              name="pricetag"
                              size={16}
                              color={isInUse ? "#F59E0B" : "#10B981"}
                            />
                            <Text
                              className={`text-sm ml-1 ${
                                isInUse ? "text-amber-600" : "text-green-600"
                              }`}
                            >
                              {perfumeCount === 0
                                ? "Sin perfumes"
                                : `${perfumeCount} perfume${perfumeCount !== 1 ? "s" : ""}`}
                            </Text>
                          </View>
                        </View>

                        <Pressable
                          onPress={() => handleDeleteBrand(brand)}
                          disabled={isDeleting || deleteBrandMutation.isPending}
                          className={`ml-4 p-3 rounded-full ${
                            isInUse
                              ? "bg-gray-200"
                              : "bg-red-100 active:bg-red-200"
                          }`}
                        >
                          {isDeleting ? (
                            <ActivityIndicator size="small" color="#EF4444" />
                          ) : (
                            <Ionicons
                              name="trash"
                              size={20}
                              color={isInUse ? "#9CA3AF" : "#EF4444"}
                            />
                          )}
                        </Pressable>
                      </View>

                      {isInUse && (
                        <View className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200">
                          <Text className="text-amber-700 text-xs">
                            ⚠️ Esta marca no se puede eliminar porque está
                            siendo utilizada por perfumes
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-gray-500 text-xs text-center">
              💡 Para eliminar una marca, primero debes eliminar o cambiar la
              marca de todos los perfumes que la usan
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
