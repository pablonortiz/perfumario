import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { PerfumeFromAPI } from "@/types/perfume";
import { useQuery } from "@tanstack/react-query";

const searchPerfumes = async (query: string): Promise<PerfumeFromAPI[]> => {
  if (!query.trim() || query.trim().length < 2) {
    return [];
  }

  const response = await fetch(
    API_ENDPOINTS.perfumes.search(encodeURIComponent(query)),
    {
      method: "GET",
      ...DEFAULT_FETCH_OPTIONS,
    },
  );

  if (!response.ok) {
    throw new Error(`Error al buscar perfumes: ${response.status}`);
  }

  return response.json();
};

export const usePerfumeSearch = (searchQuery: string) => {
  return useQuery({
    queryKey: ["perfumes", "search", searchQuery],
    queryFn: () => searchPerfumes(searchQuery),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });
};
