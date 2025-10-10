import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PerfumeCard from "@/components/PerfumeCard";
import { FilterChips } from "@/components/FilterChips";
import { FilterModal } from "@/components/FilterModal";
import { useBrands } from "@/hooks/useBrands";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDeletePerfume } from "@/hooks/useDeletePerfume";
import { usePerfumes } from "@/hooks/usePerfumes";
import { usePerfumeSearch } from "@/hooks/usePerfumeSearch";
import { usePerfumeFilters } from "@/hooks/usePerfumeFilters";
import { PerfumeFromAPI } from "@/types/perfume";
import { AddPerfumeModal } from "@/src/components/modals/AddPerfumeModal";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddPerfumeModalVisible, setIsAddPerfumeModalVisible] =
    useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<{
    id: string;
    name: string;
    gender: "male" | "female" | "unisex";
    brandId: string;
    stock: number;
  } | null>(null);
  const [filters, setFilters] = useState<{
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  }>({});
  const queryClient = useQueryClient();
  const deletePerfumeMutation = useDeletePerfume();

  // Debounced search para evitar demasiadas llamadas a la API
  const debouncedSearchQuery = useDebouncedSearch(searchQuery, 500);

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
  } = usePerfumeSearch(debouncedSearchQuery);

  // Filtros
  const {
    data: filteredResults = [],
    isLoading: isLoadingFilters,
    error: filtersError,
    refetch: refetchFilters,
  } = usePerfumeFilters(filters);

  // Obtener marcas para el modal
  const { data: brands = [] } = useBrands();

  // Lógica para determinar qué datos mostrar
  const hasSearch = debouncedSearchQuery.trim();
  const hasFilters = filters.gender || filters.brandId;

  let perfumes = allPerfumes;
  let isLoading = isLoadingAll;
  let error = errorAll;

  if (hasSearch && hasFilters) {
    // Combinar búsqueda y filtros: filtrar los resultados de búsqueda
    perfumes = searchResults.filter((perfume) => {
      const matchesGender = !filters.gender || perfume.gender === filters.gender;
      const matchesBrand = !filters.brandId || perfume.brandId === filters.brandId;
      return matchesGender && matchesBrand;
    });
    isLoading = isSearching;
    error = searchError;
  } else if (hasSearch) {
    // Solo búsqueda
    perfumes = searchResults;
    isLoading = isSearching;
    error = searchError;
  } else if (hasFilters) {
    // Solo filtros
    perfumes = filteredResults as PerfumeFromAPI[];
    isLoading = isLoadingFilters;
    error = filtersError;
  }

  // Estado de búsqueda para mostrar indicadores visuales
  const isSearchingNow = searchQuery.trim() !== debouncedSearchQuery.trim();

  // Función para manejar el pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidar y refetch las queries
      await queryClient.invalidateQueries({ queryKey: ["perfumes"] });
      await queryClient.invalidateQueries({ queryKey: ["brands"] });

      if (debouncedSearchQuery.trim()) {
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
    setEditingPerfume(null);
  };

  // Función para manejar la edición de un perfume - memoizada
  const handleEditPerfume = useCallback((perfume: {
    id: string;
    name: string;
    gender: "male" | "female" | "unisex";
    brandId: string;
    stock: number;
  }) => {
    setEditingPerfume(perfume);
    setIsAddPerfumeModalVisible(true);
  }, []);

  // Función para manejar la eliminación de un perfume - memoizada
  const handleDeletePerfume = useCallback((perfumeId: string) => {
    Alert.alert(
      "Eliminar perfume",
      "¿Estás seguro de que quieres eliminar este perfume? Esta acción es irreversible.",
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
              await deletePerfumeMutation.mutateAsync(perfumeId);
              Alert.alert("Éxito", "Perfume eliminado correctamente");
            } catch (error) {
              Alert.alert(
                "Error",
                `No se pudo eliminar el perfume: ${error instanceof Error ? error.message : "Error desconocido"}`,
              );
            }
          },
        },
      ],
    );
  }, [deletePerfumeMutation]);

  // Funciones para manejar filtros
  const handleApplyFilters = useCallback((newFilters: {
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  }) => {
    setFilters(newFilters);
  }, []);

  const handleRemoveFilter = useCallback((filterType: "gender" | "brandId") => {
    setFilters(prev => ({
      ...prev,
      [filterType]: undefined,
    }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleOpenFilters = useCallback(() => {
    console.log("Opening filter modal...");
    setIsFilterModalVisible(true);
  }, []);

  const handleCloseFilterModal = useCallback(() => {
    setIsFilterModalVisible(false);
  }, []);

  // RenderItem memoizado para el FlatList
  const renderPerfumeItem = useCallback(({ item }: { item: any }) => (
    <PerfumeCard
      id={item.id || ""}
      gender={item.gender || "unisex"}
      name={item.name || ""}
      brandId={item.brandId || ""}
      stock={item.stock || 0}
      onEdit={handleEditPerfume}
      onDelete={handleDeletePerfume}
    />
  ), [handleEditPerfume, handleDeletePerfume]);

  // KeyExtractor memoizado
  const keyExtractor = useCallback((item: any, index: number) => 
    `${item.id || item.name || index}`, []);

  if (isLoading || isSearchingNow) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          searchResultsCount={perfumes.length}
          isSearching={isSearchingNow}
          onPressFilters={handleOpenFilters}
          hasActiveFilters={!!hasFilters}
        />
        <FilterChips
          filters={filters}
          brands={brands}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
        <View className="flex-1 justify-center items-center pb-24">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-4 text-gray-600">
            {isSearchingNow ? "Buscando..." : "Cargando perfumes..."}
          </Text>
        </View>
        <Footer onFABPress={handleFABPress} />

        <AddPerfumeModal
          key={isAddPerfumeModalVisible ? "open" : "closed"}
          visible={isAddPerfumeModalVisible}
          onClose={handleCloseModal}
          brands={brands}
          primaryColor="#603780"
          mode={editingPerfume ? "edit" : "create"}
          editingPerfume={editingPerfume || undefined}
        />
        <FilterModal
          visible={isFilterModalVisible}
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
          brands={brands}
          currentFilters={filters}
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          searchResultsCount={perfumes.length}
          isSearching={isSearchingNow}
          onPressFilters={handleOpenFilters}
          hasActiveFilters={!!hasFilters}
        />
        <FilterChips
          filters={filters}
          brands={brands}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
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
          mode={editingPerfume ? "edit" : "create"}
          editingPerfume={editingPerfume || undefined}
        />
        <FilterModal
          visible={isFilterModalVisible}
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
          brands={brands}
          currentFilters={filters}
        />
      </SafeAreaView>
    );
  }

  // Mostrar mensaje si no hay resultados de búsqueda
  if (debouncedSearchQuery.trim() && perfumes.length === 0 && !isLoading && !isSearchingNow) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          searchResultsCount={0}
          isSearching={false}
        />
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
            <View className="items-center px-8">
              <Text className="text-gray-500 text-lg font-semibold text-center">
                No se encontraron perfumes
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                No hay resultados para "{debouncedSearchQuery}"
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Intenta con otros términos de búsqueda o verifica la ortografía
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
          mode={editingPerfume ? "edit" : "create"}
          editingPerfume={editingPerfume || undefined}
        />
        <FilterModal
          visible={isFilterModalVisible}
          onClose={handleCloseFilterModal}
          onApplyFilters={handleApplyFilters}
          brands={brands}
          currentFilters={filters}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        searchResultsCount={perfumes.length}
        isSearching={isSearchingNow}
      />
      <FlatList
        data={perfumes}
        renderItem={renderPerfumeItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 200, // Altura aproximada de cada item
          offset: 200 * index,
          index,
        })}
      />
      <Footer onFABPress={handleFABPress} />

      <AddPerfumeModal
        key={isAddPerfumeModalVisible ? "open" : "closed"}
        visible={isAddPerfumeModalVisible}
        onClose={handleCloseModal}
        brands={brands}
        primaryColor="#603780"
        mode={editingPerfume ? "edit" : "create"}
        editingPerfume={editingPerfume || undefined}
      />
    </SafeAreaView>
  );
}
