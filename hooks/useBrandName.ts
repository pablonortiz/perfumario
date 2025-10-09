import { useBrandsStore } from "@/stores/brandsStore";

/**
 * Hook personalizado para obtener el nombre de una marca específica
 * Asegura que el componente se re-renderice cuando las marcas se cargan
 */
export const useBrandName = (brandId: string) => {
  const brands = useBrandsStore((state) => state.brands);
  const brandsMap = useBrandsStore((state) => state.brandsMap);

  if (!brandId) {
    return "Sin marca";
  }

  if (brands.length === 0) {
    return "Cargando marca...";
  }

  return brandsMap[brandId] || "Marca desconocida";
};
