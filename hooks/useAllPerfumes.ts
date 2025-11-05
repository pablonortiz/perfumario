import { API_ENDPOINTS, DEFAULT_FETCH_OPTIONS } from "@/config/api";
import { PerfumeFromAPI } from "@/types/perfume";
import { useQuery } from "@tanstack/react-query";

const fetchAllPerfumes = async (): Promise<PerfumeFromAPI[]> => {
  const response = await fetch(API_ENDPOINTS.perfumes.list(), {
    method: "GET",
    ...DEFAULT_FETCH_OPTIONS,
  });

  if (!response.ok) {
    throw new Error(`Error al obtener todos los perfumes: ${response.status}`);
  }

  return response.json();
};

export const useAllPerfumes = () => {
  return useQuery({
    queryKey: ["perfumes", "all"],
    queryFn: fetchAllPerfumes,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
