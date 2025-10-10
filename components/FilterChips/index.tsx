import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { BrandFromAPI } from "@/types/perfume";

interface FilterChipsProps {
  filters: {
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  };
  brands: BrandFromAPI[];
  onRemoveFilter: (filterType: "gender" | "brandId") => void;
  onClearAll: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  brands,
  onRemoveFilter,
  onClearAll,
}) => {
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

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand?.name || "Marca desconocida";
  };

  const hasActiveFilters = filters.gender || filters.brandId;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <View className="px-4 py-2 bg-white border-b border-gray-100">
      <View className="flex-row items-center flex-wrap gap-2">
        {/* Gender Filter Chip */}
        {filters.gender && (
          <View className="bg-purple-500 rounded-full px-3 py-2 flex-row items-center">
            <Ionicons
              name={getGenderIcon(filters.gender)}
              size={16}
              color="#FFFFFF"
            />
            <Text className="text-white text-sm font-medium ml-1">
              {getGenderLabel(filters.gender)}
            </Text>
            <Pressable
              onPress={() => onRemoveFilter("gender")}
              className="ml-2 w-5 h-5 items-center justify-center"
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        )}

        {/* Brand Filter Chip */}
        {filters.brandId && (
          <View className="bg-purple-500 rounded-full px-3 py-2 flex-row items-center">
            <Text className="text-white text-sm font-medium">
              {getBrandName(filters.brandId)}
            </Text>
            <Pressable
              onPress={() => onRemoveFilter("brandId")}
              className="ml-2 w-5 h-5 items-center justify-center"
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        )}

        {/* Clear All Button */}
        <Pressable
          onPress={onClearAll}
          className="bg-gray-100 rounded-full px-3 py-2 flex-row items-center"
        >
          <Text className="text-gray-600 text-sm font-medium">Limpiar todo</Text>
          <Ionicons name="close" size={14} color="#6B7280" className="ml-1" />
        </Pressable>
      </View>
    </View>
  );
};
