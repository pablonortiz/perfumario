import { useBrandName } from "@/hooks/useBrandName";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { getGenderProps } from "./utils/getGenderProps";

type Props = {
  gender: "male" | "female" | "unisex";
  name: string;
  brandId: string;
  stock: number;
};

const ProductCard: React.FC<Props> = ({ gender, name, brandId, stock }) => {
  const isAvailable = stock > 0;
  const { genderBackgroundColor, genderIconColor, genderIconName } =
    getGenderProps(gender);

  // Usar useBrandName para resolver el nombre de la marca
  const brandName = useBrandName(brandId);

  return (
    <View className="bg-white rounded-2xl shadow-md m-4 p-4 mb-4">
      {/* Top section with icon and product info */}
      <View className="flex-row items-center mb-4">
        {/* Icon section - centered and large */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: genderBackgroundColor }}
        >
          <Ionicons name={genderIconName} size={40} color={genderIconColor} />
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
          <View
            className={`px-3 py-1 rounded-full mr-3 ${
              isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <Text className="text-white text-xs font-semibold">
              {isAvailable ? "Disponible" : "Sin stock"}
            </Text>
          </View>

          {/* Stock quantity */}
          <Text className="text-sm text-gray-700">
            {isAvailable ? `${stock} u.` : "0 u."}
          </Text>
        </View>

        {/* Right side - Counter buttons */}
        <View className="flex-row items-center">
          <Pressable className="bg-gray-100 rounded-lg px-3 py-2">
            <Text className="text-xl text-purple-600 font-bold">−</Text>
          </Pressable>
          <Text className="mx-3 text-base font-semibold text-gray-700">0</Text>
          <Pressable className="bg-purple-100 rounded-lg px-3 py-2">
            <Text className="text-xl text-purple-600 font-bold">+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
