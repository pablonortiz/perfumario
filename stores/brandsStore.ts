import { Brand } from "perfumario-schemas";
import { create } from "zustand";

interface BrandsState {
  brands: Brand[];
  brandsMap: Record<string, string>; // id -> name mapping for quick lookup
  isLoading: boolean;
  error: string | null;
  setBrands: (brands: Brand[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getBrandName: (brandId: string) => string;
  clearBrands: () => void;
}

// Selector para obtener el nombre de una marca específica
export const selectBrandName = (brandId: string) => (state: BrandsState) => {
  if (!brandId) {
    return "Sin marca";
  }

  if (state.brands.length === 0) {
    return "Cargando marca...";
  }

  return state.brandsMap[brandId] || "Marca desconocida";
};

export const useBrandsStore = create<BrandsState>((set, get) => ({
  brands: [],
  brandsMap: {},
  isLoading: false,
  error: null,

  setBrands: (brands) => {
    // Crear un mapa para búsquedas rápidas por ID
    const brandsMap = brands.reduce(
      (acc, brand) => {
        if (brand.id) {
          acc[brand.id] = brand.name;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    set({ brands, brandsMap, error: null });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  getBrandName: (brandId) => {
    const { brandsMap, brands } = get();

    if (!brandId) {
      return "Sin marca";
    }

    if (brands.length === 0) {
      return "Cargando marca...";
    }

    return brandsMap[brandId] || "Marca desconocida";
  },

  clearBrands: () => set({ brands: [], brandsMap: {}, error: null }),
}));
