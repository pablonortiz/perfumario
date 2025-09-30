import Logo from "@/assets/images/logo-transparent.png";
import { Image } from "expo-image";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { View } from "react-native";
import { FAB, Searchbar } from "react-native-paper";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  onPressDocument?: () => Promise<boolean>;
}

const Header: FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onPressDocument,
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
      <View className="flex-row p-4 bg-violet-500 gap-5">
        <Image source={Logo} style={{ width: 50, height: 50 }} />
        <Searchbar
          style={{ flex: 1 }}
          placeholder="Buscar perfumes"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FAB
          icon="file-document"
          size="medium"
          mode="elevated"
          onPress={handlePressDocument}
          loading={isDocumentButtonLoading}
          style={{ borderRadius: 30 }}
        />
      </View>
      <View className="p-2 bg-violet-400" />
      <View className="bg-violet-400">
        <View className="p-2 rounded-s-full bg-white" />
      </View>
    </View>
  );
};

export default Header;
