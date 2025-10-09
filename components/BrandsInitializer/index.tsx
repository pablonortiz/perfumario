import { useBrands } from "@/hooks/useBrands";

/**
 * Componente que inicializa las marcas al cargar la aplicación
 * Se ejecuta una sola vez y carga las marcas en el store de Zustand
 */
export const BrandsInitializer = () => {
  useBrands();

  // Este componente no renderiza nada, solo inicializa las marcas
  return null;
};
