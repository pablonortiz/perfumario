import { useQuery } from "@tanstack/react-query";
import { PerfumeFromAPI } from "@/types/perfume";

const API_BASE_URL = "https://perfumario-server.vercel.app";

const fetchAllPerfumes = async (): Promise<PerfumeFromAPI[]> => {
  const response = await fetch(`${API_BASE_URL}/perfumes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};
