import { AnimatedListItemElegant } from "@/components/AnimatedList/AnimatedListItemElegant";
import { EmptyState } from "@/components/EmptyState";
import { MainLayout } from "@/components/MainLayout";
import PerfumeCard from "@/components/PerfumeCard";
import { PerfumeListSkeleton } from "@/components/SkeletonLoader/PerfumeListSkeleton";
import { useAllPerfumes } from "@/hooks/useAllPerfumes";
import { useBrands } from "@/hooks/useBrands";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useDeletePerfume } from "@/hooks/useDeletePerfume";
import { useGeneratePDF } from "@/hooks/useGeneratePDF";
import { usePerfumeFilters } from "@/hooks/usePerfumeFilters";
import { usePerfumes } from "@/hooks/usePerfumes";
import { usePerfumeSearch } from "@/hooks/usePerfumeSearch";
import { PerfumeFromAPI } from "@/types/perfume";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import "../global.css";

export default function Index() {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddPerfumeModalVisible, setIsAddPerfumeModalVisible] =
    useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isBrandManagementModalVisible, setIsBrandManagementModalVisible] =
    useState(false);
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

  // Data fetching hooks
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

  const {
    data: filteredResults = [],
    isLoading: isLoadingFilters,
    error: filtersError,
  } = usePerfumeFilters(filters);

  const { data: brands = [] } = useBrands();
  const { data: allPerfumesForPDF = [] } = useAllPerfumes() as {
    data: PerfumeFromAPI[];
  };

  const generatePDFMutation = useGeneratePDF();

  // Determine which data to display
  const hasSearch = debouncedSearchQuery.trim().length >= 2;
  const hasFilters = !!(filters.gender || filters.brandId);

  let perfumes = allPerfumes;
  let isLoading = isLoadingAll;
  let error = errorAll;

  if (hasSearch && hasFilters) {
    // Combine search and filters
    perfumes = searchResults.filter((perfume) => {
      const matchesGender =
        !filters.gender || perfume.gender === filters.gender;
      const matchesBrand =
        !filters.brandId || perfume.brandId === filters.brandId;
      return matchesGender && matchesBrand;
    });
    isLoading = isSearching;
    error = searchError;
  } else if (hasSearch) {
    perfumes = searchResults;
    isLoading = isSearching;
    error = searchError;
  } else if (hasFilters) {
    perfumes = filteredResults as PerfumeFromAPI[];
    isLoading = isLoadingFilters;
    error = filtersError;
  }

  // Search state indicators
  const isSearchingNow = searchQuery.trim() !== debouncedSearchQuery.trim();
  const isActuallySearching =
    isSearchingNow || (searchQuery.trim().length >= 2 && isSearching);
  const shouldShowResults = !isActuallySearching && !isLoading;

  // Event handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
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

  const handleFABPress = () => {
    setIsAddPerfumeModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddPerfumeModalVisible(false);
    setEditingPerfume(null);
  };

  const handleEditPerfume = useCallback(
    (perfume: {
      id: string;
      name: string;
      gender: "male" | "female" | "unisex";
      brandId: string;
      stock: number;
    }) => {
      setEditingPerfume(perfume);
      setIsAddPerfumeModalVisible(true);
    },
    [],
  );

  const handleDeletePerfume = useCallback(
    (perfumeId: string) => {
      Alert.alert(
        "Eliminar perfume",
        "¿Estás seguro de que quieres eliminar este perfume? Esta acción es irreversible.",
        [
          { text: "Cancelar", style: "cancel" },
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
    },
    [deletePerfumeMutation],
  );

  const handleApplyFilters = useCallback(
    (newFilters: {
      gender?: "male" | "female" | "unisex";
      brandId?: string;
    }) => {
      setFilters(newFilters);
      setIsFilterModalVisible(false);
    },
    [],
  );

  const handleRemoveFilter = useCallback((filterType: "gender" | "brandId") => {
    setFilters((prev) => ({ ...prev, [filterType]: undefined }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleGeneratePDF = useCallback(async (): Promise<boolean> => {
    try {
      if (allPerfumesForPDF.length === 0) {
        Alert.alert(
          "Sin datos",
          "No hay perfumes disponibles para generar el reporte.",
          [{ text: "OK" }],
        );
        return false;
      }

      await generatePDFMutation.mutateAsync({
        perfumes: allPerfumesForPDF,
        brands: brands,
      });

      return true;
    } catch (_error) {
      Alert.alert("Error", "No se pudo generar el PDF. Intenta nuevamente.", [
        { text: "OK" },
      ]);
      return false;
    }
  }, [allPerfumesForPDF, brands, generatePDFMutation]);

  // FlatList optimizations
  const renderPerfumeItem = useCallback(
    ({ item, index }: { item: PerfumeFromAPI; index: number }) => (
      <AnimatedListItemElegant index={index} delay={150}>
        <PerfumeCard
          id={item.id || ""}
          gender={item.gender || "unisex"}
          name={item.name || ""}
          brandId={item.brandId || ""}
          stock={item.stock || 0}
          onEdit={handleEditPerfume}
          onDelete={handleDeletePerfume}
        />
      </AnimatedListItemElegant>
    ),
    [handleEditPerfume, handleDeletePerfume],
  );

  const keyExtractor = useCallback(
    (item: PerfumeFromAPI, index: number) => `${item.id || item.name || index}`,
    [],
  );

  // Common layout props
  const layoutProps = {
    searchQuery,
    setSearchQuery,
    searchResultsCount: perfumes.length,
    isSearching: isActuallySearching,
    onPressFilters: () => setIsFilterModalVisible(true),
    hasActiveFilters: hasFilters,
    onPressDocument: handleGeneratePDF,
    onPressBrandManagement: () => setIsBrandManagementModalVisible(true),
    filters,
    brands,
    onRemoveFilter: handleRemoveFilter,
    onClearAllFilters: handleClearAllFilters,
    isAddPerfumeModalVisible,
    setIsAddPerfumeModalVisible,
    isFilterModalVisible,
    setIsFilterModalVisible,
    isBrandManagementModalVisible,
    setIsBrandManagementModalVisible,
    editingPerfume,
    onCloseModal: handleCloseModal,
    onFABPress: handleFABPress,
    perfumes: allPerfumes,
    onApplyFilters: handleApplyFilters,
  };

  // Loading state
  if (isLoading || isActuallySearching) {
    return (
      <MainLayout {...layoutProps} backgroundColor="#ffffff">
        <View className="flex-1 pb-24">
          <PerfumeListSkeleton count={6} />
        </View>
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout {...layoutProps} backgroundColor="#ffffff">
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
            <EmptyState
              title="Error al cargar los perfumes"
              description={[
                error.message || "Intenta nuevamente más tarde",
                "Desliza hacia abajo para actualizar",
              ]}
            />
          }
        />
      </MainLayout>
    );
  }

  // No results with filters
  if (
    hasFilters &&
    !debouncedSearchQuery.trim() &&
    perfumes.length === 0 &&
    shouldShowResults
  ) {
    return (
      <MainLayout {...layoutProps} backgroundColor="#ffffff">
        <EmptyState
          title="No se encontraron perfumes"
          description={[
            "con los filtros seleccionados",
            "Intenta cambiar o quitar algunos filtros",
            'O presiona "Limpiar todo" en los filtros',
          ]}
        />
      </MainLayout>
    );
  }

  // No search results
  if (
    debouncedSearchQuery.trim() &&
    perfumes.length === 0 &&
    shouldShowResults
  ) {
    const descriptions = [
      `No hay resultados para "${debouncedSearchQuery}"`,
    ];

    if (hasFilters) {
      descriptions.push(
        hasSearch
          ? "con los filtros aplicados"
          : "con los filtros seleccionados",
      );
    }

    descriptions.push(
      hasSearch
        ? "Intenta con otros términos de búsqueda o verifica la ortografía"
        : hasFilters
          ? "Intenta cambiar o quitar algunos filtros"
          : "Desliza hacia abajo para actualizar",
    );

    if (hasFilters) {
      descriptions.push('O presiona "Limpiar todo" en los filtros');
    }

    descriptions.push("Desliza hacia abajo para actualizar");

    return (
      <MainLayout {...layoutProps} backgroundColor="#ffffff">
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
            <EmptyState
              title="No se encontraron perfumes"
              description={descriptions}
            />
          }
        />
      </MainLayout>
    );
  }

  // Success state with results
  return (
    <MainLayout {...layoutProps} backgroundColor="#8B5CF6">
      <FlatList
        data={perfumes}
        renderItem={renderPerfumeItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: "#ffffff",
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
      />
    </MainLayout>
  );
}
