import { useBrandsStore } from "@/stores/brandsStore";
import { PerfumeWithBrandName } from "@/types/perfume";
import { useMemo } from "react";
import { usePerfumes } from "./usePerfumes";

/**
 * Hook que combina perfumes con nombres de marcas desde Zustand
 * Útil cuando necesitas los datos completos con nombres de marcas resueltos
 */
export const usePerfumesWithBrands = () => {
  const { data: perfumes = [], isLoading, error } = usePerfumes();
  const { getBrandName } = useBrandsStore();

  const perfumesWithBrands = useMemo(() => {
    return perfumes.map(
      (perfume): PerfumeWithBrandName => ({
        ...perfume,
        brandName: getBrandName(perfume.brand_id),
      }),
    );
  }, [perfumes, getBrandName]);

  return {
    data: perfumesWithBrands,
    isLoading,
    error,
  };
};
