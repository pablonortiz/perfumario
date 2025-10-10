import { PerfumeFromAPI } from "@/types/perfume";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

interface FilterOptions {
  gender?: "male" | "female" | "unisex";
  brandId?: string;
}

const fetchPerfumesByGender = async (
  gender: "male" | "female" | "unisex"
): Promise<PerfumeFromAPI[]> => {
  const response = await fetch(`${API_BASE_URL}/perfumes/gender/${gender}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener perfumes por género: ${response.status}`);
  }

  return response.json();
};

const fetchPerfumesByBrand = async (brandId: string): Promise<PerfumeFromAPI[]> => {
  const response = await fetch(`${API_BASE_URL}/perfumes/brand/${brandId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener perfumes por marca: ${response.status}`);
  }

  return response.json();
};

const fetchPerfumesWithFilters = async (
  filters: FilterOptions
): Promise<PerfumeFromAPI[]> => {
  // Validar que al menos un filtro esté presente
  if (!filters.gender && !filters.brandId) {
    return [];
  }

  // Si solo hay filtro de género
  if (filters.gender && !filters.brandId) {
    return fetchPerfumesByGender(filters.gender);
  }

  // Si solo hay filtro de marca
  if (filters.brandId && !filters.gender) {
    return fetchPerfumesByBrand(filters.brandId);
  }

  // Si hay ambos filtros, necesitamos combinar los resultados
  if (filters.gender && filters.brandId) {
    const [genderResults, brandResults] = await Promise.all([
      fetchPerfumesByGender(filters.gender),
      fetchPerfumesByBrand(filters.brandId),
    ]);

    // Intersectar los resultados (perfumes que cumplan ambos criterios)
    const intersection = genderResults.filter((perfume) =>
      brandResults.some((brandPerfume) => brandPerfume.id === perfume.id)
    );

    return intersection;
  }

  // Fallback: devolver array vacío
  return [];
};

export const usePerfumeFilters = (filters: FilterOptions) => {
  const hasFilters = Boolean(filters.gender || filters.brandId);

  return useQuery({
    queryKey: ["perfumes", "filters", filters],
    queryFn: () => fetchPerfumesWithFilters(filters),
    enabled: hasFilters,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
