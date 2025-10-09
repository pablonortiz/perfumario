import { PerfumeWithBrandId } from "@/types/perfume";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://perfumario-server.vercel.app";

const searchPerfumes = async (query: string): Promise<PerfumeWithBrandId[]> => {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/perfumes/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    enabled: searchQuery.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });
};
