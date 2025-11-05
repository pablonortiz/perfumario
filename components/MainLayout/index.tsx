import { AnimatedModal } from "@/components/AnimatedModal";
import { BrandManagementModal } from "@/components/BrandManagementModal";
import { FilterChips } from "@/components/FilterChips";
import { FilterModal } from "@/components/FilterModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AddPerfumeModal } from "@/src/components/modals/AddPerfumeModal";
import { BrandFromAPI, PerfumeFromAPI } from "@/types/perfume";
import React, { memo, ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MainLayoutProps {
  // Header props
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResultsCount: number;
  isSearching: boolean;
  onPressFilters: () => void;
  hasActiveFilters: boolean;
  onPressDocument: () => Promise<boolean>;
  onPressBrandManagement: () => void;

  // Filter props
  filters: {
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  };
  brands: BrandFromAPI[];
  onRemoveFilter: (filterType: "gender" | "brandId") => void;
  onClearAllFilters: () => void;

  // Modal props
  isAddPerfumeModalVisible: boolean;
  setIsAddPerfumeModalVisible: (visible: boolean) => void;
  isFilterModalVisible: boolean;
  setIsFilterModalVisible: (visible: boolean) => void;
  isBrandManagementModalVisible: boolean;
  setIsBrandManagementModalVisible: (visible: boolean) => void;

  // Perfume edit props
  editingPerfume: {
    id: string;
    name: string;
    gender: "male" | "female" | "unisex";
    brandId: string;
    stock: number;
  } | null;
  onCloseModal: () => void;

  // FAB props
  onFABPress: () => void;

  // Layout props
  children: ReactNode;
  backgroundColor?: string;
  contentContainerStyle?: ViewStyle;

  // Data for brand management
  perfumes?: PerfumeFromAPI[];

  // Filter application
  onApplyFilters?: (filters: {
    gender?: "male" | "female" | "unisex";
    brandId?: string;
  }) => void;
}

/**
 * Main layout component that wraps the common structure of the app
 * Reduces duplication of Header, Footer, FilterChips, and Modals
 */
export const MainLayout: React.FC<MainLayoutProps> = memo(
  ({
    searchQuery,
    setSearchQuery,
    searchResultsCount,
    isSearching,
    onPressFilters,
    hasActiveFilters,
    onPressDocument,
    onPressBrandManagement,
    filters,
    brands,
    onRemoveFilter,
    onClearAllFilters,
    isAddPerfumeModalVisible,
    setIsAddPerfumeModalVisible,
    isFilterModalVisible,
    setIsFilterModalVisible,
    isBrandManagementModalVisible,
    setIsBrandManagementModalVisible,
    editingPerfume,
    onCloseModal,
    onFABPress,
    children,
    backgroundColor = "#8B5CF6",
    contentContainerStyle,
    perfumes = [],
    onApplyFilters,
  }) => {
    return (
      <SafeAreaView
        className="flex-1 bg-white"
        style={{ backgroundColor }}
        edges={["top"]}
      >
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResultsCount={searchResultsCount}
          isSearching={isSearching}
          onPressFilters={onPressFilters}
          hasActiveFilters={hasActiveFilters}
          onPressDocument={onPressDocument}
          onPressBrandManagement={onPressBrandManagement}
        />

        {hasActiveFilters && (
          <FilterChips
            filters={filters}
            brands={brands}
            onRemoveFilter={onRemoveFilter}
            onClearAll={onClearAllFilters}
          />
        )}

        <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>

        <Footer onFABPress={onFABPress} />

        {/* Add Perfume Modal */}
        <AnimatedModal
          visible={isAddPerfumeModalVisible}
          onRequestClose={onCloseModal}
          animationType="fade"
        >
          <AddPerfumeModal
            key={isAddPerfumeModalVisible ? "open" : "closed"}
            visible={isAddPerfumeModalVisible}
            onClose={onCloseModal}
            brands={brands}
            primaryColor="#603780"
            mode={editingPerfume ? "edit" : "create"}
            editingPerfume={editingPerfume || undefined}
          />
        </AnimatedModal>

        {/* Filter Modal */}
        <FilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApplyFilters={
            onApplyFilters ||
            (() => {
              setIsFilterModalVisible(false);
            })
          }
          brands={brands}
          currentFilters={filters}
        />

        {/* Brand Management Modal */}
        <BrandManagementModal
          visible={isBrandManagementModalVisible}
          onClose={() => setIsBrandManagementModalVisible(false)}
          brands={brands}
          perfumes={perfumes}
        />
      </SafeAreaView>
    );
  },
);

MainLayout.displayName = "MainLayout";
