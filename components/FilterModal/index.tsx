import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BrandFromAPI } from "@/types/perfume";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  }) => void;
  brands: BrandFromAPI[];
  currentFilters: {
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  };
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  brands,
  currentFilters,
}) => {
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | "unisex" | undefined
  >(currentFilters.gender);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(
    currentFilters.brandId
  );

  const handleApply = () => {
    onApplyFilters({
      gender: selectedGender,
      brandId: selectedBrandId,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedGender(undefined);
    setSelectedBrandId(undefined);
  };

  const getGenderLabel = (gender: "male" | "female" | "unisex") => {
    switch (gender) {
      case "male":
        return "Hombre";
      case "female":
        return "Mujer";
      case "unisex":
        return "Unisex";
    }
  };

  const getGenderIcon = (gender: "male" | "female" | "unisex") => {
    switch (gender) {
      case "male":
        return "male";
      case "female":
        return "female";
      case "unisex":
        return "people";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">
              Filtros
            </Text>
            <Pressable
              onPress={onClose}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Género Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Género
            </Text>
            <View className="space-y-3">
              {(["male", "female", "unisex"] as const).map((gender) => (
                <Pressable
                  key={gender}
                  onPress={() =>
                    setSelectedGender(
                      selectedGender === gender ? undefined : gender
                    )
                  }
                  className="flex-row items-center"
                >
                  <View
                    className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                      selectedGender === gender
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedGender === gender && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                  <Ionicons
                    name={getGenderIcon(gender)}
                    size={20}
                    color={selectedGender === gender ? "#7C3AED" : "#6B7280"}
                  />
                  <Text
                    className={`ml-2 text-base ${
                      selectedGender === gender
                        ? "text-purple-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {getGenderLabel(gender)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Marca Section */}
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-4">
              Marca
            </Text>
            <View className="space-y-3">
              <Pressable
                onPress={() => setSelectedBrandId(undefined)}
                className="flex-row items-center"
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                    selectedBrandId === undefined
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedBrandId === undefined && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>
                <Text
                  className={`text-base ${
                    selectedBrandId === undefined
                      ? "text-purple-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Todas las marcas
                </Text>
              </Pressable>
              {brands.map((brand) => (
                <Pressable
                  key={brand.id}
                  onPress={() =>
                    setSelectedBrandId(
                      selectedBrandId === brand.id ? undefined : brand.id
                    )
                  }
                  className="flex-row items-center"
                >
                  <View
                    className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                      selectedBrandId === brand.id
                        ? "border-purple-500 bg-purple-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedBrandId === brand.id && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                  <Text
                    className={`text-base ${
                      selectedBrandId === brand.id
                        ? "text-purple-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {brand.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="bg-white px-4 py-4 border-t border-gray-200">
          <View className="flex-row space-x-3">
            <Pressable
              onPress={handleClear}
              className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
            >
              <Text className="text-gray-700 font-semibold text-base">
                Limpiar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              className="flex-1 bg-purple-500 rounded-xl py-4 items-center"
            >
              <Text className="text-white font-semibold text-base">
                Aplicar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
