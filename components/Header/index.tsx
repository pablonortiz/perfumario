import Logo from "@/assets/images/logo-transparent.png";
import { Image } from "expo-image";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onPressDocument?: () => Promise<boolean>;
  searchResultsCount?: number;
  isSearching?: boolean;
  onPressFilters?: () => void;
  hasActiveFilters?: boolean;
}

const Header: FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onPressDocument,
  searchResultsCount,
  isSearching,
  onPressFilters,
  hasActiveFilters,
}) => {
  const [isDocumentButtonLoading, setIsDocumentButtonLoading] = useState(false);

  const handlePressDocument = async () => {
    setIsDocumentButtonLoading(true);
    if (onPressDocument) {
      await onPressDocument();
    }
    setIsDocumentButtonLoading(false);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between p-4 bg-violet-500 gap-3">
        <Image source={Logo} style={{ width: 50, height: 50 }} />
        <View className="flex-1 mx-3">
          <Searchbar
            style={{ flex: 1 }}
            placeholder="Buscar perfumes"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onPressFilters}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            hasActiveFilters ? "bg-white" : "bg-white/20"
          }`}
        >
            <Ionicons
              name="filter"
              size={20}
              color={hasActiveFilters ? "#7C3AED" : "#FFFFFF"}
            />
          </Pressable>
          <Pressable
            onPress={handlePressDocument}
            className="w-12 h-12 rounded-full items-center justify-center bg-white/20"
            disabled={isDocumentButtonLoading}
          >
            {isDocumentButtonLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="document-text" size={20} color="#FFFFFF" />
            )}
          </Pressable>
        </View>
      </View>
      
      {/* Search results indicator */}
      {searchQuery.trim() && (
        <View className="px-4 py-2 bg-violet-100">
          <Text className="text-violet-700 text-sm font-medium">
            {isSearching 
              ? "Buscando..." 
              : searchResultsCount !== undefined 
                ? `${searchResultsCount} resultado${searchResultsCount !== 1 ? 's' : ''} encontrado${searchResultsCount !== 1 ? 's' : ''}`
                : ""
            }
          </Text>
        </View>
      )}
      
      <View className="p-2 bg-violet-400" />
      <View className="bg-violet-400">
        <View className="p-2 rounded-s-full bg-white" />
      </View>
    </View>
  );
};

export default Header;
