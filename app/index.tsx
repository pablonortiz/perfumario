import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PerfumeCard from "@/components/PerfumeCard";
import { useBrands } from "@/hooks/useBrands";
import { usePerfumes } from "@/hooks/usePerfumes";
import { usePerfumeSearch } from "@/hooks/usePerfumeSearch";
import { AddPerfumeModal } from "@/src/components/modals/AddPerfumeModal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddPerfumeModalVisible, setIsAddPerfumeModalVisible] =
    useState(false);
  const queryClient = useQueryClient();

  // Usar búsqueda si hay query, sino mostrar todos los perfumes
  const {
    data: allPerfumes = [],
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchPerfumes,
  } = usePerfumes();
  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
    refetch: refetchSearch,
  } = usePerfumeSearch(searchQuery);

  // Obtener marcas para el modal
  const { data: brands = [] } = useBrands();

  const perfumes = searchQuery.trim() ? searchResults : allPerfumes;
  const isLoading = searchQuery.trim() ? isSearching : isLoadingAll;
  const error = searchQuery.trim() ? searchError : errorAll;

  // Función para manejar el pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidar y refetch las queries
      await queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      await queryClient.invalidateQueries({ queryKey: ["brands"] });

      if (searchQuery.trim()) {
        await refetchSearch();
      } else {
        await refetchPerfumes();
      }
    } catch (error) {
      console.error("Error al refrescar:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Función para manejar el press del FloatingActionButton
  const handleFABPress = () => {
    setIsAddPerfumeModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsAddPerfumeModalVisible(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <View className="flex-1 justify-center items-center pb-24">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-4 text-gray-600">Cargando perfumes...</Text>
        </View>
        <Footer onFABPress={handleFABPress} />

        <AddPerfumeModal
          key={isAddPerfumeModalVisible ? "open" : "closed"}
          visible={isAddPerfumeModalVisible}
          onClose={handleCloseModal}
          brands={brands}
          primaryColor="#603780"
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FlatList
          data={[]}
          renderItem={() => null}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <View className="items-center">
              <Text className="text-red-500 text-lg font-semibold text-center">
                Error al cargar los perfumes
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                {error.message || "Intenta nuevamente más tarde"}
              </Text>
              <Text className="text-gray-400 text-center mt-4">
                Desliza hacia abajo para actualizar
              </Text>
            </View>
          }
        />
        <Footer onFABPress={handleFABPress} />

        <AddPerfumeModal
          key={isAddPerfumeModalVisible ? "open" : "closed"}
          visible={isAddPerfumeModalVisible}
          onClose={handleCloseModal}
          brands={brands}
          primaryColor="#603780"
        />
      </SafeAreaView>
    );
  }

  // Mostrar mensaje si no hay resultados de búsqueda
  if (searchQuery.trim() && perfumes.length === 0 && !isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <FlatList
          data={[]}
          renderItem={() => null}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          ListEmptyComponent={
            <View className="items-center">
              <Text className="text-gray-500 text-lg text-center">
                No se encontraron perfumes para &ldquo;{searchQuery}&rdquo;
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Intenta con otros términos de búsqueda
              </Text>
              <Text className="text-gray-400 text-center mt-4">
                Desliza hacia abajo para actualizar
              </Text>
            </View>
          }
        />
        <Footer onFABPress={handleFABPress} />

        <AddPerfumeModal
          key={isAddPerfumeModalVisible ? "open" : "closed"}
          visible={isAddPerfumeModalVisible}
          onClose={handleCloseModal}
          brands={brands}
          primaryColor="#603780"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        data={perfumes}
        renderItem={({ item }) => (
          <PerfumeCard
            gender={item.gender || "unisex"}
            name={item.name || ""}
            brandId={item.brandId || ""}
            stock={item.stock || 0}
          />
        )}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <Footer onFABPress={handleFABPress} />

      <AddPerfumeModal
        key={isAddPerfumeModalVisible ? "open" : "closed"}
        visible={isAddPerfumeModalVisible}
        onClose={handleCloseModal}
        brands={brands}
        primaryColor="#603780"
      />
    </SafeAreaView>
  );
}
